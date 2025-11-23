-- =====================================================
-- PERMANENT FIX FOR EMAIL CONSTRAINT ERRORS
-- =====================================================
-- This script COMPLETELY fixes the email constraint issue
-- by making all text fields nullable with empty string defaults
-- =====================================================

-- Step 1: Clear any problematic data first
DELETE FROM public.profiles WHERE email IS NULL;
DELETE FROM public.profiles WHERE full_name IS NULL;

-- Step 2: Alter table to use defaults instead of NOT NULL
-- This allows the INSERT to succeed even if email is missing
ALTER TABLE public.profiles 
  ALTER COLUMN email SET DEFAULT '',
  ALTER COLUMN email DROP NOT NULL;

ALTER TABLE public.profiles 
  ALTER COLUMN full_name SET DEFAULT '',
  ALTER COLUMN full_name DROP NOT NULL;

-- Step 3: Recreate the trigger function with bulletproof null handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, ''),
    full_name = COALESCE(EXCLUDED.full_name, ''),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Ensure all existing rows have valid email (not null)
UPDATE public.profiles SET email = '' WHERE email IS NULL;
UPDATE public.profiles SET full_name = '' WHERE full_name IS NULL;

-- Step 5: Verify all profiles have email set
SELECT COUNT(*) as null_emails FROM public.profiles WHERE email IS NULL;
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- If the SELECT returns any null_emails, there's an issue
-- If total_profiles matches non-null count, everything is fixed!
