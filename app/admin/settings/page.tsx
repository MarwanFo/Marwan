"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
    Save,
    Settings,
    CheckCircle,
    GraduationCap,
    Clock,
    Lightbulb,
    Calendar,
    Mail,
    Phone,
    MessageSquare,
    Globe,
    FileText,
    Sparkles,
} from "lucide-react";

interface SiteSettings {
    id?: string;
    // Hero section
    hero_title: string;
    hero_subtitle: string;
    hero_description: string;
    // Certificate stats
    total_certifications: number;
    learning_hours: number;
    skills_acquired: number;
    years_learning: number;
    // Contact
    contact_email: string;
    contact_phone: string;
    contact_message: string;
    // Footer
    footer_text: string;
}

const supabase = createClient();

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [formData, setFormData] = useState<SiteSettings>({
        hero_title: "",
        hero_subtitle: "",
        hero_description: "",
        total_certifications: 0,
        learning_hours: 0,
        skills_acquired: 0,
        years_learning: 0,
        contact_email: "",
        contact_phone: "",
        contact_message: "",
        footer_text: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        if (!supabase) return;
        const { data, error } = await supabase
            .from("site_settings")
            .select("id, hero_title, hero_subtitle, hero_description, total_certifications, learning_hours, skills_acquired, years_learning, contact_email, contact_phone, contact_message, footer_text")
            .single();

        if (!error && data) {
            setFormData({
                id: data.id,
                hero_title: data.hero_title || "",
                hero_subtitle: data.hero_subtitle || "",
                hero_description: data.hero_description || "",
                total_certifications: data.total_certifications || 0,
                learning_hours: data.learning_hours || 0,
                skills_acquired: data.skills_acquired || 0,
                years_learning: data.years_learning || 0,
                contact_email: data.contact_email || "",
                contact_phone: data.contact_phone || "",
                contact_message: data.contact_message || "",
                footer_text: data.footer_text || "",
            });
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);

        const settingsData = {
            hero_title: formData.hero_title || null,
            hero_subtitle: formData.hero_subtitle || null,
            hero_description: formData.hero_description || null,
            total_certifications: formData.total_certifications,
            learning_hours: formData.learning_hours,
            skills_acquired: formData.skills_acquired,
            years_learning: formData.years_learning,
            contact_email: formData.contact_email || null,
            contact_phone: formData.contact_phone || null,
            contact_message: formData.contact_message || null,
            footer_text: formData.footer_text || null,
            updated_at: new Date().toISOString(),
        };

        if (formData.id) {
            await supabase.from("site_settings").update(settingsData).eq("id", formData.id);
        } else {
            await supabase.from("site_settings").insert(settingsData);
        }

        await fetchSettings();
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const inputClass = "w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all";

    if (loading) {
        return (
            <div className="glass rounded-2xl p-12 text-center">
                <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Site Settings</h1>
                <p className="text-white/60">Manage hero section, certificate stats, contact info, and more</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Hero Section */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-neon-cyan" />
                        Hero Section
                    </h2>
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.hero_title}
                                    onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                                    placeholder="Full Stack Developer"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Subtitle
                                </label>
                                <input
                                    type="text"
                                    value={formData.hero_subtitle}
                                    onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                                    placeholder="Building the future..."
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.hero_description}
                                onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                                placeholder="A brief intro shown in the hero section..."
                                rows={3}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                    </div>
                </div>

                {/* Certificate Stats */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-neon-purple" />
                        Certificate Section Stats
                    </h2>
                    <p className="text-white/60 text-sm mb-4">These numbers appear in the Certificates section</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                <span className="flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-neon-cyan" />
                                    Certifications
                                </span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.total_certifications}
                                onChange={(e) => setFormData({ ...formData, total_certifications: parseInt(e.target.value) || 0 })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-neon-purple" />
                                    Learning Hours
                                </span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.learning_hours}
                                onChange={(e) => setFormData({ ...formData, learning_hours: parseInt(e.target.value) || 0 })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                <span className="flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-neon-magenta" />
                                    Skills Acquired
                                </span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.skills_acquired}
                                onChange={(e) => setFormData({ ...formData, skills_acquired: parseInt(e.target.value) || 0 })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-yellow-400" />
                                    Years Learning
                                </span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.years_learning}
                                onChange={(e) => setFormData({ ...formData, years_learning: parseInt(e.target.value) || 0 })}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-neon-magenta" />
                        Contact Section
                    </h2>
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    <span className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Contact Email
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                    placeholder="contact@example.com"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    <span className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone Number
                                    </span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                    placeholder="+1 234 567 890"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Contact Section Message
                            </label>
                            <textarea
                                value={formData.contact_message}
                                onChange={(e) => setFormData({ ...formData, contact_message: e.target.value })}
                                placeholder="The message shown above the contact form..."
                                rows={2}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-white/60" />
                        Footer
                    </h2>
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Footer Text
                        </label>
                        <input
                            type="text"
                            value={formData.footer_text}
                            onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                            placeholder="© 2024 Your Name. All rights reserved."
                            className={inputClass}
                        />
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
                                <span>Save Settings</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
