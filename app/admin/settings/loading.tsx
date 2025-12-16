"use client";

import { Settings } from "lucide-react";

export default function SettingsLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 animate-pulse">
                <div className="p-2 rounded-xl bg-neon-cyan/10">
                    <Settings className="w-7 h-7 text-neon-cyan" />
                </div>
                <div className="h-8 w-48 bg-white/10 rounded-lg" />
            </div>
            <div className="glass rounded-2xl p-8 animate-pulse">
                <div className="space-y-6">
                    <div className="h-12 bg-white/10 rounded" />
                    <div className="h-12 bg-white/10 rounded" />
                    <div className="h-12 bg-white/10 rounded" />
                    <div className="h-12 bg-neon-cyan/20 rounded w-32" />
                </div>
            </div>
        </div>
    );
}
