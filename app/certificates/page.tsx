import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import CertificatesPageClient from "./CertificatesPageClient";

export const metadata: Metadata = {
    title: "Certificates | Developer Portfolio",
    description: "View all my certifications and credentials",
};

export default async function CertificatesPage() {
    const supabase = await createClient();

    const { data: certificates } = await supabase
        .from("certificates")
        .select("*")
        .order("display_order", { ascending: true });

    const { data: settings } = await supabase
        .from("site_settings")
        .select("total_certifications, learning_hours, skills_acquired, years_learning")
        .single();

    return <CertificatesPageClient certificates={certificates || []} settings={settings} />;
}
