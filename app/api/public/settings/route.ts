import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Public endpoint — no auth required, returns safe non-sensitive settings
export async function GET() {
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from("site_settings")
            .select(
                "hero_name, hero_tagline, hero_title, hero_description, cta_primary_text, cta_primary_href, cta_secondary_text, cta_secondary_href, github_url, linkedin_url, social_email, location, footer_tagline, footer_text"
            )
            .single();

        return NextResponse.json(data || {}, {
            headers: {
                // Cache for 60 seconds on the client, revalidate in background
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
            },
        });
    } catch {
        return NextResponse.json({});
    }
}
