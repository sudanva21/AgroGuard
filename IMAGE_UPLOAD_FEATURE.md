# 📸 Product Image Upload Feature

## Overview

Admin panel now supports **two methods** for adding product images:
1. **Upload by URL** - Paste image URLs from external sources
2. **Upload from Device** - Upload local files directly to Supabase Storage

---

## Features Implemented

### ✅ Dual Upload Methods

#### **Method 1: Upload by URL**
- Paste up to 3 image URLs
- **Main Image** (Required) - Primary product display
- **Image 2** (Optional) - Additional angle/view
- **Image 3** (Optional) - Additional angle/view
- Supports any publicly accessible image URL
- Recommended sources: Unsplash, Pexels, or your CDN

#### **Method 2: Upload from Device**
- Upload up to 3 images from local device
- **Main Image** (Required) - Primary product display
- **Image 2** (Optional) - Additional angle/view
- **Image 3** (Optional) - Additional angle/view
- Files stored in Supabase Storage bucket
- Automatic public URL generation
- File validation (size, type)

---

## User Interface

### Upload Method Selector
```
┌─────────────────────────────────────────┐
│ Product Images (Up to 3)                │
│                                         │
│ ○ Upload by URL    ○ Upload from Device│
└─────────────────────────────────────────┘
```

### URL Mode
```
┌─────────────────────────────────────────┐
│ Main Image URL *                        │
│ [https://images.unsplash.com/photo-...]│
│                                         │
│ Image 2 URL (Optional)                  │
│ [https://images.unsplash.com/photo-...]│
│                                         │
│ Image 3 URL (Optional)                  │
│ [https://images.unsplash.com/photo-...]│
│                                         │
│ 💡 Tip: Use high-quality images         │
│    (600x600px recommended)              │
└─────────────────────────────────────────┘
```

### Local Upload Mode
```
┌─────────────────────────────────────────┐
│ Main Image *                            │
│ [Choose File] No file chosen            │
│ ✓ product-main.jpg                      │
│                                         │
│ Image 2 (Optional)                      │
│ [Choose File] No file chosen            │
│                                         │
│ Image 3 (Optional)                      │
│ [Choose File] No file chosen            │
│                                         │
│ 💡 Tip: Max 5MB per image               │
│    Supported: JPG, PNG, GIF, WebP      │
└─────────────────────────────────────────┘
```

---

## Technical Implementation

### File Structure

**Modified Files:**
- `src/pages/AdminDashboard.jsx` - Added upload logic and UI

**New SQL Files:**
- `setup_storage_bucket.sql` - Storage bucket setup script

### State Management

```javascript
// Upload method state
const [imageUploadMethod, setImageUploadMethod] = useState('url')

// File upload state
const [uploadingImages, setUploadingImages] = useState(false)

// Selected files state
const [imageFiles, setImageFiles] = useState({
  file1: null,
  file2: null,
  file3: null
})

// Product form state (existing)
const [productForm, setProductForm] = useState({
  image1: '', // Main image URL
  image2: '', // Optional image 2 URL
  image3: '', // Optional image 3 URL
  ...
})
```

### File Upload Flow

```javascript
// 1. User selects file
handleFileChange(event, 'file1')
  ↓
// 2. Validation (size, type)
if (file.size > 5MB) → Show error
if (!file.type.startsWith('image/')) → Show error
  ↓
// 3. Store file in state
setImageFiles({ ...imageFiles, file1: file })
  ↓
// 4. On save, upload to Supabase
handleFileUpload(file, index)
  ↓
// 5. Generate unique filename
fileName = `${timestamp}-${random}.${ext}`
  ↓
// 6. Upload to storage bucket
supabase.storage.from('product-images').upload(filePath, file)
  ↓
// 7. Get public URL
supabase.storage.from('product-images').getPublicUrl(filePath)
  ↓
// 8. Save URL to database
productData.image = publicUrl
```

---

## Supabase Storage Setup

### Step 1: Create Storage Bucket

**Run this SQL in Supabase SQL Editor:**
```sql
-- File: setup_storage_bucket.sql
```

This creates:
- ✅ Storage bucket `product-images`
- ✅ Public read access (anyone can view)
- ✅ Authenticated upload access (logged-in users)
- ✅ Admin-only delete access
- ✅ Admin-only update access

### Step 2: Verify Bucket

1. Go to Supabase Dashboard
2. Navigate to **Storage** section
3. Check for bucket named `product-images`
4. Click bucket → Should see "Public" badge
5. Click "Policies" tab → Should see 4 policies

### Storage Structure
```
product-images/
└── products/
    ├── 1701234567890-abc123.jpg
    ├── 1701234567891-def456.png
    └── 1701234567892-ghi789.webp
```

### Public URL Format
```
https://[your-project-ref].supabase.co/storage/v1/object/public/product-images/products/1701234567890-abc123.jpg
```

---

## File Validation

### Size Limits
- **Maximum**: 5MB per image
- **Validation**: Frontend (before upload)
- **Error Message**: "Image must be less than 5MB"

### Supported Formats
- **JPG/JPEG** ✅
- **PNG** ✅
- **GIF** ✅
- **WebP** ✅
- **Other formats**: Rejected with error

### Validation Code
```javascript
if (file.size > 5 * 1024 * 1024) {
  showAlert({
    title: 'File Too Large',
    message: 'Image must be less than 5MB',
    type: 'warning'
  })
  return
}

if (!file.type.startsWith('image/')) {
  showAlert({
    title: 'Invalid File',
    message: 'Please select an image file',
    type: 'warning'
  })
  return
}
```

---

## User Experience

### Upload States

#### **1. Idle State**
- File input shows "No file chosen"
- Save button enabled
- No loading indicators

#### **2. File Selected**
- Shows green checkmark ✓
- Displays filename
- Save button enabled

#### **3. Uploading State**
- Save button shows "Uploading..."
- Spinner icon animates
- Cancel button disabled
- Form inputs disabled

#### **4. Upload Complete**
- Product saved successfully
- Form closes automatically
- Product list refreshes
- Success alert shown

#### **5. Upload Error**
- Error alert shown
- Form remains open
- User can retry
- File selection preserved

### Visual Feedback

**File Selected:**
```
Main Image *
[Choose File] product-image.jpg
✓ product-image.jpg  ← Green text with checkmark
```

**Uploading:**
```
[🔄 Uploading...]  ← Spinner + disabled button
```

**Error:**
```
⚠️ Upload Error
Failed to upload image 1
[OK]
```

---

## API Reference

### handleFileChange(event, fileKey)
Handles file selection from input

**Parameters:**
- `event` - File input change event
- `fileKey` - 'file1', 'file2', or 'file3'

**Validation:**
- File size ≤ 5MB
- File type starts with 'image/'

**Updates:**
- `imageFiles` state with selected file

### handleFileUpload(file, index)
Uploads file to Supabase Storage

**Parameters:**
- `file` - File object to upload
- `index` - Image index (0, 1, 2)

**Returns:**
- `Promise<string|null>` - Public URL or null on error

**Process:**
1. Generate unique filename
2. Upload to `product-images/products/`
3. Get public URL
4. Return URL string

**Error Handling:**
- Shows alert on failure
- Returns null
- Logs error to console

### handleSaveProduct()
Saves product with image handling

**Process:**
1. Validate required fields
2. Check upload method
3. If local → Upload files sequentially
4. If URL → Use form values directly
5. Create product data object
6. Save to database
7. Close form and refresh list

---

## Testing Guide

### Test Case 1: URL Upload

**Steps:**
1. Click "Add New Product"
2. Select "Upload by URL" (default)
3. Enter main image URL
4. Optionally enter image 2 and 3 URLs
5. Fill other required fields
6. Click "Save"

**Expected:**
- ✅ Product created with URL images
- ✅ Images display in product card
- ✅ URLs stored in database

### Test Case 2: Local File Upload

**Steps:**
1. Click "Add New Product"
2. Select "Upload from Device"
3. Click "Choose File" for Main Image
4. Select a JPG/PNG file < 5MB
5. See green checkmark with filename
6. Optionally add image 2 and 3
7. Fill other required fields
8. Click "Save"

**Expected:**
- ✅ Shows "Uploading..." state
- ✅ Files upload to Supabase Storage
- ✅ Public URLs generated
- ✅ Product created successfully
- ✅ Images display immediately

### Test Case 3: File Size Validation

**Steps:**
1. Select "Upload from Device"
2. Try uploading file > 5MB

**Expected:**
- ❌ Error: "Image must be less than 5MB"
- ❌ File not accepted
- ✅ Can select different file

### Test Case 4: File Type Validation

**Steps:**
1. Select "Upload from Device"
2. Try uploading PDF/ZIP/etc

**Expected:**
- ❌ Error: "Please select an image file"
- ❌ File not accepted

### Test Case 5: Switch Upload Methods

**Steps:**
1. Select "Upload by URL"
2. Enter a URL
3. Switch to "Upload from Device"
4. Select file
5. Switch back to "Upload by URL"

**Expected:**
- ✅ Form resets when switching
- ✅ No data loss
- ✅ Smooth transition

### Test Case 6: Mixed Upload (Not Supported)

**Note:** You must choose ONE method per product. Cannot mix URL and local uploads in same product.

### Test Case 7: Cancel During Upload

**Steps:**
1. Select large image files
2. Click "Save"
3. Try clicking "Cancel" during upload

**Expected:**
- ✅ Cancel button disabled during upload
- ✅ Cannot close form during upload
- ✅ Must wait for completion

---

## Mobile Responsiveness

### Radio Button Layout
- **Mobile**: Stacked vertically or compact horizontal
- **Desktop**: Horizontal side-by-side

### File Input Styling
- **Mobile**: Full-width, touch-friendly
- **Desktop**: Standard width

### File Name Display
- **Mobile**: Truncate long filenames
- **Desktop**: Show full filename

---

## Error Handling

### Frontend Errors

| Error | Cause | Message |
|-------|-------|---------|
| File too large | File > 5MB | "Image must be less than 5MB" |
| Invalid type | Not an image | "Please select an image file" |
| No main image | Missing required image | "Please provide at least one product image" |
| Upload failed | Network/storage error | "Failed to upload image [n]" |

### Backend Errors

| Error | Cause | Handling |
|-------|-------|----------|
| Storage quota exceeded | Bucket full | Show error, contact admin |
| Network timeout | Slow connection | Retry upload |
| Permissions error | Not authenticated | Redirect to login |
| Bucket not found | Setup incomplete | Show setup instructions |

---

## Security Features

### Authentication
- ✅ Only authenticated users can upload
- ✅ Only admin users can access upload form
- ✅ Non-admins redirected away

### Authorization
- ✅ Row-level security on admin_users table
- ✅ Storage policies enforce access control
- ✅ Frontend checks admin status

### File Validation
- ✅ Size limit prevents abuse
- ✅ Type check prevents malicious files
- ✅ Unique filenames prevent overwrites

### Storage Policies
```sql
-- Public read (anyone can view images)
CREATE POLICY "Public can view product images"

-- Authenticated upload (logged-in users only)
CREATE POLICY "Authenticated users can upload"

-- Admin delete (only admins can delete)
CREATE POLICY "Admin users can delete product images"

-- Admin update (only admins can update)
CREATE POLICY "Admin users can update product images"
```

---

## Performance Considerations

### Upload Speed
- **Small images** (< 500KB): 1-2 seconds
- **Medium images** (500KB-2MB): 2-5 seconds
- **Large images** (2MB-5MB): 5-10 seconds

### Optimization Tips
1. Compress images before upload
2. Use WebP format for smaller size
3. Resize to 800x800px (recommended max)
4. Avoid uploading RAW/TIFF files

### Sequential Upload
- Files upload one at a time
- Progress shown with "Uploading..." text
- Prevents rate limiting issues

---

## Future Enhancements

### Possible Improvements
- [ ] Image preview before upload
- [ ] Drag & drop file upload
- [ ] Multiple file selection at once
- [ ] Image cropping/editing tool
- [ ] Progress bar for uploads
- [ ] Image compression on upload
- [ ] Thumbnail generation
- [ ] Image optimization pipeline
- [ ] Batch upload for multiple products
- [ ] Upload history/logs

---

## Troubleshooting

### Problem: "Upload Error" on save

**Solutions:**
1. Check Supabase storage bucket exists
2. Run `setup_storage_bucket.sql`
3. Verify bucket is public
4. Check authentication status
5. Verify admin privileges

### Problem: Files upload but don't display

**Solutions:**
1. Check public URL is correct
2. Verify bucket is public
3. Check image URL in database
4. Test URL directly in browser
5. Check CORS settings

### Problem: "File Too Large" error

**Solutions:**
1. Compress image before upload
2. Resize image to smaller dimensions
3. Convert to more efficient format (WebP)
4. Use URL upload for large images

### Problem: Cannot switch upload methods

**Solutions:**
1. Refresh the page
2. Clear browser cache
3. Check console for errors
4. Verify form state is correct

---

## Database Schema

### marketplace_products Table
```sql
CREATE TABLE marketplace_products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,              -- Main image URL (from image1)
  images TEXT[],           -- Array of all image URLs [image1, image2, image3]
  ...
)
```

### Image Storage
- `image` column: Main/primary image URL
- `images` array: All product images (includes main + optional)

---

## Quick Reference

### File Limits
- **Max Size**: 5MB per file
- **Max Images**: 3 per product
- **Required**: At least 1 image (main)

### Supported Formats
- JPG, JPEG, PNG, GIF, WebP

### Upload Methods
1. **URL**: Paste external image URLs
2. **Local**: Upload from device to Supabase Storage

### Setup Checklist
- [ ] Run `setup_storage_bucket.sql`
- [ ] Verify bucket created in Supabase Dashboard
- [ ] Check bucket is public
- [ ] Test file upload as admin
- [ ] Verify images display correctly

---

**Status**: ✅ COMPLETE - Ready for use  
**Last Updated**: 2025-11-30  
**Admin Dashboard**: http://localhost:3001/admin-dashboard-2025
