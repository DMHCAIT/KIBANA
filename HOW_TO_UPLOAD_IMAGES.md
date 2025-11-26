# 📸 How to Upload Product Images

## 🎯 Where to Upload Images

### **Option 1: Upload Images via Admin Panel (Recommended)**

#### **For Product Images:**

1. **Go to Admin Panel**
   - Navigate to: `https://your-domain.com/admin/products`
   - Or: `http://localhost:3000/admin/products` (if running locally)

2. **Edit a Product**
   - Click on any product in the list
   - Click the **"Edit"** button (or go to `/admin/products/[product-slug]/edit`)

3. **Upload Images**
   - Click on the **"Images"** tab
   - Click the **"Upload Images"** button
   - Select one or multiple image files (PNG, JPG, JPEG)
   - Images will automatically upload to Supabase Storage
   - The first image will be set as the primary image

4. **Set Primary Image**
   - Hover over any image
   - Click the **Star icon** to set it as primary
   - Primary image shows on product cards and as the main image

5. **Add Alt Text**
   - Click on any uploaded image
   - Enter descriptive alt text in the input field below the image
   - This helps with SEO and accessibility

6. **Save Product**
   - Click **"Save Product"** button at the bottom
   - Images will be saved to the database

#### **For Variant-Specific Images (Color Variants):**

1. **Go to Product Edit Page**
   - Navigate to: `/admin/products/[product-slug]/edit`

2. **Go to Variants Tab**
   - Click on the **"Variants"** tab

3. **Edit a Variant**
   - Find the color variant you want to add images to
   - Click **"Edit"** or expand the variant

4. **Upload Variant Images**
   - Use the image upload section in the variant form
   - Upload images specific to that color variant
   - These images will show when customers select that color

5. **Save Variant**
   - Click **"Save Variant"** to save the images

---

### **Option 2: Upload via Supabase Storage Directly**

If you prefer to upload images directly to Supabase:

1. **Go to Supabase Dashboard**
   - Visit: `https://app.supabase.com`
   - Select your project

2. **Navigate to Storage**
   - Click **"Storage"** in the left sidebar
   - Click on **"product-images"** bucket (or create it if it doesn't exist)

3. **Upload Images**
   - Click **"Upload file"** or **"New folder"**
   - Create folders by product name: `products/[product-name]/[color-name]/`
   - Upload images to the appropriate folders

4. **Get Public URLs**
   - Right-click on uploaded files
   - Copy the public URL
   - Use these URLs when creating products/variants

---

## 📁 Image Organization Structure

### **Recommended Folder Structure:**

```
product-images/
├── products/
│   ├── vistara-tote/
│   │   ├── teal-blue-dark-blue/
│   │   │   ├── image-1.jpg
│   │   │   ├── image-2.jpg
│   │   │   └── image-3.jpg
│   │   ├── mint-green-pastel-green/
│   │   │   ├── image-1.jpg
│   │   │   └── image-2.jpg
│   │   └── mocha-tan/
│   │       └── image-1.jpg
│   ├── prizma-sling/
│   │   └── ...
│   └── ...
```

---

## 🖼️ Image Requirements

### **Recommended Specifications:**

- **Format**: PNG, JPG, or JPEG
- **Size**: 
  - Minimum: 800x800px
  - Recommended: 1200x1200px or higher
  - Maximum file size: 10MB per image
- **Aspect Ratio**: 
  - Square (1:1) for product images
  - Or 4:5 for portrait orientation
- **Quality**: High resolution, well-lit, clear product photos

### **Best Practices:**

1. **Primary Image**: 
   - Should be the best, most representative image
   - Front view of the product
   - High quality and well-lit

2. **Additional Images**:
   - Show different angles (side, back, interior)
   - Show details (hardware, stitching, texture)
   - Show product in use (lifestyle images)

3. **Variant Images**:
   - Each color variant should have its own set of images
   - Show the product in that specific color
   - Include multiple angles for each color

---

## 🔧 Technical Details

### **Storage Bucket:**

- **Bucket Name**: `product-images`
- **Location**: Supabase Storage
- **Access**: Public (for product display)

### **Image URLs:**

Images are stored with this structure:
```
https://[your-project].supabase.co/storage/v1/object/public/product-images/products/[product-name]/[image-name].jpg
```

### **Database Storage:**

Images are stored in the `product_images` table with:
- `product_id`: Links to the product
- `variant_id`: Links to the color variant (optional)
- `image_url`: Full URL to the image
- `alt_text`: Description for SEO
- `order`: Display order (0 = first)
- `is_primary`: Boolean (true = main image)

---

## 📝 Step-by-Step: Uploading Images for a New Product

### **Example: Uploading VISTARA TOTE Images**

1. **Create/Edit Product**
   ```
   Go to: /admin/products/new
   Or: /admin/products/vistara-tote/edit
   ```

2. **Fill Product Details**
   - Name: VISTARA TOTE
   - Category: Tote Bag
   - Price: ₹4,999
   - Description: (add full description)
   - Specifications: (add all specs)

3. **Upload Main Product Images**
   - Go to "Images" tab
   - Click "Upload Images"
   - Select all product images (front, side, back, details)
   - Set the best front image as primary (click star icon)

4. **Create Color Variants**
   - Go to "Variants" tab
   - Click "Add Variant"
   - Color: "Teal Blue / Dark Blue"
   - Price: ₹4,999
   - Stock: 10

5. **Upload Variant-Specific Images**
   - In the variant form, upload images for "Teal Blue / Dark Blue"
   - These should show the product in that specific color

6. **Repeat for Other Colors**
   - Create variant for "Mint Green / Pastel Green"
   - Upload images for that color
   - Repeat for "Mocha Tan" and "Milky Blue"

7. **Save Product**
   - Click "Save Product" at the bottom
   - All images and variants will be saved

---

## 🚨 Troubleshooting

### **Images Not Uploading?**

1. **Check Supabase Storage Bucket**
   - Ensure `product-images` bucket exists
   - Check bucket permissions (should be public)

2. **Check File Size**
   - Ensure images are under 10MB
   - Compress large images if needed

3. **Check Browser Console**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Look for upload error messages

4. **Check Network Tab**
   - Open DevTools → Network tab
   - Try uploading again
   - Check if request fails and why

### **Images Not Displaying?**

1. **Check Image URLs**
   - Verify URLs are accessible
   - Test URL in browser directly

2. **Check Next.js Image Config**
   - Ensure Supabase domain is in `next.config.ts`
   - Should include: `*.supabase.co` and `*.supabase.in`

3. **Check CORS Settings**
   - In Supabase Storage settings
   - Ensure CORS is enabled for your domain

---

## 💡 Quick Tips

1. **Batch Upload**: You can select multiple images at once when uploading
2. **Image Order**: Drag images to reorder (if drag-drop is implemented)
3. **Primary Image**: Always set the best front-view image as primary
4. **Alt Text**: Always add descriptive alt text for SEO
5. **Consistent Sizing**: Keep all product images the same size/aspect ratio
6. **Color Accuracy**: Ensure images accurately represent product colors

---

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase Storage bucket exists and is public
3. Ensure you have proper permissions in Supabase
4. Check that image file formats are supported (PNG, JPG, JPEG)

---

## ✅ Checklist

Before going live, ensure:
- [ ] All products have at least one primary image
- [ ] Each color variant has its own images
- [ ] All images have descriptive alt text
- [ ] Images are high quality and well-lit
- [ ] Image URLs are accessible and loading correctly
- [ ] Primary images are set correctly
- [ ] Images display correctly on product pages

