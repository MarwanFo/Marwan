import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
    const supabase = await createClient();

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Create response that redirects to login
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = NextResponse.redirect(new URL('/admin/login', appUrl));

    // Clear all Supabase auth cookies
    const cookieNames = [
        'sb-access-token',
        'sb-refresh-token',
        'supabase-auth-token',
    ];

    cookieNames.forEach(name => {
        response.cookies.delete(name);
    });

    // Also clear any cookies that start with 'sb-'
    response.cookies.getAll().forEach(cookie => {
        if (cookie.name.startsWith('sb-')) {
            response.cookies.delete(cookie.name);
        }
    });

    return NextResponse.json({ success: true });
}
