-- =====================================================
-- AGROGUARD AI - FIX SCHEMA CACHE & RESET PROFILES TABLE
-- =====================================================
-- Run this FIRST to clear schema cache issues
-- =====================================================

-- STEP 1: Drop old trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- STEP 2: Drop old profiles table completely (CAUTION: This deletes existing data)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- STEP 3: Recreate profiles table with CORRECT columns
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  location TEXT,
  experience_years VARCHAR(50),
  farm_size VARCHAR(50),
  primary_crops TEXT,
  bio TEXT,
  avatar_url TEXT,
  language VARCHAR(10) DEFAULT 'en',
  pest_alert_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 4: Create indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_id ON public.profiles(id);

-- STEP 5: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- STEP 7: Create auto-profile function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 8: Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STEP 9: Create timestamp update trigger
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- STEP 10: Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;

-- =====================================================
-- VERIFICATION CHECKLIST
-- =====================================================
-- ✅ Profiles table recreated with correct columns:
--    - experience_years (VARCHAR)
--    - primary_crops (TEXT)
--    - avatar_url (TEXT)
--
-- ✅ RLS enabled and policies created
-- ✅ Auto-profile creation trigger active
-- ✅ Timestamp update trigger active
-- ✅ Ready for user registration
--
-- NEXT STEPS:
-- 1. Run this SQL first
-- 2. Test by registering a new user
-- 3. Then run COMPLETE_SUPABASE_SETUP.sql for other tables
-- =====================================================
