import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./light-mode.css";
import "./responsive.css";
import "./3d-effects.css";
import Header from "@/components/Header";
import HeaderWrapper from "@/components/HeaderWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import LoadingScreen from "@/components/LoadingScreen";
import Scene3DProvider from "@/components/three/Scene3DProvider";
import ChatWidget from "@/components/ChatWidget";
import TerminalHUD from "@/components/TerminalHUD";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://marwanfo.me";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "FARIDI Marwan | Full Stack Developer & Software Engineer",
        template: "%s | FARIDI Marwan",
    },
    description: "Creative Full Stack Developer & Software Engineering Student based in Morocco. Specializing in high-performance web applications with React, Next.js, TypeScript, Tailwind CSS, Laravel, and Supabase.",
    keywords: [
        "FARIDI Marwan",
        "Marwane Faridi",
        "Marwan Faridi",
        "MarwanFo",
        "Full Stack Developer Morocco",
        "Développeur Web Maroc",
        "Software Engineer Morocco",
        "Étudiant Ingénieur Génie Informatique",
        "React Developer",
        "Next.js Developer",
        "TypeScript",
        "Tailwind CSS",
        "Laravel Developer",
        "Supabase",
        "Three.js Portfolio",
    ],
    authors: [{ name: "FARIDI Marwan", url: siteUrl }],
    creator: "FARIDI Marwan",
    publisher: "FARIDI Marwan",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: siteUrl,
        languages: {
            "en-US": `${siteUrl}/?lang=en`,
            "fr-FR": `${siteUrl}/?lang=fr`,
        },
    },
    openGraph: {
        title: "FARIDI Marwan | Full Stack Developer & Software Engineer",
        description: "Creative Full Stack Developer & Software Engineering Student crafting modern, high-performance web experiences.",
        url: siteUrl,
        siteName: "FARIDI Marwan Portfolio",
        locale: "en_US",
        alternateLocale: ["fr_FR"],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "FARIDI Marwan | Full Stack Developer",
        description: "Crafting beautiful, high-performance web experiences with React, Next.js, and modern tech.",
        creator: "@marwanfo",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "XzlsTGedNc2hTDEWQfiYN31EbKoFg2ByxuPx5r5DDGs",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": `${siteUrl}/#person`,
            name: "FARIDI Marwan",
            alternateName: ["Marwane Faridi", "Marwan Faridi", "MarwanFo"],
            url: siteUrl,
            jobTitle: "Full Stack Developer",
            description: "Full Stack Developer and 1st-year Software Engineering Student at Université Privée de Fès (UPF), specializing in modern web applications, Next.js, React, and Laravel.",
            email: "itsmemarwanefo@gmail.com",
            address: {
                "@type": "PostalAddress",
                addressCountry: "Morocco",
                addressLocality: "Casablanca / Fez",
            },
            alumniOf: [
                {
                    "@type": "EducationalOrganization",
                    name: "Université Privée de Fès (UPF)",
                    url: "https://www.upf.ac.ma/",
                },
                {
                    "@type": "EducationalOrganization",
                    name: "Brevet de Technicien Supérieur (BTS)",
                },
            ],
            sameAs: [
                "https://www.linkedin.com/in/marwanefaridi/",
                "https://github.com/MarwanFo",
            ],
            knowsAbout: [
                "React",
                "Next.js",
                "TypeScript",
                "JavaScript",
                "Tailwind CSS",
                "Node.js",
                "Laravel",
                "PHP",
                "MySQL",
                "PostgreSQL",
                "Supabase",
                "Three.js",
                "REST APIs",
                "Full Stack Web Development",
            ],
        },
        {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: siteUrl,
            name: "FARIDI Marwan Portfolio",
            description: "Portfolio of FARIDI Marwan, Full Stack Developer and Software Engineering Student.",
            publisher: {
                "@id": `${siteUrl}/#person`,
            },
            inLanguage: ["en", "fr"],
        },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                {/* Structured Data (JSON-LD) for Search & AI Engines */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <LanguageProvider>
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
                </LanguageProvider>
            </body>
        </html>
    );
}
