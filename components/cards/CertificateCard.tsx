"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar, CheckCircle, Trophy } from "lucide-react";
import { Certificate } from "@/lib/types";
import { use3DTilt } from "@/lib/hooks/use3DTilt";

interface CertificateCardProps {
    certificate: Certificate;
    index: number;
}

export default function CertificateCard({ certificate, index }: CertificateCardProps) {
    const { ref, isHovered, rotateX, rotateY, handleMouseMove, handleMouseEnter, handleMouseLeave } =
        use3DTilt<HTMLDivElement>({ maxRotation: 8 });

    const imageUrl = certificate.image_url;

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
            onMouseEnter={handleMouseEnter}
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
