-- ============================================
-- FIX ADMIN LOGIN - COMPREHENSIVE SOLUTION
-- ============================================
-- This script will create/fix the admin user completely
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: CHECK IF USER EXISTS
-- ============================================

DO $$
DECLARE
  user_exists boolean;
  user_confirmed boolean;
  admin_exists boolean;
BEGIN
  -- Check if auth user exists
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sudanva20@gmail.com') INTO user_exists;
  
  -- Check if email is confirmed
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sudanva20@gmail.com' AND email_confirmed_at IS NOT NULL) INTO user_confirmed;
  
  -- Check if admin privileges exist
  SELECT EXISTS(SELECT 1 FROM public.admin_users WHERE email = 'sudanva20@gmail.com') INTO admin_exists;
  
  RAISE NOTICE '================================';
  RAISE NOTICE 'ADMIN USER STATUS CHECK';
  RAISE NOTICE '================================';
  
  IF user_exists THEN
    RAISE NOTICE '✅ Auth user exists in database';
  ELSE
    RAISE NOTICE '❌ Auth user DOES NOT exist - must create via dashboard';
  END IF;
  
  IF user_confirmed THEN
    RAISE NOTICE '✅ Email is confirmed';
  ELSE
    RAISE NOTICE '❌ Email is NOT confirmed - must confirm in dashboard';
  END IF;
  
  IF admin_exists THEN
    RAISE NOTICE '✅ Admin privileges granted';
  ELSE
    RAISE NOTICE '❌ Admin privileges NOT granted - will add now';
  END IF;
  
  RAISE NOTICE '================================';
END $$;

-- ============================================
-- STEP 2: ADD ADMIN PRIVILEGES (Safe to run multiple times)
-- ============================================

INSERT INTO public.admin_users (
  email,
  role,
  created_by,
  created_at,
  updated_at
) VALUES (
  'sudanva20@gmail.com',
  'super_admin',
  'system',
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
  role = 'super_admin',
  updated_at = NOW();

-- ============================================
-- STEP 3: VERIFY SETUP
-- ============================================

SELECT 
  '🔍 VERIFICATION RESULTS' as section,
  '' as detail
UNION ALL
SELECT 
  '========================',
  '========================'
UNION ALL
SELECT 
  'Auth User Status:',
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ EXISTS'
    ELSE '❌ NOT FOUND - CREATE IN DASHBOARD'
  END
FROM auth.users 
WHERE email = 'sudanva20@gmail.com'
UNION ALL
SELECT 
  'Email Confirmed:',
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ CONFIRMED'
    ELSE '❌ NOT CONFIRMED - CONFIRM IN DASHBOARD'
  END
FROM auth.users 
WHERE email = 'sudanva20@gmail.com' AND email_confirmed_at IS NOT NULL
UNION ALL
SELECT 
  'Admin Privileges:',
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ GRANTED'
    ELSE '❌ ERROR - CONTACT SUPPORT'
  END
FROM public.admin_users 
WHERE email = 'sudanva20@gmail.com';

-- ============================================
-- SHOW DETAILED USER INFO
-- ============================================

SELECT 
  '📋 DETAILED USER INFO' as section,
  '==================' as detail
UNION ALL
SELECT 
  'Email:',
  COALESCE(email, '❌ NOT FOUND')
FROM auth.users 
WHERE email = 'sudanva20@gmail.com'
UNION ALL
SELECT 
  'User ID:',
  COALESCE(id::text, '❌ NOT FOUND')
FROM auth.users 
WHERE email = 'sudanva20@gmail.com'
UNION ALL
SELECT 
  'Confirmed At:',
  COALESCE(email_confirmed_at::text, '❌ NOT CONFIRMED')
FROM auth.users 
WHERE email = 'sudanva20@gmail.com'
UNION ALL
SELECT 
  'Admin Role:',
  COALESCE(role, '❌ NOT FOUND')
FROM public.admin_users 
WHERE email = 'sudanva20@gmail.com';

-- ============================================
-- FINAL STATUS
-- ============================================

SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'sudanva20@gmail.com' AND email_confirmed_at IS NOT NULL)
         AND EXISTS(SELECT 1 FROM public.admin_users WHERE email = 'sudanva20@gmail.com')
    THEN '🎉 ALL CHECKS PASSED! You can now login with: sudanva20@gmail.com / 123456'
    WHEN NOT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sudanva20@gmail.com')
    THEN '⚠️  ACTION REQUIRED: Create auth user in Dashboard → Authentication → Users'
    WHEN NOT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sudanva20@gmail.com' AND email_confirmed_at IS NOT NULL)
    THEN '⚠️  ACTION REQUIRED: Confirm email in Dashboard → Authentication → Users → Click user → Confirm Email'
    ELSE '⚠️  PARTIAL SETUP: Check results above'
  END as final_status;
