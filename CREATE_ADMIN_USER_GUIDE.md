# 👤 Create Admin User Guide

## Admin Credentials
- **Email:** `sudanva20@gmail.com`
- **Password:** `123456`
- **Role:** `super_admin`

---

## 🚀 Quick Setup (3 Methods)

### **Method 1: Via Supabase Dashboard (EASIEST) ⭐**

This is the **recommended method** - takes only 2 minutes!

#### **Step 1: Create Auth User**

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Sign in to your account
   - Select your project

2. **Navigate to Authentication**
   - Click **"Authentication"** in left sidebar
   - Click **"Users"** tab

3. **Add New User**
   - Click **"Add User"** button (top right)
   - Fill in the form:
     ```
     Email: sudanva20@gmail.com
     Password: 123456
     ```
   - ✅ **IMPORTANT:** Check **"Auto Confirm User"** checkbox
   - Click **"Create User"**

4. **Success!**
   - You should see the new user in the users list
   - Email status should show as "Confirmed"

#### **Step 2: Grant Admin Privileges**

1. **Go to SQL Editor**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New Query"**

2. **Run SQL Script**
   - Copy and paste this SQL:
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

   -- Verify
   SELECT * FROM public.admin_users WHERE email = 'sudanva20@gmail.com';
   ```

3. **Execute Query**
   - Click **"Run"** (or press Ctrl+Enter)
   - You should see 1 row returned with admin details

4. **Done!** ✅
   - Admin user is now ready
   - You can login with the credentials

---

### **Method 2: Via SQL Script Only (If Dashboard Fails)**

If you can't create the auth user via dashboard, use this SQL:

#### **Step 1: Run SQL File**

1. Open Supabase SQL Editor
2. Open file: `create_admin_user.sql`
3. Copy all contents
4. Paste into SQL Editor
5. Click "Run"

#### **Step 2: Set Password Manually**

Since SQL can't create auth users directly, you need to:

1. Go to **Authentication → Users**
2. Find user `sudanva20@gmail.com`
3. Click on the user
4. Click **"Reset Password"**
5. Set password to: `123456`
6. Save

---

### **Method 3: Via API Script (Advanced)**

Use this if you have the service role key.

#### **Prerequisites:**
- Node.js installed
- Supabase Service Role Key (from Supabase Dashboard → Settings → API)

#### **Step 1: Add Service Role Key**

Open `.env` file and add:
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**To get Service Role Key:**
1. Supabase Dashboard → Settings → API
2. Copy **"service_role" key** (secret!)
3. Paste into `.env`

#### **Step 2: Run Script**

```bash
# Install dependencies
npm install @supabase/supabase-js

# Run script
node create_admin_user_api.js
```

**Expected Output:**
```
🚀 Creating admin user...
📧 Creating Supabase Auth user...
✅ Auth user created successfully!
👑 Adding admin privileges...
✅ Admin privileges granted!
🎉 Admin user created successfully!
```

---

## 🧪 Verify Admin User

### **1. Check in Supabase Dashboard**

**Authentication:**
- Go to **Authentication → Users**
- Find `sudanva20@gmail.com`
- Status should be "Confirmed"

**Admin Table:**
- Go to **Table Editor → admin_users**
- Find row with email `sudanva20@gmail.com`
- Role should be `super_admin`

### **2. Test Login**

1. Open your application: http://localhost:5173
2. Go to Login page
3. Enter credentials:
   ```
   Email: sudanva20@gmail.com
   Password: 123456
   ```
4. Click "Sign In"
5. You should be logged in successfully

### **3. Access Admin Dashboard**

After login:
1. Click on profile/menu
2. Look for "Admin Dashboard" link
3. Click it
4. You should see admin interface with:
   - User management
   - Product management
   - Analytics
   - System settings

---

## 🔐 Admin Features Accessible

With `super_admin` role, you can:

✅ **User Management**
- View all registered users
- Manage user accounts
- Add/remove admin privileges

✅ **Product Management**
- Add/edit/delete marketplace products
- Manage product categories
- Update stock and pricing

✅ **Content Management**
- Manage disease detection database
- Update treatment recommendations
- Modify pest alerts

✅ **Analytics & Reports**
- View platform statistics
- Monitor user activity
- Track sales and orders

✅ **System Administration**
- Add/remove other admins
- Configure system settings
- Access logs and debugging info

---

## 🛠️ Troubleshooting

### **Issue: "Invalid login credentials"**

**Solution:**
1. Make sure auth user was created successfully
2. Check if email is confirmed (Auto Confirm should be checked)
3. Verify password is exactly: `123456`
4. Try password reset in Supabase Dashboard

### **Issue: "Logged in but no Admin Dashboard"**

**Solution:**
1. Verify email exists in `admin_users` table:
   ```sql
   SELECT * FROM admin_users WHERE email = 'sudanva20@gmail.com';
   ```
2. If not found, run the SQL script again
3. Check role is `super_admin`
4. Logout and login again

### **Issue: "User already exists" error**

**Solution:**
- This is okay! User was already created
- Just run the SQL script to grant admin privileges
- Skip the auth user creation step

### **Issue: SQL script fails**

**Check:**
1. Table `admin_users` exists:
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_name = 'admin_users';
   ```
2. If table doesn't exist, run `COMPLETE_SUPABASE_SETUP.sql` first
3. Check you have proper permissions

---

## 📊 Admin User Schema

The `admin_users` table structure:

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Roles:**
- `super_admin` - Full access (your role)
- `admin` - Standard admin access
- `moderator` - Limited admin access

---

## 🔄 Additional Admin Users

To add more admins later:

### **Via Admin Dashboard:**
1. Login as admin
2. Go to Admin Dashboard
3. Navigate to "Admin Management"
4. Click "Add New Admin"
5. Enter email and select role
6. Send invitation

### **Via SQL:**
```sql
INSERT INTO public.admin_users (email, role, created_by)
VALUES ('newemail@example.com', 'admin', 'sudanva20@gmail.com');
```

---

## 🎯 Next Steps After Creating Admin

1. ✅ **Login** with admin credentials
2. ✅ **Access Admin Dashboard**
3. ✅ **Verify all admin features** work
4. ✅ **Add 20 marketplace products** (if not done already)
5. ✅ **Test the entire platform** with admin privileges
6. ✅ **Prepare for presentation** with full access

---

## 🔒 Security Notes

⚠️ **Important Security Reminders:**

1. **Change Default Password**
   - After first login, change password to something stronger
   - Use Settings → Security → Change Password

2. **Keep Service Role Key Secret**
   - Never commit `.env` to Git
   - Never share service role key
   - It has full database access

3. **For Production:**
   - Use strong passwords (min 12 characters)
   - Enable 2FA if available
   - Regularly audit admin user list
   - Use environment-specific credentials

---

## ✅ Success Checklist

Before presenting, verify:

- [ ] Admin user created in Supabase Auth
- [ ] Email confirmed/verified
- [ ] Email added to `admin_users` table
- [ ] Role set to `super_admin`
- [ ] Can login successfully
- [ ] Admin Dashboard accessible
- [ ] All admin features working
- [ ] Can manage products
- [ ] Can add/remove users

---

## 📞 Quick Reference

**Login URL:** http://localhost:5173/login
**Email:** sudanva20@gmail.com
**Password:** 123456
**Role:** super_admin
**Admin Dashboard:** http://localhost:5173/admin

---

**You're all set! Login and start managing your agricultural platform! 🌾**
