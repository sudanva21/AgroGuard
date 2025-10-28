-- ============================================
-- MARKETPLACE ADMIN & PRODUCTS TABLES
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- 1. ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255) -- Email of admin who added this admin
);

-- Create index for faster email lookups
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can view admins (for checking if they're admin)
CREATE POLICY "Authenticated users can view admins"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only existing admins can insert new admins
CREATE POLICY "Admins can add new admins"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Policy: Only existing admins can delete admins
CREATE POLICY "Admins can remove admins"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Insert the first admin (REPLACE WITH YOUR EMAIL)
-- After running this, you can add more admins through the dashboard
INSERT INTO admin_users (email, created_by)
VALUES ('sudanva@gmail.com', 'sudanva8055')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Info
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'seeds', 'pesticides', 'fertilizers', 'tools'
  price DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  
  -- Product Details
  description TEXT,
  supplier VARCHAR(255),
  image TEXT, -- Image URL
  
  -- Status & Ratings
  verified BOOLEAN DEFAULT true,
  in_stock BOOLEAN DEFAULT true,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  reviews INTEGER DEFAULT 0,
  
  -- Additional Fields (for future expansion)
  features JSONB, -- Array of key features
  specifications JSONB, -- Product specifications
  usage_instructions TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255) -- Admin email who created this
);

-- Create indexes
CREATE INDEX idx_products_category ON marketplace_products(category);
CREATE INDEX idx_products_in_stock ON marketplace_products(in_stock);
CREATE INDEX idx_products_name ON marketplace_products(name);

-- Enable RLS
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view products
CREATE POLICY "Anyone can view products"
  ON marketplace_products
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert products
CREATE POLICY "Admins can insert products"
  ON marketplace_products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Policy: Only admins can update products
CREATE POLICY "Admins can update products"
  ON marketplace_products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Policy: Only admins can delete products
CREATE POLICY "Admins can delete products"
  ON marketplace_products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt()->>'email'
    )
  );

-- ============================================
-- 3. FUNCTIONS
-- ============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all admins
CREATE OR REPLACE FUNCTION get_all_admins()
RETURNS TABLE(
  id UUID,
  email VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  created_by VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.email, a.created_at, a.created_by
  FROM admin_users a
  ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON marketplace_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Replace 'your-email@example.com' with your actual email
-- 2. Run this entire SQL in Supabase SQL Editor
-- 3. You can now access admin dashboard at: /admin-dashboard-2025
-- 4. Add more admins through the dashboard interface
