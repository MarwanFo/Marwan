import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Project } from "@/lib/types";
import ProjectDetailClient from "./ProjectDetailClient";

interface PageProps {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const supabase = await createClient();
    const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!project) {
        return {
            title: "Project Not Found | FARIDI Marwan",
            description: "The requested project could not be found.",
        };
    }

    const title = `${project.title} | Projects | FARIDI Marwan`;
    const description = project.description || `Case study and technical details for ${project.title}.`;
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://marwanfo.me";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${siteUrl}/projects/${project.id}`,
            siteName: "FARIDI Marwan Portfolio",
            type: "article",
            images: project.image_url ? [{ url: project.image_url, width: 1200, height: 630, alt: project.title }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: project.image_url ? [project.image_url] : [],
        },
    };
}

export default async function ProjectDetailPage({ params }: PageProps) {
    const supabase = await createClient();

    // Fetch the target project
    const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!project) {
        notFound();
    }

    // Fetch all projects for previous / next project navigation
    const { data: allProjects } = await supabase
        .from("projects")
        .select("id, title, image_url, tags, display_order")
        .order("display_order", { ascending: true });

    const projectsList = (allProjects || []) as Project[];
    const currentIndex = projectsList.findIndex((p) => p.id === project.id);
    const prevProject = currentIndex > 0 ? projectsList[currentIndex - 1] : null;
    const nextProject = currentIndex >= 0 && currentIndex < projectsList.length - 1 ? projectsList[currentIndex + 1] : null;

    return (
        <ProjectDetailClient
            project={project as Project}
            prevProject={prevProject}
            nextProject={nextProject}
        />
    );
}

