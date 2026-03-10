"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
    Save,
    CheckCircle,
    Sparkles,
    Type,
    MousePointerClick,
    Eye,
} from "lucide-react";

interface HeroSettings {
    id?: string;
    hero_name: string;
    hero_tagline: string;
    hero_title: string;
    hero_subtitle: string;
    hero_description: string;
    cta_primary_text: string;
    cta_primary_href: string;
    cta_secondary_text: string;
    cta_secondary_href: string;
}

const supabase = createClient();

export default function HeroAdminPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState<HeroSettings>({
        hero_name: "",
        hero_tagline: "Welcome to my portfolio",
        hero_title: "",
        hero_subtitle: "",
        hero_description: "",
        cta_primary_text: "View Projects",
        cta_primary_href: "#projects",
        cta_secondary_text: "Get in Touch",
        cta_secondary_href: "#contact",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const { data } = await supabase
                .from("site_settings")
                .select("id, hero_name, hero_tagline, hero_title, hero_subtitle, hero_description, cta_primary_text, cta_primary_href, cta_secondary_text, cta_secondary_href")
                .single();

            if (data) {
                setForm({
                    id: data.id,
                    hero_name: data.hero_name || "",
                    hero_tagline: data.hero_tagline || "Welcome to my portfolio",
                    hero_title: data.hero_title || "",
                    hero_subtitle: data.hero_subtitle || "",
                    hero_description: data.hero_description || "",
                    cta_primary_text: data.cta_primary_text || "View Projects",
                    cta_primary_href: data.cta_primary_href || "#projects",
                    cta_secondary_text: data.cta_secondary_text || "Get in Touch",
                    cta_secondary_href: data.cta_secondary_href || "#contact",
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
            hero_name: form.hero_name || null,
            hero_tagline: form.hero_tagline || null,
            hero_title: form.hero_title || null,
            hero_subtitle: form.hero_subtitle || null,
            hero_description: form.hero_description || null,
            cta_primary_text: form.cta_primary_text || "View Projects",
            cta_primary_href: form.cta_primary_href || "#projects",
            cta_secondary_text: form.cta_secondary_text || "Get in Touch",
            cta_secondary_href: form.cta_secondary_href || "#contact",
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
                <p className="text-white/60">Loading hero settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Hero Section</h1>
                    <p className="text-white/60">Control the first thing visitors see on your portfolio</p>
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

            {/* Live Preview Card */}
            <div className="glass rounded-2xl p-6 border border-neon-cyan/20 bg-neon-cyan/5">
                <p className="text-xs text-neon-cyan uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Live Preview
                </p>
                <div className="text-center py-6">
                    <p className="text-xs text-white/40 uppercase tracking-[0.3em] mb-2">
                        {form.hero_tagline || "Welcome to my portfolio"}
                    </p>
                    <h2 className="text-4xl font-extrabold text-white/90 mb-1">
                        {form.hero_name || <span className="text-white/20">YOUR NAME</span>}
                    </h2>
                    <p className="text-xl font-bold text-white/60 mb-2">
                        {form.hero_title || <span className="text-white/20">Your Title</span>}
                    </p>
                    <p className="text-sm text-white/40 max-w-md mx-auto mb-4">
                        {form.hero_description || "Your description will appear here..."}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <span className="px-4 py-2 rounded-full glass text-sm text-white/70 border border-white/20">
                            {form.cta_primary_text || "View Projects"}
                        </span>
                        <span className="px-4 py-2 rounded-full text-sm text-white/50 border border-white/10">
                            {form.cta_secondary_text || "Get in Touch"}
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Identity */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Type className="w-5 h-5 text-neon-cyan" />
                        Identity
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Your Name <span className="text-neon-cyan">*</span>
                                <span className="text-white/40 font-normal ml-2">(displayed as large animated letters)</span>
                            </label>
                            <input
                                type="text"
                                value={form.hero_name}
                                onChange={(e) => setForm({ ...form, hero_name: e.target.value })}
                                placeholder="e.g. MARWAN"
                                className={inputClass}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Title / Role
                                    <span className="text-white/40 font-normal ml-2">(below name)</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.hero_title}
                                    onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
                                    placeholder="FULL STACK DEVELOPER"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Tagline
                                    <span className="text-white/40 font-normal ml-2">(small text above name)</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.hero_tagline}
                                    onChange={(e) => setForm({ ...form, hero_tagline: e.target.value })}
                                    placeholder="Welcome to my portfolio"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Hero Description
                                <span className="text-white/40 font-normal ml-2">(paragraph below title)</span>
                            </label>
                            <textarea
                                value={form.hero_description}
                                onChange={(e) => setForm({ ...form, hero_description: e.target.value })}
                                placeholder="Crafting beautiful, high-performance web experiences with modern technologies and creative design."
                                rows={3}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MousePointerClick className="w-5 h-5 text-neon-purple" />
                        Call-to-Action Buttons
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-sm font-medium text-neon-cyan">Primary Button (filled)</p>
                            <div>
                                <label className="block text-white/60 text-xs mb-1">Button Text</label>
                                <input
                                    type="text"
                                    value={form.cta_primary_text}
                                    onChange={(e) => setForm({ ...form, cta_primary_text: e.target.value })}
                                    placeholder="View Projects"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-xs mb-1">Link / Href</label>
                                <input
                                    type="text"
                                    value={form.cta_primary_href}
                                    onChange={(e) => setForm({ ...form, cta_primary_href: e.target.value })}
                                    placeholder="#projects or /projects"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-sm font-medium text-white/60">Secondary Button (outline)</p>
                            <div>
                                <label className="block text-white/60 text-xs mb-1">Button Text</label>
                                <input
                                    type="text"
                                    value={form.cta_secondary_text}
                                    onChange={(e) => setForm({ ...form, cta_secondary_text: e.target.value })}
                                    placeholder="Get in Touch"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-xs mb-1">Link / Href</label>
                                <input
                                    type="text"
                                    value={form.cta_secondary_href}
                                    onChange={(e) => setForm({ ...form, cta_secondary_href: e.target.value })}
                                    placeholder="#contact or /contact"
                                    className={inputClass}
                                />
                            </div>
                        </div>
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
                            <span>Save Hero Section</span>
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    );
}
