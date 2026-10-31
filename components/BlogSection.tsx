import { createClient } from "@/lib/supabase/server";
import { Post } from "@/lib/types";
import { fallbackPosts } from "@/lib/data/fallback-posts";
import BlogSectionClient from "./BlogSectionClient";

export default async function BlogSection() {
    let posts: Post[] = [];

    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("published", true)
            .order("published_at", { ascending: false })
            .limit(3);

        if (!error && data && data.length > 0) {
            posts = data as Post[];
        } else {
            posts = fallbackPosts;
        }
    } catch {
        posts = fallbackPosts;
    }

    if (posts.length === 0) {
        return null;
    }

    return <BlogSectionClient initialPosts={posts} />;
}
