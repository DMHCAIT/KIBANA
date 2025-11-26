-- ============================================
-- VISTARA TOTE PRODUCT IMPORT SCRIPT
-- ============================================
-- This script creates the VISTARA TOTE product with 4 color variants
-- Execute this in your Supabase SQL Editor

-- STEP 1: Get the Tote Bag category ID
-- Run this first to find your category ID:
-- SELECT id, name, slug FROM categories WHERE name ILIKE '%tote%';
-- Copy the UUID and replace 'YOUR_TOTE_BAG_CATEGORY_ID' below

-- STEP 2: Insert the base product
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
  specifications,
  created_at,
  updated_at
)
VALUES (
  'VISTARA TOTE',
  'vistara-tote',
  'KIBANA',
  'VISTARA (means "expanse", also hints at the V-shape)

Youth-Trendy Brand Style (Bold, Catchy, Fashionable)

VISTARA – Bold. Stylish. Limitless. With its striking V-shape pattern and chic structured body, Vistara brings a fresh vibe to everyday fashion. A bag that''s as versatile as you are — from work to weekends, it''s your go-to trendsetter. Carry Vistara and own the expanse of possibilities in style.

Designed for the modern woman who values elegance and confidence, it balances sophistication with everyday functionality — a true luxury statement.

KEY FEATURES:
• Bold V-stitching pattern that makes a statement
• Structured shape that holds its form beautifully
• 100% PU Leather for durability and style
• Smooth, fine-grained texture
• Gold-tone hardware accents
• Magnetic flap with concealed zipper for security
• Padded laptop sleeve (fits 14-15 inch laptops)
• Inner zip pocket for valuables
• Multiple organizer slip pockets
• Detachable adjustable long strap (50-60 cm)
• Comfortable top handle (8-10 cm drop)
• Spacious 14-16 liter capacity
• Height: 28 cm
• Perfect for office, meetings, and day-to-evening transitions

WHAT FITS INSIDE:
✓ Laptop (14-15 inch)
✓ Diary/notebook
✓ Wallet
✓ Makeup pouch
✓ Charger and cables
✓ Daily essentials
✓ And more!',
  'Bold. Stylish. Limitless. A youth-trendy tote with striking V-shape pattern, structured design, and premium PU leather. Perfect power tote for the modern woman.',
  4999.00,
  NULL,
  'YOUR_TOTE_BAG_CATEGORY_ID', -- ⚠️ REPLACE THIS with actual category UUID
  true,
  true,
  'in_stock',
  'VISTARA TOTE - Bold V-Shape Designer Tote Bag | KIBANA',
  'Shop VISTARA TOTE featuring bold V-stitching, structured design, and premium PU leather. Available in 4 stunning colors: Teal Blue, Mint Green, Mocha Tan, Milky Blue. Perfect for office and day-to-evening use. 14-16L capacity, fits laptop.',
  '{
    "dimensions": {
      "height": "28 cm",
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
      "V-stitching pattern",
      "Structured shape",
      "Elegant design",
      "100% PU Leather",
      "Smooth fine-grained texture",
      "Gold-tone hardware",
      "Magnetic flap closure",
      "Concealed zipper top",
      "Padded laptop sleeve",
      "Inner zip pocket",
      "Organizer slip pockets",
      "Detachable adjustable strap (50-60 cm)",
      "Top handle (8-10 cm drop)",
      "Fits laptop, diary, wallet, makeup pouch, charger, daily essentials",
      "Height: 28 cm",
      "Capacity: 14-16 Liters"
    ]
  }'::jsonb,
  NOW(),
  NOW()
)
RETURNING id;

-- ⚠️ COPY THE RETURNED ID and replace 'YOUR_PRODUCT_ID' in steps below

-- STEP 3: Insert color variants
-- Variant 1: Teal Blue / Dark Blue
INSERT INTO product_variants (
  product_id,
  color,
  sku,
  price,
  stock_quantity,
  is_active,
  created_at,
  updated_at
)
VALUES (
  'YOUR_PRODUCT_ID', -- ⚠️ REPLACE with product ID from step 2
  'Teal Blue',
  'VISTARA-TEAL-001',
  4999.00,
  20,
  true,
  NOW(),
  NOW()
)
RETURNING id;
-- ⚠️ Save this ID as VARIANT_TEAL_ID

-- Variant 2: Mint Green / Pastel Green
INSERT INTO product_variants (
  product_id,
  color,
  sku,
  price,
  stock_quantity,
  is_active,
  created_at,
  updated_at
)
VALUES (
  'YOUR_PRODUCT_ID', -- ⚠️ REPLACE with product ID from step 2
  'Mint Green',
  'VISTARA-GREEN-001',
  4999.00,
  20,
  true,
  NOW(),
  NOW()
)
RETURNING id;
-- ⚠️ Save this ID as VARIANT_GREEN_ID

-- Variant 3: Mocha Tan
INSERT INTO product_variants (
  product_id,
  color,
  sku,
  price,
  stock_quantity,
  is_active,
  created_at,
  updated_at
)
VALUES (
  'YOUR_PRODUCT_ID', -- ⚠️ REPLACE with product ID from step 2
  'Mocha Tan',
  'VISTARA-TAN-001',
  4999.00,
  20,
  true,
  NOW(),
  NOW()
)
RETURNING id;
-- ⚠️ Save this ID as VARIANT_TAN_ID

-- Variant 4: Milky Blue
INSERT INTO product_variants (
  product_id,
  color,
  sku,
  price,
  stock_quantity,
  is_active,
  created_at,
  updated_at
)
VALUES (
  'YOUR_PRODUCT_ID', -- ⚠️ REPLACE with product ID from step 2
  'Milky Blue',
  'VISTARA-BLUE-001',
  4999.00,
  20,
  true,
  NOW(),
  NOW()
)
RETURNING id;
-- ⚠️ Save this ID as VARIANT_BLUE_ID

-- STEP 4: Insert product images
-- ⚠️ FIRST upload your PNG images to Supabase Storage, then add the URLs below

-- Image 1: Teal Blue
INSERT INTO product_images (
  product_id,
  variant_id,
  image_url,
  alt_text,
  "order",
  is_primary,
  created_at
)
VALUES (
  'YOUR_PRODUCT_ID',
  'VARIANT_TEAL_ID',
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/vistara-tote-teal-blue.png',
  'VISTARA TOTE in Teal Blue - Bold V-stitching pattern tote bag',
  1,
  true,
  NOW()
);

-- Image 2: Mint Green / Pastel Green
INSERT INTO product_images (
  product_id,
  variant_id,
  image_url,
  alt_text,
  "order",
  is_primary,
  created_at
)
VALUES (
  'YOUR_PRODUCT_ID',
  'VARIANT_GREEN_ID',
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/vistara-tote-pastel-green.png',
  'VISTARA TOTE in Mint Green - Pastel green structured tote bag',
  2,
  false,
  NOW()
);

-- Image 3: Mocha Tan (Brown)
INSERT INTO product_images (
  product_id,
  variant_id,
  image_url,
  alt_text,
  "order",
  is_primary,
  created_at
)
VALUES (
  'YOUR_PRODUCT_ID',
  'VARIANT_TAN_ID',
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/vistara-tote-brown.png',
  'VISTARA TOTE in Mocha Tan - Brown elegant tote bag',
  3,
  false,
  NOW()
);

-- Image 4: Milky Blue
INSERT INTO product_images (
  product_id,
  variant_id,
  image_url,
  alt_text,
  "order",
  is_primary,
  created_at
)
VALUES (
  'YOUR_PRODUCT_ID',
  'VARIANT_BLUE_ID',
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/vistara-tote-milky-blue.png',
  'VISTARA TOTE in Milky Blue - Light blue sophisticated tote bag',
  4,
  false,
  NOW()
);

-- STEP 5: Verify the data
SELECT 
  p.name,
  p.slug,
  p.price,
  p.is_active,
  c.name as category_name,
  COUNT(DISTINCT pv.id) as variant_count,
  COUNT(DISTINCT pi.id) as image_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.slug = 'vistara-tote'
GROUP BY p.id, p.name, p.slug, p.price, p.is_active, c.name;

-- Should show:
-- name: VISTARA TOTE
-- variant_count: 4
-- image_count: 4

-- ============================================
-- QUICK REFERENCE:
-- ============================================
-- Colors: Teal Blue, Mint Green, Mocha Tan, Milky Blue
-- Price: ₹4,999
-- Category: Tote Bag
-- SKUs: VISTARA-TEAL-001, VISTARA-GREEN-001, VISTARA-TAN-001, VISTARA-BLUE-001
-- Image files needed: 
--   - vistara-tote-teal-blue.png
--   - vistara-tote-pastel-green.png  
--   - vistara-tote-brown.png
--   - vistara-tote-milky-blue.png
-- ============================================
