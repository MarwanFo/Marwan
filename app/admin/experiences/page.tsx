"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Experience } from "@/lib/types";
import { validateFile, FILE_SIZE_LIMITS, ALLOWED_IMAGE_TYPES } from "@/lib/file-validation";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    Briefcase,
    MapPin,
    Calendar,
    GraduationCap,
    Upload,
} from "lucide-react";

export default function ExperiencesPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        type: "work" as "work" | "education",
        role: "",
        company: "",
        company_url: "",
        image_url: "",
        location: "",
        period: "",
        description: "",
        achievements: "",
        technologies: "",
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("experiences")
                .select("id, title, role, company, company_url, location, type, period, start_date, end_date, current, description, achievements, technologies, image_url, display_order, created_at")
                .order("display_order", { ascending: true });

            if (error) {
                console.error("[Experiences] Fetch error");
            }

            if (data) {
                setExperiences(data);
            }
        } catch (err) {
            console.error("Error fetching experiences:", err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (experience?: Experience) => {
        if (experience) {
            setEditingExperience(experience);
            setFormData({
                type: (experience as any).type || "work",
                role: experience.role,
                company: experience.company,
                company_url: experience.company_url || "",
                image_url: (experience as any).image_url || "",
                location: experience.location || "",
                period: experience.period,
                description: experience.description || "",
                achievements: experience.achievements.join("\n"),
                technologies: experience.technologies.join(", "),
            });
        } else {
            setEditingExperience(null);
            setFormData({
                type: "work",
                role: "",
                company: "",
                company_url: "",
                image_url: "",
                location: "",
                period: "",
                description: "",
                achievements: "",
                technologies: "",
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingExperience(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const experienceData = {
            type: formData.type,
            role: formData.role,
            company: formData.company,
            company_url: formData.company_url || null,
            image_url: formData.image_url || null,
            location: formData.location || null,
            period: formData.period,
            description: formData.description || null,
            achievements: formData.achievements.split("\n").map((a) => a.trim()).filter(Boolean),
            technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
            display_order: editingExperience?.display_order || experiences.length,
        };

        if (editingExperience) {
            await supabase
                .from("experiences")
                .update(experienceData)
                .eq("id", editingExperience.id);
        } else {
            await supabase.from("experiences").insert(experienceData);
        }

        await fetchExperiences();
        closeModal();
        setSaving(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Validate file (type, size, magic bytes)
            const validation = await validateFile(file, {
                allowedTypes: ALLOWED_IMAGE_TYPES,
                maxSizeBytes: FILE_SIZE_LIMITS.logo, // 1MB limit for logos
                checkMagicBytes: true,
            });

            if (!validation.valid) {
                alert(validation.error);
                setUploading(false);
                return;
            }

            // Use secure filename
            const filePath = `experience-logos/${validation.sanitizedName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                alert('Failed to upload image. Make sure the "images" bucket exists in Supabase Storage.');
                setUploading(false);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image_url: publicUrl });
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        }
        setUploading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this experience?")) {
            await supabase.from("experiences").delete().eq("id", id);
            await fetchExperiences();
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Experience</h1>
                    <p className="text-white/60">Manage your work history</p>
                </div>
                <motion.button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neon-gradient text-background font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Experience</span>
                </motion.button>
            </div>

            {/* Experiences List */}
            {loading ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading experiences...</p>
                </div>
            ) : experiences.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-white/60 mb-4">No experiences yet</p>
                    <button
                        onClick={() => openModal()}
                        className="text-neon-cyan hover:text-white transition-colors"
                    >
                        Add your first experience →
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {experiences.map((experience) => (
                        <motion.div
                            key={experience.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass rounded-xl p-5 group hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-neon-purple/10 shrink-0">
                                        <Briefcase className="w-6 h-6 text-neon-purple" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-lg">{experience.role}</h3>
                                        <p className="text-neon-cyan">{experience.company}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {experience.period}
                                            </span>
                                            {experience.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {experience.location}
                                                </span>
                                            )}
                                        </div>
                                        {experience.description && (
                                            <p className="text-white/70 mt-3 text-sm">{experience.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {experience.technologies.slice(0, 5).map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-2 py-0.5 rounded-full text-xs bg-neon-purple/10 text-neon-purple"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openModal(experience)}
                                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(experience.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
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
                                    {editingExperience ? "Edit Experience" : "Add New Experience"}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/60" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Type Selector */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Type
                                    </label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: "work" })}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${formData.type === "work"
                                                ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                                                : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                                                }`}
                                        >
                                            <Briefcase className="w-5 h-5" />
                                            <span className="font-medium">Work Experience</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: "education" })}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${formData.type === "education"
                                                ? "bg-neon-purple/20 border-neon-purple text-neon-purple"
                                                : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                                                }`}
                                        >
                                            <GraduationCap className="w-5 h-5" />
                                            <span className="font-medium">Education</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">
                                            Role *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            placeholder="e.g. Senior Developer"
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">
                                            Company *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            placeholder="Company name"
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">
                                            Period *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.period}
                                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                            placeholder="e.g. 2022 - Present"
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. Remote, New York"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Company URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.company_url}
                                        onChange={(e) => setFormData({ ...formData, company_url: e.target.value })}
                                        placeholder="https://..."
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Logo/Image
                                        <span className="text-white/40 font-normal ml-2">(company or school logo)</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                            placeholder="https://example.com/logo.png"
                                            className={`${inputClass} flex-1`}
                                        />
                                        <label className="px-4 py-3 rounded-xl glass border border-white/10 hover:border-neon-cyan/50 hover:bg-white/5 cursor-pointer transition-all flex items-center gap-2">
                                            {uploading ? (
                                                <div className="w-5 h-5 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
                                            ) : (
                                                <Upload className="w-5 h-5 text-neon-cyan" />
                                            )}
                                            <span className="text-white/80 text-sm">Upload</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                    {formData.image_url && (
                                        <div className="mt-2 p-2 rounded-lg bg-white/5 inline-flex items-center gap-3">
                                            <img
                                                src={formData.image_url}
                                                alt="Preview"
                                                className="w-12 h-12 object-contain rounded"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-white/60 text-xs">Preview</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, image_url: "" })}
                                                    className="text-red-400 text-xs hover:text-red-300"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief role description"
                                        rows={2}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Achievements (one per line)
                                    </label>
                                    <textarea
                                        value={formData.achievements}
                                        onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                                        placeholder="Led team of 5 developers&#10;Improved performance by 40%&#10;..."
                                        rows={4}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Technologies (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.technologies}
                                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                        placeholder="React, TypeScript, Node.js..."
                                        className={inputClass}
                                    />
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
                                                <span>{editingExperience ? "Update" : "Create"}</span>
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
