"use client";

import { useRef, useState, useCallback } from "react";
import { useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

interface Use3DTiltOptions {
    /** Max rotation in degrees (default: 8) */
    maxRotation?: number;
}

interface Use3DTiltReturn<T extends HTMLElement> {
    ref: React.RefObject<T>;
    isHovered: boolean;
    rotateX: MotionValue<string>;
    rotateY: MotionValue<string>;
    handleMouseMove: (e: React.MouseEvent) => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
}

/**
 * Shared hook for 3D card tilt effect on mouse move.
 * Used by ExperienceCard, CertificateCard, and ProjectCard.
 */
export function use3DTilt<T extends HTMLElement = HTMLDivElement>(
    options: Use3DTiltOptions = {}
): Use3DTiltReturn<T> {
    const { maxRotation = 8 } = options;
    const ref = useRef<T>(null) as React.RefObject<T>;
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${maxRotation}deg`, `-${maxRotation}deg`]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${maxRotation}deg`, `${maxRotation}deg`]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }, [x, y]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    }, [x, y]);

    return {
        ref,
        isHovered,
        rotateX,
        rotateY,
        handleMouseMove,
        handleMouseEnter,
        handleMouseLeave,
    };
}
