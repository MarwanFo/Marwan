import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { fallbackPosts } from "@/lib/data/fallback-posts";

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
            url: `${baseUrl}/blog`,
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

    let dynamicRoutes: MetadataRoute.Sitemap = [];

    try {
        const supabase = await createClient();
        const [{ data: projects }, { data: posts }] = await Promise.all([
            supabase.from("projects").select("id, created_at"),
            supabase.from("posts").select("slug, published_at, created_at").eq("published", true),
        ]);

        if (projects && projects.length > 0) {
            const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
                url: `${baseUrl}/projects/${p.id}`,
                lastModified: p.created_at ? new Date(p.created_at) : lastModified,
                changeFrequency: "monthly" as const,
                priority: 0.85,
            }));
            dynamicRoutes = [...dynamicRoutes, ...projectRoutes];
        }

        const blogList = posts && posts.length > 0 ? posts : fallbackPosts;
        const blogRoutes: MetadataRoute.Sitemap = blogList.map((p) => ({
            url: `${baseUrl}/blog/${p.slug}`,
            lastModified: p.published_at || p.created_at ? new Date(p.published_at || p.created_at) : lastModified,
            changeFrequency: "monthly" as const,
            priority: 0.85,
        }));
        dynamicRoutes = [...dynamicRoutes, ...blogRoutes];
    } catch {
        // Fallback to static + default fallback posts
        const blogRoutes: MetadataRoute.Sitemap = fallbackPosts.map((p) => ({
            url: `${baseUrl}/blog/${p.slug}`,
            lastModified: p.published_at || p.created_at ? new Date(p.published_at || p.created_at) : lastModified,
            changeFrequency: "monthly" as const,
            priority: 0.85,
        }));
        dynamicRoutes = [...dynamicRoutes, ...blogRoutes];
    }

    return [...staticRoutes, ...dynamicRoutes];
}
