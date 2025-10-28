-- ============================================
-- QUICK ADMIN MANAGEMENT
-- ============================================
-- Use this file to easily add/remove admin users
-- Just change the email and run in Supabase SQL Editor

-- ============================================
-- ADD NEW ADMIN
-- ============================================
-- Replace 'new-admin@example.com' with the actual email
-- Then run this query in Supabase

INSERT INTO admin_users (email, created_by)
VALUES ('new-admin@example.com', 'sudanva@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Success message
SELECT 'Admin added successfully!' as message;

-- ============================================
-- VIEW ALL ADMINS
-- ============================================
-- Uncomment below to see all current admins

-- SELECT * FROM admin_users ORDER BY created_at DESC;

-- ============================================
-- REMOVE AN ADMIN
-- ============================================
-- Uncomment and replace email to remove an admin

-- DELETE FROM admin_users WHERE email = 'admin-to-remove@example.com';
-- SELECT 'Admin removed successfully!' as message;

-- ============================================
-- QUICK EXAMPLES
-- ============================================

-- Example 1: Add your friend as admin
-- INSERT INTO admin_users (email, created_by)
-- VALUES ('friend@gmail.com', 'sudanva@gmail.com')
-- ON CONFLICT (email) DO NOTHING;

-- Example 2: Add multiple admins at once
-- INSERT INTO admin_users (email, created_by) VALUES
-- ('admin1@gmail.com', 'sudanva@gmail.com'),
-- ('admin2@gmail.com', 'sudanva@gmail.com'),
-- ('admin3@gmail.com', 'sudanva@gmail.com')
-- ON CONFLICT (email) DO NOTHING;

-- Example 3: Check if someone is admin
-- SELECT * FROM admin_users WHERE email = 'check@gmail.com';
