/**
 * Input sanitization utilities for security
 */

/**
 * Sanitize a string by removing potentially dangerous characters
 */
export function sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';

    return input
        // Remove script tags
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove other HTML tags
        .replace(/<[^>]*>/g, '')
        // Encode HTML entities
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        // Remove null bytes
        .replace(/\x00/g, '')
        .trim();
}

/**
 * Sanitize an email address
 */
export function sanitizeEmail(email: string): string {
    if (typeof email !== 'string') return '';

    // Basic email sanitization
    return email
        .toLowerCase()
        .trim()
        .replace(/[<>'"]/g, '')
        .slice(0, 254); // Max email length
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Sanitize and validate a URL
 */
export function sanitizeUrl(url: string): string | null {
    if (typeof url !== 'string') return null;

    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return null;
        }
        return parsed.href;
    } catch {
        return null;
    }
}

/**
 * Limit string length to prevent abuse
 */
export function limitLength(input: string, maxLength: number): string {
    if (typeof input !== 'string') return '';
    return input.slice(0, maxLength);
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            result[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
            result[key] = sanitizeObject(value);
        } else {
            result[key] = value;
        }
    }

    return result as T;
}
