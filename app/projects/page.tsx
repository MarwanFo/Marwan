import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import ProjectsPageClient from "./ProjectsPageClient";

export const metadata: Metadata = {
    title: "Projects | Developer Portfolio",
    description: "View all my projects and work",
};

export default async function ProjectsPage() {
    const supabase = await createClient();

    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

    return <ProjectsPageClient projects={projects || []} />;
}
