"use client";

import { Briefcase } from "lucide-react";

export default function ExperiencesLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 animate-pulse">
                <div className="p-2 rounded-xl bg-neon-purple/10">
                    <Briefcase className="w-7 h-7 text-neon-purple" />
                </div>
                <div className="h-8 w-48 bg-white/10 rounded-lg" />
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl" />
                            <div className="flex-1">
                                <div className="h-6 bg-white/10 rounded w-1/2 mb-2" />
                                <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
                                <div className="h-4 bg-white/10 rounded w-3/4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
