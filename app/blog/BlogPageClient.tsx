"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Post } from "@/lib/types";
import {
    Search,
    BookOpen,
    Calendar,
    Clock,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Star,
    Tag,
    X,
} from "lucide-react";
import Link from "next/link";

interface BlogPageClientProps {
    posts: Post[];
}

export default function BlogPageClient({ posts }: BlogPageClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Extract all unique categories
    const categories = useMemo(() => {
        const cats = new Set<string>(["All"]);
        posts.forEach((p) => {
            if (p.category) cats.add(p.category);
        });
        return Array.from(cats);
    }, [posts]);

    // Filter posts
    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesCategory =
                selectedCategory === "All" || post.category === selectedCategory;
            const matchesTag =
                !selectedTag || (post.tags && post.tags.includes(selectedTag));
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !query ||
                post.title.toLowerCase().includes(query) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
                (post.tags && post.tags.some((t) => t.toLowerCase().includes(query))) ||
                (post.category && post.category.toLowerCase().includes(query));

            return matchesCategory && matchesTag && matchesSearch;
        });
    }, [posts, selectedCategory, selectedTag, searchQuery]);

    // Format date helper
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "Recent";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "Recent";
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-24 relative overflow-hidden">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
                {/* Header Banner */}
                <div className="text-center max-w-3xl mx-auto space-y-5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-neon-cyan/30 text-neon-cyan text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Engineering Articles</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight"
                    >
                        Insights & Knowledge
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 text-base sm:text-lg leading-relaxed"
                    >
                        Articles on full-stack architecture, database security, modern React & Next.js engineering, and lessons learned building scalable systems.
                    </motion.p>
                </div>

                {/* When no posts have been published at all */}
                {posts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass rounded-3xl p-16 text-center border-dashed border-2 border-white/10 space-y-4 max-w-xl mx-auto my-8 shadow-xl"
                    >
                        <BookOpen className="w-12 h-12 text-white/30 mx-auto" />
                        <h3 className="text-2xl font-bold text-white">No Articles Published Yet</h3>
                        <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
                            Technical articles, architectural deep dives, and system case studies are currently in the works. Check back soon!
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon-gradient text-background font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Home</span>
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Search & Filter Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="glass p-4 sm:p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl"
                        >
                            {/* Search Input Bar */}
                            <div className="relative">
                                <Search className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search articles by title, topic, or keyword..."
                                    className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all text-sm sm:text-base"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Category Filter Pills & Active Tag Filter */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                                selectedCategory === cat
                                                    ? "bg-neon-cyan text-background shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                                                    : "glass text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {selectedTag && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple text-xs font-semibold">
                                        <Tag className="w-3.5 h-3.5" />
                                        <span>Tag: #{selectedTag}</span>
                                        <button
                                            onClick={() => setSelectedTag(null)}
                                            className="hover:text-white ml-1"
                                            title="Clear tag filter"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Article Count & Filter Summary */}
                        <div className="flex items-center justify-between text-xs sm:text-sm text-white/50 px-2">
                            <span>
                                Showing <strong className="text-white">{filteredPosts.length}</strong> of {posts.length} articles
                            </span>
                            {(searchQuery || selectedCategory !== "All" || selectedTag) && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("All");
                                        setSelectedTag(null);
                                    }}
                                    className="text-neon-cyan hover:underline text-xs"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>

                        {/* Empty Search/Filter State */}
                        {filteredPosts.length === 0 ? (
                            <div className="glass rounded-3xl p-16 text-center border-dashed border-2 border-white/10 space-y-4">
                                <BookOpen className="w-12 h-12 text-white/20 mx-auto" />
                                <h3 className="text-xl font-bold text-white">No articles found</h3>
                                <p className="text-white/50 text-sm max-w-md mx-auto">
                                    No articles match your current search or category filters. Try adjusting your query or resetting filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("All");
                                        setSelectedTag(null);
                                    }}
                                    className="px-6 py-2.5 rounded-xl bg-neon-gradient text-background font-bold text-sm shadow-md"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            /* Articles Grid */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPosts.map((post, index) => (
                                    <motion.article
                                        key={post.id || post.slug}
                                        initial={{ opacity: 0, y: 25 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.08 }}
                                        className="glass rounded-3xl overflow-hidden border border-white/10 hover:border-neon-cyan/40 transition-all duration-500 group flex flex-col shadow-xl hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]"
                                    >
                                        {/* Cover Image Container */}
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="block relative aspect-video overflow-hidden bg-black/40"
                                        >
                                            <img
                                                src={
                                                    post.cover_image ||
                                                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop"
                                                }
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-background/80 backdrop-blur-md text-neon-cyan border border-neon-cyan/30">
                                                    {post.category || "Article"}
                                                </span>
                                                {post.featured && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-400/20 backdrop-blur-md text-yellow-300 border border-yellow-400/40 flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-yellow-300" />
                                                        <span>Featured</span>
                                                    </span>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Card Body */}
                                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                            <div className="space-y-3">
                                                {/* Date & Read Time */}
                                                <div className="flex items-center gap-4 text-xs text-white/50">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-neon-cyan/80" />
                                                        {formatDate(post.published_at || post.created_at)}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-neon-purple/80" />
                                                        {post.read_time || "5 min read"}
                                                    </span>
                                                </div>

                                                {/* Post Title */}
                                                <Link href={`/blog/${post.slug}`} className="block group/title">
                                                    <h2 className="text-xl font-bold text-white group-hover/title:text-neon-cyan transition-colors line-clamp-2 leading-snug">
                                                        {post.title}
                                                    </h2>
                                                </Link>

                                                {/* Excerpt */}
                                                <p className="text-white/60 text-sm line-clamp-3 leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                            </div>

                                            {/* Tags & Read Action */}
                                            <div className="pt-4 border-t border-white/10 space-y-3">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(post.tags || []).slice(0, 3).map((tag) => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => setSelectedTag(tag)}
                                                            className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white/5 text-white/60 hover:text-neon-cyan hover:bg-white/10 transition-colors"
                                                        >
                                                            #{tag}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between pt-1">
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-neon-cyan hover:text-cyan-900 dark:hover:text-white transition-colors group/btn"
                                                    >
                                                        <span>Read Article</span>
                                                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
