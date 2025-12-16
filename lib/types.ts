export interface Profile {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    location: string | null;
    email: string | null;
    avatar_url: string | null;
    resume_url: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
    updated_at: string;
}

export interface Project {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    live_url: string | null;
    github_url: string | null;
    tags: string[];
    size: 'large' | 'medium' | 'small';
    featured: boolean;
    display_order: number;
    created_at: string;
}

export interface Experience {
    id: string;
    role: string;
    company: string;
    company_url: string | null;
    location: string | null;
    period: string;
    description: string | null;
    achievements: string[];
    technologies: string[];
    display_order: number;
    created_at: string;
}

export interface Certificate {
    id: string;
    title: string;
    issuer: string;
    date: string | null;
    credential_url: string | null;
    skills: string[];
    featured: boolean;
    display_order: number;
    created_at: string;
}

// Insert types (without id and created_at)
export type ProjectInsert = {
    title: string;
    description?: string | null;
    image_url?: string | null;
    live_url?: string | null;
    github_url?: string | null;
    tags?: string[];
    size?: 'large' | 'medium' | 'small';
    featured?: boolean;
    display_order?: number;
};

export type ExperienceInsert = {
    role: string;
    company: string;
    company_url?: string | null;
    location?: string | null;
    period: string;
    description?: string | null;
    achievements?: string[];
    technologies?: string[];
    display_order?: number;
};

export type CertificateInsert = {
    title: string;
    issuer: string;
    date?: string | null;
    credential_url?: string | null;
    skills?: string[];
    featured?: boolean;
    display_order?: number;
};

export type ProfileInsert = {
    name: string;
    role: string;
    bio?: string | null;
    location?: string | null;
    email?: string | null;
    avatar_url?: string | null;
    resume_url?: string | null;
    github_url?: string | null;
    linkedin_url?: string | null;
    twitter_url?: string | null;
};

export type Database = {
    public: {
        Tables: {
            profile: {
                Row: Profile;
                Insert: ProfileInsert;
                Update: Partial<ProfileInsert>;
            };
            projects: {
                Row: Project;
                Insert: ProjectInsert;
                Update: Partial<ProjectInsert>;
            };
            experiences: {
                Row: Experience;
                Insert: ExperienceInsert;
                Update: Partial<ExperienceInsert>;
            };
            certificates: {
                Row: Certificate;
                Insert: CertificateInsert;
                Update: Partial<CertificateInsert>;
            };
        };
    };
};
