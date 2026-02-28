"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Certificate } from "@/lib/types";
import CertificateCard from "@/components/cards/CertificateCard";
import { fallbackCertificates } from "@/lib/fallback-data";

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
