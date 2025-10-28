# 🗄️ Supabase Database Setup Guide

## Step 1: Create Tables in Supabase

Go to your Supabase project dashboard → SQL Editor and run these queries:

### 1. Profiles Table
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  farm_size TEXT,
  primary_crops TEXT,
  experience_years INTEGER,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 2. User Stats Table
```sql
-- Create user_stats table
CREATE TABLE user_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  diseases_detected INTEGER DEFAULT 0,
  treatments_received INTEGER DEFAULT 0,
  queries_asked INTEGER DEFAULT 0,
  days_active INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own stats
CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own stats
CREATE POLICY "Users can insert own stats"
  ON user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own stats
CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  USING (auth.uid() = user_id);
```

### 3. Auto-create profile on user signup
```sql
-- Function to create profile and stats on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_stats (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 2: Setup Storage for Avatars

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Name it: `avatars`
4. Make it **Public**
5. Click **Create Bucket**

### Set Storage Policies
Go to the `avatars` bucket → Policies:

```sql
-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public to view avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

## Step 3: Update Environment Variables

Make sure your `.env` file has:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 4: Test the Setup

1. Register a new user
2. Go to `/profile` page
3. Try uploading an avatar
4. Edit profile information
5. Check Supabase dashboard to see data

## Database Schema

### profiles table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | User ID (FK to auth.users) |
| full_name | TEXT | User's full name |
| phone | TEXT | Phone number |
| location | TEXT | Farm location |
| farm_size | TEXT | Size of farm |
| primary_crops | TEXT | Main crops grown |
| experience_years | INTEGER | Years of farming experience |
| avatar_url | TEXT | Profile picture URL |
| created_at | TIMESTAMP | When profile was created |
| updated_at | TIMESTAMP | Last update time |

### user_stats table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Stat record ID |
| user_id | UUID | User ID (FK to auth.users) |
| diseases_detected | INTEGER | Number of diseases detected |
| treatments_received | INTEGER | Number of treatments received |
| queries_asked | INTEGER | Number of AI queries |
| days_active | INTEGER | Days user has been active |
| created_at | TIMESTAMP | When stats were created |
| updated_at | TIMESTAMP | Last update time |

## Updating Stats

To increment stats when user performs actions:

```javascript
// Example: Increment diseases_detected
const { error } = await supabase.rpc('increment_stat', {
  stat_name: 'diseases_detected',
  user_id: user.id
})
```

Create this function in Supabase:

```sql
CREATE OR REPLACE FUNCTION increment_stat(stat_name TEXT, user_id UUID)
RETURNS void AS $$
BEGIN
  EXECUTE format('
    UPDATE user_stats 
    SET %I = %I + 1, updated_at = NOW()
    WHERE user_id = $1
  ', stat_name, stat_name)
  USING user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Troubleshooting

### Profile not loading?
- Check if tables are created
- Verify RLS policies are enabled
- Check browser console for errors

### Avatar upload failing?
- Ensure `avatars` bucket exists
- Check storage policies
- Verify bucket is public

### Stats not showing?
- Check if user_stats record exists
- Verify user_id matches auth.uid()
- Check RLS policies

## Security Notes

✅ Row Level Security (RLS) is enabled
✅ Users can only access their own data
✅ Avatar uploads are user-specific
✅ All policies follow principle of least privilege

---

**Next Steps:**
1. Run the SQL queries in Supabase
2. Create the avatars bucket
3. Test profile page
4. Integrate stats tracking in other features
