"use client";

import { Sparkles } from "lucide-react";

export default function SkillsLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 animate-pulse">
                <div className="p-2 rounded-xl bg-neon-cyan/10">
                    <Sparkles className="w-7 h-7 text-neon-cyan" />
                </div>
                <div className="h-8 w-48 bg-white/10 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="glass rounded-xl p-4 animate-pulse">
                        <div className="h-12 w-12 bg-white/10 rounded-xl mx-auto mb-3" />
                        <div className="h-4 bg-white/10 rounded w-3/4 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}
