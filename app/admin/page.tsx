import { createClient } from "@/lib/supabase/server";
import { FolderOpen, Briefcase, Award, Eye, TrendingUp, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering for cookie-based auth
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    let stats = [
        { name: "Projects", count: 0, icon: FolderOpen, href: "/admin/projects", color: "text-neon-cyan", bgColor: "bg-neon-cyan/10" },
        { name: "Experiences", count: 0, icon: Briefcase, href: "/admin/experiences", color: "text-neon-purple", bgColor: "bg-neon-purple/10" },
        { name: "Certificates", count: 0, icon: Award, href: "/admin/certificates", color: "text-neon-magenta", bgColor: "bg-neon-magenta/10" },
    ];

    let error = null;

    try {
        const supabase = await createClient();

        // Fetch counts for each section
        const [projectsResult, experiencesResult, certificatesResult] = await Promise.all([
            supabase.from("projects").select("id", { count: "exact", head: true }),
            supabase.from("experiences").select("id", { count: "exact", head: true }),
            supabase.from("certificates").select("id", { count: "exact", head: true }),
        ]);

        stats = [
            {
                name: "Projects",
                count: projectsResult.count || 0,
                icon: FolderOpen,
                href: "/admin/projects",
                color: "text-neon-cyan",
                bgColor: "bg-neon-cyan/10",
            },
            {
                name: "Experiences",
                count: experiencesResult.count || 0,
                icon: Briefcase,
                href: "/admin/experiences",
                color: "text-neon-purple",
                bgColor: "bg-neon-purple/10",
            },
            {
                name: "Certificates",
                count: certificatesResult.count || 0,
                icon: Award,
                href: "/admin/certificates",
                color: "text-neon-magenta",
                bgColor: "bg-neon-magenta/10",
            },
        ];
    } catch (e) {
        console.error("Error fetching dashboard data:", e);
        error = "Failed to connect to database. Please check your Supabase configuration.";
    }

    const quickActions = [
        { name: "Add New Project", href: "/admin/projects?action=new", icon: FolderOpen },
        { name: "Add Experience", href: "/admin/experiences?action=new", icon: Briefcase },
        { name: "Add Certificate", href: "/admin/certificates?action=new", icon: Award },
        { name: "Edit Profile", href: "/admin/profile", icon: Eye },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="glass rounded-2xl p-6">
                <h1 className="text-2xl font-bold text-white mb-2">
                    Welcome back! 👋
                </h1>
                <p className="text-white/60">
                    Here&apos;s an overview of your portfolio content. Manage your projects,
                    experiences, and certificates from the sidebar.
                </p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="glass rounded-2xl p-6 border border-red-500/30 bg-red-500/10">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                        <div>
                            <h3 className="font-semibold text-red-400">Database Connection Error</h3>
                            <p className="text-white/60 text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Link
                        key={stat.name}
                        href={stat.href}
                        className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <TrendingUp className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.count}</h3>
                        <p className="text-white/60">{stat.name}</p>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-neon-cyan" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.name}
                            href={action.href}
                            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon-cyan/30 transition-all duration-300"
                        >
                            <action.icon className="w-5 h-5 text-neon-cyan" />
                            <span className="text-white/80 text-sm font-medium">{action.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Info Box */}
            <div className="glass rounded-2xl p-6 border border-neon-purple/30">
                <h2 className="text-lg font-semibold text-white mb-2">💡 Getting Started</h2>
                <p className="text-white/60 text-sm mb-4">
                    Make sure you&apos;ve set up your Supabase database with the required tables.
                    You can find the SQL schema in the implementation plan.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-cyan" />
                        Create tables: profile, projects, experiences, certificates
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-purple" />
                        Enable Row Level Security (RLS) for each table
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-magenta" />
                        Add your first content items from the sidebar
                    </li>
                </ul>
            </div>
        </div>
    );
}
