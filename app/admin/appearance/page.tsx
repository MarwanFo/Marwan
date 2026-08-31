"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
    Save,
    CheckCircle,
    Github,
    Linkedin,
    Mail,
    MapPin,
    Globe,
    Eye,
    Palette,
} from "lucide-react";

interface AppearanceSettings {
    id?: string;
    github_url: string;
    linkedin_url: string;
    social_email: string;
    location: string;
    footer_tagline: string;
    footer_text: string;
    nav_resume_url: string;
}

const supabase = createClient();

export default function AppearancePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState<AppearanceSettings>({
        github_url: "",
        linkedin_url: "",
        social_email: "",
        location: "Morocco · Available Worldwide",
        footer_tagline: "Full-stack developer passionate about building modern web experiences with clean code and stunning design.",
        footer_text: "",
        nav_resume_url: "",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const { data } = await supabase
                .from("site_settings")
                .select("id, github_url, linkedin_url, social_email, location, footer_tagline, footer_text, nav_resume_url")
                .single();

            if (data) {
                setForm({
                    id: data.id,
                    github_url: data.github_url || "",
                    linkedin_url: data.linkedin_url || "",
                    social_email: data.social_email || "",
                    location: data.location || "Morocco · Available Worldwide",
                    footer_tagline: data.footer_tagline || "",
                    footer_text: data.footer_text || "",
                    nav_resume_url: data.nav_resume_url || "",
                });
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);

        const payload = {
            github_url: form.github_url || null,
            linkedin_url: form.linkedin_url || null,
            social_email: form.social_email || null,
            location: form.location || null,
            footer_tagline: form.footer_tagline || null,
            footer_text: form.footer_text || null,
            nav_resume_url: form.nav_resume_url || null,
            updated_at: new Date().toISOString(),
        };

        if (form.id) {
            await supabase.from("site_settings").update(payload).eq("id", form.id);
        } else {
            await supabase.from("site_settings").insert(payload);
        }

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const inputClass =
        "w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all";

    if (loading) {
        return (
            <div className="glass rounded-2xl p-12 text-center">
                <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60">Loading appearance settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Appearance & Social</h1>
                    <p className="text-white/60">Control social links, footer content, and navigation</p>
                </div>
                <a
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-neon-cyan hover:bg-white/5 text-sm transition-colors"
                >
                    <Eye className="w-4 h-4" />
                    Preview
                </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Social Links */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-neon-cyan" />
                        Social Links
                    </h2>
                    <p className="text-white/50 text-sm mb-5">These appear in the footer and throughout the portfolio</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                                <Github className="w-4 h-4" /> GitHub URL
                            </label>
                            <input
                                type="url"
                                value={form.github_url}
                                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                                placeholder="https://github.com/yourusername"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                                <Linkedin className="w-4 h-4" /> LinkedIn URL
                            </label>
                            <input
                                type="url"
                                value={form.linkedin_url}
                                onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                                placeholder="https://linkedin.com/in/yourprofile"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Contact Email
                                <span className="text-white/40 font-normal">(shown in footer & contact section)</span>
                            </label>
                            <input
                                type="email"
                                value={form.social_email}
                                onChange={(e) => setForm({ ...form, social_email: e.target.value })}
                                placeholder="your@email.com"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-neon-purple" />
                        Navigation
                    </h2>
                    <p className="text-white/50 text-sm mb-5">Header navigation options</p>
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Resume / CV URL
                            <span className="text-white/40 font-normal ml-2">(shown as "Download CV" button in header)</span>
                        </label>
                        <input
                            type="url"
                            value={form.nav_resume_url}
                            onChange={(e) => setForm({ ...form, nav_resume_url: e.target.value })}
                            placeholder="https://your-supabase-url/storage/v1/object/public/..."
                            className={inputClass}
                        />
                        <p className="text-white/40 text-xs mt-2">
                            💡 Upload your CV first via Profile → Resume section, then paste the URL here
                        </p>
                    </div>
                </div>

                {/* Footer Content */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-neon-magenta" />
                        Footer Content
                    </h2>
                    <p className="text-white/50 text-sm mb-5">What appears in the footer section</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                placeholder="Morocco · Available Worldwide"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Footer Tagline
                                <span className="text-white/40 font-normal ml-2">(short bio shown in footer)</span>
                            </label>
                            <textarea
                                value={form.footer_tagline}
                                onChange={(e) => setForm({ ...form, footer_tagline: e.target.value })}
                                placeholder="Full-stack developer passionate about building modern web experiences..."
                                rows={2}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Copyright Text
                                <span className="text-white/40 font-normal ml-2">(bottom of footer)</span>
                            </label>
                            <input
                                type="text"
                                value={form.footer_text}
                                onChange={(e) => setForm({ ...form, footer_text: e.target.value })}
                                placeholder="© 2025 FARIDI Marwan · Built with ❤"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>

                {/* Preview card */}
                <div className="glass rounded-2xl p-6 border border-white/10 bg-white/2">
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Footer Preview</p>
                    <div className="flex items-start justify-between flex-wrap gap-6">
                        <div>
                            <p className="text-white/60 text-sm max-w-xs">{form.footer_tagline || "Your tagline here..."}</p>
                            <div className="flex items-center gap-2 text-white/40 text-sm mt-2">
                                <MapPin className="w-4 h-4" />
                                <span>{form.location || "Your location"}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {form.github_url && (
                                <div className="p-3 rounded-xl glass border border-white/10 text-white/60">
                                    <Github className="w-5 h-5" />
                                </div>
                            )}
                            {form.linkedin_url && (
                                <div className="p-3 rounded-xl glass border border-white/10 text-white/60">
                                    <Linkedin className="w-5 h-5" />
                                </div>
                            )}
                            {form.social_email && (
                                <div className="p-3 rounded-xl glass border border-white/10 text-white/60">
                                    <Mail className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 text-white/40 text-sm">
                        {form.footer_text || `© ${new Date().getFullYear()} Your Name · Built with ❤`}
                    </div>
                </div>

                {/* Save */}
                <motion.button
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 rounded-xl bg-neon-gradient text-background font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
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
                            <span>Save Appearance</span>
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    );
}
