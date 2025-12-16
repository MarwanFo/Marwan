"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Menu, X, Download } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const navLinks = [
    { name: "About", href: "#about" },
    { name: "Certificates", href: "#certificates" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
];

interface HeaderClientProps {
    resumeUrl: string | null;
}

export default function HeaderClient({ resumeUrl }: HeaderClientProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const handleNavClick = (href: string) => {
        setIsMobileMenuOpen(false);
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleResumeClick = () => {
        if (resumeUrl) {
            window.open(resumeUrl, '_blank');
        } else {
            alert("Resume not available yet. Please check back later.");
        }
    };

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-3" : "py-5"
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <nav
                        className={`flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-300 ${isScrolled ? "glass shadow-glass" : "bg-transparent"
                            }`}
                    >
                        {/* Logo */}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            <Logo size="sm" />
                        </a>

                        {/* Desktop Navigation */}
                        <ul className="hidden md:flex items-center gap-1">
                            {navLinks.map((link, index) => (
                                <motion.li
                                    key={link.name}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <a
                                        href={link.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavClick(link.href);
                                        }}
                                        className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
                                    >
                                        {link.name}
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-neon-gradient group-hover:w-3/4 transition-all duration-300" />
                                    </a>
                                </motion.li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <div className="hidden md:flex items-center gap-3">
                            <ThemeToggle />
                            <motion.button
                                onClick={handleResumeClick}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-neon-cyan/30 text-neon-cyan text-sm font-medium hover:bg-neon-cyan/10 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Download className="w-4 h-4" />
                                <span>Resume</span>
                            </motion.button>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="md:hidden p-2 rounded-xl glass"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-white" />
                            ) : (
                                <Menu className="w-5 h-5 text-white" />
                            )}
                        </motion.button>
                    </nav>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <motion.div
                className={`fixed inset-0 z-40 md:hidden ${isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                initial={false}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Menu Content */}
                <motion.div
                    className="absolute top-24 left-6 right-6 glass rounded-2xl p-6 overflow-hidden"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{
                        opacity: isMobileMenuOpen ? 1 : 0,
                        y: isMobileMenuOpen ? 0 : -20,
                        scale: isMobileMenuOpen ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <ul className="space-y-2">
                        {navLinks.map((link, index) => (
                            <motion.li
                                key={link.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: isMobileMenuOpen ? 1 : 0,
                                    x: isMobileMenuOpen ? 0 : -20,
                                }}
                                transition={{ delay: index * 0.05 + 0.1 }}
                            >
                                <a
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick(link.href);
                                    }}
                                    className="block py-3 px-4 rounded-xl text-lg font-medium text-white/80 hover:text-neon-cyan hover:bg-white/5 transition-all duration-300"
                                >
                                    {link.name}
                                </a>
                            </motion.li>
                        ))}
                    </ul>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <button
                            onClick={handleResumeClick}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neon-gradient text-background font-semibold"
                        >
                            <Download className="w-5 h-5" />
                            <span>Download Resume</span>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
