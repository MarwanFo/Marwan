import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

// Generic message — never reveal WHY login failed (prevents user enumeration)
const GENERIC_ERROR = "Invalid credentials. Please try again.";

export async function POST(request: NextRequest) {
    try {
        // ── Rate limiting: 5 attempts per 15 minutes per IP ──────────────────
        const clientIP = getClientIP(request);
        const rateLimit = checkRateLimit(`login:${clientIP}`, {
            limit: 5,
            windowSeconds: 15 * 60,
        });

        if (!rateLimit.success) {
            const retryAfterSec = Math.ceil(
                (rateLimit.resetTime - Date.now()) / 1000
            );
            return NextResponse.json(
                { error: "Too many login attempts. Please try again later." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(retryAfterSec),
                        "X-RateLimit-Remaining": "0",
                    },
                }
            );
        }

        // ── Parse & basic validate body ───────────────────────────────────────
        let body: { email?: string; password?: string };
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
        }

        const email = (body.email || "").trim().toLowerCase().slice(0, 254);
        const password = (body.password || "").slice(0, 128);

        if (!email || !password) {
            return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
        }

        // ── Sign in via Supabase SSR — cookies are set automatically ─────────
        // Using @supabase/ssr so cookies match what the middleware expects.
        let response = NextResponse.json({ success: true });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set(name, value, {
                                ...options,
                                sameSite: "lax",
                                httpOnly: true,
                                secure:
                                    process.env.NODE_ENV === "production",
                                path: "/",
                            });
                        });
                    },
                },
            }
        );

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // Always return the same generic message regardless of the Supabase error
            // This prevents user enumeration (e.g. "Email not found" vs "Wrong password")
            return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
        }

        return response;
    } catch (err) {
        // Log internally, never expose stack trace to client
        console.error("[/api/auth/login] Unexpected error:", err);
        return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }
}
