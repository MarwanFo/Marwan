"use client";

import { motion } from "framer-motion";
import { Heart, ArrowUp, Github, Linkedin, Mail, MapPin, User, Briefcase, FolderKanban, Award, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import { useEffect, useState } from "react";

interface SiteSettings {
    github_url?: string | null;
    linkedin_url?: string | null;
    social_email?: string | null;
    location?: string | null;
    footer_tagline?: string | null;
    footer_text?: string | null;
}

export default function Footer() {
    const [settings, setSettings] = useState<SiteSettings>({});

    useEffect(() => {
        fetch("/api/public/settings")
            .then((r) => r.json())
            .then((d) => setSettings(d || {}))
            .catch(() => {});
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const currentYear = new Date().getFullYear();

    const navLinks = [
        { name: "About", href: "#about", icon: User },
        { name: "Experience", href: "#experience", icon: Briefcase },
        { name: "Projects", href: "/projects", icon: FolderKanban },
        { name: "Certificates", href: "/certificates", icon: Award },
        { name: "Contact", href: "#contact", icon: MessageCircle },
    ];

    // Use DB values with hardcoded fallbacks
    const githubUrl = settings.github_url || "https://github.com";
    const linkedinUrl = settings.linkedin_url || "https://linkedin.com";
    const emailAddress = settings.social_email || "marwanefaridi22@gmail.com";
    const location = settings.location || "Morocco Â· Available Worldwide";
    const footerTagline = settings.footer_tagline || "Full-stack developer passionate about building modern web experiences with clean code and stunning design.";
    const footerText = settings.footer_text || `Â© ${currentYear} FARIDI Marwan Â· Built with`;

    const socialLinks = [
        { name: "GitHub", icon: Github, href: githubUrl },
        { name: "LinkedIn", icon: Linkedin, href: linkedinUrl },
        { name: "Email", icon: Mail, href: `mailto:${emailAddress}` },
    ];


    return (
        <footer className="relative pt-20 pb-8 px-6 border-t border-white/10">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
                    style={{
                        background: "radial-gradient(ellipse, rgba(0, 255, 255, 0.08) 0%, transparent 70%)",
                        
                    }}
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <Logo size="sm" showText />
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            {footerTagline}
                        </p>
                        <div className="flex items-center gap-2 text-white/50 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{location}</span>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h3 className="text-white font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="flex items-center gap-2 text-white/60 hover:text-neon-cyan transition-colors text-sm group"
                                    >
                                        <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Connect */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <h3 className="text-white font-semibold">Connect</h3>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl glass border border-white/10 text-white/60 hover:text-neon-cyan hover:border-neon-cyan/50 transition-all"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                        <p className="text-white/50 text-sm">
                            Let&apos;s build something amazing together!
                        </p>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 text-white/50 text-sm"
                    >
                        <span>{footerText}</span>
                        <Heart className="w-4 h-4 text-neon-magenta fill-neon-magenta animate-pulse" />
                    </motion.p>

                    {/* Back to Top */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        onClick={scrollToTop}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-white/60 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
                        whileHover={{ y: -2 }}
                    >
                        <span className="text-sm">Back to top</span>
                        <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                    </motion.button>
                </div>
            </div>
        </footer>
    );
}
