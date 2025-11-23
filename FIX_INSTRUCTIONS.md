# Fix Schema Cache Error - Step by Step

## ⚠️ Problem
```
Could not find the 'experience_years' column of 'profiles' in the schema cache
406 Not Acceptable errors from REST API
```

**Cause**: Old table schema is cached by Supabase

---

## ✅ Solution (3 Steps)

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project: https://app.supabase.com
2. Go to **SQL Editor** (in left sidebar)
3. Click **New Query**

### Step 2: Run the FIX Script
Copy and paste the entire contents of **`FIX_SCHEMA_CACHE.sql`** into the SQL Editor.

Then click **RUN**.

**What it does:**
- ✅ Drops the old broken profiles table
- ✅ Recreates it with correct columns (experience_years, primary_crops, etc.)
- ✅ Rebuilds all triggers and policies
- ✅ Clears schema cache

### Step 3: Run the Complete Setup
Copy and paste the entire contents of **`COMPLETE_SUPABASE_SETUP.sql`** into a NEW SQL Query.

Then click **RUN**.

**What it does:**
- ✅ Keeps the profiles table you just fixed
- ✅ Creates all 11 database tables
- ✅ Sets up all RLS policies
- ✅ Creates storage buckets
- ✅ Sets up functions and triggers

---

## 🧪 Verify It Works

1. **Check Supabase Dashboard → SQL Editor**
   ```sql
   -- Copy this to verify profiles table has correct columns
   SELECT * FROM public.profiles LIMIT 1;
   ```
   Should show columns: `experience_years`, `primary_crops`, `avatar_url`, etc.

2. **Test your app:**
   - Register a new user
   - Profile page should load without errors
   - Should see all input fields (experience years, crops, etc.)
   - Should be able to upload avatar

---

## 📋 Files Updated

| File | Purpose |
|------|---------|
| **FIX_SCHEMA_CACHE.sql** | Fixes the immediate schema error (run FIRST) |
| **COMPLETE_SUPABASE_SETUP.sql** | Complete setup (run SECOND) |
| **FIX_INSTRUCTIONS.md** | This guide |

---

## ❓ Still Having Issues?

If you still see errors:

1. **In Supabase Dashboard → SQL Editor**
   - Run this cleanup:
   ```sql
   DROP TABLE IF EXISTS public.profiles CASCADE;
   ```

2. **Then run FIX_SCHEMA_CACHE.sql again**

3. **Clear your browser cache**
   - Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Close and reopen your app

4. **Check Supabase Console → Logs**
   - Look for any red error messages

---

## ✨ Expected Result

After these steps:
- ✅ Profile page loads
- ✅ All fields visible (experience_years, primary_crops, etc.)
- ✅ Can edit and save profile
- ✅ Can upload avatar
- ✅ No 406 errors in browser console
- ✅ Database ready for your app
