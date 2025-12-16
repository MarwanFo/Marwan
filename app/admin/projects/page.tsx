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
} from "lucide-react";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

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
            .select("*")
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Projects</h1>
                    <p className="text-white/60">Manage your portfolio projects</p>
                </div>
                <motion.button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neon-gradient text-background font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Project</span>
                </motion.button>
            </div>

            {/* Projects List */}
            {loading ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading projects...</p>
                </div>
            ) : projects.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-white/60 mb-4">No projects yet</p>
                    <button
                        onClick={() => openModal()}
                        className="text-neon-cyan hover:text-white transition-colors"
                    >
                        Add your first project →
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass rounded-xl p-4 flex items-center gap-4 group hover:bg-white/10 transition-colors"
                        >
                            <GripVertical className="w-5 h-5 text-white/30 cursor-grab" />

                            {project.image_url && (
                                <div
                                    className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0"
                                    style={{ backgroundImage: `url(${project.image_url})` }}
                                />
                            )}

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-white truncate">{project.title}</h3>
                                    {project.featured && (
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    )}
                                    <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/60">
                                        {project.size}
                                    </span>
                                </div>
                                <p className="text-sm text-white/60 truncate">{project.description}</p>
                                <div className="flex gap-2 mt-2">
                                    {project.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 rounded-full text-xs bg-neon-cyan/10 text-neon-cyan"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {project.live_url && (
                                    <a
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-neon-cyan transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-neon-purple transition-colors"
                                    >
                                        <Github className="w-4 h-4" />
                                    </a>
                                )}
                                <button
                                    onClick={() => openModal(project)}
                                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
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
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
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
                                                <option value="small">Small</option>
                                                <option value="medium">Medium</option>
                                                <option value="large">Large</option>
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
                                        className="w-5 h-5 rounded bg-white/10 border-white/20 text-neon-cyan focus:ring-neon-cyan"
                                    />
                                    <label htmlFor="featured" className="text-white/80">
                                        Featured project (displayed larger)
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 py-3 rounded-xl bg-neon-gradient text-background font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
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

