"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Briefcase, Calendar, MapPin, ExternalLink, ArrowUpRight, GraduationCap, Sparkles, Building2, BookOpen } from "lucide-react";
import { Experience } from "@/lib/types";
import { useState, useRef } from "react";

function ExperienceCard({ experience, index, isEducation }: { experience: Experience; index: number; isEducation?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // 3D tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

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
            onMouseEnter={() => setIsHovered(true)}
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
                                {(experience as any).image_url ? (
                                    <motion.div
                                        className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 border border-white/10"
                                        animate={{ rotate: isHovered ? 5 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img
                                            src={(experience as any).image_url}
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

export default function ExperienceSectionClient({ initialExperiences }: { initialExperiences: Experience[] }) {
    const [activeTab, setActiveTab] = useState<"work" | "education">("work");

    // Filter by type
    const filteredExperiences = initialExperiences.filter((exp: any) => {
        const type = exp.type || "work";
        return type === activeTab;
    });

    const hasMore = filteredExperiences.length > 4;
    const displayExperiences = filteredExperiences.slice(0, 4);

    return (
        <section id="experience" className="relative py-24 px-6 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full transition-all duration-1000"
                    style={{
                        background: activeTab === "education"
                            ? "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)"
                            : "radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 60%)",
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
                    className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full"
                    style={{
                        background: activeTab === "education"
                            ? "radial-gradient(circle, rgba(255, 0, 255, 0.08) 0%, transparent 60%)"
                            : "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)",
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

            <div className="relative z-10 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass border ${activeTab === "work" ? "border-neon-cyan/30" : "border-neon-purple/30"} mb-4`}
                    >
                        {activeTab === "work" ? (
                            <Building2 className="w-4 h-4 text-neon-cyan" />
                        ) : (
                            <BookOpen className="w-4 h-4 text-neon-purple" />
                        )}
                        <span className="text-sm text-white/60">
                            {activeTab === "work" ? "Career Journey" : "Academic Background"}
                        </span>
                    </motion.div>
                    <h2 className="text-heading font-bold mb-4">
                        {activeTab === "work" ? (
                            <>Professional <span className="neon-text">Experience</span></>
                        ) : (
                            <>My <span className="text-neon-purple">Education</span></>
                        )}
                    </h2>
                    <p className="text-white/60 max-w-xl mx-auto mb-8">
                        {activeTab === "work"
                            ? "My professional journey building digital products and growing as a developer"
                            : "My academic path and educational achievements"
                        }
                    </p>

                    {/* Tab Toggle with animation */}
                    <div className="inline-flex items-center gap-1 p-1.5 rounded-full glass">
                        <motion.button
                            onClick={() => setActiveTab("work")}
                            className={`relative flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${activeTab === "work"
                                ? "text-background"
                                : "text-white/60 hover:text-white"
                                }`}
                            whileHover={{ scale: activeTab === "work" ? 1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {activeTab === "work" && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-neon-gradient rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Briefcase className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">Experience</span>
                        </motion.button>
                        <motion.button
                            onClick={() => setActiveTab("education")}
                            className={`relative flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${activeTab === "education"
                                ? "text-background"
                                : "text-white/60 hover:text-white"
                                }`}
                            whileHover={{ scale: activeTab === "education" ? 1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {activeTab === "education" && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-magenta rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <GraduationCap className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">Education</span>
                        </motion.button>
                    </div>
                </motion.div>

                <div className="relative space-y-12 min-h-[200px]">
                    <AnimatePresence mode="wait">
                        {displayExperiences.length > 0 ? (
                            displayExperiences.map((experience, index) => (
                                <ExperienceCard
                                    key={experience.id}
                                    experience={experience}
                                    index={index}
                                    isEducation={activeTab === "education"}
                                />
                            ))
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center py-12"
                            >
                                <motion.div
                                    className={`w-20 h-20 mx-auto rounded-2xl ${activeTab === "education" ? "bg-neon-purple/10" : "bg-neon-cyan/10"} flex items-center justify-center mb-4`}
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {activeTab === "education" ? (
                                        <GraduationCap className="w-10 h-10 text-neon-purple/50" />
                                    ) : (
                                        <Briefcase className="w-10 h-10 text-neon-cyan/50" />
                                    )}
                                </motion.div>
                                <p className="text-white/40">No {activeTab === "work" ? "work experience" : "education"} entries yet</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <motion.a
                            href="/experience"
                            className={`inline-flex items-center gap-2 px-8 py-4 rounded-full glass border text-white transition-all group ${activeTab === "education"
                                    ? "border-neon-purple/30 hover:border-neon-purple/60 hover:text-neon-purple"
                                    : "border-white/20 hover:border-neon-cyan/50 hover:text-neon-cyan"
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>View Full History</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.a>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
