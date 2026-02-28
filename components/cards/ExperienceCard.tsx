"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, ExternalLink, GraduationCap } from "lucide-react";
import { Experience } from "@/lib/types";
import { use3DTilt } from "@/lib/hooks/use3DTilt";

interface ExperienceCardProps {
    experience: Experience;
    index: number;
    isEducation?: boolean;
}

export default function ExperienceCard({ experience, index, isEducation }: ExperienceCardProps) {
    const { ref, isHovered, rotateX, rotateY, handleMouseMove, handleMouseEnter, handleMouseLeave } =
        use3DTilt<HTMLDivElement>({ maxRotation: 6 });

    const accentColor = isEducation ? "neon-purple" : "neon-cyan";

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative group"
            style={{ perspective: "1000px" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Timeline line - hidden on mobile */}
            <div className={`absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b ${isEducation ? 'from-neon-purple via-neon-magenta to-neon-cyan' : 'from-neon-cyan via-neon-purple to-neon-magenta'} opacity-30 hidden md:block`} />

            {/* Timeline dot */}
            <motion.div
                className={`absolute left-0 md:left-1/2 top-10 w-5 h-5 rounded-full bg-${accentColor} -translate-x-1/2 hidden md:flex items-center justify-center z-10`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.15 + 0.2, type: "spring" }}
            >
                <div className={`absolute inset-0 rounded-full bg-${accentColor} animate-ping opacity-30`} />
                <div className="w-2 h-2 rounded-full bg-background" />
            </motion.div>

            <div className={`md:w-[calc(50%-50px)] ${index % 2 === 0 ? "md:ml-0" : "md:ml-auto"}`}>
                <motion.div
                    className="glass rounded-2xl overflow-hidden border border-white/10 group-hover:border-neon-cyan/30 transition-colors duration-500"
                    style={{
                        rotateX: isHovered ? rotateX : 0,
                        rotateY: isHovered ? rotateY : 0,
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Top accent with company/school logo */}
                    <div className={`relative h-2 bg-gradient-to-r ${isEducation ? 'from-neon-purple via-neon-magenta to-neon-cyan' : 'from-neon-cyan via-neon-purple to-neon-magenta'}`}>
                        {/* Shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
                            animate={{ x: isHovered ? "200%" : "-100%" }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="p-6 relative">
                        {/* Glow effect */}
                        <motion.div
                            className={`absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-${accentColor}/30 blur-3xl`}
                            animate={{ opacity: isHovered ? 0.5 : 0 }}
                            transition={{ duration: 0.5 }}
                        />

                        <div className="relative z-10">
                            {/* Header with logo */}
                            <div className="flex items-start gap-4 mb-5">
                                {/* Logo/Icon */}
                                {experience.image_url ? (
                                    <motion.div
                                        className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 border border-white/10"
                                        animate={{ rotate: isHovered ? 5 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img
                                            src={experience.image_url}
                                            alt={experience.company}
                                            className="w-full h-full object-contain p-1"
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className={`p-3 rounded-xl ${isEducation ? 'bg-neon-purple/10' : 'bg-neon-cyan/10'} flex-shrink-0`}
                                        animate={{ rotate: isHovered ? 360 : 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {isEducation ? (
                                            <GraduationCap className="w-7 h-7 text-neon-purple" />
                                        ) : (
                                            <Briefcase className="w-7 h-7 text-neon-cyan" />
                                        )}
                                    </motion.div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-xl font-bold text-white group-hover:text-${accentColor} transition-colors duration-300`}>
                                        {experience.role}
                                    </h3>
                                    {experience.company_url ? (
                                        <a
                                            href={experience.company_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-1 text-${accentColor} hover:opacity-80 transition-opacity`}
                                        >
                                            {experience.company}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <span className={`text-${accentColor}`}>{experience.company}</span>
                                    )}
                                </div>
                            </div>

                            {/* Meta info */}
                            <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-4">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span>{experience.period}</span>
                                </div>
                                {experience.location && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        <span>{experience.location}</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {experience.description && (
                                <p className="text-white/70 mb-5 leading-relaxed">{experience.description}</p>
                            )}

                            {/* Technologies with stagger animation */}
                            <div className="flex flex-wrap gap-2">
                                {experience.technologies.slice(0, 5).map((tech, techIndex) => (
                                    <motion.span
                                        key={tech}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 + techIndex * 0.05 + 0.3 }}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${isEducation
                                            ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20 group-hover:border-neon-purple/50'
                                            : 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20 group-hover:border-neon-cyan/50'
                                            }`}
                                    >
                                        {tech}
                                    </motion.span>
                                ))}
                                {experience.technologies.length > 5 && (
                                    <span className="px-3 py-1.5 text-xs rounded-full bg-white/5 text-white/40">
                                        +{experience.technologies.length - 5}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom accent line */}
                    <motion.div
                        className={`h-1 bg-gradient-to-r ${isEducation ? 'from-neon-purple to-neon-magenta' : 'from-neon-cyan to-neon-purple'}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ originX: index % 2 === 0 ? 0 : 1 }}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}
