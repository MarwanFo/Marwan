import { createClient } from "@/lib/supabase/server";
import ExperienceSectionClient from "./ExperienceSectionClient";

export default async function ExperienceSection() {
    const supabase = await createClient();

    const { data: experiences } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });

    return <ExperienceSectionClient initialExperiences={experiences || []} />;
}
