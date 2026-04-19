import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

// ── Server-side allowlists ────────────────────────────────────────────────────
// SVG intentionally excluded — can contain <script> tags (Stored XSS)
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Magic bytes for each allowed MIME type
const MAGIC_BYTES: Record<string, number[][]> = {
    "image/jpeg": [[0xff, 0xd8, 0xff]],
    "image/png":  [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
    "image/gif":  [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
    "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header
    "application/pdf": [[0x25, 0x50, 0x44, 0x46]], // %PDF
};

async function verifyMagicBytes(buffer: Uint8Array, mimeType: string): Promise<boolean> {
    const signatures = MAGIC_BYTES[mimeType];
    if (!signatures) return false;
    return signatures.some((sig) => sig.every((byte, i) => buffer[i] === byte));
}

export async function POST(request: NextRequest) {
    try {
        // ── Auth check ────────────────────────────────────────────────────────
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // ── Rate limit: 10 uploads/min per user ───────────────────────────────
        const clientIP = getClientIP(request);
        const rateLimit = checkRateLimit(`upload:${user.id}:${clientIP}`, {
            limit: 10,
            windowSeconds: 60,
        });
        if (!rateLimit.success) {
            return NextResponse.json(
                { error: "Upload rate limit exceeded. Please wait before uploading again." },
                { status: 429 }
            );
        }

        // ── Parse form data ───────────────────────────────────────────────────
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file || file.size === 0) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // ── File size check ───────────────────────────────────────────────────
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 5MB." },
                { status: 400 }
            );
        }

        // ── MIME type allowlist (server-side, not trusting client header) ─────
        const declaredMime = file.type.toLowerCase().trim();
        if (!ALLOWED_MIME_TYPES.includes(declaredMime)) {
            return NextResponse.json(
                { error: "File type not allowed. Only JPEG, PNG, GIF, WebP images, and PDF documents are accepted." },
                { status: 400 }
            );
        }

        // ── Extension allowlist ───────────────────────────────────────────────
        const rawExt = (file.name.split(".").pop() || "").toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(rawExt)) {
            return NextResponse.json(
                { error: "File extension not allowed." },
                { status: 400 }
            );
        }

        // ── Magic bytes verification (prevents disguised malicious files) ─────
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const magicValid = await verifyMagicBytes(buffer, declaredMime);
        if (!magicValid) {
            return NextResponse.json(
                { error: "File content does not match its declared type." },
                { status: 400 }
            );
        }

        // ── Generate a random, safe filename (no path traversal possible) ─────
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 10);
        const safeExt = rawExt === "jpg" ? "jpg" : rawExt; // normalize
        const fileName = `${timestamp}-${random}.${safeExt}`;

        // ── Upload to Supabase Storage ────────────────────────────────────────
        const { error: uploadError } = await supabase.storage
            .from("project-images")
            .upload(fileName, buffer, {
                contentType: declaredMime, // now verified server-side
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            // Log internally only — do NOT expose storage error to client
            console.error("[/api/upload] Storage error:", uploadError);
            return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
        }

        // ── Return public URL ─────────────────────────────────────────────────
        const { data: urlData } = supabase.storage
            .from("project-images")
            .getPublicUrl(fileName);

        return NextResponse.json({ url: urlData.publicUrl });
    } catch (err) {
        // Generic error — never expose stack trace
        console.error("[/api/upload] Unexpected error:", err);
        return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }
}
