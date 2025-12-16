/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'cdn.simpleicons.org'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
        ],
    },

    // Security Headers
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    // Prevent XSS attacks
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    // Prevent clickjacking
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    // Prevent MIME type sniffing
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    // Control referrer information
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    // Permissions Policy (restrict features)
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    // Strict Transport Security (HTTPS only)
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains',
                    },
                    // Content Security Policy
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: blob: https: http:",
                            "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
                            "frame-ancestors 'none'",
                        ].join('; '),
                    },
                ],
            },
        ];
    },

    // Redirect HTTP to HTTPS in production
    async redirects() {
        return [];
    },

    // Add powered by header removal
    poweredByHeader: false,
};

export default nextConfig;
