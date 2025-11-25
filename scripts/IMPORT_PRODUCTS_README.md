# Product Import Script

This script imports all products from your spreadsheet data into the Supabase database.

## Prerequisites

1. **Environment Variables**: Make sure your `.env.local` file has:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Supabase Storage Bucket**: 
   - The script uses the `category-images` bucket for storing product images
   - Make sure this bucket exists and has public access enabled
   - Or create a new `product-images` bucket and update the script

3. **Image Folders**: 
   - Ensure the `New Folder With Items` directory exists in the project root
   - All product images should be organized in subfolders matching the folder names in the spreadsheet

## Products Being Imported

1. **VISTARA TOTE** - Tote Bag - ₹4,999
   - Colors: Teal Blue/Dark Blue, Mint Green/Pastel Green, Mocha Tan, Milky Blue

2. **PRIZMA SLING** - Sling Bag - ₹3,999
   - Colors: Teal Blue/Dark Blue, Mint Green/Pastel Green, Mocha Tan, Milky Blue

3. **VISTAPACK** - Backpack - ₹4,499
   - Colors: Teal Blue/Dark Blue, Mint Green/Pastel Green, Mocha Tan, Milky Blue

4. **SANDESH LAPTOP BAG** - Laptop Bag - ₹6,499
   - Colors: Teal Blue/Dark Blue, Mint Green/Pastel Green, Mocha Tan, Milky Blue

5. **Lekha Wallet (Clutch)** - Clutch - ₹2,199
   - Colors: Teal Blue/Dark Blue, Mint Green/Pastel Green, Mocha Tan, Milky Blue

6. **Lekha Wallet (Wallet)** - Wallet - ₹1,999
   - Colors: Teal Blue/Dark Blue, Mint Green/Pastel Green, Mocha Tan, Milky Blue

## Usage

```bash
# From the project root
node scripts/import-products.js
```

## What the Script Does

1. **Creates Categories**: Creates all unique categories (Tote Bag, Sling Bag, Backpack, Laptop Bag, Clutch, Wallet)

2. **Creates Products**: Creates each product with:
   - Name, slug, brand, price
   - Category association
   - Active status

3. **Creates Variants**: For each color option:
   - Creates a product variant with color name
   - Generates unique SKU
   - Sets stock quantity

4. **Uploads Images**: 
   - Finds images in the matching folder
   - Uploads to Supabase Storage
   - Creates product_image records linked to variants
   - Sets first image as primary

## Image Folder Mapping

The script automatically matches image folders based on:
- Exact folder name match
- Case-insensitive partial matches
- Removes special characters for matching

## Notes

- If a category or product already exists (by slug), it will be updated instead of creating a duplicate
- Images are uploaded to: `products/{product-name}/{color-name}/{index}.{ext}`
- The script will skip variants if no images are found for that color
- All products are set to `is_active: true` and `stock_status: 'in_stock'`

## Troubleshooting

**Error: "Missing Supabase credentials"**
- Check that `.env.local` exists and has the correct variables

**Error: "Failed to upload image"**
- Check that the storage bucket exists and has proper permissions
- Verify image files exist in the expected folders

**No images found for folder**
- Check folder names match exactly (case-insensitive)
- Verify images are in PNG, JPG, or JPEG format
- Check the folder structure in `New Folder With Items`

