"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

const supabase = createClient();

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [saving, setSaving] = useState(false);

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
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("projects")
            .select("id, title, description, tags, github_url, live_url, image_url, size, featured, display_order, created_at")
            .order("display_order", { ascending: true });

        if (!error && data) {
            setProjects(data);
        }
        setLoading(false);
    };

    const openModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                description: project.description || "",
                image_url: project.image_url || "",
                live_url: project.live_url || "",
                github_url: project.github_url || "",
                tags: project.tags.join(", "),
                size: project.size,
                featured: project.featured,
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
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const projectData = {
            title: formData.title,
            description: formData.description || null,
            image_url: formData.image_url || null,
            live_url: formData.live_url || null,
            github_url: formData.github_url || null,
            tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
            size: formData.size,
            featured: formData.featured,
            display_order: editingProject?.display_order || projects.length,
        };

        let error;
        if (editingProject) {
            const result = await supabase
                .from("projects")
                .update(projectData)
                .eq("id", editingProject.id);
            error = result.error;
        } else {
            const result = await supabase.from("projects").insert(projectData);
            error = result.error;
        }

        if (error) {
            console.error("Database error:", error);
            alert(`Failed to save project: ${error.message}`);
            setSaving(false);
            return;
        }

        await fetchProjects();
        closeModal();
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            await supabase.from("projects").delete().eq("id", id);
            await fetchProjects();
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all";

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Action Bar */}
            <div className="flex items-center justify-between gap-4 glass p-4 rounded-2xl border border-white/5 shadow-xl">
                <div>
                    <h1 className="text-lg font-bold text-white hidden sm:block">Project Catalog</h1>
                    <p className="text-xs text-white/50 hidden sm:block">{projects.length} items total</p>
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
                                    </div>
                                </div>
                                <p className="text-sm text-white/50 line-clamp-2 md:line-clamp-1 group-hover:text-white/70 transition-colors">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {project.tags.map((tag) => (
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
                                {project.live_url && (
                                    <a
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-xl bg-white/5 text-white/60 hover:text-neon-cyan hover:bg-neon-cyan/10 border border-white/10 transition-all"
                                        title="Live Site"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                )}
                                <a
                                    href={project.github_url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-3 rounded-xl bg-white/5 text-white/60 hover:text-neon-purple hover:bg-neon-purple/10 border border-white/10 transition-all ${!project.github_url && 'opacity-30 cursor-not-allowed'}`}
                                    title="GitHub"
                                >
                                    <Github className="w-5 h-5" />
                                </a>
                                <div className="w-px h-8 bg-white/10 mx-1 hidden md:block" />
                                <button
                                    onClick={() => openModal(project)}
                                    className="p-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="p-3 rounded-xl bg-red-400/5 text-red-400 hover:text-white hover:bg-red-400 transition-all border border-red-400/20"
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
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6 sticky top-0 bg-background/50 backdrop-blur-md z-10 py-2 sm:py-0">
                                <h2 className="text-xl font-bold text-white">
                                    {editingProject ? "Edit Project" : "Add New Project"}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/60" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Project title"
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief project description"
                                        rows={3}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="w-full">
                                        <label className="block text-white/80 text-sm font-medium mb-2">
                                            Project Image
                                        </label>
                                        <ImageUpload
                                            value={formData.image_url}
                                            onChange={(url) => setFormData({ ...formData, image_url: url })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                Live URL
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
                                                Size
                                            </label>
                                            <select
                                                value={formData.size}
                                                onChange={(e) => setFormData({ ...formData, size: e.target.value as "large" | "medium" | "small" })}
                                                className={inputClass}
                                            >
                                                <option value="small" className="bg-slate-900">Small</option>
                                                <option value="medium" className="bg-slate-900">Medium</option>
                                                <option value="large" className="bg-slate-900">Large</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        GitHub URL
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
                                        Tags (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="React, TypeScript, Tailwind..."
                                        className={inputClass}
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-5 h-5 rounded bg-white/10 border-white/20 text-neon-cyan focus:ring-neon-cyan cursor-pointer"
                                    />
                                    <label htmlFor="featured" className="text-white/80 cursor-pointer select-none">
                                        Featured project (displayed larger)
                                    </label>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="order-2 sm:order-1 flex-1 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="order-1 sm:order-2 flex-1 py-3 rounded-xl bg-neon-gradient text-background font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                <span>{editingProject ? "Update" : "Create"}</span>
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

