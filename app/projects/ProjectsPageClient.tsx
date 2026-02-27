"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github, ArrowLeft, Sparkles, Folder, Eye, Star, Code2, Rocket } from "lucide-react";
import Link from "next/link";
import { Project } from "@/lib/types";
import { useState, useRef } from "react";

interface ProjectCardProps {
    project: Project;
    index: number;
    size?: "small" | "medium" | "large";
}

function ProjectCard({ project, index, size = "medium" }: ProjectCardProps) {
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

    const sizeClasses = {
        small: "col-span-1 row-span-1",
        medium: "col-span-1 row-span-1",
        large: "col-span-1 row-span-1 lg:col-span-2 lg:row-span-2",
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${sizeClasses[size]} group relative`}
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
                <div className={`relative overflow-hidden ${size === "large" ? "h-64 md:h-80" : "h-48"}`}>
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
                            className={`font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300 ${size === "large" ? "text-2xl" : "text-xl"}`}
                            style={{ transform: "translateZ(30px)" }}
                        >
                            {project.title}
                        </motion.h3>

                        <p className={`text-white/60 mb-4 group-hover:text-white/70 transition-colors ${size === "large" ? "line-clamp-3" : "line-clamp-2"} text-sm`}>
                            {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, size === "large" ? 6 : 3).map((tag, tagIndex) => (
                                <motion.span
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 + tagIndex * 0.05 + 0.3 }}
                                    className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-white/60 border border-white/10 group-hover:border-neon-cyan/30 group-hover:text-neon-cyan/80 transition-all duration-300"
                                >
                                    {tag}
                                </motion.span>
                            ))}
                            {project.tags.length > (size === "large" ? 6 : 3) && (
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-white/40">
                                    +{project.tags.length - (size === "large" ? 6 : 3)}
                                </span>
                            )}
                        </div>

                        {/* View Project Button for large cards */}
                        {size === "large" && (project.live_url || project.github_url) && (
                            <motion.div
                                className="mt-6 flex gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: isHovered ? 1 : 0.7, y: 0 }}
                            >
                                {project.live_url && (
                                    <a
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-gradient text-background font-medium text-sm"
                                    >
                                        <Rocket className="w-4 h-4" />
                                        View Live
                                    </a>
                                )}
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/20 text-white font-medium text-sm hover:border-neon-cyan/50 transition-colors"
                                    >
                                        <Github className="w-4 h-4" />
                                        Source Code
                                    </a>
                                )}
                            </motion.div>
                        )}
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

// Filter component
function FilterTabs({
    tags,
    activeTag,
    onTagChange,
}: {
    tags: string[];
    activeTag: string | null;
    onTagChange: (tag: string | null) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
        >
            <motion.button
                onClick={() => onTagChange(null)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTag === null
                    ? "bg-neon-gradient text-background shadow-lg shadow-neon-cyan/30"
                    : "glass text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                All Projects
            </motion.button>
            {tags.map((tag) => (
                <motion.button
                    key={tag}
                    onClick={() => onTagChange(tag)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTag === tag
                        ? "bg-neon-gradient text-background shadow-lg shadow-neon-cyan/30"
                        : "glass text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {tag}
                </motion.button>
            ))}
        </motion.div>
    );
}

export default function ProjectsPageClient({ projects }: { projects: Project[] }) {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    // Get unique tags from all projects
    const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).slice(0, 6);

    // Filter projects by tag
    const filteredProjects = activeTag
        ? projects.filter((p) => p.tags.includes(activeTag))
        : projects;

    // Determine card sizes - first featured project gets large, rest alternate
    const getCardSize = (index: number, project: Project): "small" | "medium" | "large" => {
        if (index === 0 && project.featured) return "large";
        if (project.featured && index < 3) return "large";
        return "medium";
    };

    return (
        <main className="min-h-screen py-24 px-6 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 60%)",
                        filter: "blur(100px)",
                    }}
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(0, 255, 255, 0.08) 0%, transparent 60%)",
                        filter: "blur(100px)",
                    }}
                    animate={{
                        x: [0, -30, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/#projects"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-neon-cyan transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-cyan/30 text-neon-cyan text-sm mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>{projects.length} Projects</span>
                    </motion.div>
                    <h1 className="text-heading font-bold mb-4">
                        My <span className="neon-text">Creative Work</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Explore my portfolio of web applications, open source contributions, and experiments
                        that showcase my passion for building exceptional digital experiences.
                    </p>
                </motion.div>

                {/* Filter Tabs */}
                {allTags.length > 0 && (
                    <FilterTabs tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} />
                )}

                {/* Bento Grid */}
                {filteredProjects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass rounded-2xl p-12 text-center"
                    >
                        <Folder className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/60">No projects found for this category</p>
                        <button
                            onClick={() => setActiveTag(null)}
                            className="mt-4 text-neon-cyan hover:underline"
                        >
                            View all projects
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr grid-flow-dense"
                        layout
                    >
                        {filteredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                                size={getCardSize(index, project)}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 text-center"
                >
                    <div className="glass rounded-2xl p-8 md:p-12 border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-3">
                            Interested in working together?
                        </h3>
                        <p className="text-white/60 mb-6 max-w-lg mx-auto">
                            I'm always excited to collaborate on new projects and ideas. Let's create something amazing!
                        </p>
                        <Link href="/#contact">
                            <motion.button
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-neon-gradient text-background font-semibold"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Rocket className="w-5 h-5" />
                                Get In Touch
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
