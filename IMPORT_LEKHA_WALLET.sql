-- ============================================
-- LEKHA WALLET PRODUCT IMPORT SCRIPT
-- ============================================
-- This script creates the Lekha Wallet product with 4 color variants
-- Part of the "Message & Writing" collection (Lekha = Writing/Record)
-- Execute this in your Supabase SQL Editor

-- STEP 1: Get the Wallet/Clutch category ID
-- Run this first to find your category ID:
-- SELECT id, name, slug FROM categories WHERE name ILIKE '%wallet%' OR name ILIKE '%clutch%';
-- Copy the UUID and replace 'YOUR_WALLET_CATEGORY_ID' below

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
  'Lekha Wallet',
  'lekha-wallet',
  'KIBANA',
  'Lekha Wallet – Write Your Style.

Inspired by the lines of an envelope, Lekha (meaning "writing/record" in Sanskrit & Hindi) is a blend of heritage and trend. With its chic geometric cuts, soft leather touch, and vibrant color story, Lekha adds a bold pop to your everyday carry.

Compact yet spacious, it''s designed to hold more than just essentials — it holds your statement.

KEY FEATURES:
• Envelope-inspired geometric design
• Chic geometric cuts with elegant lines
• Premium 100% PU Leather with smooth, fine-grained texture
• Zip-around closure with envelope-style panel design
• 2 main cash compartments for organized storage
• 1 center zipper pocket specifically for coins
• 6–8 card slots for all your cards
• 2 slip pockets for bills and receipts
• Gold-tone hardware (zipper puller & trims)
• Adjustable shoulder strap (26 cm drop)
• Can be used as clutch or crossbody
• Compact yet spacious design
• 1.5-2 liter capacity
• Perfect for everyday use and evening outings

WHAT FITS INSIDE:
✓ Cash organized in 2 main compartments
✓ Coins secure in center zipper pocket
✓ 6-8 cards neatly organized
✓ Bills and receipts in slip pockets
✓ Small essentials
✓ Phone (when carried as clutch)

DESIGN STORY:
Lekha (meaning "writing" or "record" in Sanskrit/Hindi) represents documentation and personal expression. This wallet is part of the Indian-rooted "Message & Writing" collection, beautifully paired with Sandesh Laptop Bag.

**Perfect Pairing:** Sandesh (Message) + Lekha (Writing) = Complete professional style with cultural roots.

Whether you''re heading to work, meeting friends, or enjoying an evening out, Lekha adds a bold pop of color and heritage-inspired elegance to your look. A statement of elegance in every line.',
  'Write Your Style. Envelope-inspired wallet with geometric design, 6-8 card slots, coin pocket, and gold accents. Compact yet spacious. A statement of elegance.',
  2199.00,
  NULL,
  'YOUR_WALLET_CATEGORY_ID', -- ⚠️ REPLACE THIS with actual category UUID
  true,
  true,
  'in_stock',
  'Lekha Wallet - Envelope Design Women''s Wallet with Gold Accents | KIBANA',
  'Shop Lekha Wallet featuring envelope-inspired geometric design, 6-8 card slots, coin pocket, premium PU leather, and gold accents. Available in 4 stunning colors: Teal Blue, Mint Green, Mocha Tan, Milky Blue. Perfect for everyday use and evening outings.',
  '{
    "material": "100% PU Leather",
    "texture": "Smooth, Fine-Grained",
    "hardware": "Gold-Tone Accents (zipper puller & trims)",
    "closure": "Zip-Around Closure with envelope-style panel design",
    "compartments": "2 main cash compartments, 1 center zipper pocket for coins, 6–8 card slots, 2 slip pockets for bills/receipts",
    "shoulderDrop": "26 cm (adjustable strap included)",
    "capacity": "1.5–2 Liters - designed to hold cash, coins, cards, and small essentials",
    "idealFor": "Everyday use, evening outings, and as a stylish companion for both casual and professional looks",
    "features": [
      "Envelope-inspired design",
      "Chic geometric cuts",
      "Elegant lines and panels",
      "Heritage meets trend",
      "100% PU Leather",
      "Smooth fine-grained texture",
      "Soft leather touch",
      "Zip-around closure",
      "Envelope-style panel design",
      "2 main cash compartments",
      "Center zipper pocket for coins",
      "6-8 card slots",
      "2 slip pockets for bills/receipts",
      "Gold-tone hardware",
      "Adjustable shoulder strap (26 cm)",
      "Use as clutch or crossbody",
      "Compact yet spacious",
      "Bold color pop",
      "Part of Message & Writing collection",
      "Pairs beautifully with SANDESH LAPTOP BAG"
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
  'LEKHA-TEAL-001',
  2199.00,
  25,
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
  'LEKHA-GREEN-001',
  2199.00,
  25,
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
  'LEKHA-TAN-001',
  2199.00,
  25,
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
  'LEKHA-BLUE-001',
  2199.00,
  25,
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/lekha-wallet-teal-blue.png',
  'Lekha Wallet in Teal Blue - Envelope design clutch wallet',
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/lekha-wallet-pastel-green.png',
  'Lekha Wallet in Mint Green - Pastel green elegant wallet',
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/lekha-wallet-brown.png',
  'Lekha Wallet in Mocha Tan - Brown stylish wallet',
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/lekha-wallet-milky-blue.png',
  'Lekha Wallet in Milky Blue - Light blue chic wallet',
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
WHERE p.slug = 'lekha-wallet'
GROUP BY p.id, p.name, p.slug, p.price, p.is_active, c.name;

-- Should show:
-- name: Lekha Wallet
-- variant_count: 4
-- image_count: 4

-- ============================================
-- QUICK REFERENCE:
-- ============================================
-- Product: Lekha Wallet
-- Meaning: Lekha = Writing/Record (Sanskrit/Hindi)
-- Collection: "Message & Writing" (pairs with SANDESH LAPTOP BAG)
-- Colors: Teal Blue, Mint Green, Mocha Tan, Milky Blue
-- Price: ₹2,199
-- Category: Wallet / Clutch
-- Card Slots: 6-8
-- Capacity: 1.5-2 Liters
-- SKUs: LEKHA-TEAL-001, LEKHA-GREEN-001, LEKHA-TAN-001, LEKHA-BLUE-001
-- Image files needed: 
--   - lekha-wallet-teal-blue.png
--   - lekha-wallet-pastel-green.png  
--   - lekha-wallet-brown.png
--   - lekha-wallet-milky-blue.png
-- ============================================
