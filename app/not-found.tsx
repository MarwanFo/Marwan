"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 30, 0],
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
                        background: "radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                    animate={{
                        scale: [1, 1.3, 1],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-2xl">
                {/* Glitchy 404 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-8"
                >
                    <h1 className="text-[150px] md:text-[200px] font-bold leading-none neon-text select-none">
                        404
                    </h1>
                    {/* Glitch layers */}
                    <motion.h1
                        className="absolute inset-0 text-[150px] md:text-[200px] font-bold leading-none text-neon-cyan/30 select-none"
                        animate={{
                            x: [0, -5, 5, 0],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    >
                        404
                    </motion.h1>
                    <motion.h1
                        className="absolute inset-0 text-[150px] md:text-[200px] font-bold leading-none text-neon-magenta/30 select-none"
                        animate={{
                            x: [0, 5, -5, 0],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 0.1,
                        }}
                    >
                        404
                    </motion.h1>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-white/60 mb-8 max-w-md mx-auto">
                        Oops! The page you're looking for seems to have vanished into the digital void.
                        Let's get you back on track.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/">
                        <motion.button
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-gradient text-background font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </motion.button>
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-white hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-16 flex items-center justify-center gap-2 text-white/40"
                >
                    <Search className="w-4 h-4" />
                    <span className="text-sm">Lost in cyberspace</span>
                </motion.div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
