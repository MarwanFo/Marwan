"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, MapPin, ExternalLink, ArrowUpRight, GraduationCap } from "lucide-react";
import { Experience } from "@/lib/types";
import { useState } from "react";

function ExperienceCard({ experience, index, isEducation }: { experience: Experience; index: number; isEducation?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
        >
            <div className={`absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b ${isEducation ? 'from-neon-purple via-neon-magenta to-neon-cyan' : 'from-neon-cyan via-neon-purple to-neon-magenta'} opacity-30 hidden md:block`} />

            <motion.div
                className={`absolute left-0 md:left-1/2 top-8 w-4 h-4 rounded-full ${isEducation ? 'bg-neon-purple' : 'bg-neon-cyan'} -translate-x-1/2 hidden md:block`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
            >
                <div className={`absolute inset-0 rounded-full ${isEducation ? 'bg-neon-purple' : 'bg-neon-cyan'} animate-ping opacity-30`} />
            </motion.div>

            <div className={`md:w-[calc(50%-40px)] ${index % 2 === 0 ? "md:ml-0" : "md:ml-auto"}`}>
                <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-neon-cyan/30">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {/* Logo/Image */}
                            {(experience as any).image_url ? (
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                                    <img
                                        src={(experience as any).image_url}
                                        alt={experience.company}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className={`p-2.5 rounded-xl flex-shrink-0 ${isEducation ? 'bg-neon-purple/10' : 'bg-neon-cyan/10'}`}>
                                    {isEducation ? (
                                        <GraduationCap className="w-6 h-6 text-neon-purple" />
                                    ) : (
                                        <Briefcase className="w-6 h-6 text-neon-cyan" />
                                    )}
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors">
                                    {experience.role}
                                </h3>
                                {experience.company_url ? (
                                    <a
                                        href={experience.company_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-1 ${isEducation ? 'text-neon-purple hover:text-neon-magenta' : 'text-neon-cyan hover:text-neon-purple'} transition-colors`}
                                    >
                                        {experience.company}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                ) : (
                                    <span className={isEducation ? 'text-neon-purple' : 'text-neon-cyan'}>{experience.company}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-4">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{experience.period}</span>
                        </div>
                        {experience.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{experience.location}</span>
                            </div>
                        )}
                    </div>

                    {experience.description && (
                        <p className="text-white/70 mb-4 leading-relaxed">{experience.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech) => (
                            <span
                                key={tech}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${isEducation ? 'bg-neon-purple/10 text-neon-purple' : 'bg-neon-cyan/10 text-neon-cyan'}`}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
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
        <section id="experience" className="relative py-24 px-6">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full transition-all duration-500"
                    style={{
                        background: activeTab === "education"
                            ? "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)"
                            : "radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)",
                        filter: "blur(80px)",
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                        {activeTab === "work" ? (
                            <Briefcase className="w-4 h-4 text-neon-cyan" />
                        ) : (
                            <GraduationCap className="w-4 h-4 text-neon-purple" />
                        )}
                        <span className="text-sm text-white/60">
                            {activeTab === "work" ? "Career Journey" : "Academic Background"}
                        </span>
                    </div>
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

                    {/* Tab Toggle */}
                    <div className="inline-flex items-center gap-2 p-1.5 rounded-full glass">
                        <button
                            onClick={() => setActiveTab("work")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${activeTab === "work"
                                ? "bg-neon-cyan/20 text-neon-cyan"
                                : "text-white/60 hover:text-white"
                                }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            <span>Experience</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("education")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${activeTab === "education"
                                ? "bg-neon-purple/20 text-neon-purple"
                                : "text-white/60 hover:text-white"
                                }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            <span>Education</span>
                        </button>
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
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-12"
                            >
                                <div className={`w-16 h-16 mx-auto rounded-2xl ${activeTab === "education" ? "bg-neon-purple/10" : "bg-neon-cyan/10"} flex items-center justify-center mb-4`}>
                                    {activeTab === "education" ? (
                                        <GraduationCap className="w-8 h-8 text-neon-purple/50" />
                                    ) : (
                                        <Briefcase className="w-8 h-8 text-neon-cyan/50" />
                                    )}
                                </div>
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
                        <a
                            href="/experience"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass border border-white/20 text-white hover:border-neon-purple/50 hover:text-neon-purple transition-all group"
                        >
                            <span>View Full History</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
