-- ============================================
-- QUICK PRODUCTION FIX - Run This Immediately
-- ============================================
-- This will fix the 500 error on collections pages
-- Run in your PRODUCTION Supabase SQL Editor

-- Step 1: Create product_variants table (REQUIRED)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color varchar,
  size varchar,
  sku varchar NOT NULL UNIQUE,
  price numeric,
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 2: Create product_images table (REQUIRED)
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  image_url text NOT NULL,
  alt_text text,
  "order" integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 3: Add missing columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS stock_status varchar DEFAULT 'in_stock',
ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0;

-- Step 4: Add missing column to categories table
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0;

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_color ON product_variants(color);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_variant_id ON product_images(variant_id);

-- Step 6: Enable Row Level Security
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Step 7: Create policies for public read access
DROP POLICY IF EXISTS "Anyone can view variants" ON product_variants;
CREATE POLICY "Anyone can view variants" ON product_variants 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view images" ON product_images;
CREATE POLICY "Anyone can view images" ON product_images 
  FOR SELECT USING (true);

-- Step 8: Create cart table (optional but recommended)
CREATE TABLE IF NOT EXISTS public.cart (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their cart" ON cart FOR ALL USING (auth.uid() = user_id);

-- Step 9: Create wishlist table (optional but recommended)
CREATE TABLE IF NOT EXISTS public.wishlist (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- Step 10: Create banners table (optional but recommended)
CREATE TABLE IF NOT EXISTS public.banners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar NOT NULL,
  subtitle text,
  description text,
  image_url text,
  video_url text,
  button_text varchar,
  button_url varchar,
  position varchar DEFAULT 'hero',
  is_active boolean DEFAULT true,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active banners" ON banners FOR SELECT USING (is_active = true);

-- ============================================
-- VERIFICATION - Run this to confirm success
-- ============================================
SELECT 
  'product_variants' as table_name,
  COUNT(*) as row_count
FROM product_variants
UNION ALL
SELECT 
  'product_images' as table_name,
  COUNT(*) as row_count
FROM product_images;

-- Check columns added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN ('is_active', 'stock_status', 'order');

-- ============================================
-- SUCCESS!
-- ============================================
-- After running this:
-- 1. Wait 2-3 minutes for deployment
-- 2. Visit /collections/tote-bag
-- 3. Should work! (empty until you import products)
-- 4. Import your products using the JSON files
-- ============================================

DO $$ 
BEGIN 
  RAISE NOTICE '✅ PRODUCTION FIX COMPLETE!';
  RAISE NOTICE '✅ product_variants table created';
  RAISE NOTICE '✅ product_images table created';
  RAISE NOTICE '✅ Missing columns added';
  RAISE NOTICE '✅ RLS policies configured';
  RAISE NOTICE '';
  RAISE NOTICE '⏱️  Wait 2-3 minutes for Vercel to redeploy';
  RAISE NOTICE '🌐 Then visit: /collections/tote-bag';
  RAISE NOTICE '📦 Import products next!';
END $$;
