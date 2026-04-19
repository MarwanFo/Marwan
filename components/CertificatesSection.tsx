import { createClient } from "@/lib/supabase/server";
import CertificatesSectionClient from "./CertificatesSectionClient";

export default async function CertificatesSection() {
    const supabase = await createClient();

    const { data: certificates } = await supabase
        .from("certificates")
        .select("*")
        .order("display_order", { ascending: true });

    const { data: settings } = await supabase
        .from("site_settings")
        .select("total_certifications, learning_hours, skills_acquired, years_learning")
        .single();

    return (
        <CertificatesSectionClient
            initialCertificates={certificates || []}
            settings={settings}
        />
    );
}
