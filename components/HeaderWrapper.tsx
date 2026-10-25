"use client";

import { usePathname } from "next/navigation";

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't show header on admin/vault pages
    if (pathname?.startsWith('/bouchaib/hmed')) {
        return null;
    }

    return <>{children}</>;
}
