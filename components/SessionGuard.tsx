"use client";

import { useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SessionGuardProps {
    children: React.ReactNode;
    /** Inactivity timeout in minutes (default: 30) */
    inactivityTimeout?: number;
    /** Show warning before logout in seconds (default: 60) */
    warningBeforeSeconds?: number;
}

/**
 * Session Guard Component
 * - Tracks user activity (mouse, keyboard, touch, scroll)
 * - Auto-logs out after inactivity period
 * - Shows warning before automatic logout
 */
export default function SessionGuard({
    children,
    inactivityTimeout = 30,
    warningBeforeSeconds = 60,
}: SessionGuardProps) {
    const router = useRouter();
    const supabase = createClient();
    const lastActivityRef = useRef(Date.now());
    const warningShownRef = useRef(false);
    const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleLogout = useCallback(async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
    }, [supabase, router]);

    const resetActivity = useCallback(() => {
        lastActivityRef.current = Date.now();
        warningShownRef.current = false;

        // Clear any pending logout timer
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    }, []);

    const checkInactivity = useCallback(() => {
        const now = Date.now();
        const inactiveTime = now - lastActivityRef.current;
        const timeoutMs = inactivityTimeout * 60 * 1000;
        const warningMs = timeoutMs - warningBeforeSeconds * 1000;

        // Show warning before logout
        if (inactiveTime >= warningMs && !warningShownRef.current) {
            warningShownRef.current = true;
            const remainingSeconds = Math.ceil((timeoutMs - inactiveTime) / 1000);

            const continueSession = window.confirm(
                `You will be logged out in ${remainingSeconds} seconds due to inactivity.\n\nClick OK to stay logged in, or Cancel to logout now.`
            );

            if (continueSession) {
                resetActivity();
            } else {
                handleLogout();
            }
        }

        // Force logout after timeout
        if (inactiveTime >= timeoutMs) {
            handleLogout();
        }
    }, [inactivityTimeout, warningBeforeSeconds, resetActivity, handleLogout]);

    useEffect(() => {
        // Activity events to track
        const events = ["mousedown", "keydown", "touchstart", "scroll", "mousemove"];

        const handleActivity = () => {
            resetActivity();
        };

        // Add event listeners
        events.forEach((event) => {
            document.addEventListener(event, handleActivity, { passive: true });
        });

        // Check inactivity every minute
        const intervalId = setInterval(checkInactivity, 60 * 1000);

        // Store session start time
        sessionStorage.setItem("admin_session_start", Date.now().toString());

        // Cleanup
        return () => {
            events.forEach((event) => {
                document.removeEventListener(event, handleActivity);
            });
            clearInterval(intervalId);
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current);
            }
        };
    }, [resetActivity, checkInactivity]);

    // Check session on visibility change (tab focus)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                checkInactivity();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [checkInactivity]);

    return <>{children}</>;
}
