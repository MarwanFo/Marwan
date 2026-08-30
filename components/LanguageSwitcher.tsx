"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
    className?: string;
    variant?: "pill" | "button" | "dropdown";
}

export default function LanguageSwitcher({ className = "", variant = "pill" }: LanguageSwitcherProps) {
    const { language, setLanguage } = useLanguage();

    if (variant === "button") {
        return (
            <motion.button
                onClick={() => setLanguage(language === "en" ? "fr" : "en")}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl glass hover:bg-white/10 border border-white/10 transition-colors ${className}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={language === "en" ? "Passer en Français" : "Switch to English"}
                aria-label="Toggle language"
            >
                <Globe className="w-4 h-4 text-neon-cyan" />
                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                    {language === "en" ? "FR 🇫🇷" : "EN 🇬🇧"}
                </span>
            </motion.button>
        );
    }

    return (
        <div
            className={`relative flex items-center p-1 rounded-full glass border border-white/10 bg-white/5 ${className}`}
            role="radiogroup"
            aria-label="Language selection"
        >
            {/* English option */}
            <button
                type="button"
                role="radio"
                aria-checked={language === "en"}
                onClick={() => setLanguage("en")}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                    language === "en" ? "text-background font-bold" : "text-white/70 hover:text-white"
                }`}
            >
                <span className="text-xs">🇬🇧</span>
                <span>EN</span>
            </button>

            {/* French option */}
            <button
                type="button"
                role="radio"
                aria-checked={language === "fr"}
                onClick={() => setLanguage("fr")}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                    language === "fr" ? "text-background font-bold" : "text-white/70 hover:text-white"
                }`}
            >
                <span className="text-xs">🇫🇷</span>
                <span>FR</span>
            </button>

            {/* Sliding Neon Pill Indicator */}
            <motion.div
                className="absolute top-1 bottom-1 rounded-full bg-neon-gradient"
                layout
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                }}
                style={{
                    width: "calc(50% - 4px)",
                    left: language === "en" ? "4px" : "calc(50%)",
                }}
            />
        </div>
    );
}
