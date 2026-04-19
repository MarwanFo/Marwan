# 🚀 Next-Gen Interactive Portfolio & AI Agent

A state-of-the-art, high-performance developer portfolio built with **Next.js 14**, **Three.js**, and **Google Gemini AI**. This project isn't just a resume; it's a full-stack platform featuring an autonomous AI assistant and a headless CMS via Supabase.

---

## 🌟 Highlights

- **🧠 Marwan-AI Assistant**: An integrated RAG (Retrieval-Augmented Generation) chatbot powered by Google Gemini, capable of answering questions about my career, skills, and projects with persistent memory.
- **🌀 3D Orbital Tech Stack**: An immersive, interactive tech sphere built with **React Three Fiber (Three.js)** that handles 50+ technologies with high-performance rendering.
- **⚡ Performance First**: 100/100 Lighthouse focus. Fully optimized using `next/image`, dynamic imports, and intersection observers for buttery-smooth 60FPS animations.
- **🛡️ Security Hardened**: Enterprise-grade security with strict CSP headers, IP-based rate limiting, magic-byte file validation, and Supabase Row Level Security (RLS).
- **💼 Headless CMS Dashboard**: A private administrative suite to manage projects, experiences, and certificates in real-time.

---

## 🛠️ Technical Architecture

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Mobile-first, Glassmorphism design)
- **Animations**: Framer Motion & Three.js (3D Scenes)
- **State Management**: React Hooks + LocalStorage Persistence

### Backend & AI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (Optimized for WebP & PDF)
- **AI Engine**: Google Gemini Pro API (with context-caching layer)

### Security & DevOps
- **Security**: Content Security Policy (CSP), Rate Limiting (LRU), Input Sanitization
- **Deployment**: Vercel (CI/CD)

---

## 🏗️ Project Structure

```bash
├── app/                    # Next.js App Router (Admin & Public)
│   ├── api/                # Edge & Serverless API Routes (AI, Upload, Chat)
├── components/             # React Component Library
│   ├── three/              # 3D Scenes & Three.js Components
│   ├── cards/              # Optimized UI Cards
│   └── ChatWidget.tsx      # Advanced AI Chat Interface
├── lib/                    # Core Logic & Utilities
│   ├── ai-context.ts       # AI RAG & Context Management
│   ├── supabase/           # Client/Server Database Config
│   └── rate-limit.ts       # IP-based Rate Limiter
├── middleware.ts            # Security Headers & Auth Guard
└── supabase-schema.sql      # Database DDL & RLS Policies
```

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone https://github.com/MarwanFo/Marwan.git
cd Marwan
npm install
```

### 2. Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GEMINI_API_KEY=your_gemini_key
```

### 3. Database
Execute the `supabase-schema.sql` in your Supabase SQL Editor to initialize tables and RLS policies.

### 4. Run
```bash
npm run dev
```

---

## 🔒 Security Best Practices
- **Rate Limiting**: Protects AI routes from abuse using IP tracking.
- **File Validation**: Only allows verified image and PDF formats via magic byte signatures.
- **Sanitization**: All user-provided inputs are sanitized before processing to prevent XSS.

---

[FARIDI Marwan](https://github.com/MarwanFo/Marwan)
