import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Cyberpunk/Neon color palette
                background: "#0a0a0f",
                foreground: "#ffffff",
                // Neon accents
                neon: {
                    cyan: "#00ffff",
                    magenta: "#ff00ff",
                    purple: "#8b5cf6",
                    pink: "#ec4899",
                    blue: "#3b82f6",
                },
                // Glassmorphism
                glass: {
                    DEFAULT: "rgba(255, 255, 255, 0.05)",
                    light: "rgba(255, 255, 255, 0.1)",
                    border: "rgba(255, 255, 255, 0.1)",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
            },
            fontSize: {
                "display-lg": ["clamp(3rem, 10vw, 8rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
                "display": ["clamp(2.5rem, 8vw, 6rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
                "heading": ["clamp(1.5rem, 4vw, 3rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
            },
            animation: {
                "marquee": "marquee 30s linear infinite",
                "marquee-reverse": "marquee-reverse 30s linear infinite",
                "glow": "glow 2s ease-in-out infinite alternate",
                "float": "float 6s ease-in-out infinite",
                "gradient": "gradient 8s ease infinite",
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                marquee: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                "marquee-reverse": {
                    "0%": { transform: "translateX(-50%)" },
                    "100%": { transform: "translateX(0%)" },
                },
                glow: {
                    "0%": { opacity: "0.5", filter: "blur(20px)" },
                    "100%": { opacity: "1", filter: "blur(30px)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                gradient: {
                    "0%, 100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                },
            },
            backdropBlur: {
                xs: "2px",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "neon-gradient": "linear-gradient(135deg, #00ffff 0%, #8b5cf6 50%, #ff00ff 100%)",
                "neon-gradient-reverse": "linear-gradient(135deg, #ff00ff 0%, #8b5cf6 50%, #00ffff 100%)",
            },
            boxShadow: {
                "neon-cyan": "0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.1)",
                "neon-magenta": "0 0 20px rgba(255, 0, 255, 0.3), 0 0 40px rgba(255, 0, 255, 0.1)",
                "neon-purple": "0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)",
                "glass": "0 8px 32px rgba(0, 0, 0, 0.3)",
            },
        },
    },
    plugins: [],
};

export default config;
