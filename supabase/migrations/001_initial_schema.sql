-- ═══════════════════════════════════════════════════════════════════════════════
-- XYROOTS DATABASE SCHEMA
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── ENUMS ──────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('teacher', 'management', 'agency');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('active', 'suspended', 'deleted');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM ('draft', 'published', 'closed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── PROFILES ───────────────────────────────────────────────────────────────────
-- Central user profile linked to Supabase auth.users

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'teacher',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  status account_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ─── TEACHER PROFILES ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT,
  specializations TEXT[] DEFAULT '{}',
  bio TEXT,
  title TEXT,
  qualification TEXT,
  professional_qualification TEXT,
  experience_years INTEGER,
  experience_details JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  preferred_locations TEXT[] DEFAULT '{}',
  availability TEXT,
  resume_url TEXT,
  profile_image_url TEXT,
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  boards TEXT[] DEFAULT '{}',
  expected_salary_min NUMERIC,
  expected_salary_max NUMERIC,
  work_preferences TEXT[] DEFAULT '{}',
  has_demo_video BOOLEAN DEFAULT false,
  demo_video_url TEXT,
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_profiles_profile_id ON teacher_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_subject ON teacher_profiles(subject);
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_location ON teacher_profiles(location);

-- ─── MANAGEMENT PROFILES ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS management_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  institution_id UUID,
  institution_name TEXT,
  designation TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_management_profiles_profile_id ON management_profiles(profile_id);

-- ─── AGENCY PROFILES ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS agency_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  agency_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  location TEXT,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agency_profiles_profile_id ON agency_profiles(profile_id);

-- ─── INSTITUTIONS ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  location TEXT,
  city TEXT,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  board TEXT[] DEFAULT '{}',
  established INTEGER,
  verified BOOLEAN DEFAULT false,
  created_by_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_institutions_created_by ON institutions(created_by_profile_id);

-- Link management_profiles to institutions
DO $$ 
BEGIN
  ALTER TABLE management_profiles DROP CONSTRAINT IF EXISTS fk_management_institution;
  ALTER TABLE management_profiles
    ADD CONSTRAINT fk_management_institution
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ─── JOBS ───────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  posted_by_role user_role NOT NULL,
  institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  requirements TEXT[] DEFAULT '{}',
  responsibilities TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  qualification TEXT,
  professional_qualification TEXT,
  experience_min INTEGER,
  experience_max INTEGER,
  employment_type TEXT DEFAULT 'Full-time',
  board TEXT,
  level TEXT,
  location TEXT,
  salary_min NUMERIC,
  salary_max NUMERIC,
  application_deadline DATE,
  status job_status NOT NULL DEFAULT 'draft',
  school_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by_profile_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_subject ON jobs(subject);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- ─── APPLICATIONS ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  teacher_profile_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
  applicant_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, applicant_profile_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications(applicant_profile_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- ─── AUDIT LOGS ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_profile ON audit_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ─── AUTO-UPDATE updated_at TRIGGER ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'profiles', 'teacher_profiles', 'management_profiles',
    'agency_profiles', 'institutions', 'jobs', 'applications'
  ])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_updated_at ON %I;
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    ', t, t);
  END LOOP;
END $$;


-- ═══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE management_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ─── PROFILES ───────────────────────────────────────────────

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Allow profile creation during signup
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- Function to get current user role without triggering RLS recursion
CREATE OR REPLACE FUNCTION get_auth_role() RETURNS text AS $$
  SELECT role::text FROM profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Management and agency can view teacher profiles
CREATE POLICY "Employers can view teacher profiles"
  ON profiles FOR SELECT
  USING (
    role = 'teacher'
    AND get_auth_role() IN ('management', 'agency')
  );

-- ─── TEACHER PROFILES ───────────────────────────────────────

CREATE POLICY "Teachers can view own teacher profile"
  ON teacher_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = teacher_profiles.profile_id
      AND p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update own teacher profile"
  ON teacher_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = teacher_profiles.profile_id
      AND p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can insert own teacher profile"
  ON teacher_profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = teacher_profiles.profile_id
      AND p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can view teacher profiles"
  ON teacher_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.auth_user_id = auth.uid()
      AND p.role IN ('management', 'agency')
    )
  );

-- ─── MANAGEMENT PROFILES ────────────────────────────────────

CREATE POLICY "Management can view own profile"
  ON management_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = management_profiles.profile_id
      AND p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Management can update own profile"
  ON management_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = management_profiles.profile_id
      AND p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Management can insert own profile"
  ON management_profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = management_profiles.profile_id
      AND p.auth_user_id = auth.uid()
    )
  );

-- ─── AGENCY PROFILES ────────────────────────────────────────

CREATE POLICY "Agency can view own profile"
  ON agency_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = agency_profiles.profile_id
      AND p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Agency can update own profile"
  ON agency_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = agency_profiles.profile_id
      AND p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Agency can insert own profile"
  ON agency_profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = agency_profiles.profile_id
      AND p.auth_user_id = auth.uid()
    )
  );

-- ─── INSTITUTIONS ───────────────────────────────────────────

CREATE POLICY "Anyone can view institutions"
  ON institutions FOR SELECT
  USING (true);

CREATE POLICY "Management can create institutions"
  ON institutions FOR INSERT
  WITH CHECK (
    get_auth_role() = 'management'
  );

CREATE POLICY "Management can update own institutions"
  ON institutions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.auth_user_id = auth.uid()
      AND p.id = institutions.created_by_profile_id
    )
  );

-- ─── JOBS ───────────────────────────────────────────────────

CREATE POLICY "Anyone can view published jobs"
  ON jobs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Job owners can view all own jobs"
  ON jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.auth_user_id = auth.uid()
      AND p.id = jobs.posted_by_profile_id
    )
  );

CREATE POLICY "Employers can create jobs"
  ON jobs FOR INSERT
  WITH CHECK (
    get_auth_role() IN ('management', 'agency')
  );

CREATE POLICY "Job owners can update own jobs"
  ON jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.auth_user_id = auth.uid()
      AND p.id = jobs.posted_by_profile_id
    )
  );

-- ─── APPLICATIONS ───────────────────────────────────────────

CREATE POLICY "Teachers can create applications"
  ON applications FOR INSERT
  WITH CHECK (
    get_auth_role() = 'teacher'
  );

CREATE POLICY "Teachers can view own applications"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.auth_user_id = auth.uid()
      AND p.id = applications.applicant_profile_id
    )
  );

CREATE POLICY "Job owners can view applications for their jobs"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs j
      JOIN profiles p ON p.id = j.posted_by_profile_id
      WHERE j.id = applications.job_id
      AND p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Job owners can update application status"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM jobs j
      JOIN profiles p ON p.id = j.posted_by_profile_id
      WHERE j.id = applications.job_id
      AND p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can withdraw own applications"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.auth_user_id = auth.uid()
      AND p.id = applications.applicant_profile_id
    )
  );

-- ─── AUDIT LOGS ─────────────────────────────────────────────

CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.auth_user_id = auth.uid()
      AND p.id = audit_logs.profile_id
    )
  );

CREATE POLICY "Users can create audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.auth_user_id = auth.uid()
      AND p.id = audit_logs.profile_id
    )
  );


-- ═══════════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- Run this separately if Storage is needed:
-- ═══════════════════════════════════════════════════════════════════════════════

-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('institution-logos', 'institution-logos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('demo-videos', 'demo-videos', false);

-- Storage policies for avatars:
-- CREATE POLICY "Avatar images are publicly accessible"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'avatars');

-- CREATE POLICY "Users can upload own avatar"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Storage policies for resumes:
-- CREATE POLICY "Users can upload own resume"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');
