import { describe, it, expect } from 'vitest';
import {
    validateMimeType,
    validateFileSize,
    sanitizeFilename,
    generateSecureFilename,
    isSafeUrl,
    ALLOWED_IMAGE_TYPES,
    ALLOWED_DOCUMENT_TYPES,
    FILE_SIZE_LIMITS,
} from '@/lib/file-validation';

describe('validateMimeType', () => {
    it('accepts allowed image types', () => {
        const file = new File([''], 'test.png', { type: 'image/png' });
        expect(validateMimeType(file, ALLOWED_IMAGE_TYPES)).toBe(true);
    });

    it('accepts all allowed image formats', () => {
        for (const type of ALLOWED_IMAGE_TYPES) {
            const file = new File([''], 'test', { type });
            expect(validateMimeType(file, ALLOWED_IMAGE_TYPES)).toBe(true);
        }
    });

    it('rejects disallowed types', () => {
        const file = new File([''], 'test.exe', { type: 'application/x-executable' });
        expect(validateMimeType(file, ALLOWED_IMAGE_TYPES)).toBe(false);
    });

    it('accepts PDF for document types', () => {
        const file = new File([''], 'resume.pdf', { type: 'application/pdf' });
        expect(validateMimeType(file, ALLOWED_DOCUMENT_TYPES)).toBe(true);
    });
});

describe('validateFileSize', () => {
    it('accepts files within size limit', () => {
        const content = new Uint8Array(1024); // 1KB
        const file = new File([content], 'small.png', { type: 'image/png' });
        expect(validateFileSize(file, FILE_SIZE_LIMITS.image)).toBe(true);
    });

    it('rejects files exceeding size limit', () => {
        const content = new Uint8Array(6 * 1024 * 1024); // 6MB
        const file = new File([content], 'huge.png', { type: 'image/png' });
        expect(validateFileSize(file, FILE_SIZE_LIMITS.image)).toBe(false);
    });

    it('accepts files exactly at the limit', () => {
        const content = new Uint8Array(FILE_SIZE_LIMITS.avatar); // exactly 2MB
        const file = new File([content], 'avatar.jpg', { type: 'image/jpeg' });
        expect(validateFileSize(file, FILE_SIZE_LIMITS.avatar)).toBe(true);
    });
});

describe('sanitizeFilename', () => {
    it('removes path traversal characters', () => {
        expect(sanitizeFilename('../../etc/passwd')).not.toContain('..');
        expect(sanitizeFilename('../../etc/passwd')).not.toContain('/');
    });

    it('removes dangerous characters', () => {
        const result = sanitizeFilename('file<name>with:bad*chars?.txt');
        expect(result).not.toContain('<');
        expect(result).not.toContain('>');
        expect(result).not.toContain(':');
        expect(result).not.toContain('*');
        expect(result).not.toContain('?');
    });

    it('replaces spaces with underscores', () => {
        expect(sanitizeFilename('my cool file.png')).toBe('my_cool_file.png');
    });

    it('lowercases the filename', () => {
        expect(sanitizeFilename('MyFile.PNG')).toBe('myfile.png');
    });

    it('limits filename length to 100 characters', () => {
        const longName = 'a'.repeat(200) + '.png';
        expect(sanitizeFilename(longName).length).toBeLessThanOrEqual(100);
    });

    it('removes leading dots', () => {
        expect(sanitizeFilename('.hidden')).toBe('hidden');
        expect(sanitizeFilename('...triple')).toBe('triple');
    });
});

describe('generateSecureFilename', () => {
    it('generates a filename with timestamp', () => {
        const result = generateSecureFilename('photo.jpg');
        expect(result).toMatch(/^\d+-[a-z0-9]+\.jpg$/);
    });

    it('preserves the file extension', () => {
        expect(generateSecureFilename('image.png')).toContain('.png');
        expect(generateSecureFilename('doc.pdf')).toContain('.pdf');
    });

    it('generates unique filenames', () => {
        const a = generateSecureFilename('file.jpg');
        const b = generateSecureFilename('file.jpg');
        expect(a).not.toBe(b);
    });

    it('uses the filename as extension when no dot exists', () => {
        // split('.').pop() returns 'noext' when there's no dot, so extension becomes 'noext'
        const result = generateSecureFilename('noext');
        expect(result).toMatch(/^\d+-[a-z0-9]+\.noext$/);
    });
});

describe('isSafeUrl', () => {
    it('allows https URLs', () => {
        expect(isSafeUrl('https://example.com')).toBe(true);
    });

    it('allows http URLs', () => {
        expect(isSafeUrl('http://example.com')).toBe(true);
    });

    it('rejects javascript: URLs', () => {
        expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    });

    it('rejects data: URLs', () => {
        expect(isSafeUrl('data:text/html,<h1>XSS</h1>')).toBe(false);
    });

    it('rejects vbscript: URLs', () => {
        expect(isSafeUrl('vbscript:MsgBox("XSS")')).toBe(false);
    });

    it('rejects invalid URLs', () => {
        expect(isSafeUrl('not-a-url')).toBe(false);
    });
});

describe('FILE_SIZE_LIMITS', () => {
    it('has correct values', () => {
        expect(FILE_SIZE_LIMITS.image).toBe(5 * 1024 * 1024);      // 5MB
        expect(FILE_SIZE_LIMITS.document).toBe(10 * 1024 * 1024);  // 10MB
        expect(FILE_SIZE_LIMITS.avatar).toBe(2 * 1024 * 1024);     // 2MB
        expect(FILE_SIZE_LIMITS.logo).toBe(1 * 1024 * 1024);       // 1MB
    });
});
