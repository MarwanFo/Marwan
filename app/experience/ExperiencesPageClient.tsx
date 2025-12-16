"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Experience } from "@/lib/types";

function ExperienceCard({ experience, index }: { experience: Experience; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
        >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">{experience.role}</h3>
                    <a
                        href={experience.company_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-neon-purple hover:text-neon-magenta transition-colors"
                    >
                        <span>{experience.company}</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
                <div className="flex flex-col items-end gap-1 text-sm text-white/60">
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
            </div>

            {experience.description && (
                <p className="text-white/70 mb-4">{experience.description}</p>
            )}

            {experience.achievements.length > 0 && (
                <ul className="space-y-2 mb-4">
                    {experience.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                            <span className="text-neon-cyan mt-1">▹</span>
                            <span>{achievement}</span>
                        </li>
                    ))}
                </ul>
            )}

            <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech) => (
                    <span
                        key={tech}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}

export default function ExperiencesPageClient({ experiences }: { experiences: Experience[] }) {
    return (
        <main className="min-h-screen py-24 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/#experience"
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                        <Briefcase className="w-4 h-4 text-neon-purple" />
                        <span className="text-sm text-white/60">Career Journey</span>
                    </div>
                    <h1 className="text-heading font-bold mb-4">
                        Work <span className="neon-text">Experience</span>
                    </h1>
                    <p className="text-white/60 max-w-xl mx-auto">
                        My complete professional journey and work history
                    </p>
                </motion.div>

                {/* Experiences List */}
                {experiences.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-white/60">No experiences yet</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {experiences.map((experience, index) => (
                            <ExperienceCard key={experience.id} experience={experience} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
