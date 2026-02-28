-- Supabase SQL Schema for Portfolio Admin
-- Run this in your Supabase SQL Editor

-- Profile/About Section (with stats)
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  location TEXT,
  email TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  -- Stats
  years_experience INT DEFAULT 0,
  projects_completed INT DEFAULT 0,
  happy_clients INT DEFAULT 0,
  cups_of_coffee INT DEFAULT 0,
  -- About section content
  philosophy_title TEXT DEFAULT 'Development Philosophy',
  philosophy_items JSONB DEFAULT '[]',
  interests TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  tags TEXT[] DEFAULT '{}',
  size TEXT DEFAULT 'medium',
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  company_url TEXT,
  location TEXT,
  period TEXT NOT NULL,
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT,
  credential_url TEXT,
  skills TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings (for global settings)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT DEFAULT 'Full Stack Developer',
  hero_subtitle TEXT,
  hero_description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  footer_text TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (from contact form)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills (for tech marquee)
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT DEFAULT 'frontend',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add type column to experiences (if not exists)
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'work';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url column to certificates (if not exists)
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS image_url TEXT;

-- If tables already exist, add the new columns
ALTER TABLE profile ADD COLUMN IF NOT EXISTS years_experience INT DEFAULT 0;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS projects_completed INT DEFAULT 0;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS happy_clients INT DEFAULT 0;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS cups_of_coffee INT DEFAULT 0;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS philosophy_title TEXT DEFAULT 'Development Philosophy';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS philosophy_items JSONB DEFAULT '[]';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

-- Enable Row Level Security (RLS)
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Public read policies (if they don't exist, these will fail silently)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on profile') THEN
    CREATE POLICY "Allow public read access on profile" ON profile FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on projects') THEN
    CREATE POLICY "Allow public read access on projects" ON projects FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on experiences') THEN
    CREATE POLICY "Allow public read access on experiences" ON experiences FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on certificates') THEN
    CREATE POLICY "Allow public read access on certificates" ON certificates FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on site_settings') THEN
    CREATE POLICY "Allow public read access on site_settings" ON site_settings FOR SELECT USING (true);
  END IF;
END $$;

-- Authenticated user policies
DO $$
BEGIN
  -- Profile policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to insert profile') THEN
    CREATE POLICY "Allow authenticated users to insert profile" ON profile FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to update profile') THEN
    CREATE POLICY "Allow authenticated users to update profile" ON profile FOR UPDATE TO authenticated USING (true);
  END IF;
  
  -- Projects policies (public can read, authenticated can manage)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage projects') THEN
    CREATE POLICY "Allow authenticated users to manage projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  -- Experiences policies (public can read, authenticated can manage)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage experiences') THEN
    CREATE POLICY "Allow authenticated users to manage experiences" ON experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  -- Certificates policies (public can read, authenticated can manage)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage certificates') THEN
    CREATE POLICY "Allow authenticated users to manage certificates" ON certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  -- Site settings policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage site_settings') THEN
    CREATE POLICY "Allow authenticated users to manage site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  
  -- Skills policies (public can read, authenticated can manage)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on skills') THEN
    CREATE POLICY "Allow public read access on skills" ON skills FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage skills') THEN
    CREATE POLICY "Allow authenticated users to manage skills" ON skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  
  -- Messages policies (public can insert via contact form, authenticated can read/manage)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public to insert messages') THEN
    CREATE POLICY "Allow public to insert messages" ON messages FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage messages') THEN
    CREATE POLICY "Allow authenticated users to manage messages" ON messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;
