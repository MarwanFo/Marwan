import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminEmail } from '@/lib/security';

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
                        // Keep maxAge/expires so session doesn't expire instantly
                        supabaseResponse.cookies.set(name, value, {
                            ...options,
                            sameSite: 'lax',
                            httpOnly: false, // Allow client-side sync
                            secure: process.env.NODE_ENV === 'production',
                            path: '/',
                        });
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isAuthorizedAdmin = user ? isAdminEmail(user.email) : false;

    if (request.nextUrl.pathname.startsWith('/bouchaib/hmed')) {
        // Let the login page through always
        if (request.nextUrl.pathname === '/bouchaib/hmed/login') {
            // If already logged in as authorized admin, redirect to dashboard
            if (isAuthorizedAdmin) {
                return NextResponse.redirect(new URL('/bouchaib/hmed', request.url));
            }
            return supabaseResponse;
        }

        // Protect all other /bouchaib/hmed/* routes — strictly require authorized admin email
        if (!isAuthorizedAdmin) {
            return NextResponse.redirect(new URL('/bouchaib/hmed/login', request.url));
        }
    }

    return supabaseResponse;
}
