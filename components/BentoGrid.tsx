import { createClient } from "@/lib/supabase/server";
import BentoGridClient from "./BentoGridClient";

export default async function BentoGrid() {
    const supabase = await createClient();

    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

    return <BentoGridClient initialProjects={projects || []} />;
}
