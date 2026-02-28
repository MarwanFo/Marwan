"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Building2, BookOpen, ArrowUpRight } from "lucide-react";
import { Experience } from "@/lib/types";
import { useState } from "react";
import ExperienceCard from "@/components/cards/ExperienceCard";

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
