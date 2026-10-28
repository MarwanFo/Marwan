"use client";

import { motion } from "framer-motion";
import {
    ArrowLeft,
    ExternalLink,
    Github,
    Star,
    Layers,
    Calendar,
    UserCheck,
    CheckCircle2,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    ImageIcon,
    MessageSquare,
    Code2,
    Share2,
    Check,
} from "lucide-react";
import Link from "next/link";
import { Project } from "@/lib/types";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface ProjectDetailClientProps {
    project: Project;
    prevProject: Project | null;
    nextProject: Project | null;
}

export default function ProjectDetailClient({
    project,
    prevProject,
    nextProject,
}: ProjectDetailClientProps) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    const handleShare = async () => {
        if (typeof window !== "undefined") {
            try {
                if (navigator.share) {
                    await navigator.share({
                        title: project.title,
                        text: project.description || undefined,
                        url: window.location.href,
                    });
                } else {
                    await navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }
            } catch {
                // Ignore cancel errors
            }
        }
    };

    const formattedDate = project.created_at
        ? new Date(project.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
          })
        : "Recent";

    // Split features if stored as array or string
    const featuresList: string[] = Array.isArray(project.features)
        ? project.features
        : typeof (project as any).features === "string"
        ? (project as any).features.split("\n").map((f: string) => f.trim()).filter(Boolean)
        : [];

    // Gallery images
    const galleryImages: string[] = Array.isArray(project.gallery)
        ? project.gallery
        : [];

    return (
        <div className="min-h-screen bg-background relative pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Glow Elements */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10 space-y-12">
                {/* Top Navigation & Breadcrumbs */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap items-center justify-between gap-4"
                >
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all text-sm font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>{t("projects.allProjects") || "All Projects"}</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all text-sm"
                            title="Share project"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4" />
                                    <span>Share</span>
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Project Header Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="flex flex-wrap items-center gap-3">
                        {project.featured && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-bold border border-yellow-400/30">
                                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                                Featured Project
                            </span>
                        )}
                        <span className="px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-xs font-bold border border-neon-cyan/30 uppercase tracking-wider">
                            {project.size || "Full Stack"}
                        </span>
                        <span className="text-white/40 text-xs flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                        {project.title}
                    </h1>

                    {project.description && (
                        <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-3xl">
                            {project.description}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neon-cyan text-background font-bold hover:bg-neon-cyan/90 transition-all shadow-[0_0_25px_rgba(0,255,255,0.4)] group"
                            >
                                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>{t("projects.viewProject") || "Live Demo"}</span>
                            </a>
                        )}

                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass border border-white/10 hover:border-neon-purple/50 text-white font-semibold hover:bg-white/10 transition-all group"
                            >
                                <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>{t("projects.sourceCode") || "Source Code"}</span>
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Hero Showcase Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative rounded-3xl overflow-hidden glass border border-white/15 shadow-2xl group"
                >
                    {project.image_url ? (
                        <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
                        </div>
                    ) : (
                        <div className="aspect-video w-full bg-gradient-to-br from-neon-purple/20 via-background to-neon-cyan/20 flex flex-col items-center justify-center text-white/30 p-12">
                            <Code2 className="w-20 h-20 mb-4" />
                            <p className="text-sm font-mono">No preview image uploaded</p>
                        </div>
                    )}
                </motion.div>

                {/* Project Specs Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <div className="glass p-5 rounded-2xl border border-white/10 space-y-1">
                        <div className="flex items-center gap-2 text-neon-cyan text-xs font-semibold uppercase tracking-wider">
                            <UserCheck className="w-4 h-4" />
                            <span>Role</span>
                        </div>
                        <p className="text-white font-semibold text-base">
                            {project.role || "Full-Stack Developer"}
                        </p>
                    </div>

                    <div className="glass p-5 rounded-2xl border border-white/10 space-y-1">
                        <div className="flex items-center gap-2 text-neon-purple text-xs font-semibold uppercase tracking-wider">
                            <Calendar className="w-4 h-4" />
                            <span>Timeline</span>
                        </div>
                        <p className="text-white font-semibold text-base">{formattedDate}</p>
                    </div>

                    <div className="glass p-5 rounded-2xl border border-white/10 space-y-1">
                        <div className="flex items-center gap-2 text-neon-magenta text-xs font-semibold uppercase tracking-wider">
                            <Layers className="w-4 h-4" />
                            <span>Architecture</span>
                        </div>
                        <p className="text-white font-semibold text-base">
                            {project.tags?.[0] ? `${project.tags[0]} Architecture` : "Modular Full-Stack"}
                        </p>
                    </div>

                    <div className="glass p-5 rounded-2xl border border-white/10 space-y-1">
                        <div className="flex items-center gap-2 text-green-400 text-xs font-semibold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Status</span>
                        </div>
                        <p className="text-white font-semibold text-base">Completed & Verified</p>
                    </div>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4"
                >
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                        <Sparkles className="w-5 h-5 text-neon-cyan" />
                        <span>Technologies & Tools</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {project.tags && project.tags.length > 0 ? (
                            project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-white/90 border border-white/10 hover:border-neon-cyan/40 hover:text-neon-cyan transition-all"
                                >
                                    {tag}
                                </span>
                            ))
                        ) : (
                            <span className="text-white/40 text-sm">No specific tags listed</span>
                        )}
                    </div>
                </motion.div>

                {/* Deep Dive / Case Study Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6"
                >
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-6 bg-neon-gradient rounded-full" />
                        Project Deep Dive & Overview
                    </h2>

                    <div className="prose prose-invert max-w-none text-white/80 leading-relaxed text-base space-y-4">
                        {project.long_description ? (
                            project.long_description
                                .split("\n\n")
                                .map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
                        ) : project.description ? (
                            <p>{project.description}</p>
                        ) : (
                            <p className="text-white/40 italic">
                                Detailed case study is currently being prepared for this project.
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Key Features (if available) */}
                {featuresList.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-6 bg-neon-purple rounded-full" />
                            Key Features & Capabilities
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {featuresList.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 hover:border-neon-cyan/30 transition-colors"
                                >
                                    <div className="p-1 rounded-lg bg-neon-cyan/10 text-neon-cyan shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <p className="text-white/80 text-sm font-medium leading-relaxed">
                                        {feature}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Technical Challenges & Solutions (if available) */}
                {project.challenges && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="glass p-6 sm:p-8 rounded-3xl border border-neon-purple/20 space-y-4 bg-gradient-to-br from-neon-purple/5 to-transparent"
                    >
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-6 bg-neon-magenta rounded-full" />
                            Technical Challenges & Solutions
                        </h2>
                        <div className="text-white/80 leading-relaxed text-base space-y-4 whitespace-pre-line">
                            {project.challenges}
                        </div>
                    </motion.div>
                )}

                {/* Screenshot Gallery (if available) */}
                {galleryImages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <ImageIcon className="w-6 h-6 text-neon-cyan" />
                            Project Gallery & Visuals
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {galleryImages.map((imgUrl, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(imgUrl)}
                                    className="rounded-2xl overflow-hidden border border-white/10 aspect-video group relative bg-black/40 hover:border-neon-cyan/40 transition-all"
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`Screenshot ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                                            Click to view
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Lightbox Modal for gallery */}
                {activeImage && (
                    <div
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setActiveImage(null)}
                    >
                        <div className="relative max-w-5xl max-h-[90vh]">
                            <img
                                src={activeImage}
                                alt="Gallery preview"
                                className="max-w-full max-h-[85vh] rounded-2xl object-contain border border-white/20"
                            />
                            <button
                                onClick={() => setActiveImage(null)}
                                className="absolute -top-12 right-0 text-white/70 hover:text-white text-sm font-semibold px-3 py-1 bg-white/10 rounded-lg"
                            >
                                Close ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Bottom Prev / Next Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10"
                >
                    {prevProject ? (
                        <Link
                            href={`/projects/${prevProject.id}`}
                            className="glass p-5 rounded-2xl border border-white/10 hover:border-neon-cyan/30 flex items-center gap-4 transition-all group"
                        >
                            <ArrowLeft className="w-5 h-5 text-neon-cyan group-hover:-translate-x-1 transition-transform shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">Previous Project</p>
                                <p className="text-white font-bold text-base truncate group-hover:text-neon-cyan transition-colors">
                                    {prevProject.title}
                                </p>
                            </div>
                        </Link>
                    ) : (
                        <div />
                    )}

                    {nextProject ? (
                        <Link
                            href={`/projects/${nextProject.id}`}
                            className="glass p-5 rounded-2xl border border-white/10 hover:border-neon-purple/30 flex items-center justify-between gap-4 transition-all group sm:text-right"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">Next Project</p>
                                <p className="text-white font-bold text-base truncate group-hover:text-neon-purple transition-colors">
                                    {nextProject.title}
                                </p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-neon-purple group-hover:translate-x-1 transition-transform shrink-0" />
                        </Link>
                    ) : (
                        <div />
                    )}
                </motion.div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass p-8 sm:p-12 rounded-3xl border border-neon-cyan/20 text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-neon-cyan/5 to-transparent"
                >
                    <div className="max-w-xl mx-auto space-y-3">
                        <h3 className="text-2xl sm:text-3xl font-bold text-white">
                            Ready to Build Something Similar?
                        </h3>
                        <p className="text-white/60 text-sm sm:text-base">
                            Whether you have an upcoming project, a product idea, or need specialized full-stack engineering expertise, let's talk.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-neon-gradient text-background font-bold hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all"
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span>Get in Touch</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

