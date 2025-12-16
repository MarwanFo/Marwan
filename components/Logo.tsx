"use client";

import { motion } from "framer-motion";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
    animated?: boolean;
}

export default function Logo({ size = "md", showText = true, animated = true }: LogoProps) {
    const sizes = {
        sm: { container: "w-8 h-8", text: "text-lg" },
        md: { container: "w-10 h-10", text: "text-xl" },
        lg: { container: "w-14 h-14", text: "text-2xl" },
    };

    const currentSize = sizes[size];

    const Container = animated ? motion.div : "div";
    const containerProps = animated ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
    } : {};

    return (
        <Container
            className="flex items-center gap-3 cursor-pointer"
            {...containerProps}
        >
            {/* Geometric M Logo */}
            <div className={`relative ${currentSize.container}`}>
                {/* Outer gradient ring */}
                <div
                    className="absolute inset-0 rounded-full p-[2px]"
                    style={{
                        background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-purple), var(--neon-magenta))",
                    }}
                >
                    <div className="w-full h-full rounded-full bg-background" />
                </div>

                {/* M Letter inside hexagon */}
                <div className="absolute inset-1 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Hexagon frame */}
                        <polygon
                            points="50,8 88,28 88,72 50,92 12,72 12,28"
                            fill="none"
                            stroke="url(#logoGradient)"
                            strokeWidth="3"
                        />
                        {/* M Letter */}
                        <path
                            d="M28 72 L28 32 L50 52 L72 32 L72 72"
                            fill="none"
                            stroke="url(#logoGradient)"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <defs>
                            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="var(--neon-cyan)" />
                                <stop offset="50%" stopColor="var(--neon-purple)" />
                                <stop offset="100%" stopColor="var(--neon-magenta)" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Text */}
            {showText && (
                <span className={`${currentSize.text} font-bold neon-text tracking-wider`}>
                    MARWAN
                </span>
            )}
        </Container>
    );
}
