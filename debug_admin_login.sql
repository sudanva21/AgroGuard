-- ============================================
-- DEBUG ADMIN LOGIN ISSUES
-- ============================================
-- Run this in Supabase SQL Editor to diagnose the problem

-- ============================================
-- 1. CHECK IF EMAIL EXISTS IN AUTH.USERS
-- ============================================
SELECT 
  'AUTH USER CHECK' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ EMAIL NOT CONFIRMED'
    ELSE '✅ EMAIL CONFIRMED'
  END as status
FROM auth.users
WHERE email = 'sudanva20@gmail.com';

-- ============================================
-- 2. CHECK IF EMAIL EXISTS IN ADMIN_USERS TABLE
-- ============================================
SELECT 
  'ADMIN PRIVILEGES CHECK' as check_type,
  id,
  email,
  role,
  created_at,
  '✅ HAS ADMIN PRIVILEGES' as status
FROM public.admin_users
WHERE email = 'sudanva20@gmail.com';

-- ============================================
-- 3. LIST ALL AUTH USERS (to see if any exist)
-- ============================================
SELECT 
  'ALL AUTH USERS' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 4. LIST ALL ADMIN USERS (to see if table has data)
-- ============================================
SELECT 
  'ALL ADMIN USERS' as check_type,
  id,
  email,
  role,
  created_at
FROM public.admin_users
ORDER BY created_at DESC;

-- ============================================
-- 5. CHECK SUPABASE AUTH SETTINGS
-- ============================================
-- Note: This checks if email confirmation is required
-- If your Supabase project requires email confirmation, 
-- users cannot login until email is verified

SELECT 
  'DIAGNOSIS COMPLETE' as status,
  'Check the results above to identify the issue' as message;

-- ============================================
-- COMMON ISSUES & SOLUTIONS:
-- ============================================
-- 
-- Issue 1: No rows returned from auth.users query
-- Solution: User doesn't exist in Supabase Auth. 
--          Create it via Authentication > Users in dashboard.
--
-- Issue 2: email_confirmed_at is NULL
-- Solution: Email not confirmed. Either:
--          - Click user in dashboard and select "Confirm Email"
--          - Enable "Auto Confirm Users" when creating
--
-- Issue 3: No rows in admin_users table
-- Solution: User has no admin privileges. 
--          Run the INSERT command from create_admin_user.sql
--
-- Issue 4: Different email in auth.users
-- Solution: Check spelling, case sensitivity
--          Email should be exactly: sudanva20@gmail.com
--
-- ============================================
