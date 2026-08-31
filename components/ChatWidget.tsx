"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Loader2, MinusCircle, Sparkles, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
    const isLight = useLightMode();

    // Load history from localStorage on initial render
    useEffect(() => {
        const savedHistory = localStorage.getItem("marwan-chat-history");
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed);
                }
            } catch (e) {
                console.error("Failed to parse chat history");
            }
        }
    }, []);

    // Save history to localStorage whenever messages change
    useEffect(() => {
        localStorage.setItem("marwan-chat-history", JSON.stringify(messages));
    }, [messages]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const clearChat = () => {
        if (window.confirm("Êtes-vous sûr de vouloir effacer l'historique de cette conversation ?")) {
            setMessages([{ role: "model", text: "Hi! I'm Marwan's AI assistant. Ask me anything about his work, skills, or projects!" }]);
            localStorage.removeItem("marwan-chat-history");
        }
    };

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
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                        className={`glass w-[360px] sm:w-[420px] h-[650px] rounded-[2rem] overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(0,255,255,0.15)] mb-4 border transition-all duration-300 backdrop-blur-2xl relative ${
                            isLight ? "bg-white/80 border-black/10" : "bg-black/40 border-white/20"
                        }`}
                    >
                        {/* Inner glowing edge */}
                        <div className="absolute inset-0 rounded-[2rem] pointer-events-none border border-white/5 z-50"></div>

                        {/* Header */}
                        <div className={`relative p-6 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.2)] z-20 transition-all duration-300 ${
                            isLight ? "bg-gradient-to-r from-slate-100 via-white to-slate-100" : "bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#0f172a]"
                        }`}>
                            {/* Replaced external URL background with a simple CSS dotted pattern to avoid CSP issues */}
                            <div className={`absolute inset-0 opacity-20`} style={{ backgroundImage: `radial-gradient(circle, ${isLight ? "#000000" : "#ffffff"} 1px, transparent 1px)`, backgroundSize: "20px 20px" }}></div>
                            <div className={`absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent ${isLight ? "via-neon-cyan/30" : "via-neon-cyan/50"} to-transparent`}></div>
                            
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-neon-purple/40 to-neon-cyan/40 backdrop-blur-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.2)] border relative group ${
                                    isLight ? "border-black/10" : "border-white/20"
                                }`}>
                                    <Sparkles className={`w-6 h-6 absolute top-1 right-1 opacity-50 ${isLight ? "text-neon-purple" : "text-white"}`} />
                                    <Bot className={`w-6 h-6 relative z-10 ${isLight ? "text-slate-800" : "text-white"}`} />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-extrabold tracking-wide leading-tight drop-shadow-sm flex items-center gap-2 ${
                                        isLight ? "text-slate-900" : "text-white"
                                    }`}>
                                        Marwan-AI
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                                        </span>
                                        <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                                            isLight ? "text-slate-500" : "text-white/70"
                                        }`}>Intelligent Agent</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 relative z-10">
                                <button 
                                    onClick={clearChat}
                                    className={`p-2 rounded-xl transition-all ${
                                        isLight ? "hover:bg-black/5 text-slate-400 hover:text-slate-600" : "hover:bg-white/10 text-white/60 hover:text-white"
                                    }`}
                                    title="Effacer la conversation"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => setIsMinimized(true)}
                                    className={`p-2 rounded-xl transition-all ${
                                        isLight ? "hover:bg-black/5 text-slate-400 hover:text-slate-600" : "hover:bg-white/10 text-white/60 hover:text-white"
                                    }`}
                                    title="Minimize"
                                >
                                    <MinusCircle className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsMinimized(false);
                                    }}
                                    className={`p-2 rounded-xl transition-all ${
                                        isLight ? "hover:bg-red-500/10 text-red-500/60 hover:text-red-500" : "hover:bg-red-500/20 text-white/60 hover:text-red-400"
                                    }`}
                                    title="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div 
                            ref={scrollRef}
                            className={`flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar z-10 transition-all duration-300 ${
                                isLight ? "bg-slate-50/50" : "bg-gradient-to-b from-transparent via-black/10 to-black/30"
                            }`}
                        >
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: "spring", damping: 20, stiffness: 150 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[88%] flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                        <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center border shadow-lg ${
                                            msg.role === "user" ? "bg-gradient-to-br from-purple-600 to-indigo-600 border-white/20" : "bg-gradient-to-br from-cyan-500 to-blue-600 border-white/20"
                                        }`}>
                                            {msg.role === "user" ? <User className="w-4.5 h-4.5 text-white" /> : <Bot className="w-4.5 h-4.5 text-white" />}
                                        </div>
                                        <div 
                                            className={`rounded-[1.25rem] p-4 text-[14px] leading-[1.6] shadow-md backdrop-blur-md whitespace-pre-wrap transition-all ${
                                                msg.role === "user" 
                                                ? "bg-gradient-to-br from-neon-purple/70 to-indigo-600/50 text-white border border-neon-purple/40 rounded-tr-sm" 
                                                : isLight 
                                                    ? "bg-white text-slate-800 rounded-tl-sm border border-black/5 shadow-slate-200/50" 
                                                    : "bg-[#1e293b]/70 text-white/95 rounded-tl-sm border border-white/10"
                                            }`}
                                        >
                                            <ReactMarkdown
                                                components={{
                                                    a: ({node, ...props}) => <a {...props} className="text-neon-cyan hover:text-white underline transition-colors" target="_blank" rel="noopener noreferrer" />,
                                                    strong: ({node, ...props}) => <strong {...props} className={`font-bold ${isLight ? "text-slate-900" : "text-white"}`} />,
                                                    ul: ({node, ...props}) => <ul {...props} className="list-disc pl-4 space-y-1 my-2" />,
                                                    ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-4 space-y-1 my-2" />,
                                                    li: ({node, ...props}) => <li {...props} className={`marker:text-neon-cyan ${isLight ? "text-slate-600" : "text-white/70"}`} />,
                                                    p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className={`flex gap-4 items-center border rounded-[1.25rem] rounded-tl-sm p-4 shadow-xl ${
                                        isLight ? "bg-white border-black/5" : "bg-[#1e293b]/70 border-white/10"
                                    }`}>
                                        <div className="flex gap-1.5">
                                            <span className="w-2.5 h-2.5 bg-neon-cyan rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                                            <span className="w-2.5 h-2.5 bg-neon-cyan rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                                            <span className="w-2.5 h-2.5 bg-neon-cyan rounded-full animate-bounce shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                                        </div>
                                        <span className={`text-xs tracking-widest uppercase font-semibold ${isLight ? "text-slate-400" : "text-white/50"}`}>Processing</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Quick Actions & Input & Footer */}
                        <div className={`p-5 pt-3 backdrop-blur-3xl space-y-4 z-20 border-t shadow-[0_-10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 ${
                            isLight ? "bg-white/90 border-black/5" : "bg-black/60 border-white/10"
                        }`}>
                            {!isLoading && messages.length <= 2 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-wrap gap-2.5"
                                >
                                    {quickActions.map((action, idx) => (
                                        <motion.button
                                            whileHover={{ scale: 1.05, backgroundColor: isLight ? "rgba(0,255,255,0.1)" : "rgba(0,255,255,0.15)", borderColor: "rgba(0,255,255,0.4)" }}
                                            whileTap={{ scale: 0.95 }}
                                            key={idx}
                                            onClick={() => handleQuickAction(action.query)}
                                            className={`text-xs px-4 py-2 rounded-full border transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5 ${
                                                isLight ? "bg-slate-100 border-black/5 text-slate-600 hover:text-slate-900" : "bg-white/5 border-white/10 text-white/80 hover:text-white"
                                            }`}
                                        >
                                            <Sparkles className="w-3 h-3 text-neon-cyan" />
                                            {action.label}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                            
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative flex items-center gap-2 group"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Message Marwan-AI..."
                                    className={`w-full border rounded-2xl px-5 py-4 text-[15px] focus:outline-none focus:ring-2 pr-14 transition-all shadow-inner group-hover:border-neon-cyan/30 ${
                                        isLight 
                                            ? "bg-slate-50 border-black/10 text-slate-900 placeholder:text-slate-400 focus:border-neon-cyan/60 focus:ring-neon-cyan/10" 
                                            : "bg-[#0f172a]/80 border-white/10 text-white placeholder:text-white/30 focus:border-neon-cyan/60 focus:bg-[#0f172a] focus:ring-neon-cyan/20"
                                    }`}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2.5 p-3 rounded-[14px] bg-gradient-to-r from-neon-purple/80 to-neon-cyan/80 text-white hover:opacity-90 transition-all disabled:opacity-30 disabled:grayscale shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] transform hover:scale-105 active:scale-95"
                                    title="Send Message"
                                >
                                    <Send className="w-4.5 h-4.5" />
                                </button>
                            </form>
                            
                             {/* Footer */}
                             <div className="flex justify-center items-center">
                                 <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5 ${
                                     isLight ? "text-slate-400" : "text-white/30"
                                 }`}>
                                     <Bot className="w-3 h-3" /> Powered by Gemini
                                 </span>
                             </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
                <motion.button
                    onClick={() => {
                        setIsOpen(true);
                        setIsMinimized(false);
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-[68px] h-[68px] rounded-full p-[2px] transition-all z-50 group ${
                        isOpen && !isMinimized ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
                    } ${
                        isLight 
                        ? "bg-gradient-to-br from-neon-purple via-neon-cyan to-indigo-500 shadow-[0_10px_30px_rgba(0,255,255,0.3)]" 
                        : "bg-gradient-to-br from-neon-purple via-black to-neon-cyan shadow-[0_10px_40px_rgba(0,255,255,0.5)]"
                    }`}
                >
                    <div className={`w-full h-full rounded-full flex items-center justify-center relative overflow-hidden transition-all ${
                        isLight ? "bg-white/90 group-hover:bg-white" : "bg-[#0f172a] group-hover:bg-opacity-80"
                    }`}>
                        <div className={`absolute inset-0 bg-gradient-to-tr from-neon-cyan/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <MessageSquare className={`w-8 h-8 relative z-10 transition-colors ${
                            isLight ? "text-slate-800 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]" : "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        }`} />
                        <span className={`absolute top-4 right-4 w-3.5 h-3.5 bg-green-500 rounded-full border-2 shadow-[0_0_15px_rgba(74,222,128,1)] z-20 ${
                            isLight ? "border-white" : "border-[#0f172a]"
                        }`}></span>
                        <span className="absolute top-4 right-4 w-3.5 h-3.5 bg-green-400 rounded-full animate-ping opacity-75 z-20"></span>
                    </div>
                </motion.button>
            </motion.div>
        </div>
    );
}
