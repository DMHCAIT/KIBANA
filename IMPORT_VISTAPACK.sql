-- ============================================
-- VISTAPACK PRODUCT IMPORT SCRIPT
-- ============================================
-- This script creates the VISTAPACK product with 4 color variants
-- Execute this in your Supabase SQL Editor

-- STEP 1: Get the Backpack category ID
-- Run this first to find your category ID:
-- SELECT id, name, slug FROM categories WHERE name ILIKE '%backpack%';
-- Copy the UUID and replace 'YOUR_BACKPACK_CATEGORY_ID' below

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
  'VISTAPACK',
  'vistapack',
  'KIBANA',
  'VISTAPACK – Where Structure Meets Style

Step into a world of effortless charm with the VISTAPACK, a modern emblem of strength, style, and versatility. Defined by its bold chevron-inspired stitching and structured leather silhouette, this backpack whispers stories of movement, freedom, and self-expression.

Designed to carry both your essentials and your spirit with ease, it is more than just a bag—it is a companion for journeys, both near and far. Its ergonomic straps embrace you in comfort, while the compact yet functional interior ensures your belongings stay organized wherever life takes you.

Just as horizons open up with every step forward, the VISTAPACK symbolizes exploration and resilience, making it a timeless gesture of empowerment and elegance for the modern soul.

KEY FEATURES:
• Bold chevron-inspired stitching that catches the eye
• Structured leather silhouette for lasting form
• Ergonomic straps that embrace you in comfort
• Main top zipper closure for security
• Envelope-style front flap pocket for quick access
• Padded compartment (fits iPad/small tablet, up to 11")
• Internal zipper pocket for valuables
• 2 slip pockets for cards, phone, and keys
• Premium 100% PU Leather construction
• Smooth, fine-grained texture
• Gold-tone hardware accents
• Adjustable straps (90-130 cm)
• Works for shoulder carry and crossbody
• Compact 10-12 liter capacity
• Height: 28 cm
• Perfect for college, workdays, city travel, and leisure

WHAT FITS INSIDE:
✓ iPad or small tablet (up to 11")
✓ Wallet and cards
✓ Phone
✓ Keys
✓ Small essentials
✓ Daily necessities',
  'Where Structure Meets Style. Urban carry backpack with bold chevron stitching, padded tablet compartment, and ergonomic design. A companion for journeys near and far.',
  4499.00,
  NULL,
  'YOUR_BACKPACK_CATEGORY_ID', -- ⚠️ REPLACE THIS with actual category UUID
  true,
  true,
  'in_stock',
  'VISTAPACK - Urban Carry Backpack with Chevron Design | KIBANA',
  'Shop VISTAPACK featuring bold chevron-inspired stitching, structured leather design, and premium PU leather. Padded iPad/tablet compartment. Available in 4 stunning colors: Teal Blue, Mint Green, Mocha Tan, Milky Blue. Perfect for college, workdays, and city travel.',
  '{
    "dimensions": {
      "height": "28 cm",
      "capacity": "10-12 Liters"
    },
    "material": "100% PU Leather",
    "texture": "Smooth, Fine-Grained",
    "hardware": "Gold-Tone Accents",
    "closure": "Main top zipper closure, Envelope-style front flap pocket",
    "compartments": "1 padded compartment (fits iPad/small tablet up to 11 inches), 1 zipper pocket, 2 slip pockets (cards, phone, keys)",
    "shoulderDrop": "Adjustable 90 – 130 cm (works for both shoulder carry and crossbody)",
    "capacity": "10–12 Liters",
    "idealFor": "College, casual workdays, city travel, and leisure outings",
    "features": [
      "Bold chevron-inspired stitching",
      "Structured leather silhouette",
      "Modern emblem of strength and style",
      "Ergonomic straps for comfort",
      "100% PU Leather",
      "Smooth fine-grained texture",
      "Gold-tone hardware accents",
      "Main top zipper closure",
      "Envelope-style front flap pocket",
      "Padded compartment for iPad/tablet (up to 11 inches)",
      "Internal zipper pocket",
      "2 slip pockets for cards, phone, keys",
      "Adjustable straps (90-130 cm)",
      "Shoulder carry or crossbody wear",
      "Compact 10-12 liter capacity",
      "Height: 28 cm",
      "Symbolizes exploration and resilience",
      "Timeless gesture of empowerment"
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
  'VISTAPACK-TEAL-001',
  4499.00,
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
  'VISTAPACK-GREEN-001',
  4499.00,
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
  'VISTAPACK-TAN-001',
  4499.00,
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
  'VISTAPACK-BLUE-001',
  4499.00,
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/vistapack-dark-green.png',
  'VISTAPACK in Teal Blue - Bold chevron urban backpack',
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/vistapack-green.png',
  'VISTAPACK in Mint Green - Pastel green structured backpack',
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/vistapack-brown.png',
  'VISTAPACK in Mocha Tan - Brown elegant backpack',
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
  'https://YOUR-SUPABASE-URL.supabase.co/storage/v1/object/public/products/vistapack-blue.png',
  'VISTAPACK in Milky Blue - Light blue modern backpack',
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
WHERE p.slug = 'vistapack'
GROUP BY p.id, p.name, p.slug, p.price, p.is_active, c.name;

-- Should show:
-- name: VISTAPACK
-- variant_count: 4
-- image_count: 4

-- ============================================
-- QUICK REFERENCE:
-- ============================================
-- Colors: Teal Blue, Mint Green, Mocha Tan, Milky Blue
-- Price: ₹4,499
-- Category: Backpack
-- SKUs: VISTAPACK-TEAL-001, VISTAPACK-GREEN-001, VISTAPACK-TAN-001, VISTAPACK-BLUE-001
-- Image files needed: 
--   - vistapack-dark-green.png (for Teal Blue)
--   - vistapack-green.png  
--   - vistapack-brown.png
--   - vistapack-blue.png
-- ============================================
