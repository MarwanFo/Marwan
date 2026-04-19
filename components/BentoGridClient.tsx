"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Project } from "@/lib/types";
import ProjectCard from "@/components/cards/ProjectCard";
import { fallbackProjects } from "@/lib/fallback-data";

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
                            <span>View All Projects</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.a>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
