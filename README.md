# 🚀 Modern Developer Portfolio

A high-performance, dynamic portfolio website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

This project features a fully functional **Admin Dashboard** that serves as a CMS, allowing you to manage projects, experiences, certificates, and profile information in real-time without touching the code.

![Portfolio Preview](https://via.placeholder.com/1200x600?text=Portfolio+Preview)

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

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Backend & Auth**: [Supabase](https://supabase.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
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

### 4. Run the development server

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

## 📦 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables.
4.  Deploy!

---

Built with ❤️ by [Marwan](https://github.com/yourusername)
