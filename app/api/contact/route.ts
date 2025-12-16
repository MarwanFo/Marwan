import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail, isValidEmail, limitLength } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
    try {
        // Rate limiting - 5 requests per minute per IP
        const clientIP = getClientIP(request);
        const rateLimit = checkRateLimit(`contact:${clientIP}`, { limit: 5, windowSeconds: 60 });

        if (!rateLimit.success) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
                        'X-RateLimit-Remaining': '0',
                    }
                }
            );
        }

        const body = await request.json();

        // Sanitize inputs
        const name = limitLength(sanitizeString(body.name || ''), 100);
        const email = sanitizeEmail(body.email || '');
        const message = limitLength(sanitizeString(body.message || ''), 5000);

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Honeypot check (if a hidden field is filled, it's likely a bot)
        if (body.website || body.phone_number) {
            // Silently ignore spam
            return NextResponse.json({ success: true });
        }

        // Create Supabase client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Insert sanitized message into database
        const { error } = await supabase
            .from("messages")
            .insert({
                name,
                email,
                message,
                read: false,
            });

        if (error) {
            console.error("Error saving message:", error);
            return NextResponse.json(
                { error: "Failed to save message" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in contact API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
