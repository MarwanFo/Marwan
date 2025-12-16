/**
 * File Upload Validation Utility
 * Validates file type, size, and magic bytes for security
 */

// Common image file signatures (magic bytes)
const FILE_SIGNATURES: Record<string, number[][]> = {
    'image/jpeg': [[0xFF, 0xD8, 0xFF]],
    'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
    'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
    'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header (full check includes WEBP at offset 8)
    'image/svg+xml': [[0x3C, 0x73, 0x76, 0x67], [0x3C, 0x3F, 0x78, 0x6D, 0x6C]], // <svg or <?xml
    'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
};

// Allowed MIME types for different contexts
export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
];

export const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
];

// Default file size limits (in bytes)
export const FILE_SIZE_LIMITS = {
    image: 5 * 1024 * 1024,      // 5MB for images
    document: 10 * 1024 * 1024,  // 10MB for documents
    avatar: 2 * 1024 * 1024,     // 2MB for avatars
    logo: 1 * 1024 * 1024,       // 1MB for logos
};

export interface FileValidationResult {
    valid: boolean;
    error?: string;
    sanitizedName?: string;
}

/**
 * Validate file MIME type
 */
export function validateMimeType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeBytes: number): boolean {
    return file.size <= maxSizeBytes;
}

/**
 * Validate file magic bytes (signature)
 * This prevents users from renaming malicious files to bypass extension checks
 */
export async function validateMagicBytes(file: File): Promise<boolean> {
    const signatures = FILE_SIGNATURES[file.type];

    // If we don't have signatures for this type, skip magic byte check
    if (!signatures) {
        return true;
    }

    // Read the first 16 bytes of the file
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Check if any signature matches
    return signatures.some((signature) => {
        return signature.every((byte, index) => bytes[index] === byte);
    });
}

/**
 * Sanitize filename to prevent path traversal and other attacks
 */
export function sanitizeFilename(filename: string): string {
    // Remove path separators and dangerous characters
    return filename
        .replace(/[\/\\:*?"<>|]/g, '')  // Remove dangerous chars
        .replace(/\.\./g, '')            // Prevent path traversal
        .replace(/^\.+/, '')             // Remove leading dots
        .replace(/\s+/g, '_')            // Replace spaces with underscores
        .toLowerCase()
        .slice(0, 100);                  // Limit filename length
}

/**
 * Generate a secure filename with timestamp
 */
export function generateSecureFilename(originalName: string): string {
    const ext = originalName.split('.').pop()?.toLowerCase() || 'bin';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}.${ext}`;
}

/**
 * Comprehensive file validation
 */
export async function validateFile(
    file: File,
    options: {
        allowedTypes?: string[];
        maxSizeBytes?: number;
        checkMagicBytes?: boolean;
    } = {}
): Promise<FileValidationResult> {
    const {
        allowedTypes = ALLOWED_IMAGE_TYPES,
        maxSizeBytes = FILE_SIZE_LIMITS.image,
        checkMagicBytes = true,
    } = options;

    // Check file exists and has content
    if (!file || file.size === 0) {
        return { valid: false, error: 'No file provided or file is empty' };
    }

    // Check file type
    if (!validateMimeType(file, allowedTypes)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        };
    }

    // Check file size
    if (!validateFileSize(file, maxSizeBytes)) {
        const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);
        return {
            valid: false,
            error: `File too large. Maximum size: ${maxSizeMB}MB`,
        };
    }

    // Check magic bytes
    if (checkMagicBytes) {
        const validMagicBytes = await validateMagicBytes(file);
        if (!validMagicBytes) {
            return {
                valid: false,
                error: 'File content does not match its extension. Possible malicious file.',
            };
        }
    }

    // Generate secure filename
    const sanitizedName = generateSecureFilename(file.name);

    return {
        valid: true,
        sanitizedName,
    };
}

/**
 * Check if a URL is safe (no javascript: or data: protocols)
 */
export function isSafeUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
        return !dangerousProtocols.includes(parsed.protocol);
    } catch {
        return false;
    }
}
