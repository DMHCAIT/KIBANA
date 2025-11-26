-- ============================================
-- SANDESH LAPTOP BAG PRODUCT IMPORT SCRIPT
-- ============================================
-- This script creates the SANDESH LAPTOP BAG product with 4 color variants
-- Part of the "Message & Writing" collection (Sandesh = Message)
-- Execute this in your Supabase SQL Editor

-- STEP 1: Get the Laptop Bag category ID
-- Run this first to find your category ID:
-- SELECT id, name, slug FROM categories WHERE name ILIKE '%laptop%';
-- Copy the UUID and replace 'YOUR_LAPTOP_BAG_CATEGORY_ID' below

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
  'SANDESH LAPTOP BAG',
  'sandesh-laptop-bag',
  'KIBANA',
  'Sandesh Laptop Bag – Carry Your Story. Own Your Style.

Inspired by the timeless shape of an envelope, Sandesh blends tradition with trend. Its sharp geometric front and sleek silhouette make it a bold fashion statement, while the smartly designed laptop compartment keeps you ready for work, play, and everything in between.

From café catch-ups to boardroom meetings, Sandesh is more than a bag — it''s your message to the world.

KEY FEATURES:
• Envelope-inspired design with sharp geometric front
• Sleek, structured silhouette that maintains its shape
• Premium 100% PU Leather with smooth, fine-grained texture
• Magnetic flap with concealed zipper for secure storage
• Main padded compartment (fits 14"–15.6" laptop)
• Front envelope-style pocket for documents/tablet
• Internal zipper pocket for valuables
• Slip pockets for phone & cards
• Gold-tone hardware accents throughout
• Detachable long strap (adjustable 50–60 cm)
• Top handle (8–10 cm drop) for versatile carrying
• 12-14 liter capacity for all your essentials
• Height: 28 cm - perfect professional size
• Perfect for professionals, students, and style-conscious users

WHAT FITS INSIDE:
✓ Laptop (14"–15.6") in padded compartment
✓ Tablet or documents in front envelope pocket
✓ Diary and notebooks
✓ Charger and cables organized
✓ Wallet secured in zipper pocket
✓ Phone in slip pocket
✓ All your daily essentials

DESIGN STORY:
Sandesh (meaning "message" in Sanskrit/Hindi) represents communication and connection. This laptop bag is your message to the world — a statement of professionalism, style, and cultural heritage. The envelope-inspired design pays homage to traditional correspondence while embracing modern functionality.

Part of the Indian-rooted "Message & Writing" collection.',
  'Carry Your Story. Own Your Style. Envelope-inspired laptop bag with geometric design, padded compartment for 14"–15.6" laptop, and premium gold accents. A bold statement piece.',
  6499.00,
  NULL,
  'YOUR_LAPTOP_BAG_CATEGORY_ID', -- ⚠️ REPLACE THIS with actual category UUID
  true,
  true,
  'in_stock',
  'SANDESH LAPTOP BAG - Envelope Design Laptop Bag with Gold Accents | KIBANA',
  'Shop SANDESH LAPTOP BAG featuring envelope-inspired geometric design, padded 14-15.6 inch laptop compartment, premium PU leather, and gold accents. Available in 4 stunning colors: Teal Blue, Mint Green, Mocha Tan, Milky Blue. Perfect for professionals and students.',
  '{
    "dimensions": {
      "height": "28 cm",
      "capacity": "12-14 Liters"
    },
    "material": "100% PU Leather",
    "texture": "Smooth, Fine-Grained",
    "hardware": "Gold-Tone Accents",
    "closure": "Magnetic Flap with concealed zipper for secure storage",
    "compartments": "One main padded compartment (fits 14–15.6 inch laptop), One front envelope-style pocket for documents/tablet, Internal zipper pocket + slip pockets for phone & cards",
    "shoulderDrop": "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)",
    "capacity": "12–14 Liters – fits laptop, diary, charger, wallet, phone, and daily essentials",
    "laptopSize": "Fits 14–15.6 inch laptop",
    "idealFor": "Professionals, students, and style-conscious users who want a luxury laptop bag with a bold geometric identity",
    "features": [
      "Envelope-inspired timeless design",
      "Sharp geometric front panel",
      "Sleek structured silhouette",
      "Bold fashion statement",
      "100% PU Leather",
      "Smooth fine-grained texture",
      "Magnetic flap closure",
      "Concealed zipper for security",
      "Padded laptop compartment (14-15.6 inches)",
      "Front envelope-style pocket",
      "Internal zipper pocket",
      "Slip pockets for phone and cards",
      "Gold-tone hardware accents",
      "Detachable adjustable strap (50-60 cm)",
      "Top handle (8-10 cm drop)",
      "12-14 liter capacity",
      "Height: 28 cm",
      "Perfect for work, café, boardroom",
      "Cultural heritage meets modern style",
      "Part of Message & Writing collection"
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
  'SANDESH-TEAL-001',
  6499.00,
  15,
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
  'SANDESH-GREEN-001',
  6499.00,
  15,
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
  'SANDESH-TAN-001',
  6499.00,
  15,
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
  'SANDESH-BLUE-001',
  6499.00,
  15,
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/sandesh-laptop-bag-teal-blue.png',
  'SANDESH LAPTOP BAG in Teal Blue - Envelope design laptop bag',
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/sandesh-laptop-bag-green.png',
  'SANDESH LAPTOP BAG in Mint Green - Pastel green laptop bag',
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/sandesh-laptop-bag-brown.png',
  'SANDESH LAPTOP BAG in Mocha Tan - Brown professional laptop bag',
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/sandesh-laptop-bag-milky-blue.png',
  'SANDESH LAPTOP BAG in Milky Blue - Light blue elegant laptop bag',
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
WHERE p.slug = 'sandesh-laptop-bag'
GROUP BY p.id, p.name, p.slug, p.price, p.is_active, c.name;

-- Should show:
-- name: SANDESH LAPTOP BAG
-- variant_count: 4
-- image_count: 4

-- ============================================
-- QUICK REFERENCE:
-- ============================================
-- Product: SANDESH LAPTOP BAG
-- Meaning: Sandesh = Message (Sanskrit/Hindi)
-- Collection: "Message & Writing" (pairs with Lekha Wallet)
-- Colors: Teal Blue, Mint Green, Mocha Tan, Milky Blue
-- Price: ₹6,499
-- Category: Laptop Bag / Work Bag
-- Laptop Size: 14"–15.6"
-- Capacity: 12-14 Liters
-- SKUs: SANDESH-TEAL-001, SANDESH-GREEN-001, SANDESH-TAN-001, SANDESH-BLUE-001
-- Image files needed: 
--   - sandesh-laptop-bag-teal-blue.png
--   - sandesh-laptop-bag-green.png  
--   - sandesh-laptop-bag-brown.png
--   - sandesh-laptop-bag-milky-blue.png
-- ============================================
