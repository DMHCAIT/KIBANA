-- ============================================
-- INSERT ALL 5 PRODUCTS WITH 20 VARIANTS
-- ============================================
-- This will add all your products to the database
-- Run this in Supabase SQL Editor

-- STEP 1: Get your category IDs first
-- Run this query and note down the IDs:
/*
SELECT id, name, slug FROM categories ORDER BY name;

You need IDs for:
- Tote Bag (for VISTARA TOTE)
- Sling Bag (for PRIZMA SLING)
- Backpack (for VISTAPACK)
- Laptop Bag (for SANDESH LAPTOP BAG)
- Wallet or Clutch (for Lekha Wallet)

Replace 'YOUR_XXX_CATEGORY_ID' below with actual UUIDs
*/

-- ============================================
-- PRODUCT 1: VISTARA TOTE (₹4,999)
-- ============================================

-- Insert product
INSERT INTO products (
  name, slug, brand, description, short_description, price, category_id,
  is_active, is_featured, stock_status, seo_title, seo_description, specifications
) VALUES (
  'VISTARA TOTE',
  'vistara-tote',
  'KIBANA',
  'VISTARA – Bold. Stylish. Limitless. With its striking V-shape pattern and chic structured body, Vistara brings a fresh vibe to everyday fashion. A bag that''s as versatile as you are — from work to weekends, it''s your go-to trendsetter. Carry Vistara and own the expanse of possibilities in style.',
  'Bold. Stylish. Limitless. V-stitching structured tote with padded laptop sleeve.',
  4999.00,
  'YOUR_TOTE_BAG_CATEGORY_ID', -- ⚠️ REPLACE THIS
  true,
  true,
  'in_stock',
  'VISTARA TOTE - Bold Stylish Tote Bag | KIBANA',
  'Shop VISTARA TOTE featuring V-stitching pattern, structured design, and padded laptop sleeve. Available in 4 colors.',
  '{"material": "100% PU Leather", "texture": "Smooth, Fine-Grained", "closure": "Magnetic Flap with concealed zipper", "capacity": "14-16 Liters", "height": "28 cm", "compartments": "One main compartment/Flap/Top Zipper, padded laptop sleeve, inner zip pocket, organizer slip pockets", "hardware": "Gold-Tone Accents", "shoulderDrop": "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)", "idealFor": "Office, meetings, and day-to-evening transitions"}'::jsonb
) RETURNING id;
-- ⚠️ COPY THE RETURNED ID and use it below as VISTARA_PRODUCT_ID

-- Insert variants for VISTARA TOTE
INSERT INTO product_variants (product_id, color, sku, price, stock_quantity, is_active) VALUES
('VISTARA_PRODUCT_ID', 'Teal Blue', 'VISTARA-TEAL-001', 4999.00, 20, true),
('VISTARA_PRODUCT_ID', 'Mint Green', 'VISTARA-GREEN-001', 4999.00, 20, true),
('VISTARA_PRODUCT_ID', 'Mocha Tan', 'VISTARA-TAN-001', 4999.00, 20, true),
('VISTARA_PRODUCT_ID', 'Milky Blue', 'VISTARA-BLUE-001', 4999.00, 20, true);

-- ============================================
-- PRODUCT 2: PRIZMA SLING (₹3,999)
-- ============================================

INSERT INTO products (
  name, slug, brand, description, short_description, price, category_id,
  is_active, is_featured, stock_status, seo_title, seo_description, specifications
) VALUES (
  'PRIZMA SLING',
  'prizma-sling',
  'KIBANA',
  'PRIZMA – Bold. Modern. Unstoppable. With its striking geometric cuts and chic golden hardware, Prizma redefines street-smart luxury. A bag that pairs perfectly with work looks or weekend vibes, it''s built for the confident woman who loves to stand out.',
  'Bold. Modern. Unstoppable. Geometric luxury sling with golden hardware.',
  3999.00,
  'YOUR_SLING_BAG_CATEGORY_ID', -- ⚠️ REPLACE THIS
  true,
  true,
  'in_stock',
  'PRIZMA SLING - Geometric Luxury Sling Bag | KIBANA',
  'Shop PRIZMA SLING featuring geometric cuts and golden hardware. Available in 4 colors.',
  '{"material": "100% PU Leather", "texture": "Smooth, Fine-Grained", "closure": "Square metallic push-lock (gold finish)", "capacity": "4-5 Liters", "compartments": "Main compartment, internal zipper pocket, slip pocket for phone/cards", "hardware": "Gold-Tone Accents", "shoulderDrop": "26 cm (adjustable strap included)", "idealFor": "Evening outings, brunch, parties, and as a chic companion to formal or festive wear"}'::jsonb
) RETURNING id;
-- ⚠️ COPY THE RETURNED ID and use it below as PRIZMA_PRODUCT_ID

INSERT INTO product_variants (product_id, color, sku, price, stock_quantity, is_active) VALUES
('PRIZMA_PRODUCT_ID', 'Teal Blue', 'PRIZMA-TEAL-001', 3999.00, 20, true),
('PRIZMA_PRODUCT_ID', 'Mint Green', 'PRIZMA-GREEN-001', 3999.00, 20, true),
('PRIZMA_PRODUCT_ID', 'Mocha Tan', 'PRIZMA-TAN-001', 3999.00, 20, true),
('PRIZMA_PRODUCT_ID', 'Milky Blue', 'PRIZMA-BLUE-001', 3999.00, 20, true);

-- ============================================
-- PRODUCT 3: VISTAPACK (₹4,499)
-- ============================================

INSERT INTO products (
  name, slug, brand, description, short_description, price, category_id,
  is_active, is_featured, stock_status, seo_title, seo_description, specifications
) VALUES (
  'VISTAPACK',
  'vistapack',
  'KIBANA',
  'VISTAPACK – Where Structure Meets Style. Step into a world of effortless charm with the VISTAPACK, a modern emblem of strength, style, and versatility. Defined by its bold chevron-inspired stitching and structured leather silhouette, this backpack whispers stories of movement, freedom, and self-expression.',
  'Where Structure Meets Style. Chevron-stitched urban backpack with tablet compartment.',
  4499.00,
  'YOUR_BACKPACK_CATEGORY_ID', -- ⚠️ REPLACE THIS
  true,
  true,
  'in_stock',
  'VISTAPACK - Urban Carry Backpack | KIBANA',
  'Shop VISTAPACK featuring chevron stitching and padded tablet compartment. Available in 4 colors.',
  '{"material": "100% PU Leather", "texture": "Smooth, Fine-Grained", "closure": "Main top zipper closure, Front Flap Pocket", "capacity": "10-12 Liters", "height": "28 cm", "compartments": "1 padded compartment (fits iPad/small tablet, up to 11 inches), 1 zipper pocket, 2 slip pockets (cards, phone, keys)", "hardware": "Gold-Tone Accents", "shoulderDrop": "Adjustable 90–130 cm (works for both shoulder carry and crossbody)", "idealFor": "College, casual workdays, city travel, and leisure outings"}'::jsonb
) RETURNING id;
-- ⚠️ COPY THE RETURNED ID and use it below as VISTAPACK_PRODUCT_ID

INSERT INTO product_variants (product_id, color, sku, price, stock_quantity, is_active) VALUES
('VISTAPACK_PRODUCT_ID', 'Teal Blue', 'VISTAPACK-TEAL-001', 4499.00, 20, true),
('VISTAPACK_PRODUCT_ID', 'Mint Green', 'VISTAPACK-GREEN-001', 4499.00, 20, true),
('VISTAPACK_PRODUCT_ID', 'Mocha Tan', 'VISTAPACK-TAN-001', 4499.00, 20, true),
('VISTAPACK_PRODUCT_ID', 'Milky Blue', 'VISTAPACK-BLUE-001', 4499.00, 20, true);

-- ============================================
-- PRODUCT 4: SANDESH LAPTOP BAG (₹6,499)
-- ============================================

INSERT INTO products (
  name, slug, brand, description, short_description, price, category_id,
  is_active, is_featured, stock_status, seo_title, seo_description, specifications
) VALUES (
  'SANDESH LAPTOP BAG',
  'sandesh-laptop-bag',
  'KIBANA',
  'Sandesh Laptop Bag – Carry Your Story. Own Your Style. Inspired by the timeless shape of an envelope, Sandesh blends tradition with trend. Its sharp geometric front and sleek silhouette make it a bold fashion statement, while the smartly designed laptop compartment keeps you ready for work, play, and everything in between.',
  'Carry Your Story. Envelope-inspired laptop bag with geometric design.',
  6499.00,
  'YOUR_LAPTOP_BAG_CATEGORY_ID', -- ⚠️ REPLACE THIS
  true,
  true,
  'in_stock',
  'SANDESH LAPTOP BAG - Envelope Design Laptop Bag | KIBANA',
  'Shop SANDESH LAPTOP BAG featuring envelope-inspired design and padded laptop compartment. Available in 4 colors.',
  '{"material": "100% PU Leather", "texture": "Smooth, Fine-Grained", "closure": "Magnetic Flap with concealed zipper", "capacity": "12-14 Liters", "height": "28 cm", "laptopSize": "Fits 14-15.6 inch laptop", "compartments": "One main padded compartment (fits 14–15.6 inch laptop), One front envelope-style pocket for documents/tablet, Internal zipper pocket + slip pockets", "hardware": "Gold-Tone Accents", "shoulderDrop": "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)", "idealFor": "Professionals, students, and style-conscious users"}'::jsonb
) RETURNING id;
-- ⚠️ COPY THE RETURNED ID and use it below as SANDESH_PRODUCT_ID

INSERT INTO product_variants (product_id, color, sku, price, stock_quantity, is_active) VALUES
('SANDESH_PRODUCT_ID', 'Teal Blue', 'SANDESH-TEAL-001', 6499.00, 15, true),
('SANDESH_PRODUCT_ID', 'Mint Green', 'SANDESH-GREEN-001', 6499.00, 15, true),
('SANDESH_PRODUCT_ID', 'Mocha Tan', 'SANDESH-TAN-001', 6499.00, 15, true),
('SANDESH_PRODUCT_ID', 'Milky Blue', 'SANDESH-BLUE-001', 6499.00, 15, true);

-- ============================================
-- PRODUCT 5: LEKHA WALLET (₹2,199)
-- ============================================

INSERT INTO products (
  name, slug, brand, description, short_description, price, category_id,
  is_active, is_featured, stock_status, seo_title, seo_description, specifications
) VALUES (
  'Lekha Wallet',
  'lekha-wallet',
  'KIBANA',
  'Lekha Wallet – Write Your Style. Inspired by the lines of an envelope, Lekha is a blend of heritage and trend. With its chic geometric cuts, soft leather touch, and vibrant color story, Lekha adds a bold pop to your everyday carry. Compact yet spacious, it''s designed to hold more than just essentials — it holds your statement.',
  'Write Your Style. Envelope-inspired wallet with 6-8 card slots.',
  2199.00,
  'YOUR_WALLET_CATEGORY_ID', -- ⚠️ REPLACE THIS
  true,
  true,
  'in_stock',
  'Lekha Wallet - Envelope Design Wallet | KIBANA',
  'Shop Lekha Wallet featuring envelope-inspired design and 6-8 card slots. Available in 4 colors.',
  '{"material": "100% PU Leather", "texture": "Smooth, Fine-Grained", "closure": "Zip-Around Closure with envelope-style panel design", "capacity": "1.5-2 Liters", "compartments": "2 main cash compartments, 1 center zipper pocket for coins, 6–8 card slots, 2 slip pockets for bills/receipts", "hardware": "Gold-Tone Accents (zipper puller & trims)", "shoulderDrop": "26 cm (adjustable strap included)", "idealFor": "Everyday use, evening outings, and as a stylish companion"}'::jsonb
) RETURNING id;
-- ⚠️ COPY THE RETURNED ID and use it below as LEKHA_PRODUCT_ID

INSERT INTO product_variants (product_id, color, sku, price, stock_quantity, is_active) VALUES
('LEKHA_PRODUCT_ID', 'Teal Blue', 'LEKHA-TEAL-001', 2199.00, 25, true),
('LEKHA_PRODUCT_ID', 'Mint Green', 'LEKHA-GREEN-001', 2199.00, 25, true),
('LEKHA_PRODUCT_ID', 'Mocha Tan', 'LEKHA-TAN-001', 2199.00, 25, true),
('LEKHA_PRODUCT_ID', 'Milky Blue', 'LEKHA-BLUE-001', 2199.00, 25, true);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all products were created
SELECT name, slug, price FROM products WHERE slug IN (
  'vistara-tote', 'prizma-sling', 'vistapack', 'sandesh-laptop-bag', 'lekha-wallet'
) ORDER BY price DESC;

-- Check all variants (should show 20 rows)
SELECT p.name, pv.color, pv.sku, pv.price, pv.stock_quantity
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE p.slug IN ('vistara-tote', 'prizma-sling', 'vistapack', 'sandesh-laptop-bag', 'lekha-wallet')
ORDER BY p.name, pv.color;

-- Count check
SELECT 
  'Total Products' as type,
  COUNT(*) as count
FROM products 
WHERE slug IN ('vistara-tote', 'prizma-sling', 'vistapack', 'sandesh-laptop-bag', 'lekha-wallet')
UNION ALL
SELECT 
  'Total Variants' as type,
  COUNT(*) as count
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE p.slug IN ('vistara-tote', 'prizma-sling', 'vistapack', 'sandesh-laptop-bag', 'lekha-wallet');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$ 
BEGIN 
  RAISE NOTICE '✅ ALL 5 PRODUCTS INSERTED!';
  RAISE NOTICE '✅ 20 VARIANTS CREATED!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 NEXT STEPS:';
  RAISE NOTICE '1. Upload 20 product images to Supabase Storage';
  RAISE NOTICE '2. Get the image URLs';
  RAISE NOTICE '3. Insert product_images records linking images to variants';
  RAISE NOTICE '4. Visit your website collections pages!';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Products ready to display on website!';
END $$;
