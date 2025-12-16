"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
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
    {
        id: "5",
        title: "DevOps Pipeline",
        description: "Automated CI/CD pipeline with container orchestration and monitoring.",
        tags: ["Docker", "Kubernetes", "AWS"],
        image_url: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=600&fit=crop",
        live_url: "#",
        github_url: "#",
        size: "medium",
        featured: false,
        display_order: 4,
        created_at: new Date().toISOString(),
    },
];

function BentoCard({ project, index }: { project: Project; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 20 };
    const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [15, -15]), springConfig);
    const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
    };

    const sizeClasses = {
        large: "md:col-span-2 md:row-span-2",
        medium: "md:col-span-1 md:row-span-2",
        small: "md:col-span-1 md:row-span-1",
    };

    const heightClasses = {
        large: "min-h-[400px] md:min-h-[500px]",
        medium: "min-h-[300px] md:min-h-[500px]",
        small: "min-h-[250px] md:min-h-[240px]",
    };

    return (
        <motion.div
            ref={cardRef}
            className={`relative group rounded-2xl overflow-hidden cursor-pointer ${sizeClasses[project.size]} ${heightClasses[project.size]}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.02 }}
        >
            <div className="absolute inset-0 glass rounded-2xl" />

            <motion.div
                className="absolute inset-0 overflow-hidden rounded-2xl"
                style={{ x: bgX, y: bgY }}
            >
                <div
                    className="absolute inset-[-20px] bg-cover bg-center transition-transform duration-500"
                    style={{
                        backgroundImage: `url(${project.image_url})`,
                        transform: isHovered ? "scale(1.1)" : "scale(1.05)",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </motion.div>

            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: "linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(255, 0, 255, 0.1) 100%)",
                }}
            />

            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: "linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(139, 92, 246, 0.3), rgba(255, 0, 255, 0.3))",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "xor",
                    WebkitMaskComposite: "xor",
                    padding: "1px",
                }}
            />

            <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.slice(0, 4).map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/70 backdrop-blur-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300">
                    {project.title}
                </h3>

                <p className="text-white/60 text-sm md:text-base mb-4 line-clamp-2">
                    {project.description}
                </p>

                <motion.div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {project.live_url && (
                        <a
                            href={project.live_url}
                            className="flex items-center gap-2 text-sm text-neon-cyan hover:text-white transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>Live Demo</span>
                        </a>
                    )}
                    {project.github_url && (
                        <a
                            href={project.github_url}
                            className="flex items-center gap-2 text-sm text-neon-purple hover:text-white transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="w-4 h-4" />
                            <span>Code</span>
                        </a>
                    )}
                </motion.div>
            </div>

            <motion.div
                className="absolute top-4 right-4 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1, rotate: 45 }}
            >
                <ArrowUpRight className="w-5 h-5 text-white" />
            </motion.div>
        </motion.div>
    );
}

export default function BentoGridClient({ initialProjects }: { initialProjects: Project[] }) {
    const allProjects = initialProjects.length > 0 ? initialProjects : fallbackProjects;
    const projects = allProjects.slice(0, 4);
    const hasMore = allProjects.length > 4;

    return (
        <section id="projects" className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-heading font-bold mb-4">
                        Featured <span className="neon-text">Projects</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        A collection of projects that showcase my skills in building modern,
                        performant, and user-centric applications.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
                    {projects.map((project, index) => (
                        <BentoCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <a
                            href="/projects"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass border border-white/20 text-white hover:border-neon-cyan/50 hover:text-neon-cyan transition-all group"
                        >
                            <span>View All Projects</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

