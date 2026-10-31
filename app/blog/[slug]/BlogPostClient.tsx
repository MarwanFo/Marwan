"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { Post } from "@/lib/types";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Share2,
    Check,
    Tag,
    BookOpen,
    ArrowRight,
    MessageSquare,
    Sparkles,
    User,
} from "lucide-react";
import Link from "next/link";

interface BlogPostClientProps {
    post: Post;
    prevPost: Post | null;
    nextPost: Post | null;
    relatedPosts: Post[];
}

export default function BlogPostClient({
    post,
    prevPost,
    nextPost,
    relatedPosts,
}: BlogPostClientProps) {
    const [copied, setCopied] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "Recent";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "Recent";
        }
    };

    const handleShare = async () => {
        if (typeof window !== "undefined") {
            try {
                if (navigator.share) {
                    await navigator.share({
                        title: post.title,
                        text: post.excerpt || undefined,
                        url: window.location.href,
                    });
                } else {
                    await navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }
            } catch {
                // Ignore cancel errors
            }
        }
    };

    const handleTwitterShare = () => {
        if (typeof window !== "undefined") {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(`"${post.title}" by @MarwanFaridi`);
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
        }
    };

    const handleLinkedInShare = () => {
        if (typeof window !== "undefined") {
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
        }
    };

    // Render formatted markdown content
    const renderContent = (rawContent: string) => {
        const sections = rawContent.split("\n\n");

        return sections.map((section, idx) => {
            const trimmed = section.trim();

            // Headings
            if (trimmed.startsWith("### ")) {
                return (
                    <h3 key={idx} className="text-xl sm:text-2xl font-bold text-white mt-8 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-neon-purple rounded-full" />
                        {trimmed.replace(/^###\s+/, "")}
                    </h3>
                );
            }
            if (trimmed.startsWith("## ")) {
                return (
                    <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-white mt-12 mb-4 flex items-center gap-2.5">
                        <span className="w-2 h-6 bg-neon-gradient rounded-full" />
                        {trimmed.replace(/^##\s+/, "")}
                    </h2>
                );
            }
            if (trimmed.startsWith("# ")) {
                return (
                    <h1 key={idx} className="text-3xl sm:text-4xl font-extrabold text-white mt-12 mb-4">
                        {trimmed.replace(/^#\s+/, "")}
                    </h1>
                );
            }

            // Code blocks
            if (trimmed.startsWith("```")) {
                const lines = trimmed.split("\n");
                const language = lines[0].replace("```", "").trim() || "code";
                const codeSnippet = lines.slice(1, -1).join("\n");

                return (
                    <div key={idx} className="my-6 rounded-2xl overflow-hidden glass border border-white/10 shadow-xl">
                        <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                            <span>{language.toUpperCase()}</span>
                            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                        </div>
                        <pre className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm font-mono text-neon-cyan/90 leading-relaxed bg-black/40">
                            <code>{codeSnippet}</code>
                        </pre>
                    </div>
                );
            }

            // Bullet Lists
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                const items = trimmed.split("\n").map((line) => line.replace(/^[-*]\s+/, ""));
                return (
                    <ul key={idx} className="my-4 space-y-2.5 pl-2">
                        {items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-3 text-white/80 text-base leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-2 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                );
            }

            // Blockquote
            if (trimmed.startsWith("> ")) {
                return (
                    <blockquote
                        key={idx}
                        className="my-6 p-4 sm:p-6 rounded-2xl border-l-4 border-neon-cyan bg-white/5 italic text-white/80 text-base sm:text-lg"
                    >
                        {trimmed.replace(/^>\s+/, "")}
                    </blockquote>
                );
            }

            // Standard Paragraph
            return (
                <p key={idx} className="text-white/80 text-base sm:text-lg leading-relaxed my-4">
                    {trimmed}
                </p>
            );
        });
    };

    return (
        <div className="min-h-screen bg-background relative pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Top Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-neon-gradient z-50 origin-left"
                style={{ scaleX }}
            />

            {/* Ambient Lighting */}
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[140px] pointer-events-none" />

            <article className="max-w-4xl mx-auto relative z-10 space-y-12">
                {/* Navigation & Share Row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all text-sm font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>All Articles</span>
                    </Link>

                    {/* Share action buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleTwitterShare}
                            className="p-2.5 rounded-xl glass hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all text-xs font-semibold"
                            title="Share on X (Twitter)"
                        >
                            𝕏
                        </button>
                        <button
                            onClick={handleLinkedInShare}
                            className="p-2.5 rounded-xl glass hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all text-xs font-semibold"
                            title="Share on LinkedIn"
                        >
                            in
                        </button>
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all text-sm font-medium"
                            title="Copy link"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400 text-xs font-bold">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4" />
                                    <span className="text-xs">Share</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Article Header */}
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40">
                            {post.category || "Article"}
                        </span>
                        <span className="text-white/40 text-xs flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.published_at || post.created_at)}
                        </span>
                        <span className="text-white/40 text-xs flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.read_time || "5 min read"}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-3xl border-l-2 border-neon-cyan/50 pl-4 py-1">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Author Byline Card */}
                    <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-purple p-0.5 shadow-md">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                                MF
                            </div>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">FARIDI Marwan</p>
                            <p className="text-white/50 text-xs">Full Stack Developer & Software Engineer</p>
                        </div>
                    </div>
                </div>

                {/* Cover Image Showcase */}
                {post.cover_image && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-3xl overflow-hidden glass border border-white/15 shadow-2xl relative aspect-video"
                    >
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-40" />
                    </motion.div>
                )}

                {/* Article Body Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass p-6 sm:p-12 rounded-3xl border border-white/10 shadow-xl"
                >
                    <div className="prose prose-invert max-w-none">
                        {renderContent(post.content)}
                    </div>

                    {/* Article Tags Footer */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-white/10 space-y-3">
                            <div className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-wider">
                                <Tag className="w-3.5 h-3.5" />
                                <span>Topics & Technologies</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 text-white/80 border border-white/10 hover:border-neon-cyan/40 hover:text-neon-cyan transition-all"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Bottom Prev / Next Navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    {prevPost ? (
                        <Link
                            href={`/blog/${prevPost.slug}`}
                            className="glass p-5 rounded-2xl border border-white/10 hover:border-neon-cyan/30 flex items-center gap-4 transition-all group"
                        >
                            <ArrowLeft className="w-5 h-5 text-neon-cyan group-hover:-translate-x-1 transition-transform shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">Previous Article</p>
                                <p className="text-white font-bold text-sm sm:text-base truncate group-hover:text-neon-cyan transition-colors">
                                    {prevPost.title}
                                </p>
                            </div>
                        </Link>
                    ) : (
                        <div />
                    )}

                    {nextPost ? (
                        <Link
                            href={`/blog/${nextPost.slug}`}
                            className="glass p-5 rounded-2xl border border-white/10 hover:border-neon-purple/30 flex items-center justify-between gap-4 transition-all group sm:text-right"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">Next Article</p>
                                <p className="text-white font-bold text-sm sm:text-base truncate group-hover:text-neon-purple transition-colors">
                                    {nextPost.title}
                                </p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-neon-purple group-hover:translate-x-1 transition-transform shrink-0" />
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>

                {/* Related Articles Recommendation */}
                {relatedPosts.length > 0 && (
                    <div className="space-y-6 pt-6">
                        <div className="flex items-center gap-2 text-white font-bold text-lg">
                            <Sparkles className="w-5 h-5 text-neon-cyan" />
                            <span>Recommended Reading</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {relatedPosts.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/blog/${related.slug}`}
                                    className="glass p-5 rounded-2xl border border-white/10 hover:border-neon-cyan/30 transition-all group flex flex-col justify-between space-y-3"
                                >
                                    <div>
                                        <span className="text-[11px] font-bold text-neon-cyan uppercase tracking-wider">
                                            {related.category}
                                        </span>
                                        <h4 className="text-base font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-2 mt-1">
                                            {related.title}
                                        </h4>
                                        <p className="text-white/50 text-xs line-clamp-2 mt-1.5">
                                            {related.excerpt}
                                        </p>
                                    </div>
                                    <div className="text-xs text-white/40 flex items-center justify-between pt-2 border-t border-white/5">
                                        <span>{related.read_time || "5 min read"}</span>
                                        <span className="text-neon-cyan group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass p-8 sm:p-12 rounded-3xl border border-neon-cyan/20 text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-neon-cyan/5 to-transparent shadow-2xl"
                >
                    <div className="max-w-xl mx-auto space-y-3">
                        <h3 className="text-2xl sm:text-3xl font-bold text-white">
                            Have Thoughts or Want to Discuss?
                        </h3>
                        <p className="text-white/60 text-sm sm:text-base">
                            Whether you want to discuss engineering architecture, collaborate on a project, or share feedback on this article, my inbox is always open.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-neon-gradient text-background font-bold hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all"
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span>Get in Touch</span>
                        </Link>
                    </div>
                </motion.div>
            </article>
        </div>
    );
}

