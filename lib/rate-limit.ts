/**
 * Rate limiter with LRU eviction for serverless environments.
 *
 * IMPORTANT: This is an in-memory rate limiter. In serverless deployments
 * (e.g. Vercel), each cold start creates a fresh store, so rate limits
 * won't persist across instances. For production at scale, consider using
 * a Redis-based solution (e.g. Upstash Redis with @upstash/ratelimit).
 *
 * Improvements over naive Map-based approach:
 * - MAX_STORE_SIZE cap prevents unbounded memory growth
 * - LRU eviction removes oldest entries when the store is full
 * - Periodic cleanup of expired entries every 60 seconds
 * - Graceful handling of edge cases
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
    lastAccessed: number;
}

/** Maximum number of tracked identifiers to prevent memory leaks */
const MAX_STORE_SIZE = 10_000;

const rateLimitStore = new Map<string, RateLimitEntry>();

/** Evict the oldest entries when store exceeds MAX_STORE_SIZE */
function evictOldest(count: number): void {
    const entries = Array.from(rateLimitStore.entries())
        .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

    for (let i = 0; i < count && i < entries.length; i++) {
        rateLimitStore.delete(entries[i][0]);
    }
}

/** Remove expired entries from the store */
function cleanupExpired(): void {
    const now = Date.now();
    rateLimitStore.forEach((entry, key) => {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    });
}

// Cleanup expired entries every 60 seconds (more frequent than before)
// Use unref() if available so the timer doesn't prevent process exit
const cleanupInterval = setInterval(cleanupExpired, 60 * 1000);
if (typeof cleanupInterval === 'object' && 'unref' in cleanupInterval) {
    cleanupInterval.unref();
}

export interface RateLimitConfig {
    /** Maximum number of requests allowed in the time window */
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
 * Check if a request is within rate limits.
 *
 * @param identifier - Unique identifier (e.g. "contact:<IP>" or "upload:<userId>:<IP>")
 * @param config - Rate limit configuration (defaults: 10 req / 60s)
 * @returns Whether the request is allowed
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = { limit: 10, windowSeconds: 60 }
): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // If no entry exists or the window has expired, create a fresh entry
    if (!entry || now > entry.resetTime) {
        // Evict oldest entries if store is at capacity
        if (!entry && rateLimitStore.size >= MAX_STORE_SIZE) {
            evictOldest(Math.ceil(MAX_STORE_SIZE * 0.1)); // evict 10%
        }

        const resetTime = now + config.windowSeconds * 1000;
        rateLimitStore.set(identifier, { count: 1, resetTime, lastAccessed: now });
        return { success: true, remaining: config.limit - 1, resetTime };
    }

    // Update last accessed timestamp
    entry.lastAccessed = now;

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
 * Get client IP from request headers.
 * Handles proxies (X-Forwarded-For, X-Real-IP) and falls back to 'unknown'.
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        // Take the first IP (client's real IP, before proxies)
        return forwarded.split(',')[0].trim();
    }
    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }
    return 'unknown';
}
