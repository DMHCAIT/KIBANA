-- ============================================
-- PRIZMA SLING PRODUCT IMPORT SCRIPT
-- ============================================
-- This script creates the PRIZMA SLING product with 4 color variants
-- Execute this in your Supabase SQL Editor

-- STEP 1: Get the Sling Bag category ID
-- Run this first to find your category ID:
-- SELECT id, name, slug FROM categories WHERE name ILIKE '%sling%';
-- Copy the UUID and replace 'YOUR_SLING_BAG_CATEGORY_ID' below

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
  'PRIZMA SLING',
  'prizma-sling',
  'KIBANA',
  'PRIZMA – Luxury–Chic Sling

Inspired by the brilliance of a prism, this bag reflects bold geometry and refined craftsmanship. The striking geometric cuts and golden clasp create a statement, blending modern artistry with timeless elegance.

PRIZMA is designed for women who shine in every dimension — sophisticated, confident, and effortlessly stylish.

Bold. Modern. Unstoppable.

With its striking geometric cuts and chic golden hardware, PRIZMA redefines street-smart luxury. A bag that pairs perfectly with work looks or weekend vibes, it''s built for the confident woman who loves to stand out.

PRIZMA is sophistication made effortless. Carry Prizma and shine at every angle.

KEY FEATURES:
• Bold geometric cuts for modern artistry
• Square metallic push-lock with gold finish
• Premium 100% PU Leather
• Smooth, fine-grained texture
• Gold-tone hardware accents
• Spacious main compartment for essentials
• Internal zipper pocket for valuables
• Slip pocket for phone/cards
• Adjustable shoulder strap (26 cm drop)
• Compact 4-5 liter capacity
• Perfect for evening outings, brunch, and parties
• Ideal companion for formal or festive wear

WHAT FITS INSIDE:
✓ Wallet
✓ Phone
✓ Sunglasses
✓ Small accessories
✓ Cards and essentials',
  'Bold. Modern. Unstoppable. Luxury-chic sling with striking geometric cuts, gold hardware, and refined craftsmanship. Perfect for the confident woman.',
  3999.00,
  NULL,
  'YOUR_SLING_BAG_CATEGORY_ID', -- ⚠️ REPLACE THIS with actual category UUID
  true,
  true,
  'in_stock',
  'PRIZMA SLING - Luxury Geometric Sling Bag | KIBANA',
  'Shop PRIZMA SLING featuring bold geometric design, square metallic push-lock, and premium PU leather. Available in 4 stunning colors: Teal Blue, Mint Green, Mocha Tan, Milky Blue. Perfect for evening outings, brunch, parties. 4-5L capacity.',
  '{
    "dimensions": {
      "shoulderDrop": "26 cm",
      "capacity": "4-5 Liters"
    },
    "material": "100% PU Leather",
    "texture": "Smooth, Fine-Grained",
    "hardware": "Gold-Tone Accents",
    "closure": "Square metallic push-lock (gold finish)",
    "compartments": "Main compartment (spacious enough for essentials), Internal zipper pocket, Slip pocket for phone/cards",
    "shoulderDrop": "26 cm (adjustable strap included)",
    "capacity": "4–5 Liters",
    "idealFor": "Evening outings, brunch, parties, and as a chic companion to formal or festive wear",
    "features": [
      "Bold geometric cuts",
      "Modern artistry design",
      "Prism-inspired brilliance",
      "Square metallic push-lock",
      "Gold finish hardware",
      "100% PU Leather",
      "Smooth fine-grained texture",
      "Gold-tone accents",
      "Main compartment for essentials",
      "Internal zipper pocket",
      "Slip pocket for phone/cards",
      "Adjustable shoulder strap",
      "26 cm shoulder drop",
      "Compact 4-5 liter capacity",
      "Street-smart luxury",
      "Perfect for wallet, phone, sunglasses, small accessories"
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
  'PRIZMA-TEAL-001',
  3999.00,
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
  'PRIZMA-GREEN-001',
  3999.00,
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
  'PRIZMA-TAN-001',
  3999.00,
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
  'PRIZMA-BLUE-001',
  3999.00,
  20,
  true,
  NOW(),
  NOW()
)
RETURNING id;
-- ⚠️ Save this ID as VARIANT_BLUE_ID

-- STEP 4: Insert product images
-- ⚠️ FIRST upload your PNG images to Supabase Storage, then add the URLs below

-- Image 1: Teal Blue (dark green image)
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/prizma-sling-dark-green.png',
  'PRIZMA SLING in Teal Blue - Bold geometric luxury sling bag',
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/prizma-sling-pastel-green.png',
  'PRIZMA SLING in Mint Green - Pastel green chic sling bag',
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/prizma-sling-brown.png',
  'PRIZMA SLING in Mocha Tan - Brown elegant sling bag',
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/prizma-sling-milky-blue.png',
  'PRIZMA SLING in Milky Blue - Light blue sophisticated sling bag',
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
WHERE p.slug = 'prizma-sling'
GROUP BY p.id, p.name, p.slug, p.price, p.is_active, c.name;

-- Should show:
-- name: PRIZMA SLING
-- variant_count: 4
-- image_count: 4

-- ============================================
-- QUICK REFERENCE:
-- ============================================
-- Colors: Teal Blue, Mint Green, Mocha Tan, Milky Blue
-- Price: ₹3,999
-- Category: Sling Bag
-- SKUs: PRIZMA-TEAL-001, PRIZMA-GREEN-001, PRIZMA-TAN-001, PRIZMA-BLUE-001
-- Image files needed: 
--   - prizma-sling-dark-green.png (for Teal Blue)
--   - prizma-sling-pastel-green.png  
--   - prizma-sling-brown.png
--   - prizma-sling-milky-blue.png
-- ============================================
