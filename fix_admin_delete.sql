-- ============================================
-- FIX ADMIN USER DELETION
-- ============================================
-- Run this SQL in Supabase SQL Editor if you can't delete admin users

-- Step 1: Check if the delete policy exists
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'admin_users' AND cmd = 'DELETE';

-- Step 2: Drop existing delete policy (if it exists with issues)
DROP POLICY IF EXISTS "Admins can remove admins" ON admin_users;

-- Step 3: Recreate the delete policy with proper permissions
CREATE POLICY "Admins can remove admins"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    -- Allow deletion if the current user is an admin
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt()->>'email'
    )
    -- Optional: Prevent deleting yourself (can also be handled in frontend)
    AND email != auth.jwt()->>'email'
  );

-- Step 4: Verify the policy was created
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'admin_users' AND cmd = 'DELETE';

-- Step 5: Test deletion (optional - replace with actual admin ID to delete)
-- First, get list of admins
SELECT id, email, created_at FROM admin_users ORDER BY created_at DESC;

-- Then delete a test admin (uncomment and replace ID)
-- DELETE FROM admin_users WHERE id = 'paste-admin-id-here';

-- ============================================
-- ALTERNATIVE: Disable RLS temporarily for testing
-- ============================================
-- WARNING: Only do this for testing! Re-enable RLS after!

-- Disable RLS (TEMPORARY - for testing only)
-- ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Try deletion from dashboard

-- Re-enable RLS (DO THIS AFTER TESTING!)
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all policies on admin_users table
SELECT * FROM pg_policies WHERE tablename = 'admin_users';

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_users';

-- Check your current user email
SELECT auth.jwt()->>'email' as current_user_email;

-- Check if you're in the admin list
SELECT * FROM admin_users WHERE email = auth.jwt()->>'email';
