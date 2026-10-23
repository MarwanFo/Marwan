import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail, isValidEmail, limitLength } from "@/lib/sanitize";
import { verifyOrigin } from "@/lib/security";

export async function POST(request: NextRequest) {
    try {
        // ── 1. Anti-CSRF Origin Verification ─────────────────────────────────
        const originCheck = verifyOrigin(request);
        if (!originCheck.valid) {
            return NextResponse.json(
                { error: originCheck.reason || "Cross-origin request forbidden" },
                { status: 403 }
            );
        }

        // ── 2. Rate limiting - 5 requests per minute per IP ──────────────────
        const clientIP = getClientIP(request);
        const rateLimit = checkRateLimit(`contact:${clientIP}`, { limit: 5, windowSeconds: 60 });

        if (!rateLimit.success) {
            const retryAfterSec = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(retryAfterSec),
                        'X-RateLimit-Remaining': '0',
                    }
                }
            );
        }

        let body: any;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
        }

        // ── 3. Honeypot check (if a hidden field is filled, silently drop) ─────
        if (body.website || body.phone_number) {
            console.warn(`[Contact Security]: Honeypot triggered by ${clientIP}`);
            return NextResponse.json({ success: true });
        }

        // ── 4. Bot Time-Gate Check (forms submitted in < 1.5s are bots) ───────
        if (body._timestamp && typeof body._timestamp === "number") {
            const duration = Date.now() - body._timestamp;
            if (duration < 1500) {
                console.warn(`[Contact Security]: Bot time-gate triggered (${duration}ms) by ${clientIP}`);
                return NextResponse.json({ success: true });
            }
        }

        // ── 5. Sanitize & Validate Inputs ─────────────────────────────────────
        const name = limitLength(sanitizeString(body.name || ''), 100);
        const email = sanitizeEmail(body.email || '');
        const message = limitLength(sanitizeString(body.message || ''), 2000);

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        // Validate email format and prevent CRLF injection
        if (!isValidEmail(email) || /[\r\n]/.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address format" },
                { status: 400 }
            );
        }

        // ── 6. Save to Supabase ───────────────────────────────────────────────
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error } = await supabase
            .from("messages")
            .insert({
                name,
                email,
                message,
                read: false,
            });

        if (error) {
            console.error("[Contact API Error]: Error saving message:", error.message);
            return NextResponse.json(
                { error: "Failed to send message. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[Contact API Error]: Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
