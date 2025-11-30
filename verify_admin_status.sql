-- ============================================
-- VERIFY ADMIN STATUS FOR sudanva20@gmail.com
-- ============================================
-- Run this in Supabase SQL Editor to check admin setup

SELECT 
  '🔍 ADMIN STATUS CHECK' as info,
  '===================' as details
UNION ALL
SELECT 
  '1. Auth User Exists:',
  CASE 
    WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'sudanva20@gmail.com')
    THEN '✅ YES'
    ELSE '❌ NO - Create user in Dashboard'
  END
UNION ALL
SELECT 
  '2. Email Confirmed:',
  CASE 
    WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'sudanva20@gmail.com' AND email_confirmed_at IS NOT NULL)
    THEN '✅ YES'
    ELSE '❌ NO - Confirm in Dashboard'
  END
UNION ALL
SELECT 
  '3. Admin Privileges:',
  CASE 
    WHEN EXISTS(SELECT 1 FROM public.admin_users WHERE email = 'sudanva20@gmail.com')
    THEN '✅ YES'
    ELSE '❌ NO - Run fix_admin_login.sql'
  END
UNION ALL
SELECT 
  '',
  ''
UNION ALL
SELECT 
  '📊 ADMIN DETAILS' as info,
  '===================' as details;

-- Show admin user details
SELECT 
  email,
  role,
  created_at,
  created_by
FROM public.admin_users 
WHERE email = 'sudanva20@gmail.com';

-- Show auth user details
SELECT 
  'Auth User ID:' as field,
  id::text as value
FROM auth.users 
WHERE email = 'sudanva20@gmail.com'
UNION ALL
SELECT 
  'Email Confirmed:',
  CASE 
    WHEN email_confirmed_at IS NOT NULL 
    THEN email_confirmed_at::text 
    ELSE 'NOT CONFIRMED' 
  END
FROM auth.users 
WHERE email = 'sudanva20@gmail.com';

-- Final status
SELECT 
  '🎯 FINAL STATUS' as section,
  '===================' as divider
UNION ALL
SELECT 
  'Login Ready:',
  CASE 
    WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'sudanva20@gmail.com' AND email_confirmed_at IS NOT NULL)
         AND EXISTS(SELECT 1 FROM public.admin_users WHERE email = 'sudanva20@gmail.com')
    THEN '✅ YES - Can login and access admin features'
    ELSE '❌ NO - Complete setup steps above'
  END;
