# 📊 DATABASE SETUP GUIDE - What You Need to Add

## 🎯 Quick Summary

Your current database is **missing 7 tables** that the website needs. Run the SQL script to add them all at once!

---

## 📋 Missing Tables Overview

| Table | Purpose | Why Needed |
|-------|---------|------------|
| **product_images** | Store product photos | Currently using jsonb, need separate table for variants |
| **product_variants** | Color/size variations | For showing 4 colors per product (Teal, Green, Tan, Blue) |
| **banners** | Hero section images | For homepage hero banners |
| **cart** | Shopping cart | Store user cart items |
| **wishlist** | Favorite products | Store user wishlist items |
| **reviews** | Product reviews | Customer reviews and ratings |
| **addresses** | Shipping addresses | User shipping/billing addresses |

---

## 🚀 How to Add Missing Tables

### **Option 1: Run Complete SQL Script (Recommended)**

1. **Open Supabase Dashboard**
2. **Go to:** SQL Editor
3. **Copy content from:** `SUPABASE_MISSING_TABLES.sql`
4. **Paste and click:** "Run"
5. **Wait:** ~10 seconds for all tables to be created

✅ **Done!** All tables, indexes, and policies created automatically.

---

### **Option 2: Add Tables One by One**

If you prefer to understand each table, add them individually:

#### **1. Product Images Table**
```sql
CREATE TABLE public.product_images (
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

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_variant_id ON product_images(variant_id);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view product images" ON product_images FOR SELECT USING (true);
```

**Why:** Stores one image per color variant (e.g., teal blue image, mint green image, etc.)

---

#### **2. Product Variants Table**
```sql
CREATE TABLE public.product_variants (
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

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_color ON product_variants(color);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view variants" ON product_variants FOR SELECT USING (true);
```

**Why:** Stores 4 color variants per product:
- VISTARA TOTE: Teal Blue, Mint Green, Mocha Tan, Milky Blue
- Each variant has its own SKU, price, and stock

---

#### **3. Banners Table**
```sql
CREATE TABLE public.banners (
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

CREATE INDEX idx_banners_position ON banners(position);
CREATE INDEX idx_banners_is_active ON banners(is_active);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active banners" ON banners 
  FOR SELECT USING (is_active = true);
```

**Why:** Homepage hero section with images/videos

---

#### **4. Cart Table**
```sql
CREATE TABLE public.cart (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id, variant_id)
);

CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_cart_product_id ON cart(product_id);

ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their cart" ON cart 
  FOR ALL USING (auth.uid() = user_id);
```

**Why:** Logged-in users' shopping cart (guest users use localStorage)

---

#### **5. Wishlist Table**
```sql
CREATE TABLE public.wishlist (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their wishlist" ON wishlist 
  FOR ALL USING (auth.uid() = user_id);
```

**Why:** Logged-in users' wishlist (guest users use localStorage)

---

#### **6. Reviews Table**
```sql
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title varchar,
  comment text,
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved reviews" ON reviews 
  FOR SELECT USING (is_approved = true);
```

**Why:** Customer reviews and ratings on products

---

#### **7. Addresses Table**
```sql
CREATE TABLE public.addresses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their addresses" ON addresses 
  FOR ALL USING (auth.uid() = user_id);
```

**Why:** User shipping and billing addresses for checkout

---

## 🔧 Additional Required Changes

### **Update Products Table**
Your products table needs 3 new columns:

```sql
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS stock_status varchar DEFAULT 'in_stock',
ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0;
```

**Why:**
- `is_active`: Show/hide products
- `stock_status`: 'in_stock', 'out_of_stock', 'pre_order'
- `order`: Sort products manually

---

### **Update Categories Table**
Your categories table needs 1 new column:

```sql
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0;
```

**Why:** Sort categories manually in dropdown

---

## ✅ Verification Steps

After running the SQL, verify everything was created:

### **1. Check Tables Exist**
```sql
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
```

**Expected Result:** 7 rows showing all table names

---

### **2. Check Products Table Updated**
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN ('is_active', 'stock_status', 'order');
```

**Expected Result:** 3 rows showing the new columns

---

### **3. Check RLS Policies**
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected Result:** Multiple policies for each new table

---

## 🎯 What Each Table Does in the Website

### **Product Images** (`product_images`)
```
When you import VISTARA TOTE with 4 colors:
├─ product: "VISTARA TOTE"
└─ product_images:
   ├─ Image 1: teal-blue.png (variant_id: Teal Blue variant)
   ├─ Image 2: mint-green.png (variant_id: Mint Green variant)
   ├─ Image 3: mocha-tan.png (variant_id: Mocha Tan variant)
   └─ Image 4: milky-blue.png (variant_id: Milky Blue variant)
```

### **Product Variants** (`product_variants`)
```
VISTARA TOTE:
├─ Variant 1: Teal Blue, SKU: VISTARA-TEAL-001, Price: ₹4,999, Stock: 20
├─ Variant 2: Mint Green, SKU: VISTARA-GREEN-001, Price: ₹4,999, Stock: 20
├─ Variant 3: Mocha Tan, SKU: VISTARA-TAN-001, Price: ₹4,999, Stock: 20
└─ Variant 4: Milky Blue, SKU: VISTARA-BLUE-001, Price: ₹4,999, Stock: 20

Result: 4 separate product cards on collection page!
```

### **Cart** (`cart`)
```
User's Cart:
├─ Item 1: VISTARA TOTE (Teal Blue) × 1
├─ Item 2: PRIZMA SLING (Mint Green) × 2
└─ Item 3: VISTAPACK (Mocha Tan) × 1
```

### **Wishlist** (`wishlist`)
```
User's Wishlist:
├─ VISTARA TOTE
├─ SANDESH LAPTOP BAG
└─ Lekha Wallet
```

---

## 🔐 Security (RLS Policies)

All tables have **Row Level Security** enabled:

### **Public Access:**
- ✅ Anyone can view: products, images, variants, banners
- ✅ Anyone can view: approved reviews

### **User Access:**
- ✅ Users can only see/edit their own: cart, wishlist, addresses
- ✅ Users can only manage their own: reviews

### **Guest Users:**
- ✅ Use localStorage for: cart, wishlist (no database access needed)

---

## 📊 Database Relationships

```
products (1) ──→ (many) product_variants
                           │
                           ↓
                    (many) product_images

users (1) ──→ (many) cart
users (1) ──→ (many) wishlist
users (1) ──→ (many) reviews
users (1) ──→ (many) addresses

products (1) ──→ (many) cart
products (1) ──→ (many) wishlist
products (1) ──→ (many) reviews

categories (1) ──→ (many) products
```

---

## 🚀 After Adding Tables

### **Next Steps:**

1. **Import Products**
   ```bash
   node scripts/import-products.js vistara-tote-import.json
   node scripts/import-products.js prizma-sling-import.json
   node scripts/import-products.js vistapack-import.json
   node scripts/import-products.js sandesh-laptop-bag-import.json
   node scripts/import-products.js lekha-wallet-import.json
   ```

2. **Upload Images**
   - Go to Supabase Storage
   - Create `products` bucket
   - Upload all 20 PNG files

3. **Test Website**
   - Visit `/collections/tote-bag` → see 4 VISTARA cards
   - Add to cart → works!
   - Add to wishlist → works!

---

## 🆘 Troubleshooting

### **Error: uuid_generate_v4() doesn't exist**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### **Error: auth.users doesn't exist**
Make sure you're using Supabase (has auth.users by default)

### **Error: Permission denied**
Run as database owner or admin

### **Tables already exist**
The script uses `IF NOT EXISTS` so it's safe to run multiple times

---

## ✅ Checklist

Before importing products:
- [ ] Run `SUPABASE_MISSING_TABLES.sql`
- [ ] Verify all 7 tables created
- [ ] Check products table has new columns
- [ ] Create Supabase Storage bucket called `products`
- [ ] RLS policies enabled
- [ ] Ready to import products!

---

## 📞 Quick Reference

**Total New Tables:** 7
**Total New Columns:** 3 (in products) + 1 (in categories)
**Total Indexes:** 14
**Total RLS Policies:** 15
**Estimated Time:** 30 seconds to run all SQL

---

**Status:** ✅ **Ready to Execute**  
**File:** `SUPABASE_MISSING_TABLES.sql`  
**Action:** Copy → Paste in Supabase SQL Editor → Run

**Your database will be ready for all 5 products with 20 color variants!** 🎉
