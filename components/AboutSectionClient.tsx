"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Sparkles, Code2, Rocket } from "lucide-react";

interface ProfileData {
    name: string;
    role: string;
    bio: string | null;
    location: string | null;
    email: string | null;
    avatar_url: string | null;
    resume_url?: string | null;
    github_url?: string | null;
    linkedin_url?: string | null;
    years_experience: number;
    projects_completed: number;
    happy_clients: number;
    cups_of_coffee: number;
    interests: string[];
    status_badge?: string | null;
}

const defaultProfile: ProfileData = {
    name: "FARIDI Marwan",
    role: "Full Stack Developer",
    bio: "Full-stack developer and Computer Engineering student, passionate about building modern web applications with React, Node.js, and DevOps practices.",
    location: "Morocco",
    email: "marwanefaridi22@gmail.com",
    avatar_url: null,
    years_experience: 3,
    projects_completed: 20,
    happy_clients: 15,
    cups_of_coffee: 500,
    interests: ["Coding", "Learning", "Building"],
    status_badge: "Open to work",
};

export default function AboutSectionClient({ profile }: { profile: ProfileData | null }) {
    const data = profile || defaultProfile;

    const stats = [
        { value: data.years_experience || 3, label: "Years", icon: Sparkles },
        { value: data.projects_completed || 20, label: "Projects", icon: Code2 },
        { value: data.happy_clients || 15, label: "Clients", icon: Rocket },
    ];

    return (
        <section id="about" className="relative py-32 px-6 overflow-hidden">
            {/* Animated Background Orbs */}
            <motion.div
                className="absolute top-20 left-10 w-72 h-72 rounded-full bg-neon-purple/20 blur-[120px]"
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-neon-cyan/15 blur-[150px]"
                animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Centered Card Design */}
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
                >
                    {/* Corner Decorations */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-neon-cyan/20 to-transparent rounded-br-[100px]" />
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-neon-purple/20 to-transparent rounded-tl-[100px]" />

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Top Row - Avatar + Name */}
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
                            {/* Avatar */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                className="relative"
                            >
                                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <div
                                        className="absolute inset-0 p-[3px] rounded-2xl"
                                        style={{
                                            background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))",
                                        }}
                                    >
                                        <div className="w-full h-full rounded-xl overflow-hidden bg-background">
                                            {data.avatar_url ? (
                                                <img
                                                    src={data.avatar_url}
                                                    alt={data.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30">
                                                    <span className="text-5xl font-bold neon-text">
                                                        {(data.name || "M").charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Status Badge */}
                                <motion.span
                                    className="absolute -bottom-2 -right-2 px-3 py-1 text-xs font-bold rounded-lg bg-green-500 text-white shadow-lg"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                >
                                    {data.status_badge || "Available"}
                                </motion.span>
                            </motion.div>

                            {/* Name + Role */}
                            <div className="text-center md:text-left">
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl md:text-4xl font-bold text-white mb-2"
                                >
                                    {data.name}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg neon-text font-medium"
                                >
                                    {data.role}
                                </motion.p>
                                {data.location && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 }}
                                        className="text-white/50 text-sm mt-1 flex items-center justify-center md:justify-start gap-1"
                                    >
                                        <MapPin className="w-3 h-3" />
                                        {data.location}
                                    </motion.p>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-white/70 text-lg leading-relaxed text-center md:text-left max-w-2xl mb-10"
                        >
                            {data.bio}
                        </motion.p>

                        {/* Stats Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap justify-center md:justify-start gap-6 mb-10"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    whileHover={{ scale: 1.1, rotate: 3 }}
                                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10"
                                >
                                    <stat.icon className="w-5 h-5 text-neon-cyan" />
                                    <div>
                                        <span className="text-2xl font-bold text-white">{stat.value}+</span>
                                        <span className="text-white/50 text-sm ml-1">{stat.label}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-wrap justify-center md:justify-start gap-3"
                        >
                            {data.github_url && (
                                <motion.a
                                    href={data.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-neon-cyan/50 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Github className="w-4 h-4" />
                                    <span className="text-sm font-medium">GitHub</span>
                                </motion.a>
                            )}
                            {data.linkedin_url && (
                                <motion.a
                                    href={data.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-neon-purple/50 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Linkedin className="w-4 h-4" />
                                    <span className="text-sm font-medium">LinkedIn</span>
                                </motion.a>
                            )}
                            {!data.github_url && (
                                <motion.a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-neon-cyan/50 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Github className="w-4 h-4" />
                                    <span className="text-sm font-medium">GitHub</span>
                                </motion.a>
                            )}
                            {!data.linkedin_url && (
                                <motion.a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-neon-purple/50 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Linkedin className="w-4 h-4" />
                                    <span className="text-sm font-medium">LinkedIn</span>
                                </motion.a>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
