# Adding VISTARA Product - Complete Guide

## Product Overview

**VISTARA** - Bold. Stylish. Limitless.
- **Meaning:** "expanse" (hints at V-shape)
- **Brand Style:** Youth-Trendy, Bold, Catchy, Fashionable
- **Category:** Tote Bag
- **Price:** ₹4,999

## Product Description

Designed for the modern woman who values elegance and confidence, VISTARA balances sophistication with everyday functionality — a true luxury statement.

With its striking V-shape pattern and chic structured body, Vistara brings a fresh vibe to everyday fashion. A bag that's as versatile as you are — from work to weekends, it's your go-to trendsetter. Carry Vistara and own the expanse of possibilities in style.

## Color Variants (4 Colors)

1. **Teal Blue**
2. **Pastel Green**
3. **Mocha Tan**
4. **Milky Blue**

## Complete Specifications

### Design Features
- "V" stitching pattern
- Structured shape
- Elegant design

### Material & Construction
- **Material:** 100% PU Leather
- **Texture:** Smooth, Fine-Grained
- **Hardware:** Gold-Tone Accents

### Closure & Security
- **Closure Type:** Magnetic Flap with concealed zipper top

### Compartments
- One Main Compartment
- Flap/Top Zipper
- Padded laptop sleeve
- Inner zip pocket
- Organizer slip pockets

### Dimensions & Carrying
- **Shoulder Drop:** Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)
- **Capacity:** Approx. 14–16 Liters

### Can Fit
- Laptop
- Diary
- Wallet
- Makeup pouch
- Charger
- Daily essentials

### Ideal For
Office, meetings, and day-to-evening transitions – a perfect power tote combining elegance with functionality

---

## Step-by-Step Database Import

### Step 1: Get Category ID for "Tote Bag"

First, find the category ID for Tote Bag:

```sql
-- Find the tote bag category
SELECT id, name, slug FROM categories WHERE name ILIKE '%tote%';
```

Save the UUID you get. Let's call it `TOTE_BAG_CATEGORY_ID`.

### Step 2: Create the Base Product

```sql
INSERT INTO products (
  name,
  slug,
  brand,
  description,
  short_description,
  price,
  sale_price,
  category_id,
  is_active,
  is_featured,
  stock_status,
  seo_title,
  seo_description,
  specifications
)
VALUES (
  'VISTARA',
  'vistara-tote-bag',
  'KIBANA',
  'Designed for the modern woman who values elegance and confidence, VISTARA balances sophistication with everyday functionality — a true luxury statement.

With its striking V-shape pattern and chic structured body, Vistara brings a fresh vibe to everyday fashion. A bag that''s as versatile as you are — from work to weekends, it''s your go-to trendsetter. Carry Vistara and own the expanse of possibilities in style.

Features:
• Bold V-stitching pattern that catches the eye
• Structured shape that maintains its form
• Elegant design suitable for all occasions
• Premium 100% PU Leather construction
• Gold-tone hardware accents
• Magnetic flap with concealed zipper security
• Spacious 14-16 liter capacity
• Fits laptop, diary, wallet, and more
• Perfect for office, meetings, and day-to-evening transitions',
  'Bold. Stylish. Limitless. A trendy tote bag with striking V-shape pattern and chic structured body. Perfect from work to weekends.',
  4999.00,
  NULL,
  'TOTE_BAG_CATEGORY_ID', -- Replace with actual category UUID
  true,
  true, -- Set as featured since it's a new product
  'in_stock',
  'VISTARA Tote Bag - Bold Stylish V-Shape Designer Handbag | KIBANA',
  'Shop VISTARA, a bold and stylish tote bag featuring striking V-shape stitching, structured design, and premium PU leather. Perfect for office and day-to-evening transitions. 4 colors available.',
  '{
    "dimensions": {
      "capacity": "14-16 Liters"
    },
    "material": "100% PU Leather",
    "texture": "Smooth, Fine-Grained",
    "hardware": "Gold-Tone Accents",
    "closure": "Magnetic Flap with concealed zipper top",
    "compartments": "One Main Compartment, Flap/Top Zipper, Padded laptop sleeve, Inner zip pocket, Organizer slip pockets",
    "shoulderDrop": "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)",
    "capacity": "14–16 Liters",
    "idealFor": "Office, meetings, and day-to-evening transitions",
    "features": [
      "Bold V-stitching pattern",
      "Structured shape",
      "100% PU Leather",
      "Gold-tone hardware",
      "Magnetic flap closure",
      "Concealed zipper top",
      "Padded laptop sleeve",
      "Inner zip pocket",
      "Organizer slip pockets",
      "Detachable adjustable strap",
      "Top handle included",
      "Fits laptop and daily essentials"
    ]
  }'::jsonb
)
RETURNING id;
```

Save the returned product ID. Let's call it `VISTARA_PRODUCT_ID`.

### Step 3: Create Color Variants

```sql
-- Variant 1: Teal Blue
INSERT INTO product_variants (
  product_id,
  color,
  sku,
  price,
  stock_quantity,
  is_active
)
VALUES (
  'VISTARA_PRODUCT_ID', -- Replace with actual product UUID
  'Teal Blue',
  'VISTARA-TEAL-001',
  4999.00,
  15, -- Initial stock
  true
)
RETURNING id; -- Save as VARIANT_TEAL_ID

-- Variant 2: Pastel Green
INSERT INTO product_variants (
  product_id,
  color,
  sku,
  price,
  stock_quantity,
  is_active
)
VALUES (
  'VISTARA_PRODUCT_ID',
  'Pastel Green',
  'VISTARA-GREEN-001',
  4999.00,
  15,
  true
)
RETURNING id; -- Save as VARIANT_GREEN_ID

-- Variant 3: Mocha Tan
INSERT INTO product_variants (
  product_id,
  color,
  sku,
  price,
  stock_quantity,
  is_active
)
VALUES (
  'VISTARA_PRODUCT_ID',
  'Mocha Tan',
  'VISTARA-TAN-001',
  4999.00,
  15,
  true
)
RETURNING id; -- Save as VARIANT_TAN_ID

-- Variant 4: Milky Blue
INSERT INTO product_variants (
  product_id,
  color,
  sku,
  price,
  stock_quantity,
  is_active
)
VALUES (
  'VISTARA_PRODUCT_ID',
  'Milky Blue',
  'VISTARA-BLUE-001',
  4999.00,
  15,
  true
)
RETURNING id; -- Save as VARIANT_BLUE_ID
```

### Step 4: Upload Product Images

You need to upload 4 images (one for each color) to your storage first, then add them to the database.

#### Upload Images to Supabase Storage

1. Go to Supabase Dashboard → Storage
2. Create/use the `products` bucket
3. Upload 4 images:
   - `vistara-teal-blue.jpg`
   - `vistara-pastel-green.jpg`
   - `vistara-mocha-tan.jpg`
   - `vistara-milky-blue.jpg`

4. Get the public URLs for each image

#### Add Images to Database

```sql
-- Image 1: Teal Blue
INSERT INTO product_images (
  product_id,
  variant_id,
  image_url,
  alt_text,
  "order",
  is_primary
)
VALUES (
  'VISTARA_PRODUCT_ID',
  'VARIANT_TEAL_ID',
  'https://your-supabase-url.supabase.co/storage/v1/object/public/products/vistara-teal-blue.jpg',
  'VISTARA Tote Bag in Teal Blue - Bold V-stitching pattern',
  1,
  true -- First image is primary
);

-- Image 2: Pastel Green
INSERT INTO product_images (
  product_id,
  variant_id,
  image_url,
  alt_text,
  "order",
  is_primary
)
VALUES (
  'VISTARA_PRODUCT_ID',
  'VARIANT_GREEN_ID',
  'https://your-supabase-url.supabase.co/storage/v1/object/public/products/vistara-pastel-green.jpg',
  'VISTARA Tote Bag in Pastel Green - Elegant structured design',
  2,
  false
);

-- Image 3: Mocha Tan
INSERT INTO product_images (
  product_id,
  variant_id,
  image_url,
  alt_text,
  "order",
  is_primary
)
VALUES (
  'VISTARA_PRODUCT_ID',
  'VARIANT_TAN_ID',
  'https://your-supabase-url.supabase.co/storage/v1/object/public/products/vistara-mocha-tan.jpg',
  'VISTARA Tote Bag in Mocha Tan - Premium PU Leather',
  3,
  false
);

-- Image 4: Milky Blue
INSERT INTO product_images (
  product_id,
  variant_id,
  image_url,
  alt_text,
  "order",
  is_primary
)
VALUES (
  'VISTARA_PRODUCT_ID',
  'VARIANT_BLUE_ID',
  'https://your-supabase-url.supabase.co/storage/v1/object/public/products/vistara-milky-blue.jpg',
  'VISTARA Tote Bag in Milky Blue - Gold-tone hardware accents',
  4,
  false
);
```

---

## Alternative: Use Import Script

If you have the import script available, create a JSON file:

### vistara-product.json

```json
{
  "products": [
    {
      "name": "VISTARA",
      "slug": "vistara-tote-bag",
      "brand": "KIBANA",
      "description": "Designed for the modern woman who values elegance and confidence, VISTARA balances sophistication with everyday functionality — a true luxury statement.\n\nWith its striking V-shape pattern and chic structured body, Vistara brings a fresh vibe to everyday fashion. A bag that's as versatile as you are — from work to weekends, it's your go-to trendsetter. Carry Vistara and own the expanse of possibilities in style.",
      "short_description": "Bold. Stylish. Limitless. A trendy tote bag with striking V-shape pattern and chic structured body.",
      "price": 4999,
      "category": "Tote Bag",
      "is_featured": true,
      "specifications": {
        "material": "100% PU Leather",
        "texture": "Smooth, Fine-Grained",
        "hardware": "Gold-Tone Accents",
        "closure": "Magnetic Flap with concealed zipper top",
        "compartments": "One Main Compartment, Padded laptop sleeve, Inner zip pocket, Organizer slip pockets",
        "shoulderDrop": "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)",
        "capacity": "14–16 Liters",
        "idealFor": "Office, meetings, and day-to-evening transitions",
        "features": [
          "Bold V-stitching pattern",
          "Structured shape",
          "100% PU Leather",
          "Gold-tone hardware",
          "Magnetic flap closure",
          "Padded laptop sleeve",
          "Detachable adjustable strap"
        ]
      },
      "variants": [
        {
          "color": "Teal Blue",
          "sku": "VISTARA-TEAL-001",
          "stock_quantity": 15,
          "image_url": "path/to/vistara-teal-blue.jpg"
        },
        {
          "color": "Pastel Green",
          "sku": "VISTARA-GREEN-001",
          "stock_quantity": 15,
          "image_url": "path/to/vistara-pastel-green.jpg"
        },
        {
          "color": "Mocha Tan",
          "sku": "VISTARA-TAN-001",
          "stock_quantity": 15,
          "image_url": "path/to/vistara-mocha-tan.jpg"
        },
        {
          "color": "Milky Blue",
          "sku": "VISTARA-BLUE-001",
          "stock_quantity": 15,
          "image_url": "path/to/vistara-milky-blue.jpg"
        }
      ]
    }
  ]
}
```

Then run:
```bash
node scripts/import-products.js vistara-product.json
```

---

## Verification Checklist

After adding the product, verify:

### 1. Collections Page
- [ ] Visit `/collections/tote-bag`
- [ ] Verify VISTARA appears
- [ ] Check that all 4 colors show as separate cards
- [ ] Verify each card shows correct color image

### 2. Product Detail Page
- [ ] Click on any VISTARA color variant
- [ ] Verify product page loads
- [ ] Check all 4 color swatches appear
- [ ] Test color selection
- [ ] Verify specifications tab shows all details
- [ ] Check pricing shows ₹4,999

### 3. Search & Filters
- [ ] Search for "VISTARA"
- [ ] Search for "V-shape"
- [ ] Filter by Tote Bag category
- [ ] Filter by price range

### 4. Cart & Checkout
- [ ] Add VISTARA (any color) to cart
- [ ] Verify correct color shows in cart
- [ ] Test checkout process
- [ ] Verify order shows correct variant

---

## Expected Result on Collection Page

When you visit `/collections/tote-bag`, you should see:

**4 separate cards for VISTARA:**

1. **Card 1:** VISTARA - Teal Blue
   - Image: Teal blue bag
   - Label: "Color: Teal Blue"
   - Price: ₹4,999
   - Stock: 15 in stock

2. **Card 2:** VISTARA - Pastel Green
   - Image: Pastel green bag
   - Label: "Color: Pastel Green"
   - Price: ₹4,999
   - Stock: 15 in stock

3. **Card 3:** VISTARA - Mocha Tan
   - Image: Mocha tan bag
   - Label: "Color: Mocha Tan"
   - Price: ₹4,999
   - Stock: 15 in stock

4. **Card 4:** VISTARA - Milky Blue
   - Image: Milky blue bag
   - Label: "Color: Milky Blue"
   - Price: ₹4,999
   - Stock: 15 in stock

---

## SEO Keywords to Include

For better search visibility, the product includes:
- VISTARA
- V-shape pattern
- Structured tote bag
- Designer handbag
- Office tote
- Laptop bag
- PU leather bag
- Gold hardware
- Magnetic closure
- Trendy handbag
- Modern tote bag
- Elegant handbag

---

## Marketing Copy Suggestions

### Homepage Banner
"Introducing VISTARA – Bold. Stylish. Limitless."

### Collection Page
"Discover VISTARA, our newest tote bag featuring striking V-shape stitching. Available in 4 stunning colors."

### Social Media
"Own the expanse of possibilities with VISTARA ✨ Our newest tote combines bold style with everyday functionality. Which color speaks to you? 💙💚🤎💙 #VISTARA #KIBANA #NewArrivals"

### Email Campaign
Subject: "Meet VISTARA – Your New Go-To Power Tote 💼✨"

Body: "Designed for the modern woman who values elegance and confidence, VISTARA brings sophistication to your everyday. Choose from 4 stunning colors and make it yours."

---

## Troubleshooting

### Issue: Product not showing on collection page
**Check:**
- [ ] product.is_active = true
- [ ] product.category_id matches Tote Bag category
- [ ] At least one variant has is_active = true

### Issue: Colors not showing as separate cards
**Check:**
- [ ] Each variant has a unique color value
- [ ] Each variant has is_active = true
- [ ] Images are linked to correct variant_id

### Issue: Images not displaying
**Check:**
- [ ] Image URLs are correct and public
- [ ] Images are uploaded to storage
- [ ] Image files are not corrupted
- [ ] variant_id in product_images matches actual variant

### Issue: Wrong price showing
**Check:**
- [ ] Variant price matches product price (₹4,999)
- [ ] No unexpected sale_price set
- [ ] Currency formatting is correct

---

## Quick Reference

**Product Name:** VISTARA  
**SKU Prefix:** VISTARA  
**Category:** Tote Bag  
**Price:** ₹4,999  
**Colors:** 4 (Teal Blue, Pastel Green, Mocha Tan, Milky Blue)  
**Stock per Color:** 15 units (adjust as needed)  
**Featured:** Yes  
**Active:** Yes  

---

## Next Steps

1. **Gather Images:**
   - Take/prepare 4 high-quality product photos
   - One photo per color variant
   - Recommended resolution: 1200x1200px minimum
   - Format: JPG or PNG

2. **Upload to Storage:**
   - Use Supabase Storage or your CDN
   - Get public URLs for each image

3. **Run SQL Commands:**
   - Execute Step 1-4 above in order
   - Replace placeholder UUIDs with actual values

4. **Verify:**
   - Check collection page
   - Test product detail page
   - Verify cart functionality

5. **Launch:**
   - Announce on social media
   - Add to homepage featured section
   - Send email to customers

---

**Status:** Ready to import
**Time to Complete:** ~15-20 minutes
**Difficulty:** Easy (if following steps)
