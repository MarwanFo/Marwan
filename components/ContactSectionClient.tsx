"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    Mail,
    MapPin,
    Send,
    Copy,
    Check,
    Github,
    Linkedin,
    Twitter,
} from "lucide-react";

interface ProfileData {
    email?: string | null;
    location?: string | null;
    github_url?: string | null;
    linkedin_url?: string | null;
    twitter_url?: string | null;
}

interface SettingsData {
    contact_email?: string | null;
    contact_message?: string | null;
}

const defaultProfile = {
    email: "hello@marwan.dev",
    location: "Available Worldwide · Remote",
    github_url: "https://github.com",
    linkedin_url: "https://linkedin.com",
    twitter_url: "https://twitter.com",
};

const defaultSettings = {
    contact_message: "Have a project in mind or just want to chat? I'd love to hear from you.",
};

export default function ContactSectionClient({
    profile,
    settings,
}: {
    profile?: ProfileData | null;
    settings?: SettingsData | null;
}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [copied, setCopied] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const contactEmail = settings?.contact_email || profile?.email || defaultProfile.email;
    const location = profile?.location || defaultProfile.location;
    const message = settings?.contact_message || defaultSettings.contact_message;
    const githubUrl = profile?.github_url || defaultProfile.github_url;
    const linkedinUrl = profile?.linkedin_url || defaultProfile.linkedin_url;
    const twitterUrl = profile?.twitter_url || defaultProfile.twitter_url;

    const handleCopyEmail = async () => {
        await navigator.clipboard.writeText(contactEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        try {
            // Save message to Supabase
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setSent(true);
            setFormData({ name: "", email: "", message: "" });
            setTimeout(() => setSent(false), 3000);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const inputClass =
        "w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all";

    const socialLinks = [
        { icon: Github, href: githubUrl, label: "GitHub" },
        { icon: Linkedin, href: linkedinUrl, label: "LinkedIn" },
        { icon: Twitter, href: twitterUrl, label: "Twitter" },
    ].filter(link => link.href);

    return (
        <section id="contact" className="relative py-24 px-6">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(255, 0, 255, 0.08) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-heading font-bold mb-4">
                        Let&apos;s <span className="neon-text">Connect</span>
                    </h2>
                    <p className="text-white/60 max-w-xl mx-auto">
                        {message}
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Email Card */}
                        <div className="glass rounded-2xl p-6 group hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-neon-cyan/10">
                                    <Mail className="w-6 h-6 text-neon-cyan" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        Email me
                                    </h3>
                                    <p className="text-white/60 text-sm mb-3">
                                        Get in touch directly
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <code className="text-neon-cyan">{contactEmail}</code>
                                        <motion.button
                                            onClick={handleCopyEmail}
                                            className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {copied ? (
                                                <Check className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-white/60" />
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="glass rounded-2xl p-6 group hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-neon-purple/10">
                                    <MapPin className="w-6 h-6 text-neon-purple" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        Location
                                    </h3>
                                    <p className="text-white/60">{location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Find me online
                            </h3>
                            <div className="flex gap-4">
                                {socialLinks.map((link) => (
                                    <motion.a
                                        key={link.label}
                                        href={link.href!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-xl glass hover:bg-white/10 transition-colors"
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <link.icon className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="Your name"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    placeholder="your@email.com"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({ ...formData, message: e.target.value })
                                    }
                                    placeholder="Tell me about your project..."
                                    rows={5}
                                    required
                                    className={`${inputClass} resize-none`}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={sending || sent}
                                className="w-full py-4 rounded-xl bg-neon-gradient text-background font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {sending ? (
                                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                ) : sent ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Message Sent!</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
