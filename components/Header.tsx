import { createClient } from "@/lib/supabase/server";
import HeaderClient from "./HeaderClient";

export default async function Header() {
    const supabase = await createClient();

    const [{ data: profile }, { data: settings }] = await Promise.all([
        supabase.from("profile").select("resume_url").single(),
        supabase.from("site_settings").select("nav_resume_url").single(),
    ]);

    // Prefer nav_resume_url from site_settings (set via Appearance admin),
    // fall back to the profile resume URL
    const resumeUrl = settings?.nav_resume_url || profile?.resume_url || null;

    return <HeaderClient resumeUrl={resumeUrl} />;
}
