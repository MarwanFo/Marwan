"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowDown, Sparkles } from "lucide-react";

export default function HeroSection() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    // Mouse position tracking for gradient blob
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for mouse follower
    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        setIsLoaded(true);

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Text animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const letterVariants = {
        hidden: {
            opacity: 0,
            y: 100,
            rotateX: -90,
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.4, 0.25, 1],
            },
        },
    };

    const name = "MARWAN";
    const title = "FULL STACK DEVELOPER";

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Animated Background Gradient Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Mouse-following gradient blob */}
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full"
                    style={{
                        x: smoothX,
                        y: smoothY,
                        translateX: "-50%",
                        translateY: "-50%",
                        background: "radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />

                {/* Static ambient blobs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(255, 0, 255, 0.1) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                        filter: "blur(70px)",
                    }}
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />

                {/* Particle effect */}
                {isLoaded && (
                    <div className="absolute inset-0">
                        {[...Array(30)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white/30 rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, -100, 0],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 3,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                {/* Small tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="flex items-center justify-center gap-2 mb-8"
                >
                    <Sparkles className="w-4 h-4 text-neon-cyan" />
                    <span className="text-sm md:text-base uppercase tracking-[0.3em] text-white/60">
                        Welcome to my portfolio
                    </span>
                    <Sparkles className="w-4 h-4 text-neon-magenta" />
                </motion.div>

                {/* Name - Large staggered animation */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="overflow-hidden mb-4"
                >
                    <h1 className="text-display-lg font-bold flex justify-center flex-wrap" style={{ perspective: "1000px" }}>
                        {name.split("").map((letter, index) => (
                            <motion.span
                                key={index}
                                variants={letterVariants}
                                className="inline-block neon-text"
                                style={{ display: "inline-block" }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </h1>
                </motion.div>

                {/* Title */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="overflow-hidden mb-8"
                >
                    <div className="text-display font-bold flex justify-center flex-wrap gap-x-4 text-white/90" style={{ perspective: "1000px" }}>
                        {title.split(" ").map((word, wordIndex) => (
                            <motion.span
                                key={wordIndex}
                                variants={letterVariants}
                                className="inline-block"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* Description */}
                <motion.p
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Crafting{" "}
                    <span className="text-neon-cyan">beautiful</span>,{" "}
                    <span className="text-neon-purple">high-performance</span> web experiences
                    with modern technologies and creative design.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <motion.a
                        href="#projects"
                        className="group relative px-8 py-4 rounded-full glass glow-effect overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="relative z-10 font-semibold tracking-wide">View Projects</span>
                        <motion.div
                            className="absolute inset-0 bg-neon-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        />
                    </motion.a>

                    <motion.a
                        href="#contact"
                        className="group px-8 py-4 rounded-full border border-white/20 hover:border-neon-cyan/50 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="font-semibold tracking-wide text-white/80 group-hover:text-neon-cyan transition-colors duration-300">
                            Get in Touch
                        </span>
                    </motion.a>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2 text-white/40"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <ArrowDown className="w-4 h-4" />
                </motion.div>
            </motion.div>
        </section>
    );
}
