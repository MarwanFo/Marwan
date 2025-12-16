import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        // Remove maxAge and expires to make it a session cookie
                        // Session cookies are deleted when the browser closes
                        const { maxAge, expires, ...sessionOptions } = options || {};
                        supabaseResponse.cookies.set(name, value, {
                            ...sessionOptions,
                            sameSite: 'lax',
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            path: '/',
                        });
                    });
                },
            },
        }
    );

    // Get user - this validates the session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protect ALL admin routes except login
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login page only when NOT authenticated
        if (request.nextUrl.pathname === '/admin/login') {
            if (user) {
                // Already logged in, redirect to dashboard
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            return supabaseResponse;
        }

        // ALL other /admin/* routes require authentication
        if (!user) {
            // Not authenticated - redirect to login
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return supabaseResponse;
}
