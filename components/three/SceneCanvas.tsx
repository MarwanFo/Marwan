"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { Suspense, memo } from "react";
import KineticGrid from "./KineticGrid";
import FloatingGeometry from "./FloatingGeometry";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

interface SceneCanvasProps {
    theme: "dark" | "light";
}

/**
 * The global 3D background canvas.
 * Renders behind all DOM content at z-index: 0.
 * Adapts colors and intensity based on the current theme.
 */
function SceneCanvas({ theme }: SceneCanvasProps) {
    const isDark = theme === "dark";

    return (
        <div
            id="three-canvas"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0,
                pointerEvents: "none",
                opacity: isDark ? 1 : 0.5,
                transition: "opacity 0.5s ease",
            }}
        >
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 50], fov: 60, near: 0.1, far: 200 }}
                gl={{
                    antialias: false,
                    alpha: true,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: false,
                }}
                style={{ background: "transparent" }}
            >
                <AdaptiveDpr pixelated />
                <AdaptiveEvents />

                <Suspense fallback={null}>
                    <ambientLight intensity={isDark ? 0.15 : 0.3} />

                    <KineticGrid theme={theme} />
                    <FloatingGeometry theme={theme} />

                    <EffectComposer multisampling={0}>
                        <Bloom
                            luminanceThreshold={isDark ? 0.2 : 0.6}
                            luminanceSmoothing={0.9}
                            intensity={isDark ? 1.5 : 0.6}
                            mipmapBlur
                        />
                    </EffectComposer>

                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}

export default memo(SceneCanvas);
