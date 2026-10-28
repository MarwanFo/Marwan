"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Only display the public header on known public portfolio pages.
// Whitelisting public routes guarantees NO admin or vault paths exist in client-side JS bundles.
const isPublicRoute = (path: string): boolean => {
    return (
        path === "/" ||
        path === "/experience" ||
        path === "/certificates" ||
        path.startsWith("/projects")
    );
};

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (!pathname || !isPublicRoute(pathname)) {
        return null;
    }

    return <>{children}</>;
}
