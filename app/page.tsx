import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TechMarquee from "@/components/TechMarquee";
import ExperienceSection from "@/components/ExperienceSection";
import CertificatesSection from "@/components/CertificatesSection";
import BentoGrid from "@/components/BentoGrid";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="relative">
            {/* Hero Section - Full screen with animated background */}
            <HeroSection />

            {/* About Section */}
            <AboutSection />

            {/* Tech Stack Marquee */}
            <TechMarquee />

            {/* Experience Timeline */}
            <ExperienceSection />

            {/* Certificates & Credentials */}
            <CertificatesSection />

            {/* Projects Bento Grid */}
            <BentoGrid />

            {/* Contact Section */}
            <ContactSection />

            {/* Footer */}
            <Footer />
        </main>
    );
}
