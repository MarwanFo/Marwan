import { createClient } from "@/lib/supabase/server";
import HeaderClient from "./HeaderClient";

export default async function Header() {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from("profile")
        .select("resume_url")
        .single();

    return <HeaderClient resumeUrl={profile?.resume_url || null} />;
}
