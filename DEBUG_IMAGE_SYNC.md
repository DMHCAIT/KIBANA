# 🔍 Debug Image Sync Issues

## Test Storage Structure

First, test what folders are actually in storage:

1. **Open this URL in your browser:**
   ```
   https://kibana-one.vercel.app/api/admin/test-storage
   ```

2. **Check the response** - it will show:
   - What folders are in the root
   - What folders are in `products/` subfolder
   - Any errors

## Common Issues & Solutions

### Issue 1: Folders Not Found

**Symptoms:** Debug shows "no_folder_found" for all products

**Possible Causes:**
1. Folders are in a different location
2. Bucket name is different
3. List permissions issue

**Solution:**
- Check the test endpoint response
- Verify bucket name is `product-images`
- Check Supabase Storage policies

### Issue 2: Folder Names Don't Match

**Symptoms:** Folders exist but don't match product names

**Example:**
- Product: "VISTARA TOTE" → slug: "vistara-tote"
- Folder: "vistara-tote" ✅ Should match
- Folder: "VISTARA TOTE" ❌ Won't match (case sensitive)

**Solution:**
- The sync now uses case-insensitive matching
- Check folder names match product slugs

### Issue 3: Images in Subfolders

**Symptoms:** Folders found but no images

**Structure:**
```
product-images/
├── vistara-tote/
│   ├── teal-blue/
│   │   ├── image1.jpg
│   │   └── image2.jpg
│   └── mocha-tan/
│       └── image1.jpg
```

**Solution:**
- The sync handles subfolders (color variants)
- It will link images to variants if folder names match

## Manual Fix

If sync still doesn't work, you can manually link images:

### Option 1: Via Admin Panel

1. Go to `/admin/products`
2. Click "Edit" on a product
3. Go to "Images" tab
4. Click "Upload Images"
5. Upload images directly

### Option 2: Via Supabase Dashboard

1. Go to Supabase Storage
2. Right-click on an image
3. Copy the public URL
4. Go to Supabase Table Editor
5. Open `product_images` table
6. Insert new record:
   - `product_id`: (product UUID)
   - `image_url`: (copied URL)
   - `is_primary`: true (for first image)
   - `order`: 0, 1, 2, etc.

## Check Current Status

Run the test endpoint and check:
- Are folders being listed?
- What are the exact folder names?
- Are there any errors?

Then share the results and I can fix the matching logic.

