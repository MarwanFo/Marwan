"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// ── Dynamic import: Three.js only loads on desktop ──────────────────────────
const TechSphere = dynamic(() => import("./three/TechSphere"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-[500px]">
            <div className="w-10 h-10 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
        </div>
    ),
});

// ── Hooks ───────────────────────────────────────────────────────────────────

/** Returns true when the .light class is active on <html> */
function useLightMode() {
    const [isLight, setIsLight] = useState(false);
    useEffect(() => {
        const check = () =>
            setIsLight(document.documentElement.classList.contains("light"));
        check();
        const observer = new MutationObserver(check);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);
    return isLight;
}

/** Returns true if viewport is ≤ 768px */
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);
    return isMobile;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true if an icon URL is intentionally white/monochrome */
function isWhiteIcon(url: string): boolean {
    const lower = url.toLowerCase();
    return (
        lower.includes("/white") ||
        lower.endsWith("/fff") ||
        lower.includes("/ffffff")
    );
}

// ── Types ───────────────────────────────────────────────────────────────────

interface Skill {
    id: string;
    name: string;
    icon_url: string;
    website_url?: string;
}

// ── 2D Marquee (mobile fallback) ────────────────────────────────────────────

function MarqueeRow({
    items,
    reverse = false,
    lightMode,
}: {
    items: Skill[];
    reverse?: boolean;
    lightMode: boolean;
}) {
    const duplicatedItems = [...items, ...items, ...items];

    return (
        <div className="relative flex overflow-hidden py-4 group">
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />

            <motion.div
                className={`flex gap-4 md:gap-6 ${
                    reverse ? "animate-marquee-reverse" : "animate-marquee"
                }`}
                style={{
                    display: "flex",
                    flexShrink: 0,
                    flexWrap: "nowrap",
                    width: "max-content",
                }}
            >
                {duplicatedItems.map((tech, index) => {
                    const needsInvert = lightMode && isWhiteIcon(tech.icon_url);
                    return (
                        <motion.a
                            key={`${tech.id}-${index}`}
                            href={tech.website_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full glass cursor-pointer hover:bg-white/10 transition-colors duration-300"
                            style={{ flexShrink: 0, whiteSpace: "nowrap" }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-5 h-5 md:w-6 md:h-6 relative flex-shrink-0">
                                <Image
                                    src={tech.icon_url}
                                    alt={tech.name}
                                    width={24}
                                    height={24}
                                    className="object-contain w-full h-full"
                                    style={
                                        needsInvert
                                            ? {
                                                  filter: "brightness(0) saturate(100%)",
                                              }
                                            : undefined
                                    }
                                    unoptimized
                                />
                            </div>
                            <span className="text-white/80 font-medium text-sm md:text-base">
                                {tech.name}
                            </span>
                        </motion.a>
                    );
                })}
            </motion.div>
        </div>
    );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function TechMarquee() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const lightMode = useLightMode();
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchSkills = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("skills")
                .select("*")
                .order("created_at", { ascending: true });

            if (!error && data) {
                setSkills(data);
            }
            setLoading(false);
        };

        fetchSkills();
    }, []);

    // Loading spinner
    if (loading) {
        return (
            <section className="relative py-16 md:py-24 overflow-hidden">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto" />
                </div>
            </section>
        );
    }

    // Hide section if no skills
    if (skills.length === 0) return null;

    // Split skills into two rows (for mobile marquee)
    const midpoint = Math.ceil(skills.length / 2);
    const row1 = skills.slice(0, midpoint);
    const row2 = skills.slice(midpoint);

    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[200px] md:h-[300px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(ellipse, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8 md:mb-12"
                >
                    <h2 className="text-2xl md:text-heading font-bold mb-3 md:mb-4">
                        Tech <span className="neon-text">Stack</span>
                    </h2>
                    <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base px-4">
                        Technologies and tools I use to bring ideas to life
                    </p>
                </motion.div>

                {/* ── Desktop: 3D Sphere  |  Mobile: 2D Marquee ──────────── */}
                {isMobile ? (
                    <div className="space-y-2 md:space-y-4">
                        <MarqueeRow items={row1} lightMode={lightMode} />
                        {row2.length > 0 && (
                            <MarqueeRow
                                items={row2}
                                reverse
                                lightMode={lightMode}
                            />
                        )}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <TechSphere
                            skills={skills}
                            theme={lightMode ? "light" : "dark"}
                        />
                    </motion.div>
                )}
            </div>
        </section>
    );
}
