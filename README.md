# 🚀 Modern Developer Portfolio

A high-performance, dynamic portfolio website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

This project features a fully functional **Admin Dashboard** that serves as a CMS, allowing you to manage projects, experiences, certificates, and profile information in real-time without touching the code.

## ✨ Key Features

-   **⚡ Modern Tech Stack**: Built with Next.js 14 (App Router), React, and TypeScript.
-   **🎨 Dynamic UI**: Stunning neon/dark theme with **Framer Motion** animations and **Tailwind CSS**.
-   **🛡️ Admin Dashboard**: Secure admin panel to manage all content (CMS).
    -   **Projects**: Add, edit, delete, and upload project images.
    -   **Experience**: Manage work history.
    -   **Certificates**: Showcase certifications with image uploads.
    -   **Profile**: Update bio, stats, social links, and resume.
-   **🔐 Authentication**: Secure login for admin access using **Supabase Auth**.
-   **☁️ Cloud Storage**: Image and document uploads powered by **Supabase Storage**.
-   **📱 Fully Responsive**: Optimized for all devices from mobile to desktop.
-   **🔒 Security Hardened**: CSP, rate limiting, input sanitization, magic byte file validation.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Backend & Auth**: [Supabase](https://supabase.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/              # Admin CMS Dashboard (10 modules)
│   ├── api/                # API Routes (auth, contact, upload)
│   ├── page.tsx            # Homepage (portfolio sections)
│   └── layout.tsx          # Root layout
├── components/             # Reusable React components
│   └── cards/              # Extracted card sub-components
├── lib/                    # Utilities & configuration
│   ├── supabase/           # Supabase client/server/middleware
│   ├── hooks/              # Custom React hooks
│   ├── types.ts            # TypeScript type definitions
│   ├── rate-limit.ts       # Rate limiting with LRU eviction
│   ├── sanitize.ts         # Input sanitization (XSS prevention)
│   └── file-validation.ts  # File upload validation (magic bytes)
├── middleware.ts            # Auth + security headers
├── next.config.mjs         # Next.js config (CSP, security)
├── tailwind.config.ts       # Tailwind theme (neon colors)
└── supabase-schema.sql      # Database schema (DDL + RLS)
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MarwanFo/Marwan.git
cd Marwan
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# Copy the contents of supabase-schema.sql into Supabase SQL Editor and execute
```

Also create a storage bucket named `project-images` in Supabase Storage.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄️ Database Schema

The project uses the following Supabase tables:
-   `profile`: Stores user bio, stats, and links.
-   `projects`: Portfolio projects with images and tags.
-   `experiences`: Work history and achievements.
-   `certificates`: Certifications and awards.
-   `site_settings`: Global site configuration.
-   `messages`: Contact form submissions.
-   `skills`: Tech stack for the marquee section.

All tables have **Row Level Security (RLS)** enabled with appropriate policies for public read and authenticated write access.

## 🔐 Security Features

-   **Content Security Policy (CSP)** with explicit origin allowlists
-   **Rate limiting** on API routes (contact form & file uploads)
-   **Input sanitization** against XSS attacks
-   **Magic byte validation** on file uploads
-   **Honeypot fields** for bot detection
-   **Secure cookies** (httpOnly, secure, sameSite)
-   **HSTS** with 2-year max-age and preload

## 📦 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables.
4.  Deploy!

---

Built with ❤️ by [FARIDI Marwan](https://github.com/FARIDI-Marwan)
