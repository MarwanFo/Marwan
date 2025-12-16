"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar, CheckCircle, ArrowUpRight } from "lucide-react";
import { Certificate } from "@/lib/types";

// Fallback certificates for when database is empty
const fallbackCertificates: Certificate[] = [
    {
        id: "1",
        title: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2024",
        credential_url: "#",
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
        skills: ["TypeScript", "Type Safety", "OOP"],
        featured: false,
        display_order: 3,
        created_at: new Date().toISOString(),
    },
    {
        id: "5",
        title: "Docker & Kubernetes Fundamentals",
        issuer: "Linux Foundation",
        date: "2022",
        credential_url: "#",
        skills: ["Docker", "Kubernetes", "DevOps"],
        featured: false,
        display_order: 4,
        created_at: new Date().toISOString(),
    },
    {
        id: "6",
        title: "Google UX Design Certificate",
        issuer: "Google",
        date: "2021",
        credential_url: "#",
        skills: ["UX Research", "Wireframing", "Prototyping"],
        featured: false,
        display_order: 5,
        created_at: new Date().toISOString(),
    },
];

function CertificateCard({ certificate, index }: { certificate: Certificate; index: number }) {
    const imageUrl = (certificate as any).image_url;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className={`relative group`}
        >
            <div className="h-full glass rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-neon-cyan/30">
                {imageUrl && (
                    <div className="h-40 bg-white/5 overflow-hidden p-2">
                        <img
                            src={imageUrl}
                            alt={certificate.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}

                {certificate.featured && (
                    <div className="absolute top-2 right-2 z-10">
                        <div className="px-2 py-0.5 rounded-full bg-neon-gradient text-xs font-semibold text-background">
                            Featured
                        </div>
                    </div>
                )}

                <div className="p-4">

                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            {!imageUrl && (
                                <div className="p-2 rounded-xl bg-neon-cyan/10">
                                    <Award className="w-6 h-6 text-neon-cyan" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-white group-hover:text-neon-cyan transition-colors">
                                    {certificate.title}
                                </h3>
                                <p className="text-sm text-white/60">{certificate.issuer}</p>
                            </div>
                        </div>

                        {certificate.credential_url && (
                            <motion.a
                                href={certificate.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg glass opacity-0 group-hover:opacity-100 transition-opacity"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ExternalLink className="w-4 h-4 text-neon-cyan" />
                            </motion.a>
                        )}
                    </div>

                    {certificate.date && (
                        <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
                            <Calendar className="w-4 h-4" />
                            <span>Earned {certificate.date}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {certificate.skills.map((skill) => (
                            <div
                                key={skill}
                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-xs text-white/70"
                            >
                                <CheckCircle className="w-3 h-3 text-neon-cyan" />
                                <span>{skill}</span>
                            </div>
                        ))}
                    </div>

                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-cyan/5 via-neon-purple/5 to-neon-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
            </div>
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
        <section id="certificates" className="relative py-24 px-6">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)",
                        filter: "blur(80px)",
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                        <Award className="w-4 h-4 text-neon-cyan" />
                        <span className="text-sm text-white/60">Continuous Learning</span>
                    </div>
                    <h2 className="text-heading font-bold mb-4">
                        Certificates & <span className="neon-text">Credentials</span>
                    </h2>
                    <p className="text-white/60 max-w-xl mx-auto">
                        Verified certifications that demonstrate my commitment to professional growth
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {certificates.map((certificate, index) => (
                        <CertificateCard key={certificate.id} certificate={certificate} index={index} />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center glass rounded-xl p-6">
                            <div className="text-3xl font-bold neon-text mb-1">{stat.value}</div>
                            <div className="text-sm text-white/60">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <a
                            href="/certificates"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass border border-white/20 text-white hover:border-neon-cyan/50 hover:text-neon-cyan transition-all group"
                        >
                            <span>View All Certificates</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
