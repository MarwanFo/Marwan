"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Certificate } from "@/lib/types";

interface SiteSettings {
    total_certifications?: number;
    learning_hours?: number;
    skills_acquired?: number;
    years_learning?: number;
}

function CertificateCard({ certificate, index }: { certificate: Certificate; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-neon-cyan/30"
        >
            {certificate.featured && (
                <div className="absolute -top-3 -right-3">
                    <div className="px-3 py-1 rounded-full bg-neon-gradient text-xs font-semibold text-background">
                        Featured
                    </div>
                </div>
            )}

            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-neon-cyan/10">
                        <Award className="w-6 h-6 text-neon-cyan" />
                    </div>
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
        </motion.div>
    );
}

export default function CertificatesPageClient({
    certificates,
    settings
}: {
    certificates: Certificate[];
    settings?: SiteSettings | null;
}) {
    const stats = [
        { value: `${settings?.total_certifications || certificates.length}+`, label: "Certifications" },
        { value: `${settings?.learning_hours || 500}+`, label: "Learning Hours" },
        { value: `${settings?.skills_acquired || 15}+`, label: "Skills Acquired" },
        { value: `${settings?.years_learning || 4}`, label: "Years Learning" },
    ];

    return (
        <main className="min-h-screen py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/#certificates"
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
                        <Award className="w-4 h-4 text-neon-cyan" />
                        <span className="text-sm text-white/60">Continuous Learning</span>
                    </div>
                    <h1 className="text-heading font-bold mb-4">
                        All <span className="neon-text">Certificates</span>
                    </h1>
                    <p className="text-white/60 max-w-xl mx-auto">
                        My complete collection of certifications and credentials
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center glass rounded-xl p-6">
                            <div className="text-3xl font-bold neon-text mb-1">{stat.value}</div>
                            <div className="text-sm text-white/60">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Certificates Grid */}
                {certificates.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-white/60">No certificates yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((certificate, index) => (
                            <CertificateCard key={certificate.id} certificate={certificate} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
