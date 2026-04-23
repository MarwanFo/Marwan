"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

interface TerminalTriggerProps {
    onOpen: () => void;
}

export default function TerminalTrigger({ onOpen }: TerminalTriggerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed bottom-6 left-6 z-[9998]"
        >
            <motion.button
                onClick={onOpen}
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="group relative w-14 h-14 rounded-2xl glass flex items-center justify-center border border-neon-cyan/30 shadow-[0_0_20px_rgba(0,255,255,0.2)] overflow-hidden"
                title="System Console (~)"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Icon */}
                <Terminal className="w-6 h-6 text-neon-cyan group-hover:text-white transition-colors relative z-10" />
                
                {/* Animated Pulsing Dot */}
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-neon-cyan/50 animate-pulse" />
            </motion.button>
        </motion.div>
    );
}
