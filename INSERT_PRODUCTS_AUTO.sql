-- ============================================
-- AUTO INSERT ALL PRODUCTS - NO ID REPLACEMENT NEEDED!
-- ============================================
-- This script automatically finds category IDs by name
-- Just run this entire script at once!

-- ============================================
-- PRODUCT 1: VISTARA TOTE
-- ============================================

WITH tote_category AS (
  SELECT id FROM categories 
  WHERE name ILIKE '%tote%' AND is_active = true 
  LIMIT 1
),
new_product AS (
  INSERT INTO products (
    name, slug, brand, description, short_description, price, 
    category_id, is_active, is_featured, stock_status, seo_title, specifications
  )
  SELECT 
    'VISTARA TOTE',
    'vistara-tote',
    'KIBANA',
    'VISTARA – Bold. Stylish. Limitless. With its striking V-shape pattern and chic structured body, Vistara brings a fresh vibe to everyday fashion. A bag that''s as versatile as you are — from work to weekends, it''s your go-to trendsetter.',
    'Bold. Stylish. Limitless. V-stitching structured tote with padded laptop sleeve.',
    4999.00,
    id,
    true, true, 'in_stock',
    'VISTARA TOTE - Bold Stylish Tote Bag | KIBANA',
    '{"material": "100% PU Leather", "capacity": "14-16 Liters", "height": "28 cm", "closure": "Magnetic Flap with concealed zipper", "hardware": "Gold-Tone Accents"}'::jsonb
  FROM tote_category
  RETURNING id
)
INSERT INTO product_variants (product_id, color, sku, price, stock_quantity, is_active)
SELECT id, 'Teal Blue', 'VISTARA-TEAL-001', 4999.00, 20, true FROM new_product
UNION ALL
SELECT id, 'Mint Green', 'VISTARA-GREEN-001', 4999.00, 20, true FROM new_product
UNION ALL
SELECT id, 'Mocha Tan', 'VISTARA-TAN-001', 4999.00, 20, true FROM new_product
UNION ALL
SELECT id, 'Milky Blue', 'VISTARA-BLUE-001', 4999.00, 20, true FROM new_product;

-- ============================================
-- PRODUCT 2: PRIZMA SLING
-- ============================================

WITH sling_category AS (
  SELECT id FROM categories 
  WHERE name ILIKE '%sling%' AND is_active = true 
  LIMIT 1
),
new_product AS (
  INSERT INTO products (
    name, slug, brand, description, short_description, price, 
    category_id, is_active, is_featured, stock_status, seo_title, specifications
  )
  SELECT 
    'PRIZMA SLING',
    'prizma-sling',
    'KIBANA',
    'PRIZMA – Bold. Modern. Unstoppable. With its striking geometric cuts and chic golden hardware, Prizma redefines street-smart luxury. A bag that pairs perfectly with work looks or weekend vibes.',
    'Bold. Modern. Unstoppable. Geometric luxury sling with golden hardware.',
    3999.00,
    id,
    true, true, 'in_stock',
    'PRIZMA SLING - Geometric Luxury Sling Bag | KIBANA',
    '{"material": "100% PU Leather", "capacity": "4-5 Liters", "closure": "Square metallic push-lock", "hardware": "Gold-Tone Accents"}'::jsonb
  FROM sling_category
  RETURNING id
)
INSERT INTO product_variants (product_id, color, sku, price, stock_quantity, is_active)
SELECT id, 'Teal Blue', 'PRIZMA-TEAL-001', 3999.00, 20, true FROM new_product
UNION ALL
SELECT id, 'Mint Green', 'PRIZMA-GREEN-001', 3999.00, 20, true FROM new_product
UNION ALL
SELECT id, 'Mocha Tan', 'PRIZMA-TAN-001', 3999.00, 20, true FROM new_product
UNION ALL
SELECT id, 'Milky Blue', 'PRIZMA-BLUE-001', 3999.00, 20, true FROM new_product;

-- ============================================
-- PRODUCT 3: VISTAPACK
-- ============================================

WITH backpack_category AS (
  SELECT id FROM categories 
  WHERE name ILIKE '%backpack%' AND is_active = true 
  LIMIT 1
),
new_product AS (
  INSERT INTO products (
    name, slug, brand, description, short_description, price, 
    category_id, is_active, is_featured, stock_status, seo_title, specifications
  )
  SELECT 
    'VISTAPACK',
    'vistapack',
    'KIBANA',
    'VISTAPACK – Where Structure Meets Style. Defined by its bold chevron-inspired stitching and structured leather silhouette, this backpack is perfect for college, casual workdays, city travel, and leisure outings.',
    'Where Structure Meets Style. Chevron-stitched urban backpack with tablet compartment.',
    4499.00,
    id,
    true, true, 'in_stock',
    'VISTAPACK - Urban Carry Backpack | KIBANA',
    '{"material": "100% PU Leather", "capacity": "10-12 Liters", "height": "28 cm", "closure": "Top zipper + Front Flap", "hardware": "Gold-Tone Accents"}'::jsonb
  FROM backpack_category
  RETURNING id
)
INSERT INTO product_variants (product_id, color, sku, price, stock_quantity, is_active)
SELECT id, 'Teal Blue', 'VISTAPACK-TEAL-001', 4499.00, 20, true FROM new_product
UNION ALL
SELECT id, 'Mint Green', 'VISTAPACK-GREEN-001', 4499.00, 20, true FROM new_product
UNION ALL
SELECT id, 'Mocha Tan', 'VISTAPACK-TAN-001', 4499.00, 20, true FROM new_product
UNION ALL
SELECT id, 'Milky Blue', 'VISTAPACK-BLUE-001', 4499.00, 20, true FROM new_product;

-- ============================================
-- PRODUCT 4: SANDESH LAPTOP BAG
-- ============================================

WITH laptop_category AS (
  SELECT id FROM categories 
  WHERE name ILIKE '%laptop%' AND is_active = true 
  LIMIT 1
),
new_product AS (
  INSERT INTO products (
    name, slug, brand, description, short_description, price, 
    category_id, is_active, is_featured, stock_status, seo_title, specifications
  )
  SELECT 
    'SANDESH LAPTOP BAG',
    'sandesh-laptop-bag',
    'KIBANA',
    'Sandesh Laptop Bag – Carry Your Story. Own Your Style. Inspired by the timeless shape of an envelope, Sandesh blends tradition with trend. Perfect for professionals, students, and style-conscious users.',
    'Carry Your Story. Envelope-inspired laptop bag with geometric design for 14-15.6 inch laptops.',
    6499.00,
    id,
    true, true, 'in_stock',
    'SANDESH LAPTOP BAG - Envelope Design Laptop Bag | KIBANA',
    '{"material": "100% PU Leather", "capacity": "12-14 Liters", "laptopSize": "14-15.6 inch", "closure": "Magnetic Flap with zipper", "hardware": "Gold-Tone Accents"}'::jsonb
  FROM laptop_category
  RETURNING id
)
INSERT INTO product_variants (product_id, color, sku, price, stock_quantity, is_active)
SELECT id, 'Teal Blue', 'SANDESH-TEAL-001', 6499.00, 15, true FROM new_product
UNION ALL
SELECT id, 'Mint Green', 'SANDESH-GREEN-001', 6499.00, 15, true FROM new_product
UNION ALL
SELECT id, 'Mocha Tan', 'SANDESH-TAN-001', 6499.00, 15, true FROM new_product
UNION ALL
SELECT id, 'Milky Blue', 'SANDESH-BLUE-001', 6499.00, 15, true FROM new_product;

-- ============================================
-- PRODUCT 5: LEKHA WALLET
-- ============================================

WITH wallet_category AS (
  SELECT id FROM categories 
  WHERE (name ILIKE '%wallet%' OR name ILIKE '%clutch%') AND is_active = true 
  LIMIT 1
),
new_product AS (
  INSERT INTO products (
    name, slug, brand, description, short_description, price, 
    category_id, is_active, is_featured, stock_status, seo_title, specifications
  )
  SELECT 
    'Lekha Wallet',
    'lekha-wallet',
    'KIBANA',
    'Lekha Wallet – Write Your Style. Inspired by the lines of an envelope, Lekha is a blend of heritage and trend. With its chic geometric cuts and vibrant colors, perfect for everyday use and evening outings.',
    'Write Your Style. Envelope-inspired wallet with 6-8 card slots and coin pocket.',
    2199.00,
    id,
    true, true, 'in_stock',
    'Lekha Wallet - Envelope Design Wallet | KIBANA',
    '{"material": "100% PU Leather", "capacity": "1.5-2 Liters", "cardSlots": "6-8", "closure": "Zip-Around", "hardware": "Gold-Tone Accents"}'::jsonb
  FROM wallet_category
  RETURNING id
)
INSERT INTO product_variants (product_id, color, sku, price, stock_quantity, is_active)
SELECT id, 'Teal Blue', 'LEKHA-TEAL-001', 2199.00, 25, true FROM new_product
UNION ALL
SELECT id, 'Mint Green', 'LEKHA-GREEN-001', 2199.00, 25, true FROM new_product
UNION ALL
SELECT id, 'Mocha Tan', 'LEKHA-TAN-001', 2199.00, 25, true FROM new_product
UNION ALL
SELECT id, 'Milky Blue', 'LEKHA-BLUE-001', 2199.00, 25, true FROM new_product;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check all products were created
SELECT 
  p.name,
  p.slug,
  p.price,
  c.name as category_name,
  COUNT(pv.id) as variant_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.slug IN ('vistara-tote', 'prizma-sling', 'vistapack', 'sandesh-laptop-bag', 'lekha-wallet')
GROUP BY p.id, p.name, p.slug, p.price, c.name
ORDER BY p.price DESC;

-- Expected result:
-- SANDESH LAPTOP BAG | sandesh-laptop-bag | 6499 | Laptop Bag | 4
-- VISTARA TOTE | vistara-tote | 4999 | Tote Bag | 4
-- VISTAPACK | vistapack | 4499 | Backpack | 4
-- PRIZMA SLING | prizma-sling | 3999 | Sling Bag | 4
-- Lekha Wallet | lekha-wallet | 2199 | Wallet | 4

-- Show all variants
SELECT 
  p.name as product_name,
  pv.color,
  pv.sku,
  pv.price,
  pv.stock_quantity
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE p.slug IN ('vistara-tote', 'prizma-sling', 'vistapack', 'sandesh-laptop-bag', 'lekha-wallet')
ORDER BY p.name, pv.color;

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE '✅ ALL 5 PRODUCTS INSERTED!';
  RAISE NOTICE '✅ 20 COLOR VARIANTS CREATED!';
  RAISE NOTICE '';
  RAISE NOTICE '📦 Products:';
  RAISE NOTICE '   1. VISTARA TOTE (₹4,999) - 4 colors';
  RAISE NOTICE '   2. PRIZMA SLING (₹3,999) - 4 colors';
  RAISE NOTICE '   3. VISTAPACK (₹4,499) - 4 colors';
  RAISE NOTICE '   4. SANDESH LAPTOP BAG (₹6,499) - 4 colors';
  RAISE NOTICE '   5. Lekha Wallet (₹2,199) - 4 colors';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 NEXT STEPS:';
  RAISE NOTICE '   1. Upload 20 product images to Supabase Storage';
  RAISE NOTICE '   2. Link images to variants in product_images table';
  RAISE NOTICE '   3. Visit your collection pages!';
  RAISE NOTICE '';
  RAISE NOTICE '🌐 Collection URLs:';
  RAISE NOTICE '   - /collections/tote-bag';
  RAISE NOTICE '   - /collections/sling-bag';
  RAISE NOTICE '   - /collections/backpack';
  RAISE NOTICE '   - /collections/laptop-bag';
  RAISE NOTICE '   - /collections/wallet';
END $$;
