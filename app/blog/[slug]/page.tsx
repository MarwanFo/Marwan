import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Post } from "@/lib/types";
import { fallbackPosts } from "@/lib/data/fallback-posts";
import BlogPostClient from "./BlogPostClient";

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://marwanfo.me";
    let post: Post | null = null;

    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from("posts")
            .select("*")
            .eq("slug", params.slug)
            .single();

        if (data) {
            post = data as Post;
        }
    } catch {
        // Fallback
    }

    if (!post) {
        post = fallbackPosts.find((p) => p.slug === params.slug) || null;
    }

    if (!post) {
        return {
            title: "Article Not Found | FARIDI Marwan",
            description: "The requested article could not be found.",
        };
    }

    const title = `${post.title} | FARIDI Marwan Blog`;
    const description = post.excerpt || "Engineering article by FARIDI Marwan.";
    const imageUrl = post.cover_image || `${siteUrl}/icon.svg`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${siteUrl}/blog/${post.slug}`,
            siteName: "FARIDI Marwan Portfolio & Blog",
            type: "article",
            publishedTime: post.published_at || post.created_at,
            authors: ["FARIDI Marwan"],
            tags: post.tags,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    let post: Post | null = null;
    let allPosts: Post[] = [];

    try {
        const supabase = await createClient();
        const [{ data: postData }, { data: listData }] = await Promise.all([
            supabase.from("posts").select("*").eq("slug", params.slug).single(),
            supabase.from("posts").select("*").eq("published", true).order("published_at", { ascending: false }),
        ]);

        if (postData) {
            post = postData as Post;
        }
        if (listData && listData.length > 0) {
            allPosts = listData as Post[];
        }
    } catch {
        // Fallback
    }

    // Use fallback posts if table empty or post not in db
    if (!post) {
        post = fallbackPosts.find((p) => p.slug === params.slug) || null;
    }
    if (allPosts.length === 0) {
        allPosts = fallbackPosts;
    }

    if (!post) {
        notFound();
    }

    // Previous and Next article navigation
    const currentIndex = allPosts.findIndex((p) => p.slug === post!.slug);
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    // Related posts (same category or sharing tags, excluding current)
    const relatedPosts = allPosts
        .filter((p) => p.slug !== post!.slug)
        .slice(0, 2);

    return (
        <BlogPostClient
            post={post}
            prevPost={prevPost}
            nextPost={nextPost}
            relatedPosts={relatedPosts}
        />
    );
}

