"use client";

import { MessageSquare } from "lucide-react";

export default function MessagesLoading() {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3 animate-pulse">
                <div className="p-2 rounded-xl bg-neon-cyan/10">
                    <MessageSquare className="w-7 h-7 text-neon-cyan" />
                </div>
                <div className="h-8 w-48 bg-white/10 rounded-lg" />
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="glass rounded-xl p-4 animate-pulse">
                            <div className="h-5 bg-white/10 rounded w-1/2 mb-2" />
                            <div className="h-4 bg-white/10 rounded w-3/4" />
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-2">
                    <div className="glass rounded-2xl p-6 animate-pulse">
                        <div className="h-8 bg-white/10 rounded w-1/3 mb-4" />
                        <div className="h-32 bg-white/10 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}
