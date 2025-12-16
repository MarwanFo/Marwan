"use client";

export default function AdminLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-10 h-10 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Loading...</p>
        </div>
    );
}
