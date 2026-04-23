import { useState, useEffect, useCallback, useRef } from "react";

export interface TerminalEntry {
    type: "input" | "output" | "error" | "system";
    content: string;
    timestamp: Date;
}

export const useTerminal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<TerminalEntry[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial welcome message
    useEffect(() => {
        if (history.length === 0) {
            setHistory([
                {
                    type: "system",
                    content: "MARWAN_OS [Version 1.4.2] READY...",
                    timestamp: new Date(),
                },
                {
                    type: "system",
                    content: "Type 'help' to see available commands.",
                    timestamp: new Date(),
                },
            ]);
        }
    }, [history.length]);

    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    // Listen for toggle keys (Ctrl+K or Backtick)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Debug log to help identify the key on the user's system
            console.log(`[Terminal] Key pressed: ${e.key} (Code: ${e.code})`);

            const isToggleKey = 
                (e.ctrlKey && e.key === "k") || 
                e.key === "`" || 
                e.code === "Backquote" ||
                e.key === "~";

            if (isToggleKey) {
                e.preventDefault();
                console.log("[Terminal] Toggling...");
                toggle();
            }
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggle, isOpen]);

    // Command processing
    const processCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        if (!cleanCmd) return;

        // Add to history
        setHistory((prev) => [
            ...prev,
            { type: "input", content: cmd, timestamp: new Date() },
        ]);
        setCommandHistory((prev) => [cmd, ...prev]);
        setHistoryIndex(-1);

        const args = cleanCmd.split(" ");
        const action = args[0];

        switch (action) {
            case "help":
                addOutput("Available commands: help, whoami, cd [sec], theme [t], clear, exit, status");
                break;
            case "clear":
                setHistory([]);
                break;
            case "exit":
                setIsOpen(false);
                break;
            case "whoami":
                addOutput("Name: Marwan FARIDI\nRole: Full Stack Developer\nStatus: MISSION_READY\nLocation: Morocco\nSpecialization: Next.js | TypeScript | Supabase | DevOps");
                break;
            case "status":
                addOutput(`SYSTEM_LOAD: ${Math.floor(Math.random() * 20 + 5)}%\nMEMORY: ${Math.floor(Math.random() * 1000 + 4000)}MB available\nUptime: ${Math.floor(Math.random() * 100 + 20)} days\nSecurity: ENCRYPTED_TUNNEL_ACTIVE`);
                break;
            case "hack":
                addOutput("Checking vulnerabilities...");
                setTimeout(() => addOutput("Accessing mainframe..."), 500);
                setTimeout(() => addOutput("Bypassing firewall..."), 1000);
                setTimeout(() => addOutput("SUCCESS: Root access granted."), 1500);
                setTimeout(() => addOutput("Just kidding! Welcome to the source code."), 2000);
                break;
            case "socials":
                addOutput("GitHub: https://github.com/MarwanFo\nLinkedIn: https://linkedin.com/in/marwan-faridi\nEmail: marwanefaridi22@gmail.com");
                break;
            case "cd":
                const target = args[1];
                if (!target) {
                    addError("Usage: cd [projects|experience|certificates|contact|about|hero]");
                    return;
                }
                const elementId = target === "exp" ? "experience" : target === "cert" ? "certificates" : target;
                const element = document.getElementById(elementId);
                if (element) {
                    setIsOpen(false);
                    element.scrollIntoView({ behavior: "smooth" });
                    addOutput(`Navigating to ${elementId}...`);
                } else {
                    addError(`Directory not found: ${target}`);
                }
                break;
            case "theme":
                const themeName = args[1];
                if (!themeName) {
                    addError("Usage: theme [dark|light|neon|matrix]");
                    return;
                }
                applyTheme(themeName);
                break;
            default:
                addError(`Unknown command: ${action}. Type 'help' for assistance.`);
        }
    };

    const addOutput = (content: string) => {
        setHistory((prev) => [
            ...prev,
            { type: "output", content, timestamp: new Date() },
        ]);
    };

    const addError = (content: string) => {
        setHistory((prev) => [
            ...prev,
            { type: "error", content, timestamp: new Date() },
        ]);
    };

    const applyTheme = (name: string) => {
        const root = document.documentElement;
        switch (name) {
            case "matrix":
                root.style.setProperty("--neon-cyan", "#00ff41");
                root.style.setProperty("--neon-purple", "#008f11");
                root.style.setProperty("--neon-magenta", "#003b00");
                addOutput("Matrix theme initialized...");
                break;
            case "neon":
                root.style.setProperty("--neon-cyan", "#00ffff");
                root.style.setProperty("--neon-purple", "#8b5cf6");
                root.style.setProperty("--neon-magenta", "#ff00ff");
                addOutput("Default neon theme restored.");
                break;
            case "dark":
                document.documentElement.classList.remove("light");
                document.documentElement.classList.add("dark");
                addOutput("Dark mode active.");
                break;
            case "light":
                document.documentElement.classList.remove("dark");
                document.documentElement.classList.add("light");
                addOutput("Light mode active.");
                break;
            default:
                addError(`Theme '${name}' not recognized.`);
        }
    };

    return {
        isOpen,
        setIsOpen,
        history,
        processCommand,
        inputRef,
        commandHistory,
        historyIndex,
        setHistoryIndex,
    };
};
