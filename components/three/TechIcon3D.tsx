"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";

interface TechIcon3DProps {
    name: string;
    iconUrl: string;
    websiteUrl?: string;
    position: [number, number, number];
    isHovered: boolean;
    onHover: (name: string | null) => void;
    isDark: boolean;
}

const ICON_SIZE = 2.0;
const CANVAS_SIZE = 256; // higher res for crisp rendering

/** Returns true if an icon URL is intentionally white/monochrome */
function isWhiteIcon(url: string): boolean {
    const lower = url.toLowerCase();
    return (
        lower.includes("/white") ||
        lower.endsWith("/fff") ||
        lower.includes("/ffffff")
    );
}

/**
 * Draws a fallback gradient circle with the first letter of the name.
 */
function drawFallback(
    ctx: CanvasRenderingContext2D,
    size: number,
    name: string
) {
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, "#00ffff");
    grad.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${size * 0.4}px Inter, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name.charAt(0).toUpperCase(), size / 2, size / 2);
}

/**
 * A single tech icon as a billboarded 3D plane with canvas texture.
 * Uses 256Ã—256 canvas for crisp rendering. Includes hover tooltip via Html.
 */
export default function TechIcon3D({
    name,
    iconUrl,
    websiteUrl,
    position,
    isHovered,
    onHover,
    isDark,
}: TechIcon3DProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
    const scaleRef = useRef(ICON_SIZE);

    // Memoize to avoid re-running on every render
    const needsInvert = useMemo(
        () => !isDark && isWhiteIcon(iconUrl),
        [isDark, iconUrl]
    );

    
    useEffect(() => {
        let disposed = false;
        let currentTex: THREE.CanvasTexture | null = null;

        const canvas = document.createElement("canvas");
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        const ctx = canvas.getContext("2d")!;

        const finalize = () => {
            if (disposed) return;
            currentTex = new THREE.CanvasTexture(canvas);
            currentTex.minFilter = THREE.LinearFilter;
            currentTex.magFilter = THREE.LinearFilter;
            currentTex.generateMipmaps = false;
            setTexture(currentTex);
        };

        
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            if (disposed) return;
            ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            const S = CANVAS_SIZE;

            // Glass circle background
            ctx.beginPath();
            ctx.arc(S / 2, S / 2, S / 2 - 4, 0, Math.PI * 2);
            ctx.fillStyle = isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)";
            ctx.fill();

            // Border ring
            ctx.strokeStyle = isDark
                ? "rgba(0, 255, 255, 0.25)"
                : "rgba(8, 145, 178, 0.3)";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw the icon centered
            if (needsInvert) {
                ctx.filter = "brightness(0) saturate(100%)";
            }

            const iconPx = S * 0.5;
            const offset = (S - iconPx) / 2;

            try {
                ctx.drawImage(img, offset, offset, iconPx, iconPx);
            } catch {
                // Canvas tainted â€” draw fallback
                drawFallback(ctx, S, name);
            }

            ctx.filter = "none";
            finalize();
        };

        img.onerror = () => {
            if (disposed) return;
            drawFallback(ctx, CANVAS_SIZE, name);
            finalize();
        };

        // Force the SVG to load at a higher resolution by appending size params
        // SimpleIcons CDN supports ?size=N for rasterization hint
        let loadUrl = iconUrl;
        if (
            iconUrl.includes("simpleicons.org") &&
            !iconUrl.includes("?size=")
        ) {
            loadUrl += (iconUrl.includes("?") ? "&" : "?") + "size=128";
        }
        img.src = loadUrl;

        return () => {
            disposed = true;
            currentTex?.dispose();
        };
    }, [iconUrl, isDark, name, needsInvert]);

    
    useFrame(() => {
        if (!meshRef.current) return;
        const target = isHovered ? ICON_SIZE * 1.4 : ICON_SIZE;
        scaleRef.current += (target - scaleRef.current) * 0.12;
        meshRef.current.scale.setScalar(scaleRef.current);
    });

    if (!texture) return null;

    return (
        <group position={position}>
            <Billboard follow lockX={false} lockY={false} lockZ={false}>
                <mesh
                    ref={meshRef}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        onHover(name);
                        document.body.style.cursor = "pointer";
                    }}
                    onPointerOut={() => {
                        onHover(null);
                        document.body.style.cursor = "auto";
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (websiteUrl) window.open(websiteUrl, "_blank");
                    }}
                >
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial
                        map={texture}
                        transparent
                        opacity={isHovered ? 1 : 0.88}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </Billboard>
        </group>
    );
}
