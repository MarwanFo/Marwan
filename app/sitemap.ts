import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://marwanfo.me";
    const lastModified = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified,
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/experience`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/certificates`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

    try {
        const supabase = await createClient();
        const { data: projects } = await supabase
            .from("projects")
            .select("id, created_at");

        if (projects && projects.length > 0) {
            const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
                url: `${baseUrl}/projects/${p.id}`,
                lastModified: p.created_at ? new Date(p.created_at) : lastModified,
                changeFrequency: "monthly" as const,
                priority: 0.85,
            }));
            return [...staticRoutes, ...projectRoutes];
        }
    } catch {
        // Fallback to static routes if database is unreachable
    }

    return staticRoutes;
}
