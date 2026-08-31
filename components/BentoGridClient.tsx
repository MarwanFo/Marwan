"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { ExternalLink, Github, ArrowUpRight, Sparkles, Star } from "lucide-react";
import { Project } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LanguageContext";

// Fallback projects for English
const fallbackProjectsEn: Project[] = [
    {
        id: "1",
        title: "E-Commerce Platform",
        description: "A full-stack e-commerce solution with real-time inventory, AI recommendations, and seamless checkout experience.",
        tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
        image_url: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=600&fit=crop",
        live_url: "#",
        github_url: "#",
        size: "large",
        featured: true,
        display_order: 0,
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        title: "AI Dashboard",
        description: "Analytics dashboard with ML-powered insights and real-time data visualization.",
        tags: ["React", "Python", "TensorFlow"],
        image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        live_url: "#",
        github_url: "#",
        size: "medium",
        featured: false,
        display_order: 1,
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        title: "Social App",
        description: "Real-time social platform with chat, stories, and community features.",
        tags: ["React Native", "Firebase"],
        image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
        live_url: "#",
        github_url: "#",
        size: "small",
        featured: false,
        display_order: 2,
        created_at: new Date().toISOString(),
    },
    {
        id: "4",
        title: "Design System",
        description: "Component library with 50+ accessible components and theming support.",
        tags: ["Storybook", "Figma", "CSS"],
        image_url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&h=600&fit=crop",
        live_url: "#",
        github_url: "#",
        size: "small",
        featured: false,
        display_order: 3,
        created_at: new Date().toISOString(),
    },
];

// Fallback projects for French
const fallbackProjectsFr: Project[] = [
    {
        id: "1",
        title: "Plateforme E-Commerce",
        description: "Solution e-commerce full-stack avec gestion des stocks en temps réel, recommandations IA et paiement sécurisé.",
        tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
        image_url: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=600&fit=crop",
        live_url: "#",
        github_url: "#",
        size: "large",
        featured: true,
        display_order: 0,
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        title: "Tableau de bord IA",
        description: "Dashboard analytique intégrant des insights basés sur le Machine Learning et visualisation de données temps réel.",
        tags: ["React", "Python", "TensorFlow"],
        image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        live_url: "#",
        github_url: "#",
        size: "medium",
        featured: false,
        display_order: 1,
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        title: "Application Sociale",
        description: "Plateforme sociale interactive avec messagerie instantanée, stories et gestion de communauté.",
        tags: ["React Native", "Firebase"],
        image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
        live_url: "#",
        github_url: "#",
        size: "small",
        featured: false,
        display_order: 2,
        created_at: new Date().toISOString(),
    },
    {
        id: "4",
        title: "Système de Design",
        description: "Bibliothèque UI de plus de 50 composants accessibles avec support multi-thèmes.",
        tags: ["Storybook", "Figma", "CSS"],
        image_url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&h=600&fit=crop",
        live_url: "#",
        github_url: "#",
        size: "small",
        featured: false,
        display_order: 3,
        created_at: new Date().toISOString(),
    },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { t } = useTranslation();

    // 3D tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
            style={{
                perspective: "1000px",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className="relative h-full glass rounded-2xl overflow-hidden border border-white/10 group-hover:border-neon-cyan/30 transition-colors duration-500"
                style={{
                    rotateX: isHovered ? rotateX : 0,
                    rotateY: isHovered ? rotateY : 0,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Background Glow */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ transform: "translateZ(10px)" }}
                />

                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                    <motion.img
                        src={project.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        animate={{
                            scale: isHovered ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                    {/* Featured Badge */}
                    {project.featured && (
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan text-xs font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-neon-cyan" />
                            <span>{t("projects.featured")}</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 relative z-10" style={{ transform: "translateZ(20px)" }}>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-white/70 border border-white/10"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-neon-cyan transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>{t("projects.viewProject")}</span>
                            </a>
                        )}
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-neon-purple transition-colors ml-auto"
                            >
                                <Github className="w-4 h-4" />
                                <span>{t("projects.sourceCode")}</span>
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function BentoGridClient({
    initialProjects = [],
}: {
    initialProjects: Project[];
}) {
    const { t, language } = useTranslation();
    const fallbackProjects = language === "fr" ? fallbackProjectsFr : fallbackProjectsEn;

    const allProjects = initialProjects.length > 0 ? initialProjects : fallbackProjects;
    const projects = allProjects.slice(0, 6);
    const hasMore = allProjects.length > 6 || initialProjects.length > 0;

    return (
        <section id="projects" className="relative py-24 px-6 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 60%)",
                        
                    }}
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(0, 255, 255, 0.08) 0%, transparent 60%)",
                        
                    }}
                    animate={{
                        x: [0, 20, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-cyan/30 mb-4"
                    >
                        <Sparkles className="w-4 h-4 text-neon-cyan" />
                        <span className="text-sm text-white/60">{t("projects.highlight")}</span>
                    </motion.div>
                    <h2 className="text-heading font-bold mb-4">
                        {t("projects.title")} <span className="neon-text">{t("projects.highlight")}</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        {t("projects.subtitle")}
                    </p>
                </motion.div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                {/* View All Button */}
                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <motion.a
                            href="/projects"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass border border-white/20 text-white hover:border-neon-cyan/50 hover:text-neon-cyan transition-all group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>{t("projects.allProjects")}</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.a>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
