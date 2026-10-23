/**
 * Enterprise Security Utility
 * Provides CSRF Origin Verification, Prompt Injection Detection,
 * and Strict Chat History Sanitization.
 */

// Known adversarial prompt injection and jailbreak patterns
const PROMPT_INJECTION_PATTERNS = [
    // Override instructions
    /(?:ignore|disregard|forget|override|bypass)\s+(?:all\s+)?(?:previous|prior|above|system)\s+(?:instructions|prompts|rules|commands)/i,
    // DAN / Jailbreak personalities
    /(?:you\s+are\s+now|act\s+as)\s+(?:DAN|jailbreak|unrestricted|an?\s+ai\s+without\s+rules|an?\s+evil)/i,
    // System prompt leakage
    /(?:reveal|display|output|print|show|repeat)\s+(?:your\s+)?(?:system\s+prompt|initial\s+instructions|instructions\s+above)/i,
    // Delimiter manipulation
    /(?:===+\s*END\s+SYSTEM|---+\s*END\s+OF\s+INSTRUCTIONS)/i,
    // Role hijacking
    /(?:\[System\s+Message\]|\[SYSTEM\]|system:\s*")/i,
    // Secret credential fishing
    /(?:api_key|gemini_api_key|supabase_anon_key|admin_password|secret_key)/i,
];

export interface OriginVerificationResult {
    valid: boolean;
    reason?: string;
}

/**
 * Verify that a state-changing API request originates from an allowed origin (Anti-CSRF).
 */
export function verifyOrigin(request: Request): OriginVerificationResult {
    // Determine the origin from the request headers
    const originHeader = request.headers.get("origin") || request.headers.get("referer");

    // In non-browser automated environments (e.g., local tests), if neither is sent, allow if explicitly development
    if (!originHeader) {
        if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
            return { valid: true };
        }
        return { valid: false, reason: "Missing Origin or Referer header" };
    }

    try {
        const originUrl = new URL(originHeader);
        const originHost = originUrl.host.toLowerCase();

        // 1. Localhost and loopback in development / test
        if (
            originHost.startsWith("localhost:") ||
            originHost === "localhost" ||
            originHost.startsWith("127.0.0.1:") ||
            originHost === "127.0.0.1"
        ) {
            return { valid: true };
        }

        // 2. Request host header comparison
        const requestHost = request.headers.get("host")?.toLowerCase();
        if (requestHost && originHost === requestHost) {
            return { valid: true };
        }

        // 3. Configured app URL
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        if (appUrl) {
            try {
                const configuredHost = new URL(appUrl).host.toLowerCase();
                if (originHost === configuredHost) {
                    return { valid: true };
                }
            } catch {
                // Ignore parse errors on misconfigured env
            }
        }

        // 4. Allowed production domains (e.g. Vercel deployment)
        if (
            originHost === "marwanfo.vercel.app" ||
            originHost.endsWith(".vercel.app")
        ) {
            return { valid: true };
        }

        return {
            valid: false,
            reason: `Cross-origin request rejected: Origin '${originHost}' is not authorized.`,
        };
    } catch {
        return { valid: false, reason: "Malformed Origin header" };
    }
}

/**
 * Check if user input contains prompt injection / jailbreak attempts.
 */
export function detectPromptInjection(input: string): { isSuspicious: boolean; matchedPattern?: string } {
    if (typeof input !== "string") {
        return { isSuspicious: false };
    }

    const normalized = input.replace(/\s+/g, " ").trim();

    for (const pattern of PROMPT_INJECTION_PATTERNS) {
        if (pattern.test(normalized)) {
            return {
                isSuspicious: true,
                matchedPattern: pattern.source,
            };
        }
    }

    return { isSuspicious: false };
}

export interface SanitizedChatHistoryItem {
    role: "user" | "model";
    parts: [{ text: string }];
}

/**
 * Strict schema sanitizer for chat history to prevent payload poisoning & token exhaustion.
 */
export function sanitizeChatHistory(
    history: unknown,
    maxItems = 6
): SanitizedChatHistoryItem[] {
    if (!Array.isArray(history)) {
        return [];
    }

    const sanitized: SanitizedChatHistoryItem[] = [];

    // Take only the last N items to avoid memory/token bloat
    const recentHistory = history.slice(-maxItems);

    for (const item of recentHistory) {
        if (!item || typeof item !== "object") continue;

        const role = (item as any).role;
        if (role !== "user" && role !== "model") continue;

        const parts = (item as any).parts;
        if (!Array.isArray(parts) || parts.length === 0) continue;

        const firstPart = parts[0];
        if (!firstPart || typeof firstPart !== "object") continue;

        const text = firstPart.text;
        if (typeof text !== "string") continue;

        // Truncate individual message text to 1000 characters
        const safeText = text.trim().slice(0, 1000);
        if (safeText.length === 0) continue;

        sanitized.push({
            role,
            parts: [{ text: safeText }],
        });
    }

    return sanitized;
}

/**
 * Check if an email is an authorized administrator email.
 * Rejects unauthorized users even if they manage to register in auth.users.
 */
export function isAdminEmail(email?: string | null): boolean {
    if (!email || typeof email !== "string") return false;

    const normalized = email.trim().toLowerCase();
    const adminEmailsEnv = process.env.ADMIN_EMAIL || "";

    const allowed = adminEmailsEnv
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

    // Fallback safe defaults if env variable is not set
    if (allowed.length === 0) {
        allowed.push("marwanefaridi22@gmail.com", "itsmemarwanefo@gmail.com");
    }

    return allowed.includes(normalized);
}
