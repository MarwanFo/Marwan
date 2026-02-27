"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { ExternalLink, Github, ArrowUpRight, Sparkles, Star, Code2, Rocket } from "lucide-react";
import { Project } from "@/lib/types";

// Fallback projects for when database is empty
const fallbackProjects: Project[] = [
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

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

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
                {/* Image with Overlay */}
                <div className="relative overflow-hidden h-48">
                    {project.image_url ? (
                        <motion.img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            animate={{ scale: isHovered ? 1.1 : 1 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 flex items-center justify-center">
                            <Code2 className="w-20 h-20 text-white/20" />
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

                    {/* Shine effect on hover */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                        animate={{ x: isHovered ? "200%" : "-100%" }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                    />

                    {/* Featured Badge */}
                    {project.featured && (
                        <motion.div
                            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-gradient text-background text-xs font-semibold z-10"
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                        >
                            <Star className="w-3 h-3" />
                            Featured
                        </motion.div>
                    )}

                    {/* Quick Actions - Floating */}
                    <motion.div
                        className="absolute top-4 right-4 flex gap-2 z-10"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {project.live_url && (
                            <motion.a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-white/90 text-gray-900 backdrop-blur-sm shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ExternalLink className="w-4 h-4" />
                            </motion.a>
                        )}
                        {project.github_url && (
                            <motion.a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-white/90 text-gray-900 backdrop-blur-sm shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Github className="w-4 h-4" />
                            </motion.a>
                        )}
                    </motion.div>
                </div>

                {/* Content */}
                <div className="p-6 relative">
                    {/* Floating glow */}
                    <motion.div
                        className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-neon-cyan/30 blur-3xl"
                        animate={{ opacity: isHovered ? 0.8 : 0 }}
                        transition={{ duration: 0.5 }}
                    />

                    <div className="relative z-10">
                        <motion.h3
                            className="font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300 text-xl"
                            style={{ transform: "translateZ(30px)" }}
                        >
                            {project.title}
                        </motion.h3>

                        <p className="text-white/60 mb-4 group-hover:text-white/70 transition-colors line-clamp-2 text-sm">
                            {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 3).map((tag, tagIndex) => (
                                <motion.span
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 + tagIndex * 0.05 + 0.3 }}
                                    className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-white/60 border border-white/10 group-hover:border-neon-cyan/30 group-hover:text-neon-cyan/80 transition-all duration-300"
                                >
                                    {tag}
                                </motion.span>
                            ))}
                            {project.tags.length > 3 && (
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-white/40">
                                    +{project.tags.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom accent line */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-neon-gradient"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ originX: 0 }}
                />
            </motion.div>
        </motion.div>
    );
}

export default function BentoGridClient({ initialProjects }: { initialProjects: Project[] }) {
    const allProjects = initialProjects.length > 0 ? initialProjects : fallbackProjects;
    const projects = allProjects.slice(0, 4);
    const hasMore = allProjects.length > 4;

    return (
        <section id="projects" className="relative py-24 px-6 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 60%)",
                        filter: "blur(100px)",
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
                        filter: "blur(100px)",
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
                        <span className="text-sm text-white/60">My Work</span>
                    </motion.div>
                    <h2 className="text-heading font-bold mb-4">
                        Featured <span className="neon-text">Projects</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        A collection of projects that showcase my skills in building modern,
                        performant, and user-centric applications.
                    </p>
                </motion.div>

                {/* Projects Grid - Same style as /projects page */}
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
                            <span>View All Projects</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.a>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
