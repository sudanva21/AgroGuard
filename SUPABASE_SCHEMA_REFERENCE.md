# 📊 AgroGuard AI - Database Schema Reference

## Quick Overview

```
AgroGuard AI Database Structure
│
├── 👤 User Management
│   ├── auth.users (Supabase built-in)
│   └── user_profiles
│
├── 🌾 Core Features
│   ├── disease_reports
│   ├── treatment_records
│   ├── fertilizer_schedules
│   └── nutrient_plans
│
├── 🛒 E-Commerce
│   ├── marketplace_products
│   ├── admin_users
│   └── orders
│
├── ⚠️ Alert System
│   ├── pest_alert_subscriptions
│   ├── alert_logs
│   └── unsent_alerts
│
└── 📦 Storage Buckets
    ├── disease-images
    ├── product-images
    └── user-avatars
```

---

## 📋 Tables Detail

### 1️⃣ user_profiles
**Purpose**: Extended user information  
**Ownership**: Individual user

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key, references auth.users |
| email | VARCHAR | User email |
| full_name | VARCHAR | Complete name |
| phone | VARCHAR | Contact number |
| location | TEXT | Farm location |
| farming_experience | VARCHAR | e.g., 'beginner', '5-10 years' |
| farm_size | VARCHAR | e.g., '1 acre', '5 hectares' |
| crops_grown | TEXT[] | Array of crop names |
| language | VARCHAR | Preferred language (default: 'en') |
| pest_alert_enabled | BOOLEAN | Alert subscription status |
| avatar_url | TEXT | Profile picture URL |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

**Security**: RLS enabled - users can only view/edit their own

---

### 2️⃣ disease_reports
**Purpose**: Store AI disease detection results  
**Ownership**: Individual user

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Report owner |
| crop_name | VARCHAR | Crop type e.g., 'Tomato' |
| detection_method | VARCHAR | 'symptoms', 'image', 'voice' |
| disease_name | VARCHAR | Detected disease |
| scientific_name | VARCHAR | Scientific name |
| severity | VARCHAR | 'low', 'moderate', 'high' |
| confidence | VARCHAR | Detection confidence |
| symptoms | JSONB | Array of symptoms |
| causes | JSONB | Disease causes |
| image_url | TEXT | Single image |
| image_urls | TEXT[] | Multiple images |
| created_at | TIMESTAMP | Report date |

**Indexes**: user_id, created_at, crop_name  
**Security**: RLS - only report owner can view

---

### 3️⃣ treatment_records
**Purpose**: Track treatments applied by users  
**Ownership**: Individual user

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| report_id | UUID | Links to disease_reports |
| user_id | UUID | Treatment owner |
| treatment_type | VARCHAR | 'chemical', 'organic', 'biological' |
| treatment_name | VARCHAR | Product name |
| dosage | VARCHAR | Application amount |
| application_date | DATE | When applied |
| effectiveness | VARCHAR | 'excellent', 'good', 'moderate', 'poor' |
| notes | TEXT | User notes |
| created_at | TIMESTAMP | Created time |

**Indexes**: report_id, user_id  
**Security**: RLS - only owner can view

---

### 4️⃣ marketplace_products
**Purpose**: Agricultural products catalog  
**Public viewing, Admin editing**

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Product ID |
| name | VARCHAR | Product name |
| category | VARCHAR | 'seeds', 'pesticides', 'fertilizers', 'tools' |
| price | DECIMAL | Price in rupees |
| unit | VARCHAR | 'kg', '1L', 'piece', etc. |
| description | TEXT | Short description |
| full_description | TEXT | Detailed description |
| supplier | VARCHAR | Supplier name |
| image | TEXT | Single image URL |
| images | TEXT[] | Multiple product images |
| verified | BOOLEAN | Admin verified status |
| in_stock | BOOLEAN | Stock status |
| stock_quantity | INTEGER | Available quantity |
| rating | DECIMAL | Average rating (0-5) |
| reviews | INTEGER | Review count |
| features | JSONB | Array of key features |
| specifications | JSONB | Technical specifications |
| usage_instructions | TEXT | How to use |
| warranty | TEXT | Warranty information |
| created_by | VARCHAR | Admin email who created |
| created_at | TIMESTAMP | Creation time |

**Indexes**: category, in_stock, name, rating  
**Security**: Public viewing, Admin-only editing

---

### 5️⃣ admin_users
**Purpose**: Manage marketplace admins  
**Admin only**

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Admin ID |
| email | VARCHAR | UNIQUE - admin email |
| role | VARCHAR | 'super_admin', 'admin', 'moderator' |
| created_at | TIMESTAMP | When added |
| created_by | VARCHAR | Who added this admin |
| updated_at | TIMESTAMP | Last update |

**Indexes**: email  
**Security**: RLS - only existing admins can manage

---

### 6️⃣ orders
**Purpose**: Track marketplace orders  
**Ownership**: Individual user + Admins**

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Order ID |
| user_id | UUID | Order owner |
| order_number | VARCHAR | UNIQUE - e.g., 'ORD20250101001' |
| items | JSONB | Array of ordered items |
| subtotal | DECIMAL | Items total |
| delivery_charge | DECIMAL | Shipping cost |
| total | DECIMAL | Final amount |
| full_name | VARCHAR | Delivery name |
| email | VARCHAR | Contact email |
| phone | VARCHAR | Contact phone |
| address | TEXT | Delivery address |
| city | VARCHAR | City |
| state | VARCHAR | State |
| pincode | VARCHAR | Postal code |
| payment_method | VARCHAR | 'cod', 'razorpay', 'upi' |
| payment_id | VARCHAR | Payment gateway ID |
| payment_status | VARCHAR | 'pending', 'completed', 'failed' |
| status | VARCHAR | 'confirmed', 'shipped', 'delivered' |
| tracking_number | VARCHAR | Courier tracking |
| created_at | TIMESTAMP | Order date |

**Indexes**: user_id, created_at, status  
**Security**: RLS - users see own, admins see all

---

### 7️⃣ pest_alert_subscriptions
**Purpose**: User subscription to pest alerts  
**Ownership**: Individual user**

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Subscription ID |
| user_id | UUID | UNIQUE - one per user |
| location | TEXT | Geographic location |
| crop | TEXT | Crop type to monitor |
| phone_number | TEXT | SMS/WhatsApp number |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Subscription date |
| updated_at | TIMESTAMP | Last update |

**Indexes**: user_id, is_active  
**Security**: RLS - users manage own only

---

### 8️⃣ alert_logs
**Purpose**: History of sent alerts  
**Ownership**: Individual user**

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Log ID |
| user_id | UUID | Alert recipient |
| pest_name | TEXT | Which pest |
| risk_level | TEXT | 'low', 'moderate', 'high', 'severe' |
| message | TEXT | Alert message |
| alert_type | TEXT | 'sms', 'whatsapp', 'in_app' |
| location | TEXT | Alert location |
| crop | TEXT | Affected crop |
| sent_at | TIMESTAMP | When sent |

**Indexes**: user_id, sent_at  
**Security**: RLS - users see own alerts only

---

### 9️⃣ unsent_alerts
**Purpose**: Queue for retry logic  
**Service role only**

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Alert ID |
| phone_number | TEXT | Recipient phone |
| message | TEXT | Alert message |
| alert_type | TEXT | 'sms', 'whatsapp' |
| link | TEXT | WhatsApp link if applicable |
| status | TEXT | 'pending', 'sent', 'failed' |
| retry_count | INTEGER | Number of retries |
| error_message | TEXT | If failed, why |
| created_at | TIMESTAMP | When created |
| processed_at | TIMESTAMP | When processed |

**Indexes**: status (where pending)  
**Security**: Service role only

---

### 🔟 fertilizer_schedules
**Purpose**: Track fertilizer applications  
**Ownership**: Individual user**

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Schedule ID |
| user_id | UUID | Schedule owner |
| crop | VARCHAR | Crop name |
| growth_stage | VARCHAR | e.g., 'vegetative', 'flowering' |
| soil_type | VARCHAR | Soil classification |
| nutrient_name | VARCHAR | Nutrient type |
| nutrient_source | VARCHAR | e.g., 'Urea', 'DAP' |
| dosage | VARCHAR | Amount to apply |
| timing | VARCHAR | When to apply |
| status | VARCHAR | 'pending' or 'completed' |
| application_date | DATE | When applied |
| notes | TEXT | Application notes |
| created_at | TIMESTAMP | Created time |
| updated_at | TIMESTAMP | Last update |

**Indexes**: user_id+crop, user_id+status  
**Security**: RLS - users manage own only

---

### 1️⃣1️⃣ nutrient_plans
**Purpose**: Store nutrient recommendations  
**Ownership**: Individual user**

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Plan ID |
| user_id | UUID | Plan owner |
| crop | VARCHAR | Crop type |
| growth_stage | VARCHAR | Growth stage |
| soil_type | VARCHAR | Soil classification |
| recommendations | JSONB | Full plan details |
| created_at | TIMESTAMP | Created date |

**Indexes**: user_id+crop  
**Security**: RLS - users view own only

---

## 🔐 Security & Policies

### Row Level Security (RLS)
All tables have RLS enabled. Rules:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| user_profiles | Own only | Own only | Own only | Own only |
| disease_reports | Own only | Own only | Own only | Own only |
| treatment_records | Own only | Own only | Own only | Own only |
| marketplace_products | Public | Admin only | Admin only | Admin only |
| admin_users | All | Admin only | Admin only | Admin only |
| orders | Own + Admin | Own | Admin | Admin |
| pest_alert_subscriptions | Own only | Own only | Own only | Own only |
| alert_logs | Own only | System | - | - |
| unsent_alerts | System | System | System | System |
| fertilizer_schedules | Own only | Own only | Own only | Own only |
| nutrient_plans | Own only | Own only | - | - |

---

## 🎯 Key Functions

### `get_real_user_stats(user_id)`
Returns user statistics:
- diseases_detected
- treatments_received
- queries_asked
- days_active
- orders_placed

### `is_admin(user_email)`
Returns true if user is admin

### `get_all_admins()`
Returns all admin users

---

## ⚙️ Triggers & Automation

Auto-update `updated_at` timestamp on:
- user_profiles
- disease_reports
- treatment_records
- marketplace_products
- orders
- admin_users
- pest_alert_subscriptions
- fertilizer_schedules

---

## 📦 Storage Buckets

### disease-images
- **Capacity**: 50GB per project (Supabase limit)
- **Access**: Public read, Authenticated upload
- **Use**: Disease detection photos

### product-images
- **Capacity**: 50GB per project
- **Access**: Public read, Admin upload
- **Use**: Marketplace product photos

### user-avatars
- **Capacity**: 50GB per project
- **Access**: Public read, Authenticated upload
- **Use**: User profile pictures

---

## 📊 Data Relationships

```
auth.users (Supabase)
    ├── user_profiles (1:1)
    ├── disease_reports (1:many)
    │   └── treatment_records (1:many)
    ├── orders (1:many)
    │   └── items (JSONB array)
    ├── pest_alert_subscriptions (1:1)
    │   └── alert_logs (1:many)
    ├── fertilizer_schedules (1:many)
    └── nutrient_plans (1:many)

admin_users
    └── marketplace_products (created_by)

marketplace_products
    └── orders (items array)
```

---

## 🔄 Common Queries

### Get User's Disease Reports
```sql
SELECT * FROM disease_reports 
WHERE user_id = auth.uid() 
ORDER BY created_at DESC;
```

### Get User Stats
```sql
SELECT * FROM get_real_user_stats(auth.uid());
```

### Get Active Products
```sql
SELECT * FROM marketplace_products 
WHERE in_stock = true AND verified = true 
ORDER BY rating DESC;
```

### Get User's Orders
```sql
SELECT * FROM orders 
WHERE user_id = auth.uid() 
ORDER BY created_at DESC;
```

### Get Pending Alerts
```sql
SELECT * FROM unsent_alerts 
WHERE status = 'pending' 
ORDER BY created_at ASC;
```

---

## 📏 Table Sizes (Typical)

| Table | Expected Size | Growth Rate |
|-------|---------------|------------|
| user_profiles | Small | Linear with users |
| disease_reports | Large | ~100 MB/10k reports |
| treatment_records | Small | Correlates to disease_reports |
| marketplace_products | Small | ~10-50 MB for 1000 products |
| orders | Large | ~50 MB/10k orders |
| pest_alert_subscriptions | Small | Linear with users |
| alert_logs | Very Large | ~1 GB/100k alerts |
| fertilizer_schedules | Medium | Correlates to disease reports |

---

## 🚀 Performance Tips

1. **Indexes**: All major tables have indexes on frequently queried fields
2. **Pagination**: Always use `limit` and `offset` for large queries
3. **RLS**: Minimal performance impact due to PostgreSQL optimization
4. **JSONB**: Use `@>` operator for efficient searches
5. **Timestamps**: Use `created_at DESC` for sorting (indexed)

---

## ✅ Verification Checklist

- [ ] All 11 tables created
- [ ] RLS enabled on all tables
- [ ] Triggers created and working
- [ ] Indexes present on all major fields
- [ ] Functions executable
- [ ] Storage buckets accessible
- [ ] Admin user set up
- [ ] Policies correctly configured

---

*Schema Version: 1.0*  
*Last Updated: November 2025*  
*For AgroGuard AI v1.0*
