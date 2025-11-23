# ⚡ AgroGuard AI - Supabase Quick Start (5 Minutes)

## 🎯 Goal
Get your complete Supabase database set up in 5 minutes

---

## 📋 Before You Start

- ✅ Supabase account created
- ✅ New project created in Supabase
- ✅ Project is initialized (green checkmark shows in dashboard)

---

## 5️⃣ Quick Steps

### Step 1: Get Your Credentials (30 seconds)
```
1. Open Supabase Dashboard
2. Click Settings → API
3. Copy & save:
   - Project URL
   - Anon Key
```

### Step 2: Open SQL Editor (15 seconds)
```
1. In Supabase sidebar, click "SQL Editor"
2. Click "New query"
```

### Step 3: Copy & Paste SQL (30 seconds)
```
1. Open file: COMPLETE_SUPABASE_SETUP.sql
2. Copy ALL content (Ctrl+A → Ctrl+C)
3. Paste into SQL Editor (Ctrl+V)
```

### Step 4: Execute (2 minutes)
```
1. Click "RUN" button (top right)
2. Wait for green checkmark
3. See "Success" message at bottom
```

### Step 5: Update Admin Email (1 minute)
```
Create NEW query, paste this:
```

```sql
UPDATE public.admin_users 
SET email = 'YOUR_EMAIL@gmail.com' 
WHERE email = 'sudanva@gmail.com';
```

```
Click RUN
```

### Step 6: Verify (1 minute)
```
Create NEW query, paste this:
```

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

```
Should show 11 tables:
✅ admin_users
✅ alert_logs
✅ disease_reports
✅ fertilizer_schedules
✅ marketplace_products
✅ nutrient_plans
✅ orders
✅ pest_alert_subscriptions
✅ treatment_records
✅ unsent_alerts
✅ user_profiles
```

---

## 📝 Update Environment File

Open `.env` file in your project root:

```env
# Replace these with YOUR credentials:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get values from: **Settings → API** in Supabase dashboard

---

## 🧪 Test Your Setup

### Test 1: Create a Test Product
```sql
INSERT INTO public.marketplace_products (
  name, category, price, unit, description, supplier
) VALUES (
  'Test Seeds',
  'seeds',
  100,
  '1kg',
  'Test product',
  'Test Supplier'
);
```

### Test 2: View Products
```sql
SELECT * FROM public.marketplace_products LIMIT 5;
```

### Test 3: Check Admin
```sql
SELECT * FROM public.admin_users;
```

---

## ✅ Success Criteria

Your setup is complete when:

- ✅ SQL executed with no errors
- ✅ 11 tables created
- ✅ Admin email updated
- ✅ Environment variables set
- ✅ Test queries return data

---

## 🚀 Next Steps

1. **Run the application:**
   ```bash
   npm install
   npm run dev
   ```

2. **Test in browser:**
   - Go to http://localhost:5173
   - Register a new account
   - Try disease detection
   - Check marketplace

3. **Access admin dashboard:**
   - Log in with your admin email
   - Go to `/admin-dashboard-2025`

---

## 🔐 Important: Keep Safe

**DO NOT SHARE:**
- ❌ Service Role Key
- ❌ Database password
- ❌ API credentials

**SAFE TO SHARE:**
- ✅ Project URL (public)
- ✅ Anon Key (public, read-only)

---

## 🆘 Troubleshooting

### "Permission denied"
→ Make sure you're logged in to Supabase

### "Syntax error in SQL"
→ Copy entire file again, don't edit

### "Tables not showing"
→ Refresh Supabase dashboard or reload page

### Can't login to app
→ Check `.env` file has correct credentials

---

## 📞 Still Need Help?

1. Check **SUPABASE_COMPLETE_SETUP_GUIDE.md** for detailed steps
2. Check **SUPABASE_SCHEMA_REFERENCE.md** for table details
3. Visit Supabase Docs: https://supabase.com/docs

---

## 🎉 That's It!

Your AgroGuard AI database is ready. Start building! 🌾

---

**Time invested: ~5 minutes**  
**Value unlocked: Complete production-ready database**

---

*For detailed information, see the other documentation files in the project.*
