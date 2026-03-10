"use client";

import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

// Module-level singleton — one client for the entire app lifecycle
let instance: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
    if (!instance) {
        instance = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: false,
                },
            }
        );
    }
    return instance;
}
