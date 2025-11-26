-- ============================================
-- REQUIRED TABLES FOR KIBANA WEBSITE
-- Execute these in your Supabase SQL Editor
-- ============================================

-- Step 1: Add missing columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS stock_status varchar DEFAULT 'in_stock',
ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0;

-- Add missing columns to categories table
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0;

-- Step 2: Create product_images table
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL,
  variant_id uuid,
  image_url text NOT NULL,
  alt_text text,
  "order" integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) 
    REFERENCES public.products(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_variant_id ON public.product_images(variant_id);

-- Step 3: Create product_variants table (for colors, sizes, etc.)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL,
  color varchar,
  size varchar,
  sku varchar NOT NULL UNIQUE,
  price numeric,
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) 
    REFERENCES public.products(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_color ON public.product_variants(color);

-- Add foreign key constraint for product_images variant_id
ALTER TABLE public.product_images 
ADD CONSTRAINT product_images_variant_id_fkey FOREIGN KEY (variant_id) 
  REFERENCES public.product_variants(id) ON DELETE SET NULL;

-- Step 4: Create banners table (for hero sections)
CREATE TABLE IF NOT EXISTS public.banners (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
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
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT banners_pkey PRIMARY KEY (id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_banners_position ON public.banners(position);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON public.banners(is_active);

-- Step 5: Create cart table
CREATE TABLE IF NOT EXISTS public.cart (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  variant_id uuid,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cart_pkey PRIMARY KEY (id),
  CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT cart_product_id_fkey FOREIGN KEY (product_id) 
    REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT cart_variant_id_fkey FOREIGN KEY (variant_id) 
    REFERENCES public.product_variants(id) ON DELETE CASCADE,
  CONSTRAINT cart_unique_item UNIQUE (user_id, product_id, variant_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_product_id ON public.cart(product_id);

-- Step 6: Create wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT wishlist_pkey PRIMARY KEY (id),
  CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) 
    REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT wishlist_unique_item UNIQUE (user_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON public.wishlist(product_id);

-- Step 7: Create reviews table (optional but recommended)
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title varchar,
  comment text,
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) 
    REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- Step 8: Create addresses table (for user shipping addresses)
CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  type varchar DEFAULT 'shipping',
  first_name varchar NOT NULL,
  last_name varchar NOT NULL,
  phone varchar,
  address_line1 varchar NOT NULL,
  address_line2 varchar,
  city varchar NOT NULL,
  state varchar NOT NULL,
  postal_code varchar NOT NULL,
  country varchar DEFAULT 'India',
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT addresses_pkey PRIMARY KEY (id),
  CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

-- Step 9: Enable Row Level Security (RLS) for all tables
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Step 10: Create RLS policies for public read access

-- Product Images (public read)
CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (true);

-- Product Variants (public read)
CREATE POLICY "Anyone can view product variants" ON public.product_variants
  FOR SELECT USING (true);

-- Banners (public read active banners)
CREATE POLICY "Anyone can view active banners" ON public.banners
  FOR SELECT USING (is_active = true);

-- Cart (users can only access their own cart)
CREATE POLICY "Users can view their own cart" ON public.cart
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own cart" ON public.cart
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON public.cart
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own cart" ON public.cart
  FOR DELETE USING (auth.uid() = user_id);

-- Wishlist (users can only access their own wishlist)
CREATE POLICY "Users can view their own wishlist" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own wishlist" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own wishlist" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- Reviews (public read approved, users can manage their own)
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can insert their own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Addresses (users can only access their own addresses)
CREATE POLICY "Users can view their own addresses" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" ON public.addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Step 11: Create function to update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 12: Create triggers for automatic timestamp updates
CREATE TRIGGER update_product_images_updated_at BEFORE UPDATE ON public.product_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify everything was created
-- ============================================

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'product_images', 
    'product_variants', 
    'banners', 
    'cart', 
    'wishlist', 
    'reviews',
    'addresses'
  )
ORDER BY table_name;

-- Check products table has new columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN ('is_active', 'stock_status', 'order');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$ 
BEGIN 
  RAISE NOTICE '✅ All tables and columns created successfully!';
  RAISE NOTICE '✅ RLS policies configured!';
  RAISE NOTICE '✅ Indexes created for performance!';
  RAISE NOTICE '✅ Triggers set up for automatic timestamps!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '1. Import your products using the JSON/SQL scripts';
  RAISE NOTICE '2. Upload product images to Supabase Storage';
  RAISE NOTICE '3. Link images in product_images table';
  RAISE NOTICE '4. Test the website!';
END $$;
