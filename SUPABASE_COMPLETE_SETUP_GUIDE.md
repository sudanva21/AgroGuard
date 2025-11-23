# 🌾 AgroGuard AI - Complete Supabase Setup Guide

## Overview

This guide will walk you through setting up your complete Supabase database for AgroGuard AI. The `COMPLETE_SUPABASE_SETUP.sql` file contains everything you need - all tables, functions, policies, and configurations.

---

## 📋 Prerequisites

- ✅ Supabase account (free at https://supabase.com)
- ✅ Supabase project created
- ✅ Project URL and API keys ready
- ✅ Access to SQL Editor in Supabase

---

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in or create an account
4. Click "New project"
5. Fill in:
   - **Project name**: AgroGuard AI
   - **Database password**: Create a strong password
   - **Region**: Choose closest to your location (India region recommended)
6. Click "Create new project"
7. Wait for project to initialize (2-3 minutes)

### Step 2: Get Your Credentials

1. In Supabase dashboard, go to **Settings → API**
2. Note down:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJhbGc...` (this is your public key)
   - **Service Role Key**: Keep this secret (for server-side operations)

### Step 3: Run the Setup SQL

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire content from `COMPLETE_SUPABASE_SETUP.sql` file
4. Paste it into the SQL editor
5. Click the **"RUN"** button (top right)
6. Wait for execution to complete
7. You'll see "Success" message at the bottom

### Step 4: Update Admin Email

After the SQL runs successfully:

1. Still in SQL Editor, create a **new query**
2. Run this command (replace with your email):

```sql
UPDATE public.admin_users 
SET email = 'your-email@example.com' 
WHERE email = 'sudanva@gmail.com';
```

3. Click RUN
4. Verify with this query:

```sql
SELECT * FROM public.admin_users;
```

---

## 📊 What Gets Created

### Core Tables

| Table | Purpose | Records |
|-------|---------|---------|
| `user_profiles` | User account information | User data |
| `disease_reports` | Disease detection records | 1000s of reports |
| `treatment_records` | Applied treatments tracking | Treatment history |
| `admin_users` | Admin/staff accounts | Your admin team |

### Marketplace Tables

| Table | Purpose |
|-------|---------|
| `marketplace_products` | Agricultural products for sale |
| `orders` | Customer orders |

### Alert System Tables

| Table | Purpose |
|-------|---------|
| `pest_alert_subscriptions` | User subscription to pest alerts |
| `alert_logs` | History of sent alerts |
| `unsent_alerts` | Queue of alerts to send/retry |

### Advisory Tables

| Table | Purpose |
|-------|---------|
| `fertilizer_schedules` | Fertilizer application tracking |
| `nutrient_plans` | Nutrient recommendations |

### Storage Buckets

| Bucket | Purpose |
|--------|---------|
| `disease-images` | Disease detection photos |
| `product-images` | Marketplace product images |
| `user-avatars` | User profile pictures |

---

## 🔐 Security Features Included

✅ **Row Level Security (RLS)** - Enabled on all tables
✅ **Policies** - Users can only see their own data
✅ **Admin checks** - Only admins can modify products
✅ **Functions** - PostgreSQL functions for statistics
✅ **Encryption** - Built-in Supabase encryption

---

## 📝 Environment Configuration

After setup, update your `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...paste_your_anon_key_here

# Other configurations remain the same
VITE_GROQ_API_KEY=...
VITE_HUGGINGFACE_API_KEY=...
# etc.
```

**Do NOT share the Service Role Key publicly** - only use it on your server.

---

## ✨ Key Features Configured

### 1. **Authentication**
- User registration & login
- Password recovery
- Email verification

### 2. **User Profiles**
- Store farming experience
- Track farm size
- Store language preference
- Save avatar/profile picture

### 3. **Disease Detection**
- Save detection reports
- Store multiple images
- Track disease symptoms
- Record severity levels

### 4. **Treatment Tracking**
- Link treatments to diseases
- Record application dates
- Track effectiveness
- Store application notes

### 5. **Marketplace**
- Admin product management
- Multi-image product support
- Inventory tracking
- Order management with Razorpay integration

### 6. **Pest Alerts**
- Subscribe to pest alerts
- Track alert history
- Queue system for SMS/WhatsApp

### 7. **Nutrient Advisory**
- Save fertilizer schedules
- Track application progress
- Store nutrient plans

---

## 🧪 Testing Your Setup

### Test 1: Check Tables
Go to SQL Editor and run:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see all 12 tables listed.

### Test 2: Check RLS Policies
```sql
-- View all security policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

### Test 3: Create Test Data
```sql
-- Insert test product (as admin)
INSERT INTO public.marketplace_products (
  name, category, price, unit, description, supplier, verified, in_stock
) VALUES (
  'Test Tomato Seeds',
  'seeds',
  450,
  '100g',
  'High-yielding variety',
  'Test Supplier',
  true,
  true
);
```

---

## 🛠️ Admin Functions

### Add New Admin

Go to SQL Editor and run:

```sql
INSERT INTO public.admin_users (email, created_by, role)
VALUES ('admin@example.com', 'your-email@example.com', 'admin')
ON CONFLICT (email) DO NOTHING;
```

### Get User Statistics

```sql
SELECT * FROM get_real_user_stats('user-uuid-here');
```

### Check Admin List

```sql
SELECT * FROM get_all_admins();
```

---

## 📱 Storage Policies Setup

After SQL setup, configure storage access:

1. Go to **Storage** section in Supabase
2. For each bucket (`disease-images`, `product-images`, `user-avatars`):

```sql
-- Create policy for uploads
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'disease-images');

-- Create policy for views
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'disease-images');

-- Create policy for deletes
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'disease-images');
```

---

## 🚨 Troubleshooting

### Issue: "Permission denied" error

**Solution**: Check if RLS is enabled and policies are correct.
```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'disease_reports';
```

### Issue: Can't insert data

**Solution**: Make sure you're authenticated and policies allow it.
- Check if you have correct user ID
- Verify RLS policies on the table

### Issue: Functions not working

**Solution**: Grant execute permissions:
```sql
GRANT EXECUTE ON FUNCTION get_real_user_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(TEXT) TO authenticated;
```

### Issue: Bucket errors

**Solution**: Create storage policies (see Storage Policies section above)

---

## 📞 Database Summary

```
Total Tables: 12
- 3 core tables (profiles, disease, treatment)
- 2 marketplace tables (products, orders)
- 3 alert tables (subscriptions, logs, unsent)
- 2 advisory tables (fertilizer, nutrient)
- 1 admin table (admin_users)

Indexes: 25+
Functions: 3
Triggers: 8
Row Level Security: Enabled on all tables
Storage Buckets: 3
```

---

## ✅ Setup Checklist

- [ ] Supabase project created
- [ ] SQL file executed successfully
- [ ] Admin email updated
- [ ] Environment variables updated in .env
- [ ] Tables verified in SQL Editor
- [ ] Test product created
- [ ] Storage policies configured
- [ ] Application tested with new database

---

## 🔄 Production Deployment

Before deploying to production:

1. **Update admin email** - Use your production admin email
2. **Enable SMTP** - Configure email for password reset
3. **Set up backups** - Supabase does daily backups by default
4. **Review security** - Check all RLS policies
5. **Test payment gateway** - Verify Razorpay integration
6. **Set up monitoring** - Use Supabase dashboard to monitor

---

## 📚 Additional Resources

- Supabase Docs: https://supabase.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- AgroGuard AI Docs: Check `/docs` folder in your project

---

## 🎉 You're All Set!

Your AgroGuard AI database is now complete and ready to use. Users can now:
- Register and create accounts
- Upload disease photos and get AI analysis
- Browse and purchase agricultural products
- Subscribe to pest alerts
- Track fertilizer applications
- And much more!

**Happy Farming! 🌾**

---

*Last Updated: November 2025*
*For support, check the documentation in the /docs folder*
