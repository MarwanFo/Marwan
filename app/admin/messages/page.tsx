"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
    MessageSquare,
    Mail,
    User,
    Calendar,
    Trash2,
    Eye,
    EyeOff,
    Check,
    X,
    RefreshCw,
} from "lucide-react";

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
    created_at: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("messages")
                .select("id, name, email, message, read, created_at")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("[Messages] Fetch error");
            }

            if (data) {
                setMessages(data);
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string, read: boolean) => {
        await supabase.from("messages").update({ read }).eq("id", id);
        setMessages(messages.map(m => m.id === id ? { ...m, read } : m));
        if (selectedMessage?.id === id) {
            setSelectedMessage({ ...selectedMessage, read });
        }
    };

    const deleteMessage = async (id: string) => {
        setDeleting(id);
        await supabase.from("messages").delete().eq("id", id);
        setMessages(messages.filter(m => m.id !== id));
        if (selectedMessage?.id === id) {
            setSelectedMessage(null);
        }
        setDeleting(null);
    };

    const unreadCount = messages.filter(m => !m.read).length;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <MessageSquare className="w-7 h-7 text-neon-cyan" />
                        Contact Messages
                        {unreadCount > 0 && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-neon-cyan/20 text-neon-cyan">
                                {unreadCount} new
                            </span>
                        )}
                    </h1>
                    <p className="text-white/60">Messages from your portfolio contact form</p>
                </div>
                <motion.button
                    onClick={fetchMessages}
                    className="p-2 rounded-xl glass hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <RefreshCw className="w-5 h-5 text-white/60" />
                </motion.button>
            </div>

            {messages.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
                    <p className="text-white/60">
                        When visitors send you a message through your contact form, they&apos;ll appear here.
                    </p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Messages List */}
                    <div className="lg:col-span-1 space-y-3">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`glass rounded-xl p-4 cursor-pointer transition-all ${selectedMessage?.id === msg.id
                                    ? "ring-2 ring-neon-cyan/50 bg-white/10"
                                    : "hover:bg-white/5"
                                    } ${!msg.read ? "border-l-4 border-neon-cyan" : ""}`}
                                onClick={() => {
                                    setSelectedMessage(msg);
                                    if (!msg.read) markAsRead(msg.id, true);
                                }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-neon-purple" />
                                        <span className={`font-medium ${!msg.read ? "text-white" : "text-white/80"}`}>
                                            {msg.name}
                                        </span>
                                    </div>
                                    {!msg.read && (
                                        <span className="w-2 h-2 rounded-full bg-neon-cyan" />
                                    )}
                                </div>
                                <p className="text-white/50 text-sm truncate mb-2">{msg.message}</p>
                                <div className="flex items-center gap-2 text-xs text-white/40">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(msg.created_at)}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Message Detail */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {selectedMessage ? (
                                <motion.div
                                    key={selectedMessage.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass rounded-2xl p-6"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-white mb-1">
                                                {selectedMessage.name}
                                            </h2>
                                            <a
                                                href={`mailto:${selectedMessage.email}`}
                                                className="flex items-center gap-2 text-neon-cyan hover:underline"
                                            >
                                                <Mail className="w-4 h-4" />
                                                {selectedMessage.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                onClick={() => markAsRead(selectedMessage.id, !selectedMessage.read)}
                                                className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                title={selectedMessage.read ? "Mark as unread" : "Mark as read"}
                                            >
                                                {selectedMessage.read ? (
                                                    <EyeOff className="w-4 h-4 text-white/60" />
                                                ) : (
                                                    <Eye className="w-4 h-4 text-neon-cyan" />
                                                )}
                                            </motion.button>
                                            <motion.button
                                                onClick={() => deleteMessage(selectedMessage.id)}
                                                disabled={deleting === selectedMessage.id}
                                                className="p-2 rounded-lg glass hover:bg-red-500/20 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {deleting === selectedMessage.id ? (
                                                    <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>

                                    <div className="text-white/40 text-sm mb-4 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Received on {formatDate(selectedMessage.created_at)}
                                    </div>

                                    <div className="glass rounded-xl p-4 bg-white/5">
                                        <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
                                            {selectedMessage.message}
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        <motion.a
                                            href={`mailto:${selectedMessage.email}?subject=Re: Message from your portfolio`}
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-gradient text-background font-semibold"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Mail className="w-5 h-5" />
                                            Reply via Email
                                        </motion.a>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="glass rounded-2xl p-12 text-center"
                                >
                                    <Mail className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/60">Select a message to view its details</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
