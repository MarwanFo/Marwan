"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // Check if this is first visit in session
        const hasLoaded = sessionStorage.getItem("hasLoaded");
        if (hasLoaded) {
            setIsLoading(false);
            return;
        }

        // Show loading for 3 seconds on first visit
        const timer = setTimeout(() => {
            setIsLoading(false);
            sessionStorage.setItem("hasLoaded", "true");
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // Don't render on server
    if (!isMounted) return null;

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    {/* Background animated gradient */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full"
                            style={{
                                background: "radial-gradient(circle, rgba(0, 255, 255, 0.12) 0%, transparent 70%)",
                                filter: "blur(100px)",
                            }}
                            initial={{ x: "-50%", y: "-50%", scale: 0, rotate: 0 }}
                            animate={{
                                x: "-50%",
                                y: "-50%",
                                scale: [0, 1.5, 1.2],
                                rotate: 360,
                            }}
                            transition={{ duration: 2, ease: "easeOut" }}
                        />
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full"
                            style={{
                                background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                                filter: "blur(80px)",
                            }}
                            initial={{ x: "-50%", y: "-50%", scale: 0 }}
                            animate={{
                                x: "-50%",
                                y: "-50%",
                                scale: [0, 1.3, 1],
                            }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        />
                    </div>

                    {/* Logo Animation */}
                    <div className="relative z-10 text-center">
                        {/* Geometric M Logo */}
                        <motion.div
                            className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-8"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                duration: 0.8,
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                            }}
                        >
                            {/* Outer ring */}
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-purple), var(--neon-magenta))",
                                    padding: "3px",
                                }}
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                <div className="w-full h-full rounded-full bg-background" />
                            </motion.div>

                            {/* Inner hexagon shape */}
                            <motion.div
                                className="absolute inset-4 flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                            >
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    {/* Hexagon background */}
                                    <motion.polygon
                                        points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                                        fill="none"
                                        stroke="url(#gradientStroke)"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.6, duration: 1, ease: "easeInOut" }}
                                    />
                                    {/* M Letter */}
                                    <motion.path
                                        d="M25 75 L25 30 L50 55 L75 30 L75 75"
                                        fill="none"
                                        stroke="url(#gradientStroke)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                                    />
                                    <defs>
                                        <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="var(--neon-cyan)" />
                                            <stop offset="50%" stopColor="var(--neon-purple)" />
                                            <stop offset="100%" stopColor="var(--neon-magenta)" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </motion.div>

                            {/* Glowing dot accents */}
                            <motion.div
                                className="absolute -top-1 left-1/2 w-3 h-3 rounded-full bg-neon-cyan"
                                style={{ transform: "translateX(-50%)", boxShadow: "0 0 20px var(--neon-cyan)" }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: [0, 1, 0.7], scale: 1 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                            />
                            <motion.div
                                className="absolute -bottom-1 left-1/2 w-3 h-3 rounded-full bg-neon-magenta"
                                style={{ transform: "translateX(-50%)", boxShadow: "0 0 20px var(--neon-magenta)" }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: [0, 1, 0.7], scale: 1 }}
                                transition={{ delay: 1.4, duration: 0.5 }}
                            />
                        </motion.div>

                        {/* Name with stylized typography */}
                        <motion.div
                            className="overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <motion.h1
                                className="text-4xl md:text-5xl font-bold tracking-[0.2em] neon-text"
                                initial={{ y: 50 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
                            >
                                MARWAN
                            </motion.h1>
                        </motion.div>

                        {/* Animated divider line */}
                        <motion.div
                            className="w-20 h-0.5 mx-auto my-4 bg-neon-gradient"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                        />

                        {/* Subtitle */}
                        <motion.p
                            className="text-white/60 text-sm md:text-base tracking-[0.25em] uppercase"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.7, duration: 0.5 }}
                        >
                            Full Stack Developer
                        </motion.p>

                        {/* Animated loading dots */}
                        <motion.div
                            className="flex justify-center gap-2 mt-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-neon-gradient"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut",
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
