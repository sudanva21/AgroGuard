# AgroGuard Database Fix - Complete Resolution

## Errors Being Fixed
- ❌ "null value in column 'email' of relation 'profiles' violates not-null constraint"
- ❌ 406 Not Acceptable errors on GET requests
- ❌ 400 Bad Request errors on POST requests
- ❌ Schema cache staleness issues

## Root Causes
1. **Email constraint violation**: Trigger function wasn't handling null emails properly
2. **RLS policy blocks**: Policies were too restrictive for authenticated users
3. **Schema cache stale**: Old table definitions were cached by Supabase

## Solution Steps (DO IN ORDER)

### Step 1: Clear Previous Data (Optional but Recommended)
If you've had previous failed attempts, delete all test profiles from Supabase Dashboard:
1. Go to Supabase Dashboard → SQL Editor
2. Run:
```sql
DELETE FROM public.profiles;
```

### Step 2: Run the Updated SQL Setup
1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. **Copy the ENTIRE content** of `COMPLETE_SUPABASE_SETUP.sql`
4. Paste it into the SQL Editor
5. Click "RUN"
6. Wait for completion (should say "Success" in green)

### Step 3: Verify the Fix
1. Sign out of your app completely
2. Sign up with a NEW email address (critical - use a different email than before)
3. Check if Profile page loads without errors
4. If it loads, check your browser console - there should be NO 406 or 400 errors

### Step 4: Test Profile Updates
1. Update any profile fields (name, location, etc.)
2. Verify the update saves without errors
3. Refresh the page - data should persist

## What Was Fixed in COMPLETE_SUPABASE_SETUP.sql

### Fix #1: Email Constraint (Lines 81-87)
**Before:**
```sql
NEW.email,  -- Could be NULL
```

**After:**
```sql
COALESCE(NEW.email, ''),  -- Never NULL
```

### Fix #2: RLS Policies (Lines 57-82)
Added comprehensive policies:
- ✅ Users can view own profile
- ✅ Users can update own profile  
- ✅ Users can insert own profile
- ✅ Anon users can read profiles (for signup)
- ✅ Anon users can insert profiles (for signup)

### Fix #3: Schema Cache (Lines 21-29)
Clear complete table structure:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
```

## Troubleshooting

**Still getting 406 errors?**
- Clear browser cache (Ctrl+Shift+Delete)
- Sign out completely
- Try signing up with a NEW email address
- Check that Supabase project shows "profiles" table with correct columns

**Still getting email constraint error?**
- Make sure you ran the ENTIRE COMPLETE_SUPABASE_SETUP.sql file
- Check that the trigger function shows `COALESCE(NEW.email, '')`
- Run the fix again if needed

**Profile page shows blank?**
- Refresh the page
- Check browser console for errors
- Verify you're signed in to correct account

## Files Modified
- ✅ `COMPLETE_SUPABASE_SETUP.sql` - Updated with all fixes

## Next Steps After Verification
Once everything works:
1. Continue using the app normally
2. No further database setup needed
3. All new users should auto-create profiles without errors
