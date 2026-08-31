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

    // Matrix mode state
    const [isMatrix, setIsMatrix] = useState(false);

    // Command processing
    const processCommand = (cmd: string) => {
        const parts = cmd.trim().split(" ");
        const action = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        if (!action) return;

        // Add to history
        setHistory((prev) => [
            ...prev,
            { type: "input", content: cmd, timestamp: new Date() },
        ]);
        setCommandHistory((prev) => [cmd, ...prev]);
        setHistoryIndex(-1);

        switch (action) {
            case "help":
                addOutput("COMMANDS:\n  ls            - List directories (sections)\n  cd [dir]      - Move to section\n  whoami        - Developer identity data\n  skills        - View tech stack\n  resume        - Download CV (PDF)\n  socials       - View links\n  theme [name]  - Change system colors\n  echo [text]   - Print text to console\n  status        - System diagnostics\n  clear         - Wipe console history\n  exit          - Close Terminal\n  matrix-rain   - Toggle visual breach");
                break;
            case "ls":
                addOutput("about/  projects/  experience/  certificates/  contact/  hero/");
                break;
            case "clear":
                setHistory([]);
                break;
            case "exit":
                setIsOpen(false);
                break;
            case "echo":
                addOutput(args.join(" ") || "...");
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
                addOutput("GITHUB:   https://github.com/MarwanFo\nLINKEDIN: https://linkedin.com/in/marwan-faridi\nEMAIL:    marwanefaridi22@gmail.com");
                break;
            case "skills":
                addOutput("FRONTEND:  Next.js, React, Tailwind, Framer Motion, Three.js\nBACKEND:   Node.js, Supabase, PostgreSQL\nTOOLS:     Git, Docker, Vercel, Vitest");
                break;
            case "resume":
                addOutput("Initiating secure download: Marwan_CV.pdf...");
                const link = document.createElement("a");
                link.href = "/CV_Marwane_FARIDI.pdf";
                link.download = "CV_Marwane_FARIDI.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                break;
            case "matrix-rain":
                setIsMatrix(!isMatrix);
                addOutput(isMatrix ? "Visual breach stabilized." : "Visual matrix breach initiated...");
                break;
            case "cd":
                const target = args[0];
                if (!target) {
                    addError("Usage: cd [projects|experience|certificates|contact|about|hero]");
                    return;
                }
                const cleanTarget = target.replace("/", "");
                const elementId = cleanTarget === "exp" ? "experience" : cleanTarget === "cert" ? "certificates" : cleanTarget;
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
                const themeName = args[0];
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
        isMatrix,
        history,
        processCommand,
        inputRef,
        commandHistory,
        historyIndex,
        setHistoryIndex,
    };
};
