-- ============================================
-- CREATE ADMIN USER
-- Email: sudanva20@gmail.com
-- Password: 123456
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create Auth User with Supabase Auth
-- Note: This needs to be done via Supabase Auth API or Dashboard
-- See instructions below for manual creation

-- Step 2: Add email to admin_users table for admin privileges
INSERT INTO public.admin_users (
  email,
  role,
  created_by,
  created_at
) VALUES (
  'sudanva20@gmail.com',
  'super_admin',
  'system',
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
  role = 'super_admin',
  updated_at = NOW();

-- Verify admin user was added
SELECT * FROM public.admin_users WHERE email = 'sudanva20@gmail.com';

-- Success message
SELECT '✅ Admin privileges granted to sudanva20@gmail.com' as message;

-- ============================================
-- IMPORTANT: CREATE AUTH USER FIRST
-- ============================================
-- Before running this SQL, create the Supabase Auth user:
--
-- Method 1: Via Supabase Dashboard (EASIEST)
-- 1. Go to: https://app.supabase.com
-- 2. Select your project
-- 3. Click "Authentication" in left sidebar
-- 4. Click "Users" tab
-- 5. Click "Add User" button
-- 6. Enter:
--    - Email: sudanva20@gmail.com
--    - Password: 123456
--    - Auto Confirm User: YES (check this box)
-- 7. Click "Create User"
-- 8. Then run this SQL script
--
-- Method 2: Via API (if dashboard doesn't work)
-- Use the provided JavaScript file: create_admin_user_api.js
--
-- ============================================
