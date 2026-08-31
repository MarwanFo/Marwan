"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, AlertCircle, ShieldAlert } from "lucide-react";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [lockoutSeconds, setLockoutSeconds] = useState(0);
    const router = useRouter();

    // Countdown timer for client-side lockout display
    useEffect(() => {
        if (lockoutSeconds <= 0) return;
        const timer = setTimeout(() => setLockoutSeconds((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [lockoutSeconds]);

    const isLockedOut = lockoutSeconds > 0;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLockedOut) return;

        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 429) {
                setError("Too many login attempts. Please wait before trying again.");
                setLockoutSeconds(LOCKOUT_SECONDS);
                return;
            }

            if (!res.ok) {
                // Always the SAME generic message — no user enumeration
                const newAttempts = attempts + 1;
                setAttempts(newAttempts);

                if (newAttempts >= MAX_ATTEMPTS) {
                    setLockoutSeconds(LOCKOUT_SECONDS);
                    setError(
                        `Too many failed attempts. Please wait ${LOCKOUT_SECONDS}s before trying again.`
                    );
                } else {
                    setError(
                        `Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts === 1 ? "" : "s"} remaining.`
                    );
                }
                return;
            }

            // Success — middleware will validate the session on redirect
            setAttempts(0);
            router.push("/admin");
            router.refresh();
        } catch {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-background">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="glass rounded-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold neon-text mb-2">Admin Login</h1>
                        <p className="text-white/60">Sign in to manage your portfolio</p>
                    </div>

                    {/* Lockout Banner */}
                    {isLockedOut && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mb-6"
                        >
                            <ShieldAlert className="w-5 h-5 shrink-0" />
                            <span className="text-sm">
                                Account temporarily locked. Try again in{" "}
                                <strong>{lockoutSeconds}s</strong>.
                            </span>
                        </motion.div>
                    )}

                    {/* Error Message */}
                    {error && !isLockedOut && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-6"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span className="text-sm">{error}</span>
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    disabled={isLockedOut}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl glass bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all duration-300 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    disabled={isLockedOut}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl glass bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all duration-300 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading || isLockedOut}
                            className="w-full py-4 rounded-xl bg-neon-gradient text-background font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: isLockedOut ? 1 : 1.02 }}
                            whileTap={{ scale: isLockedOut ? 1 : 0.98 }}
                        >
                            {loading ? (
                                <motion.div
                                    className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            ) : isLockedOut ? (
                                <>
                                    <ShieldAlert className="w-5 h-5" />
                                    <span>Locked ({lockoutSeconds}s)</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Back to Portfolio Link */}
                    <div className="mt-6 text-center">
                        <a
                            href="/"
                            className="text-sm text-white/60 hover:text-neon-cyan transition-colors"
                        >
                            ← Back to Portfolio
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
