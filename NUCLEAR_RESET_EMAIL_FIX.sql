-- =====================================================
-- NUCLEAR OPTION: COMPLETE TABLE RESET
-- Use this if PERMANENT_FIX_EMAIL_CONSTRAINT.sql doesn't work
-- This completely destroys and rebuilds the profiles table
-- =====================================================

-- Step 1: Disable triggers and drop everything
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Step 2: Create brand new table with ZERO nullable columns
-- ALL columns have DEFAULT values to prevent any NULL errors
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) DEFAULT '' NOT NULL CHECK (email IS NOT NULL),
  full_name VARCHAR(255) DEFAULT '' NOT NULL CHECK (full_name IS NOT NULL),
  phone VARCHAR(20) DEFAULT '' NOT NULL CHECK (phone IS NOT NULL),
  location TEXT DEFAULT '' NOT NULL CHECK (location IS NOT NULL),
  experience_years VARCHAR(50) DEFAULT '' NOT NULL CHECK (experience_years IS NOT NULL),
  farm_size VARCHAR(50) DEFAULT '' NOT NULL CHECK (farm_size IS NOT NULL),
  primary_crops TEXT DEFAULT '' NOT NULL CHECK (primary_crops IS NOT NULL),
  bio TEXT DEFAULT '' NOT NULL CHECK (bio IS NOT NULL),
  avatar_url TEXT,
  
  -- Preferences
  language VARCHAR(10) DEFAULT 'en' NOT NULL CHECK (language IS NOT NULL),
  pest_alert_enabled BOOLEAN DEFAULT true NOT NULL CHECK (pest_alert_enabled IS NOT NULL),
  email_notifications BOOLEAN DEFAULT true NOT NULL CHECK (email_notifications IS NOT NULL),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL CHECK (created_at IS NOT NULL),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL CHECK (updated_at IS NOT NULL)
);

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Step 4: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Create comprehensive RLS policies
-- Policy for authenticated users
CREATE POLICY "authenticated_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "authenticated_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "authenticated_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for anon users (for signup)
CREATE POLICY "anon_read_all"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "anon_insert"
  ON public.profiles
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Step 6: Bulletproof trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name,
    phone,
    location,
    experience_years,
    farm_size,
    primary_crops,
    bio,
    language,
    pest_alert_enabled,
    email_notifications,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.email, ''), ''),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), ''),
    '',
    '',
    '',
    '',
    '',
    '',
    'en',
    true,
    true,
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION WHEN unique_violation THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Grant permissions for REST API
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT, INSERT ON public.profiles TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated, anon;

-- Step 9: Verification
SELECT 'Profiles table created successfully!' as status;
SELECT COUNT(*) as total_profiles FROM public.profiles;
