"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Language, TranslationDictionary } from "./types";
import { en } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    dictionary: TranslationDictionary;
    t: (key: string, params?: Record<string, string | number>) => string;
}

const dictionaries: Record<Language, TranslationDictionary> = {
    en,
    fr,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize language from localStorage / navigator
    useEffect(() => {
        try {
            const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
            if (savedLang === "en" || savedLang === "fr") {
                setLanguageState(savedLang);
            } else {
                // Detect browser language
                const browserLang = navigator.language.toLowerCase();
                if (browserLang.startsWith("fr")) {
                    setLanguageState("fr");
                } else {
                    setLanguageState("en");
                }
            }
        } catch {
            // Ignore error in restricted environments
        } finally {
            setIsInitialized(true);
        }
    }, []);

    // Keep html lang attribute in sync
    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.lang = language;
        }
    }, [language]);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        try {
            localStorage.setItem(STORAGE_KEY, lang);
            document.cookie = `portfolio_language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
        } catch {
            // Ignore storage errors
        }
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguageState((prev) => {
            const next: Language = prev === "en" ? "fr" : "en";
            try {
                localStorage.setItem(STORAGE_KEY, next);
                document.cookie = `portfolio_language=${next}; path=/; max-age=31536000; SameSite=Lax`;
            } catch {
                // Ignore storage errors
            }
            return next;
        });
    }, []);

    const dictionary = useMemo(() => dictionaries[language] || dictionaries.en, [language]);

    /**
     * Helper to lookup nested translation keys like "hero.role" or "nav.about"
     */
    const t = useCallback(
        (key: string, params?: Record<string, string | number>): string => {
            const keys = key.split(".");
            let result: any = dictionary;

            for (const k of keys) {
                if (result && typeof result === "object" && k in result) {
                    result = result[k];
                } else {
                    // Fallback to English dictionary if key not found
                    let fallbackResult: any = dictionaries.en;
                    for (const fbKey of keys) {
                        if (fallbackResult && typeof fallbackResult === "object" && fbKey in fallbackResult) {
                            fallbackResult = fallbackResult[fbKey];
                        } else {
                            return key; // return key name if totally missing
                        }
                    }
                    result = fallbackResult;
                    break;
                }
            }

            if (typeof result !== "string") {
                return key;
            }

            // Replace parameters like {count}
            if (params) {
                return Object.entries(params).reduce((str, [paramKey, paramVal]) => {
                    return str.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramVal));
                }, result);
            }

            return result;
        },
        [dictionary]
    );

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            toggleLanguage,
            dictionary,
            t,
        }),
        [language, setLanguage, toggleLanguage, dictionary, t]
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

export function useTranslation() {
    const { t, language, dictionary } = useLanguage();
    return { t, language, dictionary };
}
