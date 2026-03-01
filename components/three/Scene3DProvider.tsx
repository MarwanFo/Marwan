"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Dynamically import the 3D SceneCanvas with SSR disabled.
 * Three.js requires `window` and `document` which don't exist during SSR.
 * This wrapper ensures the canvas only loads on the client.
 */
const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
    ssr: false,
    loading: () => null,
});

export default function Scene3DProvider() {
    const { theme } = useTheme();

    return <SceneCanvas theme={theme} />;
}
