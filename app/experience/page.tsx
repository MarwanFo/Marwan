import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import ExperiencesPageClient from "./ExperiencesPageClient";

export const metadata: Metadata = {
    title: "Experience | Developer Portfolio",
    description: "View my complete work history and experience",
};

export default async function ExperiencesPage() {
    const supabase = await createClient();

    const { data: experiences } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });

    return <ExperiencesPageClient experiences={experiences || []} />;
}
