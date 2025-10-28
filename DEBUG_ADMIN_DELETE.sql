-- ============================================
-- DEBUG & FIX ADMIN DELETION ISSUE
-- ============================================
-- Run each section one by one in Supabase SQL Editor

-- ============================================
-- SECTION 1: CHECK CURRENT STATE
-- ============================================

-- Check all admins
SELECT id, email, created_by, created_at 
FROM admin_users 
ORDER BY created_at DESC;

-- Check current user (should be sudanva@gmail.com)
SELECT auth.jwt()->>'email' as current_user;

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_users';

-- Check all policies on admin_users
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'admin_users';

-- ============================================
-- SECTION 2: FIX DELETE POLICY
-- ============================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can remove admins" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can view admins" ON admin_users;
DROP POLICY IF EXISTS "Admins can add new admins" ON admin_users;

-- Recreate SELECT policy (view admins)
CREATE POLICY "Authenticated users can view admins"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Recreate INSERT policy (add admins)
CREATE POLICY "Admins can add new admins"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Recreate DELETE policy (remove admins) - SIMPLIFIED VERSION
CREATE POLICY "Admins can remove admins"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    -- User must be an admin to delete
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

-- ============================================
-- SECTION 3: VERIFY POLICIES WERE CREATED
-- ============================================

SELECT policyname, cmd, permissive
FROM pg_policies 
WHERE tablename = 'admin_users'
ORDER BY cmd;

-- ============================================
-- SECTION 4: TEST DELETION
-- ============================================

-- First, add a test admin to delete
INSERT INTO admin_users (email, created_by)
VALUES ('delete-me-test@example.com', 'system')
ON CONFLICT (email) DO NOTHING;

-- Verify it was added
SELECT * FROM admin_users WHERE email = 'delete-me-test@example.com';

-- Try to delete it (THIS SHOULD WORK)
DELETE FROM admin_users WHERE email = 'delete-me-test@example.com';

-- Verify it was deleted
SELECT * FROM admin_users WHERE email = 'delete-me-test@example.com';
-- Should return no rows

-- ============================================
-- SECTION 5: IF STILL NOT WORKING - DISABLE RLS TEMPORARILY
-- ============================================
-- ⚠️ WARNING: Only use this for testing!

-- Disable RLS temporarily
-- ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Now try deleting from the dashboard

-- After testing, RE-ENABLE RLS!
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECTION 6: ALTERNATIVE FIX - GRANT DIRECT PERMISSIONS
-- ============================================

-- Grant delete permission to authenticated users
GRANT DELETE ON admin_users TO authenticated;

-- ============================================
-- SECTION 7: CHECK IF DELETE WORKS NOW
-- ============================================

-- Add another test admin
INSERT INTO admin_users (email, created_by)
VALUES ('test-admin-delete@test.com', 'sudanva@gmail.com');

-- Try deleting via SQL
DELETE FROM admin_users WHERE email = 'test-admin-delete@test.com';

-- Check if it worked
SELECT COUNT(*) as remaining_test_admins 
FROM admin_users 
WHERE email LIKE '%test%';

-- ============================================
-- FINAL VERIFICATION
-- ============================================

-- Show all current admins
SELECT 
  id,
  email,
  created_by,
  created_at,
  CASE 
    WHEN email = auth.jwt()->>'email' THEN 'YOU'
    ELSE 'Other Admin'
  END as admin_type
FROM admin_users 
ORDER BY created_at DESC;

-- Show current policies
SELECT 
  policyname,
  cmd as permission_type,
  CASE 
    WHEN permissive = 'PERMISSIVE' THEN '✓ Permissive'
    ELSE '✗ Restrictive'
  END as policy_mode
FROM pg_policies 
WHERE tablename = 'admin_users'
ORDER BY cmd;
