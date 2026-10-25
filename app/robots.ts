import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://marwanfo.me";

    return {
        rules: [
            {
                // Standard search engines (Google, Bing, Yahoo, DuckDuckGo)
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                ],
            },
            {
                // AI & GEO Crawlers (ChatGPT Search, Perplexity, Claude, Google Gemini)
                userAgent: [
                    "GPTBot",
                    "PerplexityBot",
                    "ClaudeBot",
                    "Google-Extended",
                    "Applebot-Extended",
                ],
                allow: "/",
                disallow: [
                    "/api/",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
