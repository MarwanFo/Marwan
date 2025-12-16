import { createClient } from "@/lib/supabase/server";
import ContactSectionClient from "./ContactSectionClient";

export default async function ContactSection() {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from("profile")
        .select("email, location, github_url, linkedin_url, twitter_url")
        .single();

    const { data: settings } = await supabase
        .from("site_settings")
        .select("contact_email, contact_message")
        .single();

    return (
        <ContactSectionClient
            profile={profile}
            settings={settings}
        />
    );
}
