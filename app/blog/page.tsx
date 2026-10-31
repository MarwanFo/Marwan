import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { Post } from "@/lib/types";
import { fallbackPosts } from "@/lib/data/fallback-posts";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
    title: "Blog & Technical Articles | FARIDI Marwan",
    description: "In-depth articles and engineering case studies on full-stack architecture, Next.js, web security, database optimization, and high-performance design.",
    openGraph: {
        title: "Blog & Technical Articles | FARIDI Marwan",
        description: "In-depth articles and engineering case studies on full-stack architecture, Next.js, web security, and high-performance design.",
        type: "website",
        url: "https://marwanfo.me/blog",
    },
};

export default async function BlogPage() {
    let posts: Post[] = [];

    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("published", true)
            .order("published_at", { ascending: false });

        if (!error && data && data.length > 0) {
            posts = data as Post[];
        } else {
            posts = fallbackPosts;
        }
    } catch {
        posts = fallbackPosts;
    }

    return <BlogPageClient posts={posts} />;
}

