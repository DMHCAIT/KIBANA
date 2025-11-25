# Product Import Script

This script imports all products from the spreadsheet data into your Supabase database.

## Prerequisites

1. **Supabase Storage Buckets Created:**
   - Go to Supabase Dashboard → Storage
   - Create a bucket named `product-images` (Public)
   - If it doesn't exist, the script will try `category-images` as fallback

2. **Environment Variables:**
   - Make sure `.env.local` has:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```

3. **Image Folders:**
   - Images should be in: `kibana/New Folder With Items/`
   - The script will automatically match folder names to product colors

## Products to be Imported

Based on your spreadsheet:

1. **VISTARA TOTE** - ₹4,999
   - Category: Tote Bag
   - Colors: Teal Blue/Dark Blue, Mint Green/Pastel Green, Mocha Tan, Milky Blue

2. **PRIZMA SLING** - ₹3,999
   - Category: Sling Bag
   - Colors: Dark Green, Pastel Green, Mocha Tan, Milky Blue

3. **VISTAPACK** - ₹4,499
   - Category: Backpack
   - Colors: Dark Green, Green, Mocha Tan, Blue

4. **SANDESH LAPTOP BAG** - ₹6,499
   - Category: Laptop Bag
   - Colors: Dark Blue, Green, Mocha Tan, Milky Blue

5. **Lekha Wallet (Clutch)** - ₹2,199
   - Category: Clutch
   - Colors: Teal Blue, Pastel Green, Mocha Tan, Milky Blue

6. **Lekha Wallet (Wallet)** - ₹2,199
   - Category: Wallet
   - Colors: Teal Blue, Pastel Green

## How to Run

### Option 1: Command Line (Recommended)

```bash
cd kibana
node scripts/import-products.js
```

### Option 2: From Admin Panel (Coming Soon)

An API endpoint will be added to run imports from the admin panel.

## What the Script Does

1. **Creates Categories:**
   - Tote Bag
   - Sling Bag
   - Backpack
   - Laptop Bag
   - Clutch
   - Wallet

2. **Creates Products:**
   - Each product with name, price, description
   - Links to appropriate category

3. **Creates Variants:**
   - One variant per color option
   - Each variant has SKU, price, stock quantity

4. **Uploads Images:**
   - Finds images in matching folders
   - Uploads to Supabase Storage
   - Links images to products and variants
   - Sets first image as primary

## Folder Matching

The script uses fuzzy matching to find image folders. It will:
- Try exact folder name match
- Try normalized matches (removing spaces, parentheses)
- Try partial word matches

Example: `png( teal blue` will match folders like:
- `png( teal blue`
- `png(teal blue)`
- `png (teal blue)`

## Troubleshooting

### "No images found for folder"
- Check that the folder name in the script matches your actual folder name
- Check that the folder contains PNG/JPG files
- The script will show which folder it matched

### "Failed to upload image"
- Check that the storage bucket exists
- Check that the service role key has storage permissions
- Check file size limits

### "Category already exists"
- This is normal - the script will reuse existing categories
- Products will be updated if they already exist

### "Variant already exists"
- The script will skip creating duplicate variants
- Images will only be uploaded if the variant has no images

## After Import

1. **Verify in Admin Panel:**
   - Go to `/admin/products`
   - Check that all products are listed
   - Click on each product to verify images

2. **Check Categories:**
   - Go to `/admin/categories`
   - Verify all categories are created

3. **Test Storefront:**
   - Visit `/products` to see all products
   - Visit `/collections` to see categories
   - Click on products to see variants and images

## Notes

- The script is idempotent - you can run it multiple times safely
- Existing products/variants will be updated, not duplicated
- Images are only uploaded if the variant has no existing images
- Stock quantity is set to 10 for all variants (update manually if needed)
