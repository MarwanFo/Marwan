"use client";

import { usePathname } from "next/navigation";

// Only display the public header on known public portfolio pages.
// Whitelisting public routes guarantees NO admin or vault paths exist in client-side JS bundles.
const PUBLIC_NAV_ROUTES = new Set(['/', '/projects', '/experience', '/certificates']);

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (!pathname || !PUBLIC_NAV_ROUTES.has(pathname)) {
        return null;
    }

    return <>{children}</>;
}
