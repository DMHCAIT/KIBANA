-- ============================================
-- SIMPLE VERSION - ALL 5 PRODUCTS
-- ============================================
-- This version uses a simpler approach with temporary variables
-- Copy and paste sections one by one, replacing category IDs

-- ============================================
-- FIRST: GET YOUR CATEGORY IDs
-- ============================================
-- Run this query first and note down the IDs:
SELECT id, name, slug FROM categories ORDER BY name;

/*
You'll need to replace these placeholders:
- Tote Bag category ID
- Sling Bag category ID  
- Backpack category ID
- Laptop Bag category ID
- Wallet/Clutch category ID
*/

-- ============================================
-- PRODUCT 1: VISTARA TOTE
-- ============================================

-- Step 1: Insert product (replace category_id)
WITH new_product AS (
  INSERT INTO products (name, slug, brand, description, short_description, price, category_id, is_active, is_featured, stock_status, seo_title, specifications)
  VALUES (
    'VISTARA TOTE',
    'vistara-tote',
    'KIBANA',
    'VISTARA – Bold. Stylish. Limitless. V-stitching structured tote with padded laptop sleeve.',
    'Bold. Stylish. Limitless.',
    4999.00,
    'PUT-TOTE-BAG-CATEGORY-ID-HERE'::uuid, -- ⚠️ REPLACE THIS
    true, true, 'in_stock',
    'VISTARA TOTE - Bold Stylish Tote Bag | KIBANA',
    '{"material": "100% PU Leather", "capacity": "14-16 Liters", "height": "28 cm"}'::jsonb
  )
  RETURNING id
)
-- Step 2: Insert variants
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

WITH new_product AS (
  INSERT INTO products (name, slug, brand, description, short_description, price, category_id, is_active, is_featured, stock_status, seo_title, specifications)
  VALUES (
    'PRIZMA SLING',
    'prizma-sling',
    'KIBANA',
    'PRIZMA – Bold. Modern. Unstoppable. Geometric luxury sling with golden hardware.',
    'Bold. Modern. Unstoppable.',
    3999.00,
    'PUT-SLING-BAG-CATEGORY-ID-HERE'::uuid, -- ⚠️ REPLACE THIS
    true, true, 'in_stock',
    'PRIZMA SLING - Geometric Luxury Sling Bag | KIBANA',
    '{"material": "100% PU Leather", "capacity": "4-5 Liters"}'::jsonb
  )
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

WITH new_product AS (
  INSERT INTO products (name, slug, brand, description, short_description, price, category_id, is_active, is_featured, stock_status, seo_title, specifications)
  VALUES (
    'VISTAPACK',
    'vistapack',
    'KIBANA',
    'VISTAPACK – Where Structure Meets Style. Chevron-stitched urban backpack.',
    'Where Structure Meets Style.',
    4499.00,
    'PUT-BACKPACK-CATEGORY-ID-HERE'::uuid, -- ⚠️ REPLACE THIS
    true, true, 'in_stock',
    'VISTAPACK - Urban Carry Backpack | KIBANA',
    '{"material": "100% PU Leather", "capacity": "10-12 Liters", "height": "28 cm"}'::jsonb
  )
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

WITH new_product AS (
  INSERT INTO products (name, slug, brand, description, short_description, price, category_id, is_active, is_featured, stock_status, seo_title, specifications)
  VALUES (
    'SANDESH LAPTOP BAG',
    'sandesh-laptop-bag',
    'KIBANA',
    'Sandesh Laptop Bag – Carry Your Story. Envelope-inspired laptop bag.',
    'Carry Your Story. Own Your Style.',
    6499.00,
    'PUT-LAPTOP-BAG-CATEGORY-ID-HERE'::uuid, -- ⚠️ REPLACE THIS
    true, true, 'in_stock',
    'SANDESH LAPTOP BAG - Envelope Design | KIBANA',
    '{"material": "100% PU Leather", "capacity": "12-14 Liters", "laptopSize": "14-15.6 inch"}'::jsonb
  )
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

WITH new_product AS (
  INSERT INTO products (name, slug, brand, description, short_description, price, category_id, is_active, is_featured, stock_status, seo_title, specifications)
  VALUES (
    'Lekha Wallet',
    'lekha-wallet',
    'KIBANA',
    'Lekha Wallet – Write Your Style. Envelope-inspired wallet with card slots.',
    'Write Your Style.',
    2199.00,
    'PUT-WALLET-CATEGORY-ID-HERE'::uuid, -- ⚠️ REPLACE THIS
    true, true, 'in_stock',
    'Lekha Wallet - Envelope Design Wallet | KIBANA',
    '{"material": "100% PU Leather", "capacity": "1.5-2 Liters", "cardSlots": "6-8"}'::jsonb
  )
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
-- VERIFY ALL PRODUCTS
-- ============================================

SELECT 
  p.name,
  p.price,
  COUNT(pv.id) as variant_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.slug IN ('vistara-tote', 'prizma-sling', 'vistapack', 'sandesh-laptop-bag', 'lekha-wallet')
GROUP BY p.id, p.name, p.price
ORDER BY p.price DESC;

-- Expected result:
-- SANDESH LAPTOP BAG | 6499 | 4
-- VISTARA TOTE | 4999 | 4
-- VISTAPACK | 4499 | 4
-- PRIZMA SLING | 3999 | 4
-- Lekha Wallet | 2199 | 4
