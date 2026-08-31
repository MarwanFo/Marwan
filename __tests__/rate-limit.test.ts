import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

describe('checkRateLimit', () => {
    // Use unique identifiers per test to avoid cross-test interference
    let testId: string;

    beforeEach(() => {
        testId = `test-${Date.now()}-${Math.random()}`;
    });

    it('allows requests within the limit', () => {
        const result = checkRateLimit(testId, { limit: 5, windowSeconds: 60 });
        expect(result.success).toBe(true);
        expect(result.remaining).toBe(4);
    });

    it('tracks remaining count correctly', () => {
        checkRateLimit(testId, { limit: 3, windowSeconds: 60 });
        const result2 = checkRateLimit(testId, { limit: 3, windowSeconds: 60 });
        expect(result2.remaining).toBe(1);

        const result3 = checkRateLimit(testId, { limit: 3, windowSeconds: 60 });
        expect(result3.remaining).toBe(0);
    });

    it('blocks requests when limit is exceeded', () => {
        const config = { limit: 2, windowSeconds: 60 };

        checkRateLimit(testId, config); // 1st
        checkRateLimit(testId, config); // 2nd (at limit)

        const result = checkRateLimit(testId, config); // 3rd (over limit)
        expect(result.success).toBe(false);
        expect(result.remaining).toBe(0);
    });

    it('provides a reset time in the future', () => {
        const now = Date.now();
        const result = checkRateLimit(testId, { limit: 5, windowSeconds: 60 });
        expect(result.resetTime).toBeGreaterThan(now);
        expect(result.resetTime).toBeLessThanOrEqual(now + 61_000);
    });

    it('uses default config when none provided', () => {
        const result = checkRateLimit(testId);
        expect(result.success).toBe(true);
        expect(result.remaining).toBe(9); // default limit is 10
    });

    it('allows a single request even with limit of 1', () => {
        const result = checkRateLimit(testId, { limit: 1, windowSeconds: 60 });
        expect(result.success).toBe(true);
        expect(result.remaining).toBe(0);

        const result2 = checkRateLimit(testId, { limit: 1, windowSeconds: 60 });
        expect(result2.success).toBe(false);
    });
});

describe('getClientIP', () => {
    it('extracts IP from x-forwarded-for header', () => {
        const request = new Request('https://example.com', {
            headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
        });
        expect(getClientIP(request)).toBe('192.168.1.1');
    });

    it('extracts IP from x-real-ip header', () => {
        const request = new Request('https://example.com', {
            headers: { 'x-real-ip': '10.0.0.5' },
        });
        expect(getClientIP(request)).toBe('10.0.0.5');
    });

    it('returns "unknown" when no IP headers present', () => {
        const request = new Request('https://example.com');
        expect(getClientIP(request)).toBe('unknown');
    });

    it('prefers x-forwarded-for over x-real-ip', () => {
        const request = new Request('https://example.com', {
            headers: {
                'x-forwarded-for': '1.2.3.4',
                'x-real-ip': '5.6.7.8',
            },
        });
        expect(getClientIP(request)).toBe('1.2.3.4');
    });
});
