"use client";

import { motion } from "framer-motion";
import { Post } from "@/lib/types";
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface BlogSectionClientProps {
    initialPosts: Post[];
}

export default function BlogSectionClient({ initialPosts }: BlogSectionClientProps) {
    const { t } = useTranslation();

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
        <section id="blog" className="py-24 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-neon-cyan/30 text-neon-cyan text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Engineering Blog</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                    >
                        Articles & Insights
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 text-base sm:text-lg leading-relaxed"
                    >
                        Thoughts on full-stack system architecture, modern web security, and crafting high-performance digital experiences.
                    </motion.p>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {initialPosts.map((post, index) => (
                        <motion.article
                            key={post.id || post.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass rounded-3xl overflow-hidden border border-white/10 hover:border-neon-cyan/40 transition-all duration-500 group flex flex-col shadow-xl hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]"
                        >
                            {/* Cover Image Container */}
                            <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-black/40">
                                <img
                                    src={post.cover_image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop"}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                                {/* Category Badge */}
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

                            {/* Card Content */}
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    {/* Metadata row */}
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

                                    {/* Title */}
                                    <Link href={`/blog/${post.slug}`} className="block group/title">
                                        <h3 className="text-xl font-bold text-white group-hover/title:text-neon-cyan transition-colors line-clamp-2 leading-snug">
                                            {post.title}
                                        </h3>
                                    </Link>

                                    {/* Excerpt */}
                                    <p className="text-white/60 text-sm line-clamp-2 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                    {/* Tags snippet */}
                                    <div className="flex items-center gap-1.5 overflow-hidden max-w-[65%]">
                                        {(post.tags || []).slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/5 text-white/60 truncate"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Read More Link */}
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-neon-cyan hover:text-cyan-900 dark:hover:text-white transition-colors group/btn"
                                    >
                                        <span>Read Post</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Bottom Explore Button */}
                <div className="text-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass border border-neon-cyan/30 text-white font-bold hover:bg-neon-cyan hover:text-background hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all group"
                    >
                        <span>Explore All Articles</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

