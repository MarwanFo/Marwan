"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    LayoutDashboard,
    FolderOpen,
    Briefcase,
    Award,
    User,
    LogOut,
    Menu,
    ChevronRight,
    Settings,
    MessageSquare,
    Sparkles,
    Zap,
    Palette,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";
import SessionGuard from "@/components/SessionGuard";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const navGroups = [
    {
        label: "Content",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
            { name: "Projects", href: "/admin/projects", icon: FolderOpen },
            { name: "Experience", href: "/admin/experiences", icon: Briefcase },
            { name: "Certificates", href: "/admin/certificates", icon: Award },
            { name: "Skills", href: "/admin/skills", icon: Sparkles },
            { name: "Messages", href: "/admin/messages", icon: MessageSquare, badge: true },
        ],
    },
    {
        label: "Customise",
        items: [
            { name: "Hero Section", href: "/admin/hero", icon: Zap },
            { name: "Profile & About", href: "/admin/profile", icon: User },
            { name: "Appearance", href: "/admin/appearance", icon: Palette },
            { name: "Site Settings", href: "/admin/settings", icon: Settings },
        ],
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<{ email?: string } | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        const getUnread = async () => {
            const { count } = await supabase
                .from("messages")
                .select("id", { count: "exact", head: true })
                .eq("read", false);
            setUnreadCount(count || 0);
        };
        getUser();
        getUnread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            await fetch('/api/auth/signout', { method: 'POST' });
            if (typeof window !== 'undefined') {
                window.sessionStorage.clear();
                window.localStorage.clear();
            }
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/admin/login';
        }
    };

    const currentPage = navGroups
        .flatMap(g => g.items)
        .find((item) => item.href === pathname)?.name || "Dashboard";

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <SessionGuard inactivityTimeout={30} warningBeforeSeconds={60}>
            <div className="min-h-screen bg-background flex relative z-10">
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <motion.aside
                    className={`fixed lg:static inset-y-0 left-0 z-50 w-72 glass border-r border-white/10 flex flex-col transition-transform duration-300 overflow-hidden ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
                >
                    <div className="p-6 border-b border-white/10">
                        <Link href="/admin">
                            <Logo size="sm" showText animated />
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                        {navGroups.map((group) => (
                            <div key={group.label}>
                                <p className="text-xs font-semibold uppercase tracking-widest text-white/30 px-4 mb-2">
                                    {group.label}
                                </p>
                                <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const isActive = pathname === item.href;
                                        const showBadge = item.badge && unreadCount > 0;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                                    isActive
                                                        ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                                                        : "text-white/70 hover:bg-white/5 hover:text-white"
                                                }`}
                                            >
                                                <item.icon className="w-5 h-5 shrink-0" />
                                                <span className="font-medium flex-1">{item.name}</span>
                                                {showBadge && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neon-cyan text-background">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                                {isActive && !showBadge && (
                                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* View Portfolio link at bottom of nav */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 px-4 mb-2">Portfolio</p>
                            <a
                                href="/"
                                target="_blank"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all"
                            >
                                <ExternalLink className="w-5 h-5 shrink-0" />
                                <span className="font-medium">View Live Site</span>
                            </a>
                        </div>
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-3">
                            <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center">
                                <User className="w-4 h-4 text-neon-purple" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.email || "Admin"}
                                </p>
                                <p className="text-xs text-white/60">Administrator</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </motion.aside>

                <div className="flex-1 flex flex-col min-h-screen">
                    <header className="glass border-b border-white/10 px-6 py-4 flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <Menu className="w-5 h-5 text-white" />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-white">{currentPage}</h2>
                            <p className="text-sm text-white/60">Manage your portfolio content</p>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                            <ThemeToggle />
                            <Link
                                href="/"
                                target="_blank"
                                className="text-sm text-neon-cyan hover:text-white transition-colors hidden sm:block"
                            >
                                View Portfolio →
                            </Link>
                        </div>
                    </header>

                    <main className="flex-1 p-6 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SessionGuard>
    );
}
