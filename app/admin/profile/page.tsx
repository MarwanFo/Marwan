"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/ImageUpload";
import FileUpload from "@/components/FileUpload";
import {
    Save,
    User,
    Mail,
    MapPin,
    Link,
    Github,
    Linkedin,
    Twitter,
    FileText,
    CheckCircle,
    BarChart3,
    Heart,
    Coffee,
    Briefcase,
    Code,
    Plus,
    X,
    Image as ImageIcon,
} from "lucide-react";

interface ProfileData {
    id?: string;
    name: string;
    role: string;
    bio: string;
    location: string;
    email: string;
    avatar_url: string;
    resume_url: string;
    github_url: string;
    linkedin_url: string;
    twitter_url: string;
    years_experience: number;
    projects_completed: number;
    happy_clients: number;
    cups_of_coffee: number;
    interests: string[];
    status_badge: string;
    philosophy: { title: string; description: string }[];
}

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [newInterest, setNewInterest] = useState("");
    const supabase = createClient();

    const [formData, setFormData] = useState<ProfileData>({
        name: "",
        role: "",
        bio: "",
        location: "",
        email: "",
        avatar_url: "",
        resume_url: "",
        github_url: "",
        linkedin_url: "",
        twitter_url: "",
        years_experience: 0,
        projects_completed: 0,
        happy_clients: 0,
        cups_of_coffee: 0,
        interests: [],
        status_badge: "Available for hire",
        philosophy: [
            { title: "Clean Code", description: "Writing maintainable, readable, and efficient code" },
            { title: "Performance", description: "Optimizing for speed and user experience" },
            { title: "User-Centric", description: "Building with the end-user always in mind" },
            { title: "Continuous Learning", description: "Always exploring new technologies and patterns" },
        ],
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("profile")
            .select("id, name, role, bio, location, email, avatar_url, resume_url, github_url, linkedin_url, twitter_url, years_experience, projects_completed, happy_clients, cups_of_coffee, interests, status_badge, philosophy")
            .single();

        if (!error && data) {
            setFormData({
                id: data.id,
                name: data.name || "",
                role: data.role || "",
                bio: data.bio || "",
                location: data.location || "",
                email: data.email || "",
                avatar_url: data.avatar_url || "",
                resume_url: data.resume_url || "",
                github_url: data.github_url || "",
                linkedin_url: data.linkedin_url || "",
                twitter_url: data.twitter_url || "",
                years_experience: data.years_experience || 0,
                projects_completed: data.projects_completed || 0,
                happy_clients: data.happy_clients || 0,
                cups_of_coffee: data.cups_of_coffee || 0,
                interests: data.interests || [],
                status_badge: data.status_badge || "Available for hire",
                philosophy: data.philosophy || [
                    { title: "Clean Code", description: "Writing maintainable, readable, and efficient code" },
                    { title: "Performance", description: "Optimizing for speed and user experience" },
                    { title: "User-Centric", description: "Building with the end-user always in mind" },
                    { title: "Continuous Learning", description: "Always exploring new technologies and patterns" },
                ],
            });
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);

        console.log("Saving avatar_url:", formData.avatar_url);

        const profileData = {
            name: formData.name,
            role: formData.role,
            bio: formData.bio || null,
            location: formData.location || null,
            email: formData.email || null,
            avatar_url: formData.avatar_url || null,
            resume_url: formData.resume_url || null,
            github_url: formData.github_url || null,
            linkedin_url: formData.linkedin_url || null,
            twitter_url: formData.twitter_url || null,
            years_experience: formData.years_experience,
            projects_completed: formData.projects_completed,
            happy_clients: formData.happy_clients,
            cups_of_coffee: formData.cups_of_coffee,
            interests: formData.interests,
            status_badge: formData.status_badge || "Available for hire",
            philosophy: formData.philosophy,
            updated_at: new Date().toISOString(),
        };

        console.log("Profile data to save:", profileData);

        let error;
        if (formData.id) {
            const result = await supabase.from("profile").update(profileData).eq("id", formData.id);
            error = result.error;
        } else {
            const result = await supabase.from("profile").insert(profileData);
            error = result.error;
        }

        if (error) {
            console.error("[Profile] Save error — check RLS or schema");
            alert("Failed to save profile. Please check your connection and try again.");
            setSaving(false);
            return;
        }

        await fetchProfile();
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const addInterest = () => {
        if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
            setFormData({
                ...formData,
                interests: [...formData.interests, newInterest.trim()],
            });
            setNewInterest("");
        }
    };

    const removeInterest = (interest: string) => {
        setFormData({
            ...formData,
            interests: formData.interests.filter((i) => i !== interest),
        });
    };

    const inputClass = "w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all";

    if (loading) {
        return (
            <div className="glass rounded-2xl p-12 text-center">
                <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                <p className="text-white/60">Manage your about section, stats, and contact information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-neon-cyan" />
                        Basic Information
                    </h2>
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your name"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Role *
                                </label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    placeholder="e.g. Full Stack Developer"
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Status Badge
                                <span className="text-white/40 font-normal ml-2">(shown below profile picture)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.status_badge}
                                onChange={(e) => setFormData({ ...formData, status_badge: e.target.value })}
                                placeholder="e.g. Available for hire, Open to work, Not available"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Bio
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell visitors about yourself..."
                                rows={4}
                                className={`${inputClass} resize-none`}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Location
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. Remote, Worldwide"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    <span className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your@email.com"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Picture */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-neon-magenta" />
                        Profile Picture
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Upload Profile Picture
                            </label>
                            <ImageUpload
                                value={formData.avatar_url}
                                onChange={(url) => setFormData({ ...formData, avatar_url: url })}
                            />
                        </div>
                        <div className="flex items-center justify-center">
                            {formData.avatar_url ? (
                                <div className="relative">
                                    <img
                                        src={formData.avatar_url}
                                        alt="Profile preview"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-neon-cyan/30"
                                    />
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-neon-gradient text-xs font-semibold text-background">
                                        Preview
                                    </div>
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20">
                                    <span className="text-4xl font-bold text-neon-gradient">
                                        {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-neon-purple" />
                        Portfolio Stats
                    </h2>
                    <p className="text-white/60 text-sm mb-4">These numbers are displayed in the About section</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                <span className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-neon-cyan" />
                                    Years Experience
                                </span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.years_experience}
                                onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                <span className="flex items-center gap-2">
                                    <Code className="w-4 h-4 text-neon-purple" />
                                    Projects Completed
                                </span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.projects_completed}
                                onChange={(e) => setFormData({ ...formData, projects_completed: parseInt(e.target.value) || 0 })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                <span className="flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-neon-magenta" />
                                    Happy Clients
                                </span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.happy_clients}
                                onChange={(e) => setFormData({ ...formData, happy_clients: parseInt(e.target.value) || 0 })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                <span className="flex items-center gap-2">
                                    <Coffee className="w-4 h-4 text-yellow-400" />
                                    Cups of Coffee
                                </span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.cups_of_coffee}
                                onChange={(e) => setFormData({ ...formData, cups_of_coffee: parseInt(e.target.value) || 0 })}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>

                {/* Interests */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-neon-magenta" />
                        Interests
                    </h2>
                    <p className="text-white/60 text-sm mb-4">Add your hobbies and interests</p>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            placeholder="Add an interest..."
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                            className={`flex-1 ${inputClass}`}
                        />
                        <motion.button
                            type="button"
                            onClick={addInterest}
                            className="px-4 py-3 rounded-xl bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Plus className="w-5 h-5" />
                        </motion.button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.interests.map((interest) => (
                            <motion.span
                                key={interest}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-2 px-3 py-2 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                            >
                                {interest}
                                <button
                                    type="button"
                                    onClick={() => removeInterest(interest)}
                                    className="hover:text-red-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.span>
                        ))}
                        {formData.interests.length === 0 && (
                            <p className="text-white/40 text-sm">No interests added yet</p>
                        )}
                    </div>
                </div>

                {/* Development Philosophy */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Code className="w-5 h-5 text-neon-cyan" />
                        Development Philosophy
                        <span className="text-white/40 font-normal text-sm ml-2">(shown in About section)</span>
                    </h2>

                    <div className="space-y-4">
                        {formData.philosophy.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-white/60 text-sm">Item {index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({
                                                ...formData,
                                                philosophy: formData.philosophy.filter((_, i) => i !== index),
                                            });
                                        }}
                                        className="text-red-400/60 hover:text-red-400 transition-colors p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => {
                                        const updated = [...formData.philosophy];
                                        updated[index] = { ...updated[index], title: e.target.value };
                                        setFormData({ ...formData, philosophy: updated });
                                    }}
                                    placeholder="Title (e.g., Clean Code)"
                                    className={inputClass}
                                />
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => {
                                        const updated = [...formData.philosophy];
                                        updated[index] = { ...updated[index], description: e.target.value };
                                        setFormData({ ...formData, philosophy: updated });
                                    }}
                                    placeholder="Description"
                                    className={inputClass}
                                />
                            </motion.div>
                        ))}

                        <motion.button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    philosophy: [...formData.philosophy, { title: "", description: "" }],
                                });
                            }}
                            className="w-full py-3 rounded-xl border-2 border-dashed border-white/20 text-white/60 hover:border-neon-cyan/50 hover:text-neon-cyan transition-colors flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <Plus className="w-5 h-5" />
                            Add Philosophy Item
                        </motion.button>
                    </div>
                </div>

                {/* Links */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Link className="w-5 h-5 text-neon-cyan" />
                        Links & URLs
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                <span className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Resume / CV
                                </span>
                            </label>
                            <FileUpload
                                value={formData.resume_url}
                                onChange={(url) => setFormData({ ...formData, resume_url: url })}
                                label="Resume/CV"
                            />
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                <span className="flex items-center gap-2">
                                    <Github className="w-4 h-4" />
                                    GitHub URL
                                </span>
                            </label>
                            <input
                                type="url"
                                value={formData.github_url}
                                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                placeholder="https://github.com/username"
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    <span className="flex items-center gap-2">
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn URL
                                    </span>
                                </label>
                                <input
                                    type="url"
                                    value={formData.linkedin_url}
                                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                    placeholder="https://linkedin.com/in/..."
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    <span className="flex items-center gap-2">
                                        <Twitter className="w-4 h-4" />
                                        Twitter URL
                                    </span>
                                </label>
                                <input
                                    type="url"
                                    value={formData.twitter_url}
                                    onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                                    placeholder="https://twitter.com/..."
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                    <motion.button
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-4 rounded-xl bg-neon-gradient text-background font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                        ) : saved ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                <span>Saved!</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
