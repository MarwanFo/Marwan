import { describe, it, expect } from 'vitest';
import {
    sanitizeString,
    sanitizeEmail,
    isValidEmail,
    sanitizeUrl,
    limitLength,
    sanitizeObject,
} from '@/lib/sanitize';

describe('sanitizeString', () => {
    it('removes script tags', () => {
        const input = 'Hello <script>alert("xss")</script> World';
        const result = sanitizeString(input);
        expect(result).not.toContain('<script>');
        expect(result).not.toContain('alert');
    });

    it('removes HTML tags', () => {
        const input = '<div>Hello</div> <b>World</b>';
        const result = sanitizeString(input);
        expect(result).not.toContain('<div>');
        expect(result).not.toContain('<b>');
    });

    it('encodes HTML entities', () => {
        const result = sanitizeString('A & B');
        expect(result).toContain('&amp;');
    });

    it('removes null bytes', () => {
        const input = 'Hello\x00World';
        const result = sanitizeString(input);
        expect(result).not.toContain('\x00');
    });

    it('trims whitespace', () => {
        expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('returns empty string for non-string input', () => {
        expect(sanitizeString(undefined as any)).toBe('');
        expect(sanitizeString(null as any)).toBe('');
        expect(sanitizeString(123 as any)).toBe('');
    });
});

describe('sanitizeEmail', () => {
    it('lowercases and trims email', () => {
        expect(sanitizeEmail('  User@Example.COM  ')).toBe('user@example.com');
    });

    it('removes dangerous characters', () => {
        expect(sanitizeEmail('user"<script>@test.com')).not.toContain('<');
        expect(sanitizeEmail('user"<script>@test.com')).not.toContain('"');
    });

    it('limits to 254 characters', () => {
        const longEmail = 'a'.repeat(300) + '@test.com';
        expect(sanitizeEmail(longEmail).length).toBeLessThanOrEqual(254);
    });

    it('returns empty string for non-string input', () => {
        expect(sanitizeEmail(undefined as any)).toBe('');
    });
});

describe('isValidEmail', () => {
    it('accepts valid emails', () => {
        expect(isValidEmail('user@example.com')).toBe(true);
        expect(isValidEmail('user.name+tag@domain.co')).toBe(true);
    });

    it('rejects invalid emails', () => {
        expect(isValidEmail('')).toBe(false);
        expect(isValidEmail('not-an-email')).toBe(false);
        expect(isValidEmail('@no-user.com')).toBe(false);
        expect(isValidEmail('user@')).toBe(false);
    });

    it('rejects emails longer than 254 characters', () => {
        const longEmail = 'a'.repeat(250) + '@test.com';
        expect(isValidEmail(longEmail)).toBe(false);
    });
});

describe('sanitizeUrl', () => {
    it('allows http and https URLs', () => {
        expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
        expect(sanitizeUrl('http://example.com/path')).toBe('http://example.com/path');
    });

    it('rejects javascript: protocol', () => {
        expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
    });

    it('rejects data: protocol', () => {
        expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    });

    it('rejects invalid URLs', () => {
        expect(sanitizeUrl('not a url')).toBeNull();
    });

    it('returns null for non-string input', () => {
        expect(sanitizeUrl(undefined as any)).toBeNull();
    });
});

describe('limitLength', () => {
    it('truncates strings longer than maxLength', () => {
        expect(limitLength('Hello, World!', 5)).toBe('Hello');
    });

    it('returns the string unchanged if under maxLength', () => {
        expect(limitLength('Hi', 10)).toBe('Hi');
    });

    it('returns empty string for non-string input', () => {
        expect(limitLength(undefined as any, 10)).toBe('');
    });
});

describe('sanitizeObject', () => {
    it('sanitizes all string values recursively', () => {
        const input = {
            name: '<script>alert(1)</script>John',
            nested: {
                bio: '<b>Developer</b>',
            },
            count: 42,
        };
        const result = sanitizeObject(input);
        expect(result.name).not.toContain('<script>');
        expect(result.nested.bio).not.toContain('<b>');
        expect(result.count).toBe(42);
    });
});
