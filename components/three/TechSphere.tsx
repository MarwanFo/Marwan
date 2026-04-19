"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, AdaptiveDpr } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import TechSphereScene from "./TechSphereScene";

// Ã¢â€â‚¬Ã¢â€â‚¬ Types Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
interface Skill {
    id: string;
    name: string;
    icon_url: string;
    website_url?: string;
}

interface TechSphereProps {
    skills: Skill[];
    theme: "dark" | "light";
}

/**
 * Canvas wrapper for the atom-style orbital tech display.
 * Includes a DOM-based tooltip that follows the mouse cursor Ã¢â‚¬â€
 * rendered OUTSIDE the canvas for reliable display.
 */
export default function TechSphere({ skills, theme }: TechSphereProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const isDark = theme === "dark";

    // Find the hovered skill's data for icon URL
    const hoveredData = hoveredSkill
        ? skills.find((s) => s.name === hoveredSkill)
        : null;

    // Track mouse position relative to the container
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => el.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "520px",
                position: "relative",
                touchAction: "pan-y",
            }}
        >
            <Canvas
                camera={{ position: [0, 4, 20], fov: 50 }}
                dpr={[1, 1.5]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    stencil: false,
                }}
                style={{ background: "transparent" }}
            >
                <AdaptiveDpr pixelated />

                <Suspense fallback={null}>
                    <ambientLight intensity={0.6} />
                    <pointLight position={[15, 15, 15]} intensity={0.3} />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate={false}
                        minPolarAngle={Math.PI / 6}
                        maxPolarAngle={(Math.PI * 5) / 6}
                        makeDefault
                        enableDamping
                        dampingFactor={0.05}
                    />

                    <TechSphereScene
                        skills={skills}
                        theme={theme}
                        onHover={setHoveredSkill}
                    />

                    <Preload all />
                </Suspense>
            </Canvas>

            {/* Ã¢â€â‚¬Ã¢â€â‚¬ DOM Tooltip Ã¢â‚¬â€ rendered OUTSIDE the canvas Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
            {hoveredSkill && hoveredData && (
                <div
                    style={{
                        position: "absolute",
                        left: `${mousePos.x}px`,
                        top: `${mousePos.y - 16}px`,
                        transform: "translate(-50%, -100%)",
                        pointerEvents: "none",
                        zIndex: 50,
                        animation: "techTooltipIn 0.2s ease-out",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 16px",
                            borderRadius: "14px",
                            fontFamily: "var(--font-inter), Inter, sans-serif",
                            background: isDark
                                ? "rgba(8, 10, 18, 0.92)"
                                : "rgba(255, 255, 255, 0.96)",
                            backdropFilter: "blur(16px)",
                            WebkitBackdropFilter: "blur(16px)",
                            border: `1px solid ${
                                isDark
                                    ? "rgba(0, 255, 255, 0.25)"
                                    : "rgba(8, 145, 178, 0.2)"
                            }`,
                            whiteSpace: "nowrap",
                            boxShadow: isDark
                                ? "0 0 30px rgba(0, 255, 255, 0.12), 0 8px 32px rgba(0, 0, 0, 0.5)"
                                : "0 8px 32px rgba(0, 0, 0, 0.12)",
                        }}
                    >
                        {/* Mini icon */}
                        <div
                            style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "8px",
                                background: isDark
                                    ? "rgba(0, 255, 255, 0.1)"
                                    : "rgba(8, 145, 178, 0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                                <Image
                                    src={hoveredData.icon_url}
                                    alt={hoveredData.name}
                                    fill
                                    style={{ objectFit: "contain" }}
                                    draggable={false}
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Text */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span
                                style={{
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    color: isDark ? "#fff" : "#0f172a",
                                    letterSpacing: "0.01em",
                                }}
                            >
                                {hoveredSkill}
                            </span>
                            {hoveredData.website_url && (
                                <span
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: 500,
                                        color: isDark
                                            ? "rgba(0, 255, 255, 0.6)"
                                            : "rgba(8, 145, 178, 0.7)",
                                        letterSpacing: "0.04em",
                                    }}
                                >
                                    Click to explore →
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Neon accent dot */}
                    <div
                        style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: isDark ? "#00ffff" : "#0891b2",
                            margin: "4px auto 0",
                            boxShadow: isDark
                                ? "0 0 8px rgba(0, 255, 255, 0.4)"
                                : "0 0 6px rgba(8, 145, 178, 0.3)",
                        }}
                    />
                </div>
            )}

            {/* Interaction hint */}
            <div
                style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "12px",
                    color: isDark
                        ? "rgba(255,255,255,0.35)"
                        : "rgba(15,23,42,0.4)",
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    letterSpacing: "0.05em",
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            >
                🖱️ Drag to orbit • Hover for details
            </div>

            {/* Tooltip animation */}
            <style>{`
                @keyframes techTooltipIn {
                    from { opacity: 0; transform: translate(-50%, -90%) scale(0.92); }
                    to { opacity: 1; transform: translate(-50%, -100%) scale(1); }
                }
            `}</style>
        </div>
    );
}
