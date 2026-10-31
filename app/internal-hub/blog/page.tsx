"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Post } from "@/lib/types";
import { fallbackPosts } from "@/lib/data/fallback-posts";
import ImageUpload from "@/components/ImageUpload";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    ExternalLink,
    Star,
    FolderOpen,
    Eye,
    FileText,
    BookOpen,
    Clock,
    Tag,
    Globe,
    Lock,
    Search,
    AlertCircle,
    CheckCircle,
} from "lucide-react";

const supabase = createClient();

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [saving, setSaving] = useState(false);
    const [modalTab, setModalTab] = useState<"info" | "content">("info");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
    const [dbMissingNotice, setDbMissingNotice] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        cover_image: "",
        category: "Engineering",
        tags: "",
        read_time: "5 min read",
        published: true,
        featured: false,
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) {
                setPosts(data as Post[]);
                setDbMissingNotice(false);
            } else if (error) {
                // Table doesn't exist yet in Supabase
                if (error.code === "42P01" || error.message.includes("does not exist") || error.message.includes("schema cache")) {
                    setDbMissingNotice(true);
                    setPosts(fallbackPosts);
                }
            }
        } catch {
            setDbMissingNotice(true);
            setPosts(fallbackPosts);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleTitleChange = (val: string) => {
        setFormData((prev) => ({
            ...prev,
            title: val,
            // Auto generate slug if creating new post and slug wasn't manually edited
            slug: !editingPost ? generateSlug(val) : prev.slug,
        }));
    };

    const openModal = (post?: Post) => {
        setModalTab("info");
        setNotice(null);
        if (post) {
            setEditingPost(post);
            setFormData({
                title: post.title || "",
                slug: post.slug || "",
                excerpt: post.excerpt || "",
                content: post.content || "",
                cover_image: post.cover_image || "",
                category: post.category || "Engineering",
                tags: (post.tags || []).join(", "),
                read_time: post.read_time || "5 min read",
                published: !!post.published,
                featured: !!post.featured,
            });
        } else {
            setEditingPost(null);
            setFormData({
                title: "",
                slug: "",
                excerpt: "",
                content: "",
                cover_image: "",
                category: "Engineering",
                tags: "",
                read_time: "5 min read",
                published: true,
                featured: false,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
        setNotice(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setNotice(null);

        const parsedTags = formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        const slug = formData.slug ? generateSlug(formData.slug) : generateSlug(formData.title);

        const payload: any = {
            title: formData.title,
            slug,
            excerpt: formData.excerpt || null,
            content: formData.content,
            cover_image: formData.cover_image || null,
            category: formData.category || "Engineering",
            tags: parsedTags,
            read_time: formData.read_time || "5 min read",
            published: formData.published,
            featured: formData.featured,
            published_at: formData.published ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
        };

        try {
            if (editingPost) {
                const { error } = await supabase
                    .from("posts")
                    .update(payload)
                    .eq("id", editingPost.id);

                if (error) throw error;
            } else {
                const { error } = await supabase.from("posts").insert(payload);
                if (error) throw error;
            }

            await fetchPosts();
            closeModal();
        } catch (err: any) {
            if (err?.code === "42P01" || err?.message?.includes("does not exist") || err?.message?.includes("schema cache")) {
                setNotice("Note: The 'posts' table is not yet created in Supabase. Run scripts/create-blog-table.sql in your Supabase SQL editor to enable persistent saving.");
            } else {
                alert(`Error saving post: ${err.message || err}`);
            }
        } finally {
            setSaving(false);
        }
    };

    const togglePublishStatus = async (post: Post) => {
        try {
            const nextStatus = !post.published;
            const { error } = await supabase
                .from("posts")
                .update({ published: nextStatus, updated_at: new Date().toISOString() })
                .eq("id", post.id);

            if (!error) {
                setPosts((prev) =>
                    prev.map((p) => (p.id === post.id ? { ...p, published: nextStatus } : p))
                );
            }
        } catch {
            // Ignore error
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            await supabase.from("posts").delete().eq("id", id);
            await fetchPosts();
        }
    };

    // Filtered posts for search
    const displayedPosts = posts.filter((post) => {
        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "published" && post.published) ||
            (filterStatus === "draft" && !post.published);

        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
            !query ||
            post.title.toLowerCase().includes(query) ||
            (post.slug && post.slug.toLowerCase().includes(query)) ||
            (post.category && post.category.toLowerCase().includes(query));

        return matchesStatus && matchesSearch;
    });

    const publishedCount = posts.filter((p) => p.published).length;
    const draftCount = posts.length - publishedCount;

    const inputClass =
        "w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all text-sm";

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header & Stats Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass p-4 sm:p-6 rounded-2xl border border-white/5 shadow-xl">
                <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
                        <BookOpen className="w-6 h-6 text-neon-cyan" />
                        <span>Blog Management</span>
                    </h1>
                    <p className="text-xs text-white/50 mt-1">
                        {posts.length} articles total · {publishedCount} published · {draftCount} drafts
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <a
                        href="/blog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 rounded-xl glass text-white/70 hover:text-white hover:bg-white/10 border border-white/10 transition-all text-xs font-semibold flex items-center gap-1.5"
                    >
                        <span>View Public Blog</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <motion.button
                        onClick={() => openModal()}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neon-gradient text-background font-bold shadow-[0_0_20px_rgba(0,255,255,0.3)] text-sm flex-1 sm:flex-initial"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Write Article</span>
                    </motion.button>
                </div>
            </div>

            {/* Database Notice Banner (if table not in Supabase yet) */}
            {dbMissingNotice && (
                <div className="glass p-4 rounded-2xl border border-yellow-400/30 bg-yellow-400/5 flex items-start gap-3 text-xs text-yellow-300">
                    <AlertCircle className="w-5 h-5 shrink-0 text-yellow-400 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-bold">Supabase Migration Required for Blog</p>
                        <p className="text-white/70">
                            The <code className="bg-white/10 px-1 py-0.5 rounded text-white font-mono">posts</code> table is not yet created in your Supabase database.
                            To enable article creation and storage, run the SQL script located at <code className="bg-white/10 px-1 py-0.5 rounded text-white font-mono">scripts/create-blog-table.sql</code> in your Supabase SQL editor.
                        </p>
                    </div>
                </div>
            )}

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass p-4 rounded-2xl border border-white/5">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search articles by title, slug, or category..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-cyan/40 text-xs sm:text-sm"
                    />
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    {(["all", "published", "draft"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                                filterStatus === status
                                    ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles List */}
            {loading ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60 text-sm">Syncing articles...</p>
                </div>
            ) : displayedPosts.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center border-dashed border-2 border-white/5 space-y-4">
                    <BookOpen className="w-12 h-12 text-white/10 mx-auto" />
                    <h3 className="text-lg font-bold text-white">No articles found</h3>
                    <p className="text-white/50 text-sm">Create your first blog post or adjust your search filters.</p>
                    <button
                        onClick={() => openModal()}
                        className="px-6 py-2.5 rounded-xl bg-white/5 text-neon-cyan border border-neon-cyan/20 hover:bg-neon-cyan/10 transition-all font-semibold text-xs"
                    >
                        Create Post
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {displayedPosts.map((post) => (
                        <motion.div
                            key={post.id || post.slug}
                            layout
                            className="glass rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center gap-5 border border-white/5 hover:border-neon-cyan/20 transition-all duration-300 group"
                        >
                            {/* Thumbnail */}
                            {post.cover_image ? (
                                <div
                                    className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0 border border-white/10 shadow-md"
                                    style={{ backgroundImage: `url(${post.cover_image})` }}
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-8 h-8 text-white/20" />
                                </div>
                            )}

                            {/* Details */}
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-neon-cyan transition-colors truncate">
                                        {post.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => togglePublishStatus(post)}
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
                                                post.published
                                                    ? "bg-green-400/10 text-green-400 border border-green-400/30"
                                                    : "bg-white/10 text-white/50 border border-white/15"
                                            }`}
                                            title="Click to toggle status"
                                        >
                                            {post.published ? (
                                                <>
                                                    <Globe className="w-3 h-3" />
                                                    <span>LIVE</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-3 h-3" />
                                                    <span>DRAFT</span>
                                                </>
                                            )}
                                        </button>

                                        {post.featured && (
                                            <span className="px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-300 text-[10px] font-bold border border-yellow-400/20 flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-yellow-300" />
                                                <span>FEATURED</span>
                                            </span>
                                        )}

                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs sm:text-sm text-white/50 line-clamp-2 group-hover:text-white/70 transition-colors">
                                    {post.excerpt || post.content.slice(0, 150)}
                                </p>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 pt-1">
                                    <span className="font-mono text-[11px] text-neon-purple/80">/{post.slug}</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {post.read_time || "5 min read"}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10 md:border-none justify-end">
                                <a
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:text-neon-cyan hover:bg-neon-cyan/10 border border-white/10 transition-all"
                                    title="View Live Article"
                                >
                                    <Eye className="w-4 h-4" />
                                </a>

                                <button
                                    onClick={() => openModal(post)}
                                    className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                                    title="Edit Article"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => handleDelete(post.id, post.title)}
                                    className="p-2.5 rounded-xl bg-red-400/5 text-red-400 hover:text-white hover:bg-red-400 transition-all border border-red-400/20"
                                    title="Delete Article"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create / Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass rounded-3xl p-5 sm:p-7 w-full max-w-4xl max-h-[92vh] flex flex-col border border-white/10 shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        {editingPost ? "Edit Article" : "Write New Article"}
                                        {editingPost && (
                                            <a
                                                href={`/blog/${editingPost.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-neon-cyan hover:underline flex items-center gap-1 font-normal ml-2"
                                            >
                                                Live View <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </h2>
                                    <p className="text-xs text-white/50">Manage publication status, metadata, and markdown body</p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tabs Header */}
                            <div className="flex gap-2 pt-4 pb-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setModalTab("info")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                        modalTab === "info"
                                            ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
                                            : "text-white/60 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Article Info & Meta</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setModalTab("content")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                        modalTab === "content"
                                            ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/40"
                                            : "text-white/60 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    <BookOpen className="w-4 h-4" />
                                    <span>Content & Markdown</span>
                                </button>
                            </div>

                            {/* Notice if any */}
                            {notice && (
                                <div className="mt-3 p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs">
                                    {notice}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-5 py-4 pr-1">
                                {modalTab === "info" ? (
                                    <>
                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                Article Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => handleTitleChange(e.target.value)}
                                                placeholder="e.g. Modern Full-Stack System Architecture"
                                                required
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-white/80 text-sm font-medium">
                                                        URL Slug *
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }))}
                                                        className="text-[11px] text-neon-cyan hover:underline"
                                                    >
                                                        Auto Generate
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                    placeholder="modern-fullstack-architecture"
                                                    required
                                                    className={inputClass}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-white/80 text-sm font-medium mb-2">
                                                    Category
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    placeholder="Full-Stack, Security, DevOps, UI/UX"
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-white/80 text-sm font-medium mb-2">
                                                    Estimated Read Time
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.read_time}
                                                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                                                    placeholder="5 min read"
                                                    className={inputClass}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-white/80 text-sm font-medium mb-2">
                                                    Tags (comma-separated)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.tags}
                                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                                    placeholder="Next.js, TypeScript, PostgreSQL, Tailwind"
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                Cover Image URL
                                            </label>
                                            <div className="space-y-3">
                                                <input
                                                    type="url"
                                                    value={formData.cover_image}
                                                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                                                    placeholder="https://images.unsplash.com/..."
                                                    className={inputClass}
                                                />
                                                <ImageUpload
                                                    value={formData.cover_image}
                                                    onChange={(url) => setFormData({ ...formData, cover_image: url })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                Short Excerpt / Summary
                                            </label>
                                            <textarea
                                                value={formData.excerpt}
                                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                                placeholder="A concise 2-sentence summary shown on blog cards and search results..."
                                                rows={3}
                                                className={`${inputClass} resize-none`}
                                            />
                                        </div>

                                        {/* Status Toggles */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                                                <input
                                                    type="checkbox"
                                                    id="published"
                                                    checked={formData.published}
                                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                                    className="w-5 h-5 rounded bg-white/10 border-white/20 text-neon-cyan focus:ring-neon-cyan cursor-pointer"
                                                />
                                                <label htmlFor="published" className="text-white/80 text-sm cursor-pointer select-none">
                                                    <span className="font-semibold block text-white">Publish Article</span>
                                                    <span className="text-xs text-white/40">Visible to the public on /blog</span>
                                                </label>
                                            </div>

                                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                                                <input
                                                    type="checkbox"
                                                    id="featured"
                                                    checked={formData.featured}
                                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                    className="w-5 h-5 rounded bg-white/10 border-white/20 text-yellow-400 focus:ring-yellow-400 cursor-pointer"
                                                />
                                                <label htmlFor="featured" className="text-white/80 text-sm cursor-pointer select-none">
                                                    <span className="font-semibold block text-white">Featured Article</span>
                                                    <span className="text-xs text-white/40">Highlighted with Gold Star badge</span>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-white/80 text-sm font-medium">
                                                Article Markdown Body *
                                            </label>
                                            <span className="text-xs text-white/40">
                                                Markdown, code blocks, lists, and quotes supported
                                            </span>
                                        </div>

                                        <textarea
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            placeholder={`## Introduction\n\nWrite your thoughts here...\n\n### Core Architecture\n\n- Point 1\n- Point 2\n\n\`\`\`typescript\nconst greeting = "Hello, world!";\n\`\`\``}
                                            rows={16}
                                            required
                                            className={`${inputClass} font-mono text-xs sm:text-sm leading-relaxed resize-y min-h-[300px]`}
                                        />
                                    </div>
                                )}

                                {/* Modal Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="order-2 sm:order-1 flex-1 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="order-1 sm:order-2 flex-1 py-3 rounded-xl bg-neon-gradient text-background font-bold flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                                    >
                                        {saving ? (
                                            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                <span>{editingPost ? "Save Changes" : "Publish Article"}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

