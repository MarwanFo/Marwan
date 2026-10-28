"use client";

import { User } from "lucide-react";

export default function ProfileLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 animate-pulse">
                <div className="p-2 rounded-xl bg-neon-purple/10">
                    <User className="w-7 h-7 text-neon-purple" />
                </div>
                <div className="h-8 w-48 bg-white/10 rounded-lg" />
            </div>
            <div className="glass rounded-2xl p-8 animate-pulse">
                <div className="flex gap-6 mb-6">
                    <div className="w-24 h-24 bg-white/10 rounded-2xl" />
                    <div className="flex-1">
                        <div className="h-8 bg-white/10 rounded w-1/3 mb-3" />
                        <div className="h-6 bg-white/10 rounded w-1/4" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="h-12 bg-white/10 rounded" />
                    <div className="h-12 bg-white/10 rounded" />
                    <div className="h-24 bg-white/10 rounded" />
                </div>
            </div>
        </div>
    );
}
