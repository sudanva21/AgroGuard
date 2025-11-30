-- ============================================
-- SETUP SUPABASE STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================
-- Run this in Supabase SQL Editor to create storage bucket

-- Step 1: Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Set up storage policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Step 3: Set up policy to allow public read access
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Step 4: Set up policy to allow admin users to delete images
CREATE POLICY "Admin users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND auth.uid() IN (
    SELECT auth.users.id 
    FROM auth.users 
    INNER JOIN admin_users ON auth.users.email = admin_users.email
  )
);

-- Step 5: Set up policy to allow admin users to update images
CREATE POLICY "Admin users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND auth.uid() IN (
    SELECT auth.users.id 
    FROM auth.users 
    INNER JOIN admin_users ON auth.users.email = admin_users.email
  )
)
WITH CHECK (bucket_id = 'product-images');

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
  '✅ Storage bucket created' as status,
  name,
  public,
  created_at
FROM storage.buckets
WHERE id = 'product-images';

-- Check policies
SELECT 
  '📋 Storage Policies' as info,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';

-- ============================================
-- USAGE NOTES
-- ============================================
-- 1. Images will be stored in: product-images/products/[filename]
-- 2. Public URL format: https://[project-ref].supabase.co/storage/v1/object/public/product-images/products/[filename]
-- 3. Max file size: 5MB (enforced in frontend)
-- 4. Supported formats: JPG, PNG, GIF, WebP
-- 5. Only authenticated admin users can upload/delete
-- 6. Anyone can view images (public bucket)
