import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMarwanContext } from "@/lib/ai-context";
import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { verifyOrigin, detectPromptInjection, sanitizeChatHistory } from "@/lib/security";
import { sanitizeString } from "@/lib/sanitize";

export async function POST(req: Request) {
    try {
        // ── 1. Anti-CSRF Origin Verification ─────────────────────────────────
        const originCheck = verifyOrigin(req);
        if (!originCheck.valid) {
            return NextResponse.json(
                { error: originCheck.reason || "Cross-origin request forbidden" },
                { status: 403 }
            );
        }

        // ── 2. Rate Limiting: 15 messages/min per IP ─────────────────────────
        const clientIP = getClientIP(req);
        const rateLimit = checkRateLimit(`chat:${clientIP}`, {
            limit: 15,
            windowSeconds: 60,
        });

        if (!rateLimit.success) {
            const retryAfterSec = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
            return NextResponse.json(
                { error: "Too many messages sent. Please wait a minute." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(retryAfterSec),
                        "X-RateLimit-Remaining": "0",
                    },
                }
            );
        }

        // ── 3. Parse & Validate Payload ───────────────────────────────────────
        let body: { message?: string; history?: unknown };
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
        }

        const rawMessage = typeof body?.message === "string" ? body.message.trim() : "";

        if (!rawMessage) {
            return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
        }

        // Enforce maximum length to prevent token-exhaustion DoS
        if (rawMessage.length > 500) {
            return NextResponse.json(
                { error: "Message exceeds 500 character limit. Please shorten your question." },
                { status: 400 }
            );
        }

        // ── 4. Prompt Injection & Adversarial Scanner ─────────────────────────
        const injectionCheck = detectPromptInjection(rawMessage);
        if (injectionCheck.isSuspicious) {
            console.warn(`[Marwan-AI Security]: Prompt injection flagged from ${clientIP}: ${injectionCheck.matchedPattern}`);
            return NextResponse.json({
                text: "I am exclusively Marwan's professional portfolio assistant. I can only answer questions related to Marwan's engineering background, skills, and projects.",
            });
        }

        // ── 5. Sanitize History & Input ───────────────────────────────────────
        const sanitizedHistory = sanitizeChatHistory(body?.history, 6);
        const cleanMessage = sanitizeString(rawMessage);

        if (!process.env.GEMINI_API_KEY) {
            console.error("[Marwan-AI Error]: GEMINI_API_KEY is not configured");
            return NextResponse.json(
                { error: "AI service is currently unavailable. Please try again later." },
                { status: 503 }
            );
        }

        // Initialize Gemini model
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // ── 6. Fetch Context (cached) ─────────────────────────────────────────
        let context = "";
        try {
            context = await getMarwanContext();
        } catch (ctxError: any) {
            console.error("[Marwan-AI Error]: Failed to load context:", ctxError?.message || ctxError);
            return NextResponse.json({ error: "Failed to fetch portfolio data." }, { status: 500 });
        }

        // ── 7. Start Chat Session with Strict Guardrails ─────────────────────
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: context }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Marwan's professional assistant. How can I help you today?" }],
                },
                ...sanitizedHistory,
            ],
        });

        // ── 8. Generate AI Response ──────────────────────────────────────────
        try {
            const result = await chat.sendMessage(cleanMessage);
            const response = await result.response;
            const text = response.text();

            return NextResponse.json({ text });
        } catch (genError: any) {
            const errorMessage = genError?.message || "";
            if (errorMessage.includes("429") || errorMessage.includes("quota")) {
                console.error("[Marwan-AI Error]: Quota exceeded (429)");
                return NextResponse.json(
                    { error: "The AI assistant is temporarily busy. Please wait a minute and try again." },
                    { status: 429 }
                );
            }

            console.error("[Marwan-AI Error]: Generation failed:", errorMessage);
            return NextResponse.json(
                { error: "Unable to process your request at this time." },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("[Marwan-AI General Error]:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while processing your request." },
            { status: 500 }
        );
    }
}
