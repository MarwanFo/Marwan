"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTerminal, TerminalEntry } from "@/lib/hooks/useTerminal";
import { Terminal, X, ChevronRight, CornerDownRight } from "lucide-react";
import TerminalTrigger from "./TerminalTrigger";

export default function TerminalHUD() {
    const {
        isOpen,
        setIsOpen,
        history,
        processCommand,
        inputRef,
        commandHistory,
        historyIndex,
        setHistoryIndex,
    } = useTerminal();

    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of terminal
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    // Auto-focus input when terminal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, inputRef]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        processCommand(inputValue);
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            const nextIndex = historyIndex + 1;
            if (nextIndex < commandHistory.length) {
                setHistoryIndex(nextIndex);
                setInputValue(commandHistory[nextIndex]);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const nextIndex = historyIndex - 1;
            if (nextIndex >= 0) {
                setHistoryIndex(nextIndex);
                setInputValue(commandHistory[nextIndex]);
            } else {
                setHistoryIndex(-1);
                setInputValue("");
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed inset-0 z-[9999] p-4 md:p-12 lg:p-24 flex items-center justify-center bg-background/80 backdrop-blur-2xl overflow-hidden"
                >
                    {/* CRT Scanline Overlay */}
                    <div className="absolute inset-0 pointer-events-none terminal-scanline opacity-20 z-10" />

                    <div className="relative w-full max-w-5xl h-full flex flex-col glass-strong rounded-2xl border border-neon-cyan/30 shadow-2xl overflow-hidden terminal-hud terminal-flicker">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-lg bg-neon-cyan/10">
                                    <Terminal className="w-5 h-5 text-neon-cyan" />
                                </div>
                                <span className="text-sm font-bold tracking-widest text-white/80">CORE_SYSTEM_TERMINAL</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-red-400"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Output Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto px-8 py-8 space-y-4 custom-scrollbar text-sm md:text-base"
                        >
                            {history.map((entry, i) => (
                                <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                                    <EntryComponent entry={entry} />
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-white/10 bg-white/5">
                            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                                <ChevronRight className="w-5 h-5 text-neon-cyan animate-pulse" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-white/20"
                                    placeholder="Execute command..."
                                    spellCheck={false}
                                    autoComplete="off"
                                />
                            </form>
                        </div>

                        {/* Footer / Status */}
                        <div className="px-6 py-2 bg-neon-cyan/5 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-widest text-neon-cyan/40">
                            <span>Connection: SECURE_ENCRYPTED</span>
                            <span>System: OPERATIONAL</span>
                        </div>
                    </div>
                </motion.div>
            )}
            {!isOpen && <TerminalTrigger onOpen={() => setIsOpen(true)} />}
        </AnimatePresence>
    );
}

function EntryComponent({ entry }: { entry: TerminalEntry }) {
    switch (entry.type) {
        case "input":
            return (
                <div className="flex items-center gap-2">
                    <span className="text-neon-purple font-bold">visitor@marwan:~$</span>
                    <span className="text-white">{entry.content}</span>
                </div>
            );
        case "output":
            return (
                <div className="flex items-start gap-4">
                    <CornerDownRight className="w-4 h-4 text-white/20 mt-1 shrink-0" />
                    <pre className="text-white/80 whitespace-pre-wrap leading-relaxed">
                        {entry.content}
                    </pre>
                </div>
            );
        case "error":
            return (
                <div className="flex items-center gap-2 text-red-400/80">
                    <X className="w-4 h-4" />
                    <span>{entry.content}</span>
                </div>
            );
        case "system":
            return (
                <div className="py-1 border-y border-white/5 bg-white/5 -mx-8 px-8 mb-2">
                    <span className="text-neon-cyan font-bold text-xs">{entry.content}</span>
                </div>
            );
        default:
            return null;
    }
}
