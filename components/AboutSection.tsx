import { createClient } from "@/lib/supabase/server";
import AboutSectionClient from "./AboutSectionClient";

export default async function AboutSection() {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from("profile")
        .select("*")
        .single();

    return <AboutSectionClient profile={profile} />;
}
