import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
    const response = await updateSession(request);

    // ── Security headers on every response ───────────────────────────────────
    // These supplement next.config.mjs headers (which cover static routes).
    // Middleware headers cover dynamic routes, API routes, and redirects too.
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Don't set HSTS here — Next.js already does it via next.config headers

    return response;
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/:path*',
    ],
};
