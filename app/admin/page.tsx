import { createClient } from "@/lib/supabase/server";
import {
    FolderOpen,
    Briefcase,
    Award,
    TrendingUp,
    Clock,
    AlertCircle,
    Sparkles,
    MessageSquare,
    Zap,
    Palette,
    User,
    Settings,
    Mail,
    ArrowRight,
    CheckCircle,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    let counts = {
        projects: 0,
        experiences: 0,
        certificates: 0,
        skills: 0,
        messages: 0,
        unread: 0,
    };
    let recentMessages: { id: string; name: string; email: string; message: string; created_at: string; read: boolean }[] = [];
    let error: string | null = null;

    try {
        const supabase = await createClient();

        const [
            projectsRes,
            experiencesRes,
            certificatesRes,
            skillsRes,
            messagesRes,
            unreadRes,
            recentRes,
        ] = await Promise.all([
            supabase.from("projects").select("id", { count: "exact", head: true }),
            supabase.from("experiences").select("id", { count: "exact", head: true }),
            supabase.from("certificates").select("id", { count: "exact", head: true }),
            supabase.from("skills").select("id", { count: "exact", head: true }),
            supabase.from("messages").select("id", { count: "exact", head: true }),
            supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
            supabase.from("messages")
                .select("id, name, email, message, created_at, read")
                .order("created_at", { ascending: false })
                .limit(3),
        ]);

        counts = {
            projects: projectsRes.count || 0,
            experiences: experiencesRes.count || 0,
            certificates: certificatesRes.count || 0,
            skills: skillsRes.count || 0,
            messages: messagesRes.count || 0,
            unread: unreadRes.count || 0,
        };
        recentMessages = recentRes.data || [];
    } catch (e) {
        console.error("[Dashboard] DB fetch error");
        error = "Failed to connect to database. Please check your Supabase configuration.";
    }

    const statCards = [
        { name: "Projects", count: counts.projects, icon: FolderOpen, href: "/admin/projects", color: "text-neon-cyan", bg: "bg-neon-cyan/10", border: "border-neon-cyan/30" },
        { name: "Experiences", count: counts.experiences, icon: Briefcase, href: "/admin/experiences", color: "text-neon-purple", bg: "bg-neon-purple/10", border: "border-neon-purple/30" },
        { name: "Certificates", count: counts.certificates, icon: Award, href: "/admin/certificates", color: "text-neon-magenta", bg: "bg-neon-magenta/10", border: "border-neon-magenta/30" },
        { name: "Skills", count: counts.skills, icon: Sparkles, href: "/admin/skills", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
        {
            name: "Messages",
            count: counts.messages,
            icon: MessageSquare,
            href: "/admin/messages",
            color: "text-green-400",
            bg: "bg-green-400/10",
            border: "border-green-400/30",
            badge: counts.unread > 0 ? `${counts.unread} new` : null,
        },
    ];

    const contentActions = [
        { name: "Add Project", href: "/admin/projects", icon: FolderOpen, color: "text-neon-cyan" },
        { name: "Add Experience", href: "/admin/experiences", icon: Briefcase, color: "text-neon-purple" },
        { name: "Add Certificate", href: "/admin/certificates", icon: Award, color: "text-neon-magenta" },
        { name: "Add Skill", href: "/admin/skills", icon: Sparkles, color: "text-yellow-400" },
    ];

    const customiseActions = [
        { name: "Edit Hero", href: "/admin/hero", icon: Zap, color: "text-neon-cyan" },
        { name: "Edit Profile", href: "/admin/profile", icon: User, color: "text-neon-purple" },
        { name: "Social Links", href: "/admin/appearance", icon: Palette, color: "text-neon-magenta" },
        { name: "Site Settings", href: "/admin/settings", icon: Settings, color: "text-white/60" },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Welcome back! 👋</h1>
                        <p className="text-white/60">Your portfolio control center — manage everything from here.</p>
                    </div>
                    <Link
                        href="/"
                        target="_blank"
                        className="text-sm text-neon-cyan hover:text-white transition-colors flex items-center gap-1"
                    >
                        View Live Site <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="glass rounded-2xl p-6 border border-red-500/30 bg-red-500/10">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-red-400">Database Connection Error</h3>
                            <p className="text-white/60 text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Content Overview
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {statCards.map((stat) => (
                        <Link
                            key={stat.name}
                            href={stat.href}
                            className={`glass rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 group border ${stat.border} relative overflow-hidden`}
                        >
                            {stat.badge && (
                                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold bg-neon-cyan text-background">
                                    {stat.badge}
                                </span>
                            )}
                            <div className={`p-2.5 rounded-xl ${stat.bg} w-fit mb-3`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.count}</h3>
                            <p className="text-white/60 text-sm">{stat.name}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Actions — two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Content */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-neon-cyan" />
                        Add Content
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {contentActions.map((action) => (
                            <Link
                                key={action.name}
                                href={action.href}
                                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
                            >
                                <action.icon className={`w-5 h-5 ${action.color}`} />
                                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">{action.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Customise */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-neon-purple" />
                        Customise Portfolio
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {customiseActions.map((action) => (
                            <Link
                                key={action.name}
                                href={action.href}
                                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
                            >
                                <action.icon className={`w-5 h-5 ${action.color}`} />
                                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">{action.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Messages */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-green-400" />
                        Recent Messages
                        {counts.unread > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neon-cyan text-background">
                                {counts.unread} unread
                            </span>
                        )}
                    </h2>
                    <Link href="/admin/messages" className="text-sm text-neon-cyan hover:text-white transition-colors flex items-center gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {recentMessages.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageSquare className="w-10 h-10 text-white/20 mx-auto mb-3" />
                        <p className="text-white/40 text-sm">No messages yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentMessages.map((msg) => (
                            <Link
                                key={msg.id}
                                href="/admin/messages"
                                className={`flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border ${
                                    !msg.read ? "border-neon-cyan/30 border-l-2 border-l-neon-cyan" : "border-white/10"
                                }`}
                            >
                                <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center shrink-0 text-sm font-bold text-neon-purple">
                                    {msg.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white text-sm">{msg.name}</span>
                                        {!msg.read && <span className="w-2 h-2 rounded-full bg-neon-cyan shrink-0" />}
                                        <span className="text-white/40 text-xs ml-auto">
                                            {new Date(msg.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-white/50 text-sm truncate">{msg.message}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Checklist */}
            <div className="glass rounded-2xl p-6 border border-neon-purple/20">
                <h2 className="text-lg font-semibold text-white mb-4">✅ Portfolio Completion Checklist</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {[
                        { label: "Hero name & title set", done: true, href: "/admin/hero" },
                        { label: "Profile photo uploaded", done: true, href: "/admin/profile" },
                        { label: "Social links added", done: false, href: "/admin/appearance" },
                        { label: "At least 1 project", done: counts.projects > 0, href: "/admin/projects" },
                        { label: "At least 1 experience", done: counts.experiences > 0, href: "/admin/experiences" },
                        { label: "At least 1 certificate", done: counts.certificates > 0, href: "/admin/certificates" },
                        { label: "Skills added", done: counts.skills > 0, href: "/admin/skills" },
                        { label: "Contact email set", done: false, href: "/admin/settings" },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <CheckCircle className={`w-5 h-5 shrink-0 ${item.done ? "text-green-400" : "text-white/20"}`} />
                            <span className={item.done ? "text-white/70" : "text-white/40"}>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
