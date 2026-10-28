"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/lib/types";
import ImageUpload from "@/components/ImageUpload";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    ExternalLink,
    Github,
    Star,
    GripVertical,
    FolderOpen,
    Eye,
    FileText,
    Settings2,
    Sparkles,
} from "lucide-react";

const supabase = createClient();

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [saving, setSaving] = useState(false);
    const [modalTab, setModalTab] = useState<"basic" | "details">("basic");
    const [notice, setNotice] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image_url: "",
        live_url: "",
        github_url: "",
        tags: "",
        size: "medium" as "large" | "medium" | "small",
        featured: false,
        // Extended Details
        role: "",
        long_description: "",
        features: "",
        challenges: "",
        gallery: "",
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        // Try to fetch all columns including extended details
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("display_order", { ascending: true });

        if (!error && data) {
            setProjects(data as Project[]);
        } else if (error) {
            console.error("Fetch projects error:", error);
        }
        setLoading(false);
    };

    const openModal = (project?: Project) => {
        setModalTab("basic");
        setNotice(null);
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title || "",
                description: project.description || "",
                image_url: project.image_url || "",
                live_url: project.live_url || "",
                github_url: project.github_url || "",
                tags: (project.tags || []).join(", "),
                size: project.size || "medium",
                featured: !!project.featured,
                role: project.role || "",
                long_description: project.long_description || "",
                features: Array.isArray(project.features)
                    ? project.features.join("\n")
                    : (project.features as any) || "",
                challenges: project.challenges || "",
                gallery: Array.isArray(project.gallery)
                    ? project.gallery.join("\n")
                    : (project.gallery as any) || "",
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: "",
                description: "",
                image_url: "",
                live_url: "",
                github_url: "",
                tags: "",
                size: "medium",
                featured: false,
                role: "",
                long_description: "",
                features: "",
                challenges: "",
                gallery: "",
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
        setNotice(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setNotice(null);

        // Parse features and gallery lines
        const parsedFeatures = formData.features
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean);

        const parsedGallery = formData.gallery
            .split("\n")
            .map((g) => g.trim())
            .filter(Boolean);

        // Full payload with extended details
        const fullPayload: any = {
            title: formData.title,
            description: formData.description || null,
            image_url: formData.image_url || null,
            live_url: formData.live_url || null,
            github_url: formData.github_url || null,
            tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
            size: formData.size,
            featured: formData.featured,
            display_order: editingProject?.display_order ?? projects.length,
            role: formData.role || null,
            long_description: formData.long_description || null,
            features: parsedFeatures,
            challenges: formData.challenges || null,
            gallery: parsedGallery,
        };

        // Fallback payload (standard fields) if database table has not run migration yet
        const standardPayload: any = {
            title: formData.title,
            description: formData.description || null,
            image_url: formData.image_url || null,
            live_url: formData.live_url || null,
            github_url: formData.github_url || null,
            tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
            size: formData.size,
            featured: formData.featured,
            display_order: editingProject?.display_order ?? projects.length,
        };

        let saveError: any = null;

        if (editingProject) {
            // Try full payload first
            const res = await supabase.from("projects").update(fullPayload).eq("id", editingProject.id);
            if (res.error) {
                // If column does not exist error (code 42703), fallback to standard columns
                if (res.error.code === "42703" || res.error.message.includes("column")) {
                    const fallbackRes = await supabase
                        .from("projects")
                        .update(standardPayload)
                        .eq("id", editingProject.id);
                    if (fallbackRes.error) {
                        saveError = fallbackRes.error;
                    } else {
                        setNotice("Project updated! Note: Extended detail columns are not yet in Supabase. Run scripts/add-project-details.sql to enable them permanently.");
                    }
                } else {
                    saveError = res.error;
                }
            }
        } else {
            // Insert new project
            const res = await supabase.from("projects").insert(fullPayload);
            if (res.error) {
                if (res.error.code === "42703" || res.error.message.includes("column")) {
                    const fallbackRes = await supabase.from("projects").insert(standardPayload);
                    if (fallbackRes.error) {
                        saveError = fallbackRes.error;
                    } else {
                        setNotice("Project created! Note: Run scripts/add-project-details.sql in Supabase to enable all extended fields.");
                    }
                } else {
                    saveError = res.error;
                }
            }
        }

        if (saveError) {
            console.error("Database save error:", saveError);
            alert(`Failed to save project: ${saveError.message}`);
            setSaving(false);
            return;
        }

        await fetchProjects();
        if (!notice) {
            closeModal();
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            await supabase.from("projects").delete().eq("id", id);
            await fetchProjects();
        }
    };

    const inputClass =
        "w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all text-sm";

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Action Bar */}
            <div className="flex items-center justify-between gap-4 glass p-4 rounded-2xl border border-white/5 shadow-xl">
                <div>
                    <h1 className="text-lg font-bold text-white hidden sm:block">Project Catalog</h1>
                    <p className="text-xs text-white/50 hidden sm:block">
                        {projects.length} projects published · Manage public cards & deep-dive case studies
                    </p>
                </div>
                <motion.button
                    onClick={() => openModal()}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neon-gradient text-background font-bold shadow-[0_0_20px_rgba(0,255,255,0.3)] w-full sm:w-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Project</span>
                </motion.button>
            </div>

            {/* Projects List */}
            {loading ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Syncing with database...</p>
                </div>
            ) : projects.length === 0 ? (
                <div className="glass rounded-2xl p-20 text-center border-dashed border-2 border-white/5">
                    <FolderOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/60 mb-6 font-medium text-lg">Your portfolio is empty</p>
                    <button
                        onClick={() => openModal()}
                        className="px-8 py-3 rounded-xl bg-white/5 text-neon-cyan border border-neon-cyan/20 hover:bg-neon-cyan/10 transition-all font-semibold"
                    >
                        Create your first project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-5 border border-white/5 hover:border-neon-cyan/20 transition-all duration-300 group"
                        >
                            {/* Drag & Image */}
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <GripVertical className="hidden md:block w-5 h-5 text-white/20 cursor-grab hover:text-white/50" />
                                {project.image_url ? (
                                    <div
                                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-cover bg-center shrink-0 border border-white/10 shadow-lg"
                                        style={{ backgroundImage: `url(${project.image_url})` }}
                                    />
                                ) : (
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <FolderOpen className="w-8 h-8 text-white/10" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors truncate max-w-[200px] sm:max-w-none">
                                        {project.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {project.featured && (
                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 text-[10px] font-bold border border-yellow-400/20">
                                                <Star className="w-3 h-3 fill-yellow-400" />
                                                <span>FEATURED</span>
                                            </div>
                                        )}
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-white/40 border border-white/10 uppercase tracking-tighter">
                                            {project.size}
                                        </span>
                                        {project.role && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                                                {project.role}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-white/50 line-clamp-2 md:line-clamp-1 group-hover:text-white/70 transition-colors">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {(project.tags || []).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-white/60 border border-white/10 group-hover:border-neon-cyan/20 transition-all"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10 md:border-none justify-end">
                                {/* View Live Details Page */}
                                <a
                                    href={`/projects/${project.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl bg-white/5 text-white/60 hover:text-neon-cyan hover:bg-neon-cyan/10 border border-white/10 transition-all"
                                    title="View Live Details Page"
                                >
                                    <Eye className="w-5 h-5" />
                                </a>

                                {project.live_url && (
                                    <a
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-xl bg-white/5 text-white/60 hover:text-neon-cyan hover:bg-neon-cyan/10 border border-white/10 transition-all"
                                        title="Live Demo Site"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                )}
                                <a
                                    href={project.github_url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-3 rounded-xl bg-white/5 text-white/60 hover:text-neon-purple hover:bg-neon-purple/10 border border-white/10 transition-all ${!project.github_url && 'opacity-30 cursor-not-allowed'}`}
                                    title="GitHub Repository"
                                >
                                    <Github className="w-5 h-5" />
                                </a>
                                <div className="w-px h-8 bg-white/10 mx-1 hidden md:block" />
                                <button
                                    onClick={() => openModal(project)}
                                    className="p-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                                    title="Edit Project & Details"
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="p-3 rounded-xl bg-red-400/5 text-red-400 hover:text-white hover:bg-red-400 transition-all border border-red-400/20"
                                    title="Delete Project"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass rounded-3xl p-5 sm:p-7 w-full max-w-3xl max-h-[92vh] flex flex-col border border-white/10 shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        {editingProject ? "Edit Project" : "Create New Project"}
                                        {editingProject && (
                                            <a
                                                href={`/projects/${editingProject.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-neon-cyan hover:underline flex items-center gap-1 font-normal ml-2"
                                            >
                                                Preview Page <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </h2>
                                    <p className="text-xs text-white/50">Manage card preview and full case study details</p>
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
                                    onClick={() => setModalTab("basic")}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        modalTab === "basic"
                                            ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40"
                                            : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                                    }`}
                                >
                                    <Settings2 className="w-4 h-4" />
                                    <span>Basic Information</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setModalTab("details")}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        modalTab === "details"
                                            ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/40"
                                            : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Case Study & Details</span>
                                    <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-neon-cyan/20 text-neon-cyan">
                                        Rich
                                    </span>
                                </button>
                            </div>

                            {/* Notification Banner if any */}
                            {notice && (
                                <div className="mt-3 p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs">
                                    {notice}
                                </div>
                            )}

                            {/* Form Body */}
                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-5 py-4 pr-1">
                                {modalTab === "basic" ? (
                                    <>
                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                Project Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g. AI Study Assistant"
                                                required
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                Card Summary / Short Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Brief 2-3 sentence overview displayed on portfolio cards"
                                                rows={3}
                                                className={`${inputClass} resize-none`}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="w-full">
                                                <label className="block text-white/80 text-sm font-medium mb-2">
                                                    Primary Project Image
                                                </label>
                                                <ImageUpload
                                                    value={formData.image_url}
                                                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                                        Live Demo URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={formData.live_url}
                                                        onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                                                        placeholder="https://..."
                                                        className={inputClass}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                                        Card Grid Size
                                                    </label>
                                                    <select
                                                        value={formData.size}
                                                        onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
                                                        className={inputClass}
                                                    >
                                                        <option value="small" className="bg-slate-900">Small (Standard)</option>
                                                        <option value="medium" className="bg-slate-900">Medium (Default)</option>
                                                        <option value="large" className="bg-slate-900">Large (Spans 2 columns)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                GitHub Repository URL
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.github_url}
                                                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                                placeholder="https://github.com/..."
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                Tech Stack Tags (comma separated)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.tags}
                                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                                placeholder="React, TypeScript, Tailwind, Next.js, FastAPI..."
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                            <input
                                                type="checkbox"
                                                id="featured"
                                                checked={formData.featured}
                                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                className="w-5 h-5 rounded bg-white/10 border-white/20 text-neon-cyan focus:ring-neon-cyan cursor-pointer"
                                            />
                                            <label htmlFor="featured" className="text-white/80 text-sm cursor-pointer select-none">
                                                Featured Project (Highlighted with Gold Star badge)
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                Your Role on this Project
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                placeholder="e.g. Lead Full-Stack Engineer, Sole Creator & Architect"
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                Detailed Case Study & Full Overview (Markdown supported)
                                            </label>
                                            <textarea
                                                value={formData.long_description}
                                                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                                                placeholder="Write an in-depth breakdown of the project: what problem it solves, why you built it, the architecture choices, and how it works."
                                                rows={6}
                                                className={`${inputClass} resize-y min-h-[140px]`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                Key Features (1 per line)
                                            </label>
                                            <textarea
                                                value={formData.features}
                                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                                placeholder={"Semantic document search with RAG\nReal-time citation highlighting\nOffline local LLM execution via Ollama\nResponsive Dark & Warm UI"}
                                                rows={4}
                                                className={`${inputClass} resize-y`}
                                            />
                                            <p className="text-[11px] text-white/40 mt-1">Each line will become a card with an interactive icon on the details page.</p>
                                        </div>

                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                Technical Challenges & Solutions
                                            </label>
                                            <textarea
                                                value={formData.challenges}
                                                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                                                placeholder="Describe complex obstacles you tackled (e.g. optimizing RAG chunk embeddings, handling streaming responses, reducing load time)."
                                                rows={3}
                                                className={`${inputClass} resize-y`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                Additional Gallery Screenshots (1 URL per line)
                                            </label>
                                            <textarea
                                                value={formData.gallery}
                                                onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
                                                placeholder={"https://.../screenshot1.png\nhttps://.../screenshot2.png"}
                                                rows={3}
                                                className={`${inputClass} resize-y`}
                                            />
                                        </div>
                                    </>
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
                                                <span>{editingProject ? "Save Changes" : "Create Project"}</span>
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
