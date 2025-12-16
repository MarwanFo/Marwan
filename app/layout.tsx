import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./light-mode.css";
import "./responsive.css";
import Header from "@/components/Header";
import HeaderWrapper from "@/components/HeaderWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import LoadingScreen from "@/components/LoadingScreen";

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
                    <div className="fixed inset-0 grid-pattern pointer-events-none" />
                    <HeaderWrapper>
                        <Header />
                    </HeaderWrapper>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
