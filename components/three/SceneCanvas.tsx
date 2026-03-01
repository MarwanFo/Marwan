"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { Suspense, memo } from "react";
import KineticGrid from "./KineticGrid";
import FloatingGeometry from "./FloatingGeometry";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

/**
 * The global 3D background canvas.
 * Renders behind all DOM content at z-index: 0.
 * Uses AdaptiveDpr + AdaptiveEvents for mobile performance.
 */
function SceneCanvas() {
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
                    {/* Ambient light for subtle base illumination */}
                    <ambientLight intensity={0.15} />

                    {/* The kinetic particle grid */}
                    <KineticGrid />

                    {/* Floating neon geometry */}
                    <FloatingGeometry />

                    {/* Post-processing: Selective Bloom for neon glow */}
                    <EffectComposer multisampling={0}>
                        <Bloom
                            luminanceThreshold={0.2}
                            luminanceSmoothing={0.9}
                            intensity={1.5}
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
