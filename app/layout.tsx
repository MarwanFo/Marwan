import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./light-mode.css";
import "./responsive.css";
import "./3d-effects.css";
import Header from "@/components/Header";
import HeaderWrapper from "@/components/HeaderWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import LoadingScreen from "@/components/LoadingScreen";
import Scene3DProvider from "@/components/three/Scene3DProvider";
import ChatWidget from "@/components/ChatWidget";
import TerminalHUD from "@/components/TerminalHUD";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "FARIDI Marwan | Portfolio",
    description: "A creative Full Stack Developer crafting beautiful, high-performance web experiences. Specializing in React, Next.js, TypeScript, and modern web technologies.",
    keywords: ["FARIDI Marwan", "Full Stack Developer", "Web Developer", "React", "Next.js", "TypeScript", "Portfolio"],
    authors: [{ name: "FARIDI Marwan" }],
    openGraph: {
        title: "FARIDI Marwan | Portfolio",
        description: "A creative Full Stack Developer crafting beautiful, high-performance web experiences.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                <ThemeProvider>
                    <LoadingScreen />
                    <Scene3DProvider />
                    <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />
                    <HeaderWrapper>
                        <Header />
                    </HeaderWrapper>
                    {children}
                    <ChatWidget />
                    <TerminalHUD />
                </ThemeProvider>
            </body>
        </html>
    );
}
