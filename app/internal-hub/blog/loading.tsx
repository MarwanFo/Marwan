"use client";

import { BookOpen } from "lucide-react";

export default function BlogLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-3 animate-pulse">
                <div className="p-2 rounded-xl bg-neon-cyan/10">
                    <BookOpen className="w-7 h-7 text-neon-cyan" />
                </div>
                <div className="h-8 w-48 bg-white/10 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass rounded-2xl p-5 animate-pulse flex items-center gap-4">
                        <div className="w-20 h-20 bg-white/10 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-5 bg-white/10 rounded w-2/3" />
                            <div className="h-4 bg-white/10 rounded w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

