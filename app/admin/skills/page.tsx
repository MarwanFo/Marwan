"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
    Plus,
    Trash2,
    Save,
    Sparkles,
    ExternalLink,
    Image as ImageIcon,
    CheckCircle,
} from "lucide-react";

interface Skill {
    id: string;
    name: string;
    icon_url: string;
    website_url?: string;
    created_at: string;
}

// Default skills to add initially
const defaultSkills = [
    { name: "React", icon_url: "https://cdn.simpleicons.org/react/61DAFB", website_url: "https://react.dev" },
    { name: "Next.js", icon_url: "https://cdn.simpleicons.org/nextdotjs/white", website_url: "https://nextjs.org" },
    { name: "TypeScript", icon_url: "https://cdn.simpleicons.org/typescript/3178C6", website_url: "https://typescriptlang.org" },
    { name: "Node.js", icon_url: "https://cdn.simpleicons.org/nodedotjs/339933", website_url: "https://nodejs.org" },
    { name: "Tailwind CSS", icon_url: "https://cdn.simpleicons.org/tailwindcss/06B6D4", website_url: "https://tailwindcss.com" },
    { name: "PostgreSQL", icon_url: "https://cdn.simpleicons.org/postgresql/4169E1", website_url: "https://postgresql.org" },
    { name: "Docker", icon_url: "https://cdn.simpleicons.org/docker/2496ED", website_url: "https://docker.com" },
    { name: "Git", icon_url: "https://cdn.simpleicons.org/git/F05032", website_url: "https://git-scm.com" },
    { name: "Python", icon_url: "https://cdn.simpleicons.org/python/3776AB", website_url: "https://python.org" },
    { name: "AWS", icon_url: "https://cdn.simpleicons.org/amazonaws/FF9900", website_url: "https://aws.amazon.com" },
];

export default function SkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSkill, setNewSkill] = useState({ name: "", icon_url: "", website_url: "" });
    const supabase = createClient();

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("skills")
            .select("id, name, icon_url, website_url, created_at")
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching skills:", error);
            // Table might not exist, that's okay
        } else {
            setSkills(data || []);
        }
        setLoading(false);
    };

    const addSkill = async () => {
        if (!newSkill.name || !newSkill.icon_url) {
            alert("Please enter skill name and icon URL");
            return;
        }

        setSaving(true);
        const { data, error } = await supabase
            .from("skills")
            .insert({
                name: newSkill.name,
                icon_url: newSkill.icon_url,
                website_url: newSkill.website_url || null,
            })
            .select()
            .single();

        if (error) {
            console.error("[Skills] Add skill error");
            alert("Failed to add skill. Please try again.");
        } else {
            setSkills([...skills, data]);
            setNewSkill({ name: "", icon_url: "", website_url: "" });
            setShowAddForm(false);
        }
        setSaving(false);
    };

    const deleteSkill = async (id: string) => {
        if (!confirm("Are you sure you want to delete this skill?")) return;

        const { error } = await supabase.from("skills").delete().eq("id", id);

        if (error) {
            console.error("[Skills] Delete skill error");
            alert("Failed to delete skill. Please try again.");
        } else {
            setSkills(skills.filter((s) => s.id !== id));
        }
    };

    const addDefaultSkills = async () => {
        setSaving(true);
        for (const skill of defaultSkills) {
            // Check if skill already exists
            const exists = skills.some((s) => s.name.toLowerCase() === skill.name.toLowerCase());
            if (!exists) {
                const { data, error } = await supabase
                    .from("skills")
                    .insert(skill)
                    .select()
                    .single();

                if (!error && data) {
                    setSkills((prev) => [...prev, data]);
                }
            }
        }
        setSaving(false);
    };

    const inputClass =
        "w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all";

    if (loading) {
        return (
            <div className="glass rounded-2xl p-12 text-center">
                <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60">Loading skills...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Skills Management</h1>
                    <p className="text-white/60">Add and manage your technical skills</p>
                </div>
                <div className="flex gap-3">
                    {skills.length === 0 && (
                        <motion.button
                            onClick={addDefaultSkills}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Sparkles className="w-4 h-4" />
                            Add Default Skills
                        </motion.button>
                    )}
                    <motion.button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-gradient text-background font-semibold"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus className="w-4 h-4" />
                        Add Skill
                    </motion.button>
                </div>
            </div>

            {/* Add Form Modal */}
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-6"
                >
                    <h2 className="text-lg font-semibold text-white mb-4">Add New Skill</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Skill Name *
                            </label>
                            <input
                                type="text"
                                value={newSkill.name}
                                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                placeholder="e.g. React"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Icon URL *
                                <span className="text-white/40 font-normal ml-2">
                                    (use simpleicons.org)
                                </span>
                            </label>
                            <input
                                type="url"
                                value={newSkill.icon_url}
                                onChange={(e) => setNewSkill({ ...newSkill, icon_url: e.target.value })}
                                placeholder="https://cdn.simpleicons.org/react/61DAFB"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Website URL
                            </label>
                            <input
                                type="url"
                                value={newSkill.website_url}
                                onChange={(e) => setNewSkill({ ...newSkill, website_url: e.target.value })}
                                placeholder="https://react.dev"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Icon Preview */}
                    {newSkill.icon_url && (
                        <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                            <img
                                src={newSkill.icon_url}
                                alt="Preview"
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />
                            <span className="text-white/60">Icon Preview</span>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <motion.button
                            onClick={addSkill}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-gradient text-background font-semibold disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Skill
                        </motion.button>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Help Text */}
                    <div className="mt-4 p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
                        <p className="text-sm text-white/70">
                            <strong className="text-neon-cyan">Tip:</strong> Get icons from{" "}
                            <a
                                href="https://simpleicons.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neon-cyan hover:underline"
                            >
                                simpleicons.org
                            </a>
                            . Use format: <code className="bg-white/10 px-1 rounded">https://cdn.simpleicons.org/[name]/[color]</code>
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Skills Grid */}
            <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-neon-cyan" />
                    Your Skills ({skills.length})
                </h2>

                {skills.length === 0 ? (
                    <div className="text-center py-12">
                        <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40 mb-4">No skills added yet</p>
                        <p className="text-white/30 text-sm">
                            Click &quot;Add Default Skills&quot; to get started quickly
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-neon-cyan/30 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={skill.icon_url}
                                        alt={skill.name}
                                        className="w-10 h-10 object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                "https://cdn.simpleicons.org/javascript/F7DF1E";
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-white truncate">{skill.name}</h3>
                                        {skill.website_url && (
                                            <a
                                                href={skill.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-white/40 hover:text-neon-cyan flex items-center gap-1"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                Visit
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => deleteSkill(skill.id)}
                                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/30 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Where Skills Appear
                </h2>
                <p className="text-white/60">
                    Skills you add here will be displayed in the Tech Stack marquee on your portfolio homepage.
                    Each skill shows its icon and links to the official website when clicked.
                </p>
            </div>
        </div>
    );
}
