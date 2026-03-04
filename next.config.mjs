/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

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
                    // Prevent MIME type sniffing
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    // Clickjacking — covered by frame-ancestors CSP too, kept for legacy browsers
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    // XSS filter (legacy, CSP is the real shield)
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    // Referrer
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    // Permissions Policy — restrict browser feature access
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), payment=()',
                    },
                    // HSTS — 2 years, preload-eligible
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    // Content Security Policy
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            // blob: needed for Three.js Web Workers
                            isProd
                                ? "script-src 'self' 'unsafe-inline' blob:"
                                : "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            // Three.js workers
                            "worker-src 'self' blob:",
                            // HARDENED: no wildcard https: — explicit trusted origins only
                            [
                                "img-src 'self' data: blob:",
                                "https://*.supabase.co",
                                "https://cdn.simpleicons.org",
                                "https://images.unsplash.com",
                                "https://avatars.githubusercontent.com",
                                "https://lh3.googleusercontent.com",
                            ].join(" "),
                            // Allow connections to Supabase + Google Analytics
                            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com",
                            // Block all framing
                            "frame-ancestors 'none'",
                            // Block object/embed (Flash, plugins)
                            "object-src 'none'",
                            // Prevent base-tag hijacking
                            "base-uri 'self'",
                            // Forms only submit to same origin
                            "form-action 'self'",
                        ].join('; '),
                    },
                ],
            },
        ];
    },

    async redirects() {
        return [];
    },

    // Remove X-Powered-By (don't advertise Next.js version to attackers)
    poweredByHeader: false,
};

export default nextConfig;
