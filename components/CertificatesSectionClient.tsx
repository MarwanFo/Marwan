"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Award, ExternalLink, Calendar, CheckCircle, ArrowUpRight, Sparkles, Trophy } from "lucide-react";
import { Certificate } from "@/lib/types";
import { useState, useRef } from "react";

// Fallback certificates for when database is empty
const fallbackCertificates: Certificate[] = [
    {
        id: "1",
        title: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2024",
        credential_url: "#",
        image_url: null,
        skills: ["Cloud Architecture", "AWS Services", "Security"],
        featured: true,
        display_order: 0,
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        title: "Professional Frontend Developer",
        issuer: "Meta",
        date: "2023",
        credential_url: "#",
        image_url: null,
        skills: ["React", "JavaScript", "Web Performance"],
        featured: true,
        display_order: 1,
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        title: "Full Stack Web Development",
        issuer: "freeCodeCamp",
        date: "2023",
        credential_url: "#",
        image_url: null,
        skills: ["Node.js", "MongoDB", "REST APIs"],
        featured: false,
        display_order: 2,
        created_at: new Date().toISOString(),
    },
    {
        id: "4",
        title: "TypeScript Professional",
        issuer: "Udemy",
        date: "2022",
        credential_url: "#",
        image_url: null,
        skills: ["TypeScript", "Type Safety", "OOP"],
        featured: false,
        display_order: 3,
        created_at: new Date().toISOString(),
    },
];

function CertificateCard({ certificate, index }: { certificate: Certificate; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const imageUrl = (certificate as any).image_url;

    // 3D tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

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

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
            style={{ perspective: "1000px" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className="h-full glass rounded-2xl overflow-hidden border border-white/10 group-hover:border-neon-cyan/30 transition-colors duration-500"
                style={{
                    rotateX: isHovered ? rotateX : 0,
                    rotateY: isHovered ? rotateY : 0,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Image Section */}
                {imageUrl && (
                    <div className="relative h-44 bg-gradient-to-br from-white/5 to-white/0 overflow-hidden">
                        <motion.img
                            src={imageUrl}
                            alt={certificate.title}
                            className="w-full h-full object-contain p-3"
                            animate={{ scale: isHovered ? 1.05 : 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        {/* Shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                            animate={{ x: isHovered ? "200%" : "-100%" }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                    </div>
                )}

                {/* Featured Badge */}
                {certificate.featured && (
                    <motion.div
                        className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-neon-gradient text-xs font-semibold text-background"
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    >
                        <Trophy className="w-3 h-3" />
                        Featured
                    </motion.div>
                )}

                {/* Quick Action on Hover */}
                {certificate.credential_url && (
                    <motion.a
                        href={certificate.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 left-3 z-10 p-2 rounded-xl bg-white/90 text-gray-900 backdrop-blur-sm shadow-lg"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ExternalLink className="w-4 h-4" />
                    </motion.a>
                )}

                <div className="p-5 relative">
                    {/* Glow effect */}
                    <motion.div
                        className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-neon-cyan/30 blur-3xl"
                        animate={{ opacity: isHovered ? 0.6 : 0 }}
                        transition={{ duration: 0.5 }}
                    />

                    <div className="relative z-10">
                        <div className="flex items-start gap-3 mb-3">
                            {!imageUrl && (
                                <motion.div
                                    className="p-2.5 rounded-xl bg-neon-cyan/10"
                                    animate={{ rotate: isHovered ? 360 : 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Award className="w-6 h-6 text-neon-cyan" />
                                </motion.div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white group-hover:text-neon-cyan transition-colors duration-300 line-clamp-2">
                                    {certificate.title}
                                </h3>
                                <p className="text-sm text-white/60">{certificate.issuer}</p>
                            </div>
                        </div>

                        {certificate.date && (
                            <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
                                <Calendar className="w-4 h-4" />
                                <span>Earned {certificate.date}</span>
                            </div>
                        )}

                        {/* Skills with stagger animation */}
                        <div className="flex flex-wrap gap-2">
                            {certificate.skills.slice(0, 3).map((skill, skillIndex) => (
                                <motion.div
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 + skillIndex * 0.05 + 0.2 }}
                                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-xs text-white/70 border border-white/10 group-hover:border-neon-cyan/30 group-hover:text-neon-cyan/80 transition-all duration-300"
                                >
                                    <CheckCircle className="w-3 h-3" />
                                    <span>{skill}</span>
                                </motion.div>
                            ))}
                            {certificate.skills.length > 3 && (
                                <span className="px-3 py-1 text-xs rounded-full bg-white/5 text-white/40">
                                    +{certificate.skills.length - 3}
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

interface SiteSettings {
    total_certifications?: number;
    learning_hours?: number;
    skills_acquired?: number;
    years_learning?: number;
}

export default function CertificatesSectionClient({
    initialCertificates,
    settings
}: {
    initialCertificates: Certificate[];
    settings?: SiteSettings | null;
}) {
    const allCertificates = initialCertificates.length > 0 ? initialCertificates : fallbackCertificates;
    const certificates = allCertificates.slice(0, 4);
    const hasMore = allCertificates.length > 4;

    const stats = [
        { value: `${settings?.total_certifications || allCertificates.length}+`, label: "Certifications" },
        { value: `${settings?.learning_hours || 500}+`, label: "Learning Hours" },
        { value: `${settings?.skills_acquired || 15}+`, label: "Skills Acquired" },
        { value: `${settings?.years_learning || 4}`, label: "Years Learning" },
    ];

    return (
        <section id="certificates" className="relative py-24 px-6 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute bottom-1/4 left-0 w-[600px] h-[600px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 60%)",
                        filter: "blur(100px)",
                    }}
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)",
                        filter: "blur(100px)",
                    }}
                    animate={{
                        x: [0, -20, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
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
                        <span className="text-sm text-white/60">Continuous Learning</span>
                    </motion.div>
                    <h2 className="text-heading font-bold mb-4">
                        Certificates & <span className="neon-text">Credentials</span>
                    </h2>
                    <p className="text-white/60 max-w-xl mx-auto">
                        Verified certifications that demonstrate my commitment to professional growth
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {certificates.map((certificate, index) => (
                        <CertificateCard key={certificate.id} certificate={certificate} index={index} />
                    ))}
                </div>

                {/* Stats with hover effects */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="text-center glass rounded-xl p-6 group hover:bg-white/10 transition-colors cursor-default"
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            <motion.div
                                className="text-3xl font-bold neon-text mb-1"
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                {stat.value}
                            </motion.div>
                            <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <motion.a
                            href="/certificates"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass border border-white/20 text-white hover:border-neon-cyan/50 hover:text-neon-cyan transition-all group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>View All Certificates</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.a>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
