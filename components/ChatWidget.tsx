"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Loader2, MinusCircle } from "lucide-react";

interface Message {
    role: "user" | "model";
    text: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", text: "Hi! I'm Marwan's AI assistant. Ask me anything about his work, skills, or projects!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: userMessage,
                    history: messages.slice(1).map(m => ({
                        role: m.role,
                        parts: [{ text: m.text }]
                    }))
                }),
            });

            const data = await response.json();
            if (data.text) {
                setMessages(prev => [...prev, { role: "model", text: data.text }]);
            } else if (data.error) {
                setMessages(prev => [...prev, { role: "model", text: `Error: ${data.error}` }]);
            } else {
                setMessages(prev => [...prev, { role: "model", text: "Error: No response from brain." }]);
            }
        } catch (error: any) {
            setMessages(prev => [...prev, { role: "model", text: `Connection Error: ${error.message || "Failed to reach Marwan-AI"}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        { label: "Check Projects", query: "Show me your top projects" },
        { label: "Technical Skills", query: "What is your tech stack?" },
        { label: "Experience", query: "Tell me about your work experience" },
    ];

    const handleQuickAction = (query: string) => {
        setInput(query);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="glass w-[350px] sm:w-[400px] h-[600px] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10 mb-4"
                    >
                        {/* Header */}
                        <div className="bg-neon-gradient p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                                    <Bot className="w-6 h-6 text-background" />
                                </div>
                                <div>
                                    <h3 className="text-background font-bold leading-none">Marwan-AI</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-background animate-pulse" />
                                        <span className="text-[10px] text-background/70 font-bold uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setIsMinimized(true)}
                                    className="p-1.5 rounded-lg hover:bg-background/10 transition-colors text-background"
                                    title="Minimize"
                                >
                                    <MinusCircle className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsMinimized(false);
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-background/10 transition-colors text-background"
                                    title="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20"
                        >
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[85%] flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border border-white/10 ${msg.role === "user" ? "bg-neon-purple/20" : "bg-neon-cyan/20"}`}>
                                            {msg.role === "user" ? <User className="w-4 h-4 text-neon-purple" /> : <Bot className="w-4 h-4 text-neon-cyan" />}
                                        </div>
                                        <div 
                                            className={`rounded-2xl p-3 text-sm leading-relaxed ${
                                                msg.role === "user" 
                                                ? "bg-neon-purple/20 text-white border border-neon-purple/30 rounded-tr-none shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
                                                : "glass text-white/90 rounded-tl-none border-white/5"
                                            }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2 items-center glass rounded-2xl rounded-tl-none p-4 py-3">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions & Input */}
                        <div className="p-4 border-t border-white/10 bg-black/40 space-y-3">
                            {!isLoading && messages.length <= 2 && (
                                <div className="flex flex-wrap gap-2">
                                    {quickActions.map((action, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleQuickAction(action.query)}
                                            className="text-[11px] px-3 py-1.5 rounded-full glass border-white/5 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 text-white/60 hover:text-white transition-all whitespace-nowrap"
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                            
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-cyan/50 placeholder:text-white/20 pr-12 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 p-2 rounded-lg bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 transition-all disabled:opacity-30 shadow-lg"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => {
                    setIsOpen(true);
                    setIsMinimized(false);
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className={`w-14 h-14 rounded-full bg-neon-gradient flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.4)] border border-white/20 transition-all ${
                    isOpen && !isMinimized ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
                }`}
            >
                <div className="relative">
                    <MessageSquare className="w-7 h-7 text-background" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                </div>
            </motion.button>
        </div>
    );
}
