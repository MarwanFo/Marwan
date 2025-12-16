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
    X,
    ChevronRight,
    Settings,
    MessageSquare,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import SessionGuard from "@/components/SessionGuard";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: FolderOpen },
    { name: "Experience", href: "/admin/experiences", icon: Briefcase },
    { name: "Certificates", href: "/admin/certificates", icon: Award },
    { name: "Skills", href: "/admin/skills", icon: Sparkles },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<{ email?: string } | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, [supabase.auth]);

    const handleLogout = async () => {
        try {
            // Sign out on client
            await supabase.auth.signOut();

            // Call server-side signout to clear cookies
            await fetch('/api/auth/signout', { method: 'POST' });

            // Clear all local storage
            if (typeof window !== 'undefined') {
                window.sessionStorage.clear();
                window.localStorage.clear();
            }

            // Hard redirect to login
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Force redirect anyway
            window.location.href = '/admin/login';
        }
    };

    // Get current page title
    const currentPage = navItems.find((item) => item.href === pathname)?.name || "Dashboard";

    // Don't show admin layout on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <SessionGuard inactivityTimeout={30} warningBeforeSeconds={60}>
            <div className="min-h-screen bg-background flex">
                {/* Sidebar Backdrop (Mobile) */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <motion.aside
                    className={`fixed lg:static inset-y-0 left-0 z-50 w-72 glass border-r border-white/10 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    {/* Logo */}
                    <div className="p-6 border-b border-white/10">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-neon-gradient flex items-center justify-center text-background font-bold">
                                M
                            </div>
                            <div>
                                <h1 className="font-bold text-white">Admin Panel</h1>
                                <p className="text-xs text-white/60">Portfolio Manager</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                                        : "text-white/70 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                    {isActive && (
                                        <ChevronRight className="w-4 h-4 ml-auto" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
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

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Top Bar */}
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
                        <div className="ml-auto">
                            <Link
                                href="/"
                                target="_blank"
                                className="text-sm text-neon-cyan hover:text-white transition-colors"
                            >
                                View Portfolio →
                            </Link>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 p-6 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SessionGuard>
    );
}
