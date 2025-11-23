-- =====================================================
-- DIAGNOSTIC QUERIES
-- Run this to see what's actually in your database
-- =====================================================

-- Check if profiles table exists and its structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Count profiles
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Check for NULL emails
SELECT COUNT(*) as null_emails FROM public.profiles WHERE email IS NULL;

-- Show all profiles
SELECT id, email, full_name, created_at FROM public.profiles LIMIT 10;

-- Check RLS policies
SELECT schemaname, tablename, policyname, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Check trigger function
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';
