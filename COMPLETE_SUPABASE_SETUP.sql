-- =====================================================
-- AGROGUARD AI - COMPLETE SUPABASE DATABASE SETUP
-- =====================================================
-- This SQL file contains the complete database schema
-- for AgroGuard AI application. Run this entire file
-- in your Supabase SQL Editor to set up everything.
--
-- Setup Instructions:
-- 1. Go to supabase.com and create a new project
-- 2. Go to SQL Editor
-- 3. Create a new query and paste ALL of this code
-- 4. Click "RUN" to execute
-- 5. After execution, replace 'sudanva@gmail.com' with your admin email
--
-- =====================================================

-- =====================================================
-- 1. AUTHENTICATION & USER PROFILES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  location TEXT,
  farming_experience VARCHAR(50),
  farm_size VARCHAR(50),
  crops_grown TEXT[], -- Array of crop names
  bio TEXT,
  avatar_url TEXT,
  
  -- Preferences
  language VARCHAR(10) DEFAULT 'en',
  pest_alert_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. DISEASE DETECTION & REPORTS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.disease_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Detection details
  crop_name VARCHAR(100) NOT NULL,
  detection_method VARCHAR(50) NOT NULL, -- 'symptoms', 'image', 'voice'
  
  -- Disease information
  disease_name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255),
  severity VARCHAR(50),
  confidence VARCHAR(20),
  description TEXT,
  urgency TEXT,
  
  -- Symptoms and causes
  symptoms JSONB, -- Array of symptoms
  causes JSONB, -- Array of causes
  
  -- Input data
  input_symptoms JSONB, -- Original symptom inputs
  image_url TEXT, -- Single image URL
  image_urls TEXT[], -- Multiple image URLs
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disease_reports_user_id ON public.disease_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_disease_reports_created_at ON public.disease_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_disease_reports_crop ON public.disease_reports(crop_name);

-- Enable RLS
ALTER TABLE public.disease_reports ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own reports"
  ON public.disease_reports
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON public.disease_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON public.disease_reports
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON public.disease_reports
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 3. TREATMENT RECORDS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.treatment_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.disease_reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Treatment details
  treatment_type VARCHAR(50) NOT NULL, -- 'chemical', 'organic', 'biological'
  treatment_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(255),
  application_date DATE,
  application_method TEXT,
  
  -- Results
  effectiveness VARCHAR(50), -- 'excellent', 'good', 'moderate', 'poor'
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_treatment_records_report_id ON public.treatment_records(report_id);
CREATE INDEX IF NOT EXISTS idx_treatment_records_user_id ON public.treatment_records(user_id);

-- Enable RLS
ALTER TABLE public.treatment_records ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own treatments"
  ON public.treatment_records
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own treatments"
  ON public.treatment_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own treatments"
  ON public.treatment_records
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own treatments"
  ON public.treatment_records
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. MARKETPLACE ADMIN MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin', -- 'super_admin', 'admin', 'moderator'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255), -- Email of admin who added this
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can view admins"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert new admins"
  ON public.admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Admins can delete admins"
  ON public.admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Insert default admin (REPLACE WITH YOUR EMAIL)
INSERT INTO public.admin_users (email, created_by, role)
VALUES ('sudanva@gmail.com', 'system', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 5. MARKETPLACE PRODUCTS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.marketplace_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Info
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'seeds', 'pesticides', 'fertilizers', 'tools'
  price DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  
  -- Product Details
  description TEXT,
  full_description TEXT,
  supplier VARCHAR(255),
  image TEXT, -- Single image URL (legacy)
  images TEXT[], -- Array of image URLs
  
  -- Status & Ratings
  verified BOOLEAN DEFAULT true,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  reviews INTEGER DEFAULT 0,
  
  -- Detailed Information
  features JSONB, -- Array of key features
  specifications JSONB, -- Product specifications
  usage_instructions TEXT,
  warranty TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255) -- Admin email
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.marketplace_products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.marketplace_products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.marketplace_products(name);
CREATE INDEX IF NOT EXISTS idx_products_rating ON public.marketplace_products(rating DESC);

-- Enable RLS
ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view products"
  ON public.marketplace_products
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert products"
  ON public.marketplace_products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Only admins can update products"
  ON public.marketplace_products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Only admins can delete products"
  ON public.marketplace_products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

-- =====================================================
-- 6. ORDERS (E-COMMERCE)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Order Details
  order_number VARCHAR(50) UNIQUE NOT NULL,
  items JSONB NOT NULL, -- Array of ordered items
  
  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_charge DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Shipping Details
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  
  -- Payment
  payment_method VARCHAR(50) NOT NULL, -- 'cod', 'razorpay', 'upi'
  payment_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  
  -- Order Status
  status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  tracking_number VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

-- =====================================================
-- 7. PEST ALERT SUBSCRIPTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.pest_alert_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL,
  crop TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_pest_subscriptions_user_id ON public.pest_alert_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_pest_subscriptions_active ON public.pest_alert_subscriptions(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.pest_alert_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own subscriptions"
  ON public.pest_alert_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON public.pest_alert_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.pest_alert_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
  ON public.pest_alert_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 8. ALERT LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.alert_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pest_name TEXT NOT NULL,
  risk_level TEXT NOT NULL, -- 'low', 'moderate', 'high', 'severe'
  message TEXT NOT NULL,
  alert_type TEXT DEFAULT 'in_app', -- 'sms', 'whatsapp', 'in_app'
  location TEXT,
  crop TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_alert_logs_user_id ON public.alert_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_logs_sent_at ON public.alert_logs(sent_at DESC);

-- Enable RLS
ALTER TABLE public.alert_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own alert logs"
  ON public.alert_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- =====================================================
-- 9. UNSENT ALERTS (Retry Queue)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.unsent_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  alert_type TEXT NOT NULL, -- 'sms', 'whatsapp'
  link TEXT,
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'sent', 'failed'
  retry_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_unsent_alerts_status ON public.unsent_alerts(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_unsent_alerts_created_at ON public.unsent_alerts(created_at DESC);

-- Enable RLS
ALTER TABLE public.unsent_alerts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Service role can manage unsent alerts"
  ON public.unsent_alerts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 10. FERTILIZER SCHEDULES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.fertilizer_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  crop VARCHAR(100) NOT NULL,
  growth_stage VARCHAR(100),
  soil_type VARCHAR(100),
  nutrient_name VARCHAR(200) NOT NULL,
  nutrient_source VARCHAR(300),
  dosage VARCHAR(200),
  timing VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  application_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_fertilizer_schedules_user_crop ON public.fertilizer_schedules(user_id, crop);
CREATE INDEX IF NOT EXISTS idx_fertilizer_schedules_status ON public.fertilizer_schedules(user_id, status);

-- Enable RLS
ALTER TABLE public.fertilizer_schedules ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own schedules"
  ON public.fertilizer_schedules
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules"
  ON public.fertilizer_schedules
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
  ON public.fertilizer_schedules
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
  ON public.fertilizer_schedules
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 11. NUTRIENT PLANS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.nutrient_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  crop VARCHAR(100) NOT NULL,
  growth_stage VARCHAR(100) NOT NULL,
  soil_type VARCHAR(100) NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_nutrient_plans_user_crop ON public.nutrient_plans(user_id, crop, created_at DESC);

-- Enable RLS
ALTER TABLE public.nutrient_plans ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own nutrient plans"
  ON public.nutrient_plans
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrient plans"
  ON public.nutrient_plans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 12. STORAGE BUCKETS FOR IMAGES
-- =====================================================

-- Disease Detection Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('disease-images', 'Disease Detection Images', true)
ON CONFLICT (id) DO NOTHING;

-- Product Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'Marketplace Product Images', true)
ON CONFLICT (id) DO NOTHING;

-- User Avatars Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-avatars', 'User Profile Avatars', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 13. USEFUL FUNCTIONS
-- =====================================================

-- Function to get user's real statistics
CREATE OR REPLACE FUNCTION get_real_user_stats(user_uuid UUID)
RETURNS TABLE(
  diseases_detected BIGINT,
  treatments_received BIGINT,
  queries_asked BIGINT,
  days_active BIGINT,
  orders_placed BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE((SELECT COUNT(*) FROM disease_reports WHERE user_id = user_uuid), 0)::BIGINT,
    COALESCE((SELECT COUNT(*) FROM treatment_records WHERE user_id = user_uuid), 0)::BIGINT,
    COALESCE((SELECT COUNT(*) FROM disease_reports WHERE user_id = user_uuid), 0)::BIGINT,
    CASE 
      WHEN (SELECT MIN(created_at) FROM disease_reports WHERE user_id = user_uuid) IS NOT NULL 
      THEN (CURRENT_DATE - (SELECT MIN(created_at)::DATE FROM disease_reports WHERE user_id = user_uuid))::BIGINT
      ELSE 0
    END,
    COALESCE((SELECT COUNT(*) FROM orders WHERE user_id = user_uuid), 0)::BIGINT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_real_user_stats(UUID) TO authenticated;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION is_admin(TEXT) TO authenticated;

-- Function to get all admins
CREATE OR REPLACE FUNCTION get_all_admins()
RETURNS TABLE(
  id UUID,
  email VARCHAR,
  role VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  created_by VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.email, a.role, a.created_at, a.created_by
  FROM admin_users a
  ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_all_admins() TO authenticated;

-- =====================================================
-- 14. AUTO-UPDATE TIMESTAMP TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for disease_reports
DROP TRIGGER IF EXISTS update_disease_reports_updated_at ON public.disease_reports;
CREATE TRIGGER update_disease_reports_updated_at
  BEFORE UPDATE ON public.disease_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for treatment_records
DROP TRIGGER IF EXISTS update_treatment_records_updated_at ON public.treatment_records;
CREATE TRIGGER update_treatment_records_updated_at
  BEFORE UPDATE ON public.treatment_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for marketplace_products
DROP TRIGGER IF EXISTS update_products_updated_at ON public.marketplace_products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.marketplace_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for pest_alert_subscriptions
DROP TRIGGER IF EXISTS update_pest_subscriptions_updated_at ON public.pest_alert_subscriptions;
CREATE TRIGGER update_pest_subscriptions_updated_at
  BEFORE UPDATE ON public.pest_alert_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for fertilizer_schedules
DROP TRIGGER IF EXISTS update_fertilizer_schedules_updated_at ON public.fertilizer_schedules;
CREATE TRIGGER update_fertilizer_schedules_updated_at
  BEFORE UPDATE ON public.fertilizer_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 15. GRANT PERMISSIONS
-- =====================================================

GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.disease_reports TO authenticated;
GRANT ALL ON public.treatment_records TO authenticated;
GRANT ALL ON public.marketplace_products TO authenticated;
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.pest_alert_subscriptions TO authenticated;
GRANT ALL ON public.alert_logs TO authenticated;
GRANT ALL ON public.fertilizer_schedules TO authenticated;
GRANT ALL ON public.nutrient_plans TO authenticated;
GRANT ALL ON public.admin_users TO authenticated;
GRANT ALL ON public.unsent_alerts TO service_role;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your AgroGuard AI database is now ready!
--
-- Next Steps:
-- 1. Replace 'sudanva@gmail.com' with your email in the admin_users table
--    UPDATE public.admin_users SET email = 'your-email@example.com' 
--    WHERE email = 'sudanva@gmail.com';
--
-- 2. Create your Supabase storage policies:
--    - Go to Storage in Supabase dashboard
--    - Configure access policies for buckets
--
-- 3. Test your setup:
--    - Register a new user
--    - Create a disease report
--    - Check admin dashboard
--
-- 4. Update environment variables:
--    VITE_SUPABASE_URL=your-supabase-url
--    VITE_SUPABASE_ANON_KEY=your-anon-key
--
-- For support, refer to the documentation in /docs folder
-- =====================================================
