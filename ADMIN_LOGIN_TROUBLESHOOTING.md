# 🔧 Admin Login Troubleshooting Guide

## ❌ Problem: "Invalid Credentials" Error

You're getting a login error because one of these issues:
1. ❌ User not created in Supabase Auth
2. ❌ Email not confirmed
3. ❌ Wrong password
4. ❌ Typo in email address

---

## 🔍 **Step 1: Diagnose the Issue (1 minute)**

### **Run Diagnostic SQL**

1. Open Supabase Dashboard: https://app.supabase.com
2. Go to **SQL Editor** → **New Query**
3. Copy and paste from file: `debug_admin_login.sql`
4. Click **"Run"**

### **Read the Results**

Look for these checks:

✅ **AUTH USER CHECK** - Should show 1 row with email confirmed
✅ **ADMIN PRIVILEGES CHECK** - Should show 1 row with super_admin role

If any check shows **0 rows**, that's your problem!

---

## 🛠️ **Step 2: Fix the Issue**

### **🔴 Issue A: User Doesn't Exist in Auth**

**Symptoms:**
- AUTH USER CHECK shows 0 rows
- Error: "Invalid login credentials"

**Solution:**

1. **Go to Supabase Dashboard**
2. **Navigate:** Authentication → Users
3. **Click:** "Add User" button (top right, green button)
4. **Fill in:**
   ```
   Email: sudanva20@gmail.com
   Password: 123456
   ```
5. **✅ CRITICAL:** Check the box "Auto Confirm User"
6. **Click:** "Create User"
7. **Verify:** You should see the user in the list

---

### **🔴 Issue B: Email Not Confirmed**

**Symptoms:**
- AUTH USER CHECK shows email_confirmed_at is NULL
- User exists but can't login

**Solution:**

1. **Go to:** Authentication → Users
2. **Find:** sudanva20@gmail.com in the list
3. **Click:** on the user row
4. **Click:** "Send Magic Link" or "Confirm Email" button
5. **Alternative:** Click three dots (⋮) → "Confirm Email"

**Or use SQL:**
```sql
-- Run this to manually confirm email
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'sudanva20@gmail.com';
```

---

### **🔴 Issue C: Admin Privileges Not Set**

**Symptoms:**
- ADMIN PRIVILEGES CHECK shows 0 rows
- User can login but no admin dashboard

**Solution:**

Run this SQL in SQL Editor:

```sql
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
```

---

## 🎯 **Complete Fix (All-in-One Solution)**

If you want to fix everything at once:

### **Method 1: Via Dashboard (Recommended)**

**Step-by-Step Video Instructions:**

1. **Create User:**
   - Dashboard → Authentication → Users
   - Click "Add User"
   - Email: `sudanva20@gmail.com`
   - Password: `123456`
   - ✅ Check "Auto Confirm User"
   - Click "Create User"

2. **Grant Admin:**
   - Dashboard → SQL Editor → New Query
   - Paste from `fix_admin_login.sql`
   - Click "Run"
   - Look for: "🎉 ALL CHECKS PASSED!"

---

### **Method 2: Manual Verification**

If dashboard isn't working, verify each step:

#### **1. Check Auth User Exists:**
```sql
SELECT * FROM auth.users WHERE email = 'sudanva20@gmail.com';
```
**Expected:** 1 row with confirmed email

#### **2. If No User, Create Via Dashboard:**
- Cannot create via SQL (security restriction)
- MUST use: Authentication → Users → Add User

#### **3. If Email Not Confirmed:**
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'sudanva20@gmail.com';
```

#### **4. Grant Admin Privileges:**
```sql
INSERT INTO public.admin_users (email, role, created_by)
VALUES ('sudanva20@gmail.com', 'super_admin', 'system')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';
```

---

## 🧪 **Test the Login**

After fixing:

1. **Clear Browser Cache:**
   - Press Ctrl+Shift+Delete
   - Clear "Cached images and files"
   - Click "Clear data"

2. **Reload Application:**
   - Go to: http://localhost:5173/login
   - Hard refresh: Ctrl+Shift+R

3. **Try Login:**
   ```
   Email: sudanva20@gmail.com
   Password: 123456
   ```

4. **Success Indicators:**
   - ✅ No error message
   - ✅ Redirects to home page
   - ✅ User menu shows profile
   - ✅ "Admin Dashboard" link visible

---

## 🐛 **Still Not Working?**

### **Debug Checklist:**

#### **1. Verify Credentials Exactly:**
```
Email: sudanva20@gmail.com (all lowercase, no spaces)
Password: 123456 (no spaces, exactly 6 digits)
```

#### **2. Check Supabase Connection:**

Run in browser console (F12):
```javascript
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Has ANON_KEY:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
```

Should show your Supabase URL and `true`

#### **3. Check Auth Configuration:**

Dashboard → Authentication → Policies → Check if:
- "Enable email confirmations" is OFF (or email is confirmed)
- "Enable email signup" is ON

#### **4. Test with Different Browser:**
- Try Chrome Incognito
- Try Firefox Private Window
- Clears all cache/cookies issues

#### **5. Check Console for Errors:**

Open browser console (F12) → Console tab
Look for red errors when clicking login

Common errors:
- `Invalid login credentials` → User doesn't exist or wrong password
- `Email not confirmed` → Need to confirm email
- `Network error` → Check .env file Supabase credentials

---

## 📋 **Quick Reference Commands**

### **Check User Status:**
```sql
SELECT 
  email, 
  email_confirmed_at,
  created_at 
FROM auth.users 
WHERE email = 'sudanva20@gmail.com';
```

### **Confirm Email:**
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'sudanva20@gmail.com';
```

### **Grant Admin:**
```sql
INSERT INTO admin_users (email, role, created_by)
VALUES ('sudanva20@gmail.com', 'super_admin', 'system')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';
```

### **Check Admin Status:**
```sql
SELECT * FROM admin_users WHERE email = 'sudanva20@gmail.com';
```

---

## 🎬 **Complete Setup Video Guide**

### **Time: 3 minutes**

**Part 1: Create Auth User (1 min)**
1. Go to Supabase Dashboard
2. Authentication → Users → Add User
3. Fill email and password
4. Check "Auto Confirm"
5. Click Create

**Part 2: Grant Admin (1 min)**
1. SQL Editor → New Query
2. Copy from `create_admin_user.sql`
3. Paste and Run
4. Verify success message

**Part 3: Test Login (1 min)**
1. Go to http://localhost:5173/login
2. Enter credentials
3. Login successfully
4. Check for Admin Dashboard link

---

## ✅ **Success Checklist**

Before calling it done:

- [ ] User exists in Authentication → Users
- [ ] Email shows as "Confirmed" (green checkmark)
- [ ] Email exists in admin_users table
- [ ] Role is "super_admin"
- [ ] Can login without errors
- [ ] Profile menu shows user info
- [ ] "Admin Dashboard" link visible
- [ ] Admin Dashboard page accessible

---

## 📞 **Get Help**

If still stuck, provide this info:

1. **Screenshot of**: Authentication → Users (showing your user)
2. **Result of**: `SELECT * FROM auth.users WHERE email = 'sudanva20@gmail.com';`
3. **Result of**: `SELECT * FROM admin_users WHERE email = 'sudanva20@gmail.com';`
4. **Error message**: Exact text from login error
5. **Browser console**: Any red errors (F12 → Console)

---

## 🚀 **Alternative: Create Different Admin**

If `sudanva20@gmail.com` keeps failing, try a different email:

1. Use: `admin@test.com` / `123456`
2. Follow same steps as above
3. Test if that works
4. If yes, then issue is specific to sudanva20@gmail.com email

---

**Most Common Solution: The user wasn't created with "Auto Confirm User" checked. Recreate it with that checkbox enabled!** ✅
