# 🚀 Quick Start: Image Upload Feature

## ⚡ 2-Minute Setup

### Step 1: Setup Supabase Storage (Required for Local Upload)

**Option A: Via Supabase Dashboard** (Easiest)
1. Open Supabase Dashboard
2. Go to **Storage** section
3. Click **"New bucket"**
4. Name: `product-images`
5. Toggle **"Public bucket"** ON
6. Click **"Create bucket"**

**Option B: Via SQL** (Automated)
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Copy/paste contents of `setup_storage_bucket.sql`
4. Click **"Run"**
5. Check output for ✅ success messages

### Step 2: Test the Feature

1. Navigate to admin dashboard: http://localhost:3001/admin-dashboard-2025
2. Click **"Add New Product"**
3. See two radio buttons under "Product Images"

---

## 📋 How to Use

### Method 1: Upload by URL (No Setup Required)

1. Select **"Upload by URL"** (default)
2. Paste image URLs in 3 fields:
   - **Main Image URL** * (Required)
   - **Image 2 URL** (Optional)
   - **Image 3 URL** (Optional)
3. Fill other product details
4. Click **"Save"**

**Where to get image URLs:**
- [Unsplash](https://unsplash.com) - Free high-quality photos
- [Pexels](https://pexels.com) - Free stock photos
- Your own CDN or image hosting

### Method 2: Upload from Device (Requires Step 1)

1. Select **"Upload from Device"**
2. Click **"Choose File"** for each image:
   - **Main Image** * (Required)
   - **Image 2** (Optional)
   - **Image 3** (Optional)
3. See green ✓ checkmark when file selected
4. Fill other product details
5. Click **"Save"**
6. Wait for **"Uploading..."** to complete

---

## ✅ What You Get

### Features
- ✅ Dual upload methods (URL or Local)
- ✅ Up to 3 images per product
- ✅ Main image + 2 optional images
- ✅ File validation (size, type)
- ✅ Real-time upload progress
- ✅ Auto-generated public URLs
- ✅ Secure storage with policies
- ✅ Mobile responsive

### File Limits
- **Max Size**: 5MB per image
- **Formats**: JPG, PNG, GIF, WebP
- **Required**: At least 1 image (Main)

---

## 🧪 Quick Test

### Test URL Upload (1 minute)
```
1. Click "Add New Product"
2. Leave "Upload by URL" selected
3. Paste this URL in "Main Image URL":
   https://images.unsplash.com/photo-1560493676-04071c5f467b
4. Fill: Name="Test", Category="Seeds", Price="100", Unit="1kg"
5. Click "Save"
6. See product with image in list ✓
```

### Test Local Upload (2 minutes)
```
1. Click "Add New Product"
2. Select "Upload from Device"
3. Click "Choose File" → Select any image from your computer
4. See green checkmark with filename ✓
5. Fill: Name="Test 2", Category="Tools", Price="500", Unit="piece"
6. Click "Save"
7. Wait for "Uploading..." → Should take 2-5 seconds
8. See product with uploaded image in list ✓
```

---

## 🎯 UI Changes

### Before
```
Product Images (Up to 3)

Image 1 URL (Main Image) *
[_________________________________]

Image 2 URL (Optional)
[_________________________________]

Image 3 URL (Optional)
[_________________________________]
```

### After
```
Product Images (Up to 3)

( ) Upload by URL    ( ) Upload from Device

[Conditional form based on selection]

URL Mode:
  Main Image URL * [________________________]
  Image 2 URL      [________________________]
  Image 3 URL      [________________________]

Device Mode:
  Main Image *    [Choose File] ✓ image.jpg
  Image 2         [Choose File]
  Image 3         [Choose File]
```

---

## ⚠️ Important Notes

### Storage Setup
- **URL Upload**: Works immediately (no setup)
- **Local Upload**: Requires Supabase storage bucket (Step 1)

### When to Use Each Method

**Use URL Upload when:**
- ✅ Images already hosted online
- ✅ Using stock photos (Unsplash, Pexels)
- ✅ Want faster setup (no storage needed)
- ✅ Images on your existing CDN

**Use Local Upload when:**
- ✅ Have images on your device
- ✅ Want centralized storage in Supabase
- ✅ Need full control over images
- ✅ Want to delete old images easily

### File Size Tips
- Compress images before upload
- Recommended size: 800x800px
- Use WebP for better compression
- Keep under 2MB for faster uploads

---

## 🐛 Troubleshooting

### "Upload Error" message
**Fix:** Run `setup_storage_bucket.sql` in Supabase SQL Editor

### Files upload but don't show
**Fix:** Make sure bucket is public in Supabase Dashboard

### "File Too Large" error
**Fix:** Compress image or use image < 5MB

### Cannot switch upload methods
**Fix:** Refresh the page

---

## 📖 Full Documentation

For detailed information, see:
- **IMAGE_UPLOAD_FEATURE.md** - Complete technical docs
- **setup_storage_bucket.sql** - Storage setup script

---

## 🎉 You're Done!

The image upload feature is now ready to use. Choose your preferred upload method and start adding products with images!

**Test URL**: http://localhost:3001/admin-dashboard-2025
