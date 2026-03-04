"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import TechIcon3D from "./TechIcon3D";

// ── Types ───────────────────────────────────────────────────────────────────
interface Skill {
    id: string;
    name: string;
    icon_url: string;
    website_url?: string;
}

interface TechSphereSceneProps {
    skills: Skill[];
    theme: "dark" | "light";
    onHover: (name: string | null) => void;
}

interface RingConfig {
    radius: number;
    tilt: [number, number, number]; // Euler angles for the ring's orbital plane
    speed: number; // Rotation speed (rad/s) — negative = reverse
    colorDark: string;
    colorLight: string;
}

// ── Ring configurations ─────────────────────────────────────────────────────
// Three orbital rings at different tilts — like an atom's electron shells

const RING_CONFIGS: RingConfig[] = [
    {
        radius: 9,
        tilt: [0.35, 0, 0.15], // Near-horizontal, slight tilt
        speed: 0.12,
        colorDark: "#00ffff",
        colorLight: "#0891b2",
    },
    {
        radius: 7.5,
        tilt: [1.15, 0.4, -0.2], // Steep tilt
        speed: -0.1,
        colorDark: "#8b5cf6",
        colorLight: "#7c3aed",
    },
    {
        radius: 8.2,
        tilt: [-0.7, -0.3, 0.6], // Counter-tilt
        speed: 0.08,
        colorDark: "#ff00ff",
        colorLight: "#c026d3",
    },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Distributes skills across 3 rings (40%, 35%, 25%) */
function distributeToRings(skills: Skill[]): Skill[][] {
    if (skills.length === 0) return [[], [], []];

    const count1 = Math.max(1, Math.ceil(skills.length * 0.4));
    const count2 = Math.max(1, Math.ceil(skills.length * 0.35));

    return [
        skills.slice(0, count1),
        skills.slice(count1, count1 + count2),
        skills.slice(count1 + count2),
    ];
}

/** Generate particle trail positions along a ring */
function generateRingParticles(
    radius: number,
    count: number
): Float32Array {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3; // slight Y jitter
        positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
}

// ── Orbital Ring Component ──────────────────────────────────────────────────

function OrbitRing({
    config,
    skills,
    hoveredSkill,
    onHover,
    isDark,
}: {
    config: RingConfig;
    skills: Skill[];
    hoveredSkill: string | null;
    onHover: (name: string | null) => void;
    isDark: boolean;
}) {
    const orbitRef = useRef<THREE.Group>(null);

    // Place icons evenly around the ring
    const iconPositions = useMemo(() => {
        return skills.map((_, i) => {
            const angle = (i / skills.length) * Math.PI * 2;
            return [
                Math.cos(angle) * config.radius,
                0,
                Math.sin(angle) * config.radius,
            ] as [number, number, number];
        });
    }, [skills.length, config.radius]);

    // Trail particle positions
    const particlePositions = useMemo(
        () => generateRingParticles(config.radius, 60),
        [config.radius]
    );

    // Animate the orbital rotation
    useFrame((_, delta) => {
        if (!orbitRef.current) return;
        orbitRef.current.rotation.y += delta * config.speed;
    });

    const ringColor = isDark ? config.colorDark : config.colorLight;

    return (
        <group rotation={config.tilt}>
            {/* ── Visible ring (thin torus) ───────────────────────────── */}
            <mesh>
                <torusGeometry args={[config.radius, 0.025, 8, 128]} />
                <meshBasicMaterial
                    color={ringColor}
                    transparent
                    opacity={isDark ? 0.15 : 0.2}
                />
            </mesh>

            {/* ── Glowing wider ring (subtle) ─────────────────────────── */}
            <mesh>
                <torusGeometry args={[config.radius, 0.12, 8, 128]} />
                <meshBasicMaterial
                    color={ringColor}
                    transparent
                    opacity={isDark ? 0.03 : 0.04}
                    blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
                />
            </mesh>

            {/* ── Particle trail ──────────────────────────────────────── */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={60}
                        array={particlePositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color={ringColor}
                    size={isDark ? 0.06 : 0.05}
                    transparent
                    opacity={isDark ? 0.3 : 0.25}
                    sizeAttenuation
                    blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
                />
            </points>

            {/* ── Orbiting icons ──────────────────────────────────────── */}
            <group ref={orbitRef}>
                {skills.map((skill, i) => (
                    <TechIcon3D
                        key={skill.id}
                        name={skill.name}
                        iconUrl={skill.icon_url}
                        websiteUrl={skill.website_url}
                        position={iconPositions[i]}
                        isHovered={hoveredSkill === skill.name}
                        onHover={onHover}
                        isDark={isDark}
                    />
                ))}
            </group>
        </group>
    );
}

// ── Main Scene ──────────────────────────────────────────────────────────────

/**
 * Atom-style orbital scene:
 * - Central pulsing wireframe core (dodecahedron)
 * - 3 tilted orbital rings with neon glow + particle trails
 * - Icons orbit along each ring at different speeds
 */
export default function TechSphereScene({ skills, theme, onHover }: TechSphereSceneProps) {
    const hoveredSkillRef = useRef<string | null>(null);
    const handleHover = (name: string | null) => {
        hoveredSkillRef.current = name;
        onHover(name);
    };
    const isDark = theme === "dark";
    const coreRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    // Distribute skills across 3 rings
    const rings = useMemo(() => distributeToRings(skills), [skills]);

    // ── Pulse the central core ──────────────────────────────────────────────
    useFrame((state) => {
        if (coreRef.current) {
            const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.12;
            coreRef.current.scale.setScalar(s);
            coreRef.current.rotation.y += 0.005;
            coreRef.current.rotation.x += 0.003;
        }
        if (glowRef.current) {
            const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
            glowRef.current.scale.setScalar(s);
        }
    });

    return (
        <group>
            {/* ── Central nucleus ─────────────────────────────────────────── */}
            {/* Wireframe dodecahedron — slowly spinning + pulsing */}
            <mesh ref={coreRef}>
                <dodecahedronGeometry args={[0.7, 0]} />
                <meshBasicMaterial
                    color={isDark ? "#00ffff" : "#0891b2"}
                    wireframe
                    transparent
                    opacity={isDark ? 0.25 : 0.3}
                />
            </mesh>

            {/* Inner glow sphere */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial
                    color={isDark ? "#8b5cf6" : "#7c3aed"}
                    transparent
                    opacity={isDark ? 0.08 : 0.06}
                />
            </mesh>

            {/* Outer glow halo */}
            <mesh>
                <sphereGeometry args={[1.2, 16, 16]} />
                <meshBasicMaterial
                    color={isDark ? "#00ffff" : "#0891b2"}
                    transparent
                    opacity={isDark ? 0.02 : 0.015}
                    blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
                />
            </mesh>

            {/* ── Orbital rings ───────────────────────────────────────────── */}
            {RING_CONFIGS.map((config, i) => (
                <OrbitRing
                    key={i}
                    config={config}
                    skills={rings[i] || []}
                    hoveredSkill={hoveredSkillRef.current}
                    onHover={handleHover}
                    isDark={isDark}
                />
            ))}
        </group>
    );
}
