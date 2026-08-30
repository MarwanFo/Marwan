export type Language = 'en' | 'fr';

export interface TranslationDictionary {
    nav: {
        about: string;
        experience: string;
        certificates: string;
        projects: string;
        contact: string;
        resume: string;
        downloadResume: string;
    };
    hero: {
        welcome: string;
        role: string;
        description: {
            part1: string;
            part2: string;
            part3: string;
            part4: string;
        };
        viewProjects: string;
        getInTouch: string;
        scroll: string;
    };
    about: {
        sectionTitle: string;
        sectionSubtitle: string;
        statusBadge: string;
        years: string;
        projects: string;
        clients: string;
        coffee: string;
        philosophyTitle: string;
        interestsTitle: string;
        interests: {
            coding: string;
            learning: string;
            building: string;
            problemSolving: string;
            architecture: string;
            openSource: string;
        };
        philosophies: {
            cleanCode: { title: string; desc: string };
            performance: { title: string; desc: string };
            userCentric: { title: string; desc: string };
            continuousLearning: { title: string; desc: string };
        };
        location: string;
    };
    skills: {
        title: string;
        highlight: string;
        subtitle: string;
    };
    experience: {
        title: string;
        highlight: string;
        subtitle: string;
        workTab: string;
        educationTab: string;
        present: string;
        achievements: string;
        viewCompany: string;
        viewSchool: string;
        allExperiences: string;
    };
    certificates: {
        title: string;
        highlight: string;
        subtitle: string;
        featured: string;
        allCertificates: string;
        viewCredential: string;
        preview: string;
        close: string;
        skillsCovered: string;
    };
    projects: {
        title: string;
        highlight: string;
        subtitle: string;
        viewProject: string;
        sourceCode: string;
        featured: string;
        allProjects: string;
        backToHome: string;
        searchPlaceholder: string;
        filterAll: string;
        noProjectsFound: string;
        showingProjects: string;
    };
    contact: {
        title: string;
        highlight: string;
        subtitle: string;
        nameLabel: string;
        namePlaceholder: string;
        emailLabel: string;
        emailPlaceholder: string;
        messageLabel: string;
        messagePlaceholder: string;
        sendButton: string;
        sending: string;
        sentSuccess: string;
        error: string;
        copyEmail: string;
        copied: string;
        connectPrompt: string;
        locationText: string;
    };
    footer: {
        bio: string;
        location: string;
        quickLinks: string;
        connect: string;
        connectSubtitle: string;
        copyright: string;
        backToTop: string;
    };
    notFound: {
        title: string;
        message: string;
        backHome: string;
        viewProjects: string;
    };
}
