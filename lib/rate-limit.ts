/**
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis-based rate limiting
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((entry, key) => {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    /** Maximum number of requests allowed */
    limit: number;
    /** Time window in seconds */
    windowSeconds: number;
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetTime: number;
}

/**
 * Check if a request is within rate limits
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = { limit: 10, windowSeconds: 60 }
): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetTime) {
        // Create new entry
        const resetTime = now + config.windowSeconds * 1000;
        rateLimitStore.set(identifier, { count: 1, resetTime });
        return { success: true, remaining: config.limit - 1, resetTime };
    }

    if (entry.count >= config.limit) {
        // Rate limit exceeded
        return { success: false, remaining: 0, resetTime: entry.resetTime };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(identifier, entry);
    return { success: true, remaining: config.limit - entry.count, resetTime: entry.resetTime };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }
    return 'unknown';
}
