-- ============================================
-- CREATE CATEGORIES FIRST (if they don't exist)
-- ============================================
-- Run this first to make sure you have all required categories

-- Check existing categories
SELECT id, name, slug, is_active FROM categories ORDER BY name;

-- Create missing categories (if needed)
INSERT INTO categories (name, slug, description, is_active, "order")
VALUES 
  ('Tote Bag', 'tote-bag', 'Spacious and stylish tote bags for work and everyday use', true, 1),
  ('Sling Bag', 'sling-bag', 'Compact and trendy sling bags for on-the-go style', true, 2),
  ('Backpack', 'backpack', 'Versatile backpacks for urban adventures', true, 3),
  ('Laptop Bag', 'laptop-bag', 'Professional laptop bags with padded protection', true, 4),
  ('Wallet', 'wallet', 'Elegant wallets and clutches for everyday essentials', true, 5),
  ('Clutch', 'clutch', 'Stylish clutches for evening occasions', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- Verify categories were created
SELECT id, name, slug, is_active FROM categories ORDER BY "order";

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE '✅ CATEGORIES READY!';
  RAISE NOTICE '';
  RAISE NOTICE 'Now run: INSERT_PRODUCTS_AUTO.sql';
END $$;
