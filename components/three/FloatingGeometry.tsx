"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingShape {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
    speed: number;
    rotSpeed: [number, number, number];
    color: string;
    geometry: "octahedron" | "tetrahedron" | "icosahedron";
    phaseOffset: number;
}

const NEON_COLORS = ["#00ffff", "#8b5cf6", "#ff00ff", "#06b6d4", "#a855f7"];

function generateShapes(count: number): FloatingShape[] {
    const shapes: FloatingShape[] = [];
    const geoTypes: FloatingShape["geometry"][] = ["octahedron", "tetrahedron", "icosahedron"];

    for (let i = 0; i < count; i++) {
        shapes.push({
            position: [
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 30 - 10,
            ],
            rotation: [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI,
            ],
            scale: 0.3 + Math.random() * 0.8,
            speed: 0.2 + Math.random() * 0.5,
            rotSpeed: [
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
            ],
            color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
            geometry: geoTypes[Math.floor(Math.random() * geoTypes.length)],
            phaseOffset: Math.random() * Math.PI * 2,
        });
    }
    return shapes;
}

function FloatingShape({ shape }: { shape: FloatingShape }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const initialY = shape.position[1];

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.elapsedTime;

        // Anti-gravity float: gentle upward drift with sine oscillation
        meshRef.current.position.y =
            initialY + Math.sin(t * shape.speed + shape.phaseOffset) * 3;
        meshRef.current.position.x =
            shape.position[0] + Math.cos(t * shape.speed * 0.7 + shape.phaseOffset) * 1.5;

        // Slow continuous rotation
        meshRef.current.rotation.x += shape.rotSpeed[0];
        meshRef.current.rotation.y += shape.rotSpeed[1];
        meshRef.current.rotation.z += shape.rotSpeed[2];
    });

    const GeometryComponent = useMemo(() => {
        switch (shape.geometry) {
            case "octahedron":
                return <octahedronGeometry args={[shape.scale, 0]} />;
            case "tetrahedron":
                return <tetrahedronGeometry args={[shape.scale, 0]} />;
            case "icosahedron":
                return <icosahedronGeometry args={[shape.scale, 0]} />;
        }
    }, [shape.geometry, shape.scale]);

    return (
        <mesh
            ref={meshRef}
            position={shape.position}
            rotation={shape.rotation}
        >
            {GeometryComponent}
            <meshBasicMaterial
                color={shape.color}
                wireframe
                transparent
                opacity={0.25}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

export default function FloatingGeometry() {
    const shapes = useMemo(() => generateShapes(12), []);

    return (
        <group>
            {shapes.map((shape, i) => (
                <FloatingShape key={i} shape={shape} />
            ))}
        </group>
    );
}
