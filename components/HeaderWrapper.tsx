"use client";

import { usePathname } from "next/navigation";

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't show header on admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return <>{children}</>;
}
