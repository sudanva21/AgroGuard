# 🔧 Fix: 'public.profiles' Table Error

## Problem
```
Error: Could not find the table 'public.profiles' in the schema cache
```

## Solution

The SQL file has been updated to use `profiles` instead of `user_profiles`. Follow these steps:

### Step 1: Drop Old Table (if it exists)
Go to Supabase SQL Editor and run:

```sql
-- Drop old user_profiles table if it exists
DROP TABLE IF EXISTS public.user_profiles CASCADE;
```

### Step 2: Run Updated SQL
1. Open `COMPLETE_SUPABASE_SETUP.sql`
2. Copy ALL content
3. In Supabase SQL Editor, create a NEW query
4. Paste the updated SQL
5. Click RUN
6. Wait for success message

### Step 3: Verify
Run this query to verify the table exists:

```sql
SELECT * FROM public.profiles LIMIT 1;
```

### Step 4: Update Environment Variables
Make sure `.env` has Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## What Changed

The SQL file now:
- ✅ Creates `profiles` table instead of `user_profiles`
- ✅ Automatically creates profile when user signs up (trigger)
- ✅ Keeps all same columns and security policies
- ✅ Works with standard Supabase auth flow

---

## Test Your Fix

### Test 1: Register a new user
1. Go to app: http://localhost:5173
2. Click "Register"
3. Fill in details and register
4. Check Supabase: should create entry in `profiles` table

### Test 2: Check Database
```sql
SELECT id, email, full_name, created_at 
FROM public.profiles;
```

### Test 3: Check Admin
```sql
SELECT * FROM public.admin_users;
```

---

## If Still Getting Error

### Clear Browser Cache
- Press `Ctrl+Shift+Delete` (or Cmd+Shift+Delete on Mac)
- Clear all cache
- Reload page

### Restart Application
```bash
# Stop: Press Ctrl+C in terminal
# Restart:
npm run dev
```

### Check Supabase Connection
```sql
-- Verify all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Should show these tables:
- ✅ admin_users
- ✅ alert_logs
- ✅ disease_reports
- ✅ fertilizer_schedules
- ✅ marketplace_products
- ✅ nutrient_plans
- ✅ orders
- ✅ pest_alert_subscriptions
- ✅ profiles ← This one!
- ✅ treatment_records
- ✅ unsent_alerts

---

## Quick Checklist

- [ ] Updated SQL file downloaded
- [ ] Old table dropped (if exists)
- [ ] New SQL executed in Supabase
- [ ] `profiles` table verified
- [ ] Environment variables set
- [ ] Application restarted
- [ ] Can register new user
- [ ] Profile appears in database

---

✅ **You're fixed!** The `profiles` table error should now be resolved.

For more help, check `SUPABASE_COMPLETE_SETUP_GUIDE.md`
