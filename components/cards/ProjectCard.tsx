"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Star, Code2 } from "lucide-react";
import { Project } from "@/lib/types";
import { use3DTilt } from "@/lib/hooks/use3DTilt";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const { ref, isHovered, rotateX, rotateY, handleMouseMove, handleMouseEnter, handleMouseLeave } =
        use3DTilt<HTMLDivElement>({ maxRotation: 10 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
            style={{ perspective: "1000px" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
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
                        className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-neon-cyan/30"
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
