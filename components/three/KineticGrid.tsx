"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const GRID_SIZE = 40;
const TOTAL_POINTS = GRID_SIZE * GRID_SIZE;
const SPACING = 2.5;
const HALF = (GRID_SIZE * SPACING) / 2;

// Vertex shader: handles wave animation + mouse repulsion on the GPU
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseRadius;

  attribute float aRandom;

  varying float vDistance;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Gentle wave animation
    float wave = sin(pos.x * 0.15 + uTime * 0.8) * cos(pos.y * 0.15 + uTime * 0.6) * 2.0;
    pos.z += wave;

    // Mouse influence: push points away from cursor
    vec2 toMouse = pos.xy - uMouse;
    float dist = length(toMouse);
    float influence = smoothstep(uMouseRadius, 0.0, dist);

    // Push away from mouse with organic curve
    pos.xy += normalize(toMouse + 0.001) * influence * 8.0;
    pos.z += influence * 12.0;

    // Subtle floating based on unique random seed
    pos.z += sin(uTime * 0.5 + aRandom * 6.28) * 0.8;

    vDistance = dist;
    vAlpha = 1.0 - smoothstep(0.0, HALF_SIZE, length(pos.xy));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = max(1.5, 3.5 * (1.0 / -mvPosition.z) * 50.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment shader: neon dot with glow falloff
const fragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;
  uniform float uOpacity;

  varying float vDistance;
  varying float vAlpha;

  void main() {
    // Circular point shape
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    // Soft glow falloff
    float glow = 1.0 - smoothstep(0.0, 0.5, d);
    glow = pow(glow, 1.5);

    // Color gradient based on distance from mouse
    float colorMix = smoothstep(0.0, 30.0, vDistance);
    vec3 color = mix(uColorA, uColorB, colorMix);

    // Pulse effect
    float pulse = 0.7 + 0.3 * sin(uTime * 1.5);

    gl_FragColor = vec4(color, glow * vAlpha * pulse * uOpacity);
  }
`;

// Theme-specific color palettes
const THEME_COLORS = {
    dark: {
        colorA: "#00ffff", // Neon Cyan
        colorB: "#8b5cf6", // Purple
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
    },
    light: {
        colorA: "#0891b2", // Deep Teal (visible on white)
        colorB: "#7c3aed", // Deep Purple
        opacity: 0.45,
        blending: THREE.NormalBlending,
    },
};

interface KineticGridProps {
    theme: "dark" | "light";
}

export default function KineticGrid({ theme }: KineticGridProps) {
    const meshRef = useRef<THREE.Points>(null);
    const { viewport } = useThree();
    const colors = THEME_COLORS[theme];

    // Mouse position in world space
    const mouse = useRef(new THREE.Vector2(9999, 9999));

    // Generate grid positions + random seeds
    const { positions, randoms } = useMemo(() => {
        const pos = new Float32Array(TOTAL_POINTS * 3);
        const rnd = new Float32Array(TOTAL_POINTS);

        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const idx = (i * GRID_SIZE + j) * 3;
                pos[idx] = i * SPACING - HALF;
                pos[idx + 1] = j * SPACING - HALF;
                pos[idx + 2] = 0;
                rnd[i * GRID_SIZE + j] = Math.random();
            }
        }

        return { positions: pos, randoms: rnd };
    }, []);

    // Shader uniforms
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(9999, 9999) },
            uMouseRadius: { value: 15.0 },
            uColorA: { value: new THREE.Color(colors.colorA) },
            uColorB: { value: new THREE.Color(colors.colorB) },
            uOpacity: { value: colors.opacity },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // Update colors when theme changes
    useEffect(() => {
        if (!meshRef.current) return;
        const mat = meshRef.current.material as THREE.ShaderMaterial;
        mat.uniforms.uColorA.value.set(colors.colorA);
        mat.uniforms.uColorB.value.set(colors.colorB);
        mat.uniforms.uOpacity.value = colors.opacity;
        mat.blending = colors.blending;
        mat.needsUpdate = true;
    }, [colors]);

    // Track mouse in normalized device coordinates
    const handlePointerMove = useCallback(
        (e: PointerEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouse.current.set(x * viewport.width * 0.5, y * viewport.height * 0.5);
        },
        [viewport]
    );

    // Attach global pointer listener
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("pointermove", handlePointerMove, { passive: true });
        }
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("pointermove", handlePointerMove);
            }
        };
    }, [handlePointerMove]);

    // Animation loop (runs every frame)
    useFrame((_, delta) => {
        if (!meshRef.current) return;
        const mat = meshRef.current.material as THREE.ShaderMaterial;
        mat.uniforms.uTime.value += delta;
        mat.uniforms.uMouse.value.lerp(mouse.current, 0.08);
    });

    // Inject HALF_SIZE as a define so the shader can reference grid size
    const defines = useMemo(() => ({ HALF_SIZE: HALF.toFixed(1) }), []);

    return (
        <points ref={meshRef} frustumCulled={false}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={TOTAL_POINTS}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aRandom"
                    count={TOTAL_POINTS}
                    array={randoms}
                    itemSize={1}
                />
            </bufferGeometry>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                defines={defines}
                transparent
                depthWrite={false}
                blending={colors.blending}
            />
        </points>
    );
}
