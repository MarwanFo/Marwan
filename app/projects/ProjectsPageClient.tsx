"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Project } from "@/lib/types";

interface ProjectCardProps {
    project: Project;
    index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative glass rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
        >
            {/* Image */}
            {project.image_url && (
                <div className="aspect-video overflow-hidden">
                    <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors">
                            {project.title}
                        </h3>
                        {project.featured && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-neon-gradient text-background font-medium">
                                Featured
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg glass hover:bg-white/20 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 text-neon-cyan" />
                            </a>
                        )}
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg glass hover:bg-white/20 transition-colors"
                            >
                                <Github className="w-4 h-4 text-neon-purple" />
                            </a>
                        )}
                    </div>
                </div>

                <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/70"
                        >
                            {tag}
                        </span>
                    ))}
                    {project.tags.length > 4 && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/50">
                            +{project.tags.length - 4}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function ProjectsPageClient({ projects }: { projects: Project[] }) {
    return (
        <main className="min-h-screen py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/#projects"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-neon-cyan transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-heading font-bold mb-4">
                        All <span className="neon-text">Projects</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        A comprehensive collection of all my projects and work
                    </p>
                </motion.div>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-white/60">No projects yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
