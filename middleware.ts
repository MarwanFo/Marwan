import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

// Common paths scanned by automated tools like Gobuster, dirsearch, and scanners
const SCANNER_HONEYPOTS = [
    '/admin',
    '/administrator',
    '/wp-admin',
    '/wp-login.php',
    '/cpanel',
    '/phpmyadmin',
    '/backend',
    '/controlpanel',
    '/private',
];

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname.toLowerCase();

    // ── Anti-Gobuster / Directory Scanner Trap ──────────────────────────────
    const isHoneypot = SCANNER_HONEYPOTS.some(
        (hp) => pathname === hp || pathname.startsWith(`${hp}/`)
    );

    if (isHoneypot) {
        const ip = getClientIP(request);
        const rateCheck = checkRateLimit(`scanner:${ip}`, { limit: 3, windowSeconds: 60 });
        if (!rateCheck.success) {
            return new NextResponse('Access Denied', {
                status: 429,
                headers: {
                    'Retry-After': '3600',
                    'Content-Type': 'text/plain',
                },
            });
        }
        return NextResponse.rewrite(new URL('/not-found', request.url), { status: 404 });
    }

    // Skip middleware for auth API routes to avoid interference
    if (request.nextUrl.pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    const response = await updateSession(request);

    // ── Security headers on every response ───────────────────────────────────
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, icon.svg, public assets
         */
        '/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:jpg|jpeg|gif|png|webp|svg|ico|pdf)$).*)',
    ],
};
