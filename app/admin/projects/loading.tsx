"use client";

import { FolderOpen } from "lucide-react";

export default function ProjectsLoading() {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3 animate-pulse">
                <div className="p-2 rounded-xl bg-neon-cyan/10">
                    <FolderOpen className="w-7 h-7 text-neon-cyan" />
                </div>
                <div className="h-8 w-48 bg-white/10 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="glass rounded-2xl p-4 animate-pulse">
                        <div className="h-40 bg-white/10 rounded-xl mb-4" />
                        <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-white/10 rounded w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
