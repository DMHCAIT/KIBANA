# 🎒 VISTAPACK - Complete Setup Guide

**Urban Carry Backpack | Where Structure Meets Style**

---

## 📋 Product Overview

- **Name:** VISTAPACK
- **Tagline:** "Where Structure Meets Style"
- **Category:** Backpack (Urban Carry)
- **Price:** ₹4,499
- **Brand:** KIBANA
- **Style:** Modern, Versatile, Ergonomic
- **Target:** Students, travelers, urban professionals

---

## 🎨 Color Variants (4 Colors)

| Color | SKU | Image File | Stock |
|-------|-----|------------|-------|
| Teal Blue | VISTAPACK-TEAL-001 | vistapack-dark-green.png | 20 |
| Mint Green | VISTAPACK-GREEN-001 | vistapack-green.png | 20 |
| Mocha Tan | VISTAPACK-TAN-001 | vistapack-brown.png | 20 |
| Milky Blue | VISTAPACK-BLUE-001 | vistapack-blue.png | 20 |

---

## 📝 Product Description

### Short Version:
"Where Structure Meets Style. Urban carry backpack with bold chevron stitching, padded tablet compartment, and ergonomic design. A companion for journeys near and far."

### Full Version:
Step into a world of effortless charm with the VISTAPACK, a modern emblem of strength, style, and versatility. Defined by its bold chevron-inspired stitching and structured leather silhouette, this backpack whispers stories of movement, freedom, and self-expression.

Designed to carry both your essentials and your spirit with ease, it is more than just a bag—it is a companion for journeys, both near and far. Its ergonomic straps embrace you in comfort, while the compact yet functional interior ensures your belongings stay organized wherever life takes you.

Just as horizons open up with every step forward, the VISTAPACK symbolizes exploration and resilience, making it a timeless gesture of empowerment and elegance for the modern soul.

---

## ✨ Key Features

### Design:
- ✅ Bold chevron-inspired stitching
- ✅ Structured leather silhouette
- ✅ Modern emblem of strength and style
- ✅ Ergonomic straps for comfort

### Material & Hardware:
- ✅ 100% PU Leather
- ✅ Smooth, fine-grained texture
- ✅ Gold-tone hardware accents
- ✅ Premium construction

### Closure & Compartments:
- ✅ Main top zipper closure
- ✅ Envelope-style front flap pocket
- ✅ Padded compartment (fits iPad/tablet up to 11")
- ✅ Internal zipper pocket for valuables
- ✅ 2 slip pockets (cards, phone, keys)

### Dimensions & Capacity:
- ✅ Height: 28 cm
- ✅ Capacity: 10-12 Liters
- ✅ Adjustable straps (90-130 cm)
- ✅ Works for shoulder carry or crossbody

### Perfect For:
- ✅ College and student life
- ✅ Casual workdays
- ✅ City travel
- ✅ Leisure outings
- ✅ Daily commute

---

## 📦 What Fits Inside

✓ iPad or small tablet (up to 11")  
✓ Wallet and cards  
✓ Phone  
✓ Keys  
✓ Small water bottle  
✓ Diary or notebook  
✓ Charging cables  
✓ Small essentials  

---

## 🚀 Quick Import Instructions

### Step 1: Prepare Images

**You need 4 PNG images:**
1. `vistapack-dark-green.png` (for Teal Blue variant)
2. `vistapack-green.png` (for Mint Green variant)
3. `vistapack-brown.png` (for Mocha Tan variant)
4. `vistapack-blue.png` (for Milky Blue variant)

**Image Requirements:**
- Format: PNG with transparent or white background
- Resolution: Minimum 1000x1000 px (recommended 2000x2000 px)
- Aspect: Square (1:1)
- Size: Under 500KB per image
- Quality: High-resolution product shots

### Step 2: Upload to Supabase Storage

1. Go to Supabase Dashboard
2. Navigate to **Storage**
3. Select or create `products` bucket
4. Upload all 4 PNG files
5. Get public URLs for each image
6. Save URLs for next step

### Step 3: Import Product Data

**Choose ONE method:**

#### Method A: Using Import Script (Recommended)

```bash
# From workspace root
node scripts/import-products.js vistapack-import.json
```

**Before running:**
- Open `vistapack-import.json`
- Update `image_filename` values with actual Supabase URLs
- Ensure Supabase credentials are in `.env`

#### Method B: Using SQL Script (Manual)

1. Find your Backpack category ID:
```sql
SELECT id, name, slug FROM categories WHERE name ILIKE '%backpack%';
```

2. Open `IMPORT_VISTAPACK.sql`

3. Replace placeholders:
   - `YOUR_BACKPACK_CATEGORY_ID` → actual category UUID
   - `YOUR_PRODUCT_ID` → product UUID from step 2
   - `VARIANT_TEAL_ID` → variant UUID for Teal Blue
   - `VARIANT_GREEN_ID` → variant UUID for Mint Green
   - `VARIANT_TAN_ID` → variant UUID for Mocha Tan
   - `VARIANT_BLUE_ID` → variant UUID for Milky Blue
   - `YOUR-SUPABASE-URL` → your actual Supabase URL

4. Execute each section in order in Supabase SQL Editor

5. Copy the returned IDs after each step

---

## ✅ Verification Steps

### 1. Check Product Created
```sql
SELECT id, name, slug, price, is_active, is_featured
FROM products
WHERE slug = 'vistapack';
```

**Expected:**
- name: VISTAPACK
- price: 4499.00
- is_active: true
- is_featured: true

### 2. Check Variants
```sql
SELECT pv.id, pv.color, pv.sku, pv.price, pv.stock_quantity, pv.is_active
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE p.slug = 'vistapack'
ORDER BY pv.color;
```

**Expected: 4 rows**
- Mint Green (VISTAPACK-GREEN-001)
- Milky Blue (VISTAPACK-BLUE-001)
- Mocha Tan (VISTAPACK-TAN-001)
- Teal Blue (VISTAPACK-TEAL-001)

### 3. Check Images
```sql
SELECT pi.image_url, pi.alt_text, pv.color, pi.is_primary
FROM product_images pi
JOIN products p ON pi.product_id = p.id
JOIN product_variants pv ON pi.variant_id = pv.id
WHERE p.slug = 'vistapack'
ORDER BY pi."order";
```

**Expected: 4 rows**
- Each variant should have one image
- Teal Blue should be primary (is_primary = true)

### 4. Full Product Overview
```sql
SELECT 
  p.name,
  p.price,
  c.name as category_name,
  COUNT(DISTINCT pv.id) as variant_count,
  COUNT(DISTINCT pi.id) as image_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.slug = 'vistapack'
GROUP BY p.id, p.name, p.price, c.name;
```

**Expected:**
```
name: VISTAPACK
price: 4499
category_name: Backpack
variant_count: 4
image_count: 4
```

---

## 🌐 Test on Website

### 1. Visit Collection Page
Navigate to: `https://kibana-one.vercel.app/collections/backpack`

**Should see:**
- 4 separate VISTAPACK cards
- Each card shows a different color
- Each priced at ₹4,499
- All display correct images

### 2. Click Each Color Card
Test all 4 variants:
- Click "Teal Blue" card → Opens product detail
- Click "Mint Green" card → Opens product detail
- Click "Mocha Tan" card → Opens product detail
- Click "Milky Blue" card → Opens product detail

### 3. Test Product Detail Page
On the product detail page, verify:
- [ ] Product name displays: "VISTAPACK"
- [ ] Price shows: ₹4,499
- [ ] All 4 color swatches visible
- [ ] Can select each color
- [ ] Image changes when selecting colors
- [ ] "Add to Cart" works for each variant
- [ ] Specifications display correctly
- [ ] Description renders properly

### 4. Test Shopping Cart
- [ ] Add Teal Blue to cart → Shows correct variant
- [ ] Add Mint Green to cart → Shows correct variant
- [ ] Can adjust quantities
- [ ] Total price calculates correctly
- [ ] Can proceed to checkout

---

## 🎯 Expected Display on Collection Page

When you visit `/collections/backpack`, you should see **4 product cards**:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  [Teal Blue]    │  │  [Mint Green]   │  │  [Mocha Tan]    │  │  [Milky Blue]   │
│   VISTAPACK     │  │   VISTAPACK     │  │   VISTAPACK     │  │   VISTAPACK     │
│    ₹4,499       │  │    ₹4,499       │  │    ₹4,499       │  │    ₹4,499       │
│  [Add to Cart]  │  │  [Add to Cart]  │  │  [Add to Cart]  │  │  [Add to Cart]  │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 🛠️ Troubleshooting

### Issue 1: Product Not Showing
**Check:**
```sql
SELECT is_active, category_id FROM products WHERE slug = 'vistapack';
```
- Ensure `is_active = true`
- Verify `category_id` matches Backpack category

### Issue 2: Only 1 Card Instead of 4
**Check:**
```sql
SELECT COUNT(*) FROM product_variants WHERE product_id = 
  (SELECT id FROM products WHERE slug = 'vistapack');
```
- Should return 4
- If less, variants not created properly

### Issue 3: Images Not Loading
**Check:**
```sql
SELECT image_url FROM product_images WHERE product_id = 
  (SELECT id FROM products WHERE slug = 'vistapack');
```
- Verify URLs are public
- Test URLs in browser
- Check Supabase bucket permissions

### Issue 4: Can't Add to Cart
**Check:**
```sql
SELECT pv.color, pv.stock_quantity, pv.is_active
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE p.slug = 'vistapack';
```
- Verify `stock_quantity > 0`
- Ensure `is_active = true`

---

## 📊 Specifications Display

The product detail page will show these specs:

**Material & Texture:**
- 100% PU Leather
- Smooth, Fine-Grained

**Dimensions:**
- Height: 28 cm
- Capacity: 10-12 Liters

**Hardware:**
- Gold-Tone Accents

**Closure:**
- Main top zipper closure
- Envelope-style front flap pocket

**Compartments:**
- 1 padded compartment (fits iPad/small tablet up to 11")
- 1 zipper pocket
- 2 slip pockets (cards, phone, keys)

**Shoulder Drop:**
- Adjustable 90 – 130 cm
- Works for both shoulder carry and crossbody

**Ideal For:**
- College, casual workdays, city travel, and leisure outings

---

## 🎁 Marketing Ideas

### Product Positioning:
**Target Audience:** Students, young professionals, travelers  
**Use Cases:** College, work, travel, daily commute  
**Key Benefit:** Versatile, ergonomic, stylish

### Launch Promotion:
```
🎒 NEW: VISTAPACK
Where Structure Meets Style

✨ Chevron-inspired design
📱 Fits your iPad/tablet
🎨 4 stunning colors
💰 ₹4,499

Perfect for:
📚 College days
💼 Casual work
✈️ City adventures

Shop now! Limited launch stock.
```

### Instagram Caption:
```
Meet VISTAPACK – your new travel companion 🎒

Bold chevron stitching ✨
Structured yet flexible 💪
Padded tablet sleeve 📱
4 gorgeous colors 🌈

Whether you're heading to class, work, or exploring the city, 
VISTAPACK has your back. Literally. 😉

Swipe to see all colors →
Which one is calling your name? 💙💚🤎

#VISTAPACK #KIBANA #UrbanBackpack #TravelInStyle
#WhereSturctupeMeetsStyle
```

### Bundle Offer:
```
🎁 Student Starter Pack
VISTAPACK + PRIZMA SLING
₹8,499 → ₹7,999
SAVE ₹500!

Perfect combo for college life! 🎓
Backpack for books, sling for essentials.
```

---

## 🔄 Next Steps After Import

1. **Test Thoroughly:**
   - Visit collection page
   - Click each variant
   - Add to cart
   - Test checkout

2. **Add to Homepage:**
   - Feature as "New Arrival"
   - Add to hero banner
   - Include in featured products

3. **Create Content:**
   - Product photography
   - Lifestyle shots
   - Video walkthroughs
   - Customer testimonials

4. **Launch Marketing:**
   - Social media posts
   - Email newsletter
   - Influencer outreach
   - Paid ads

5. **Monitor Performance:**
   - Track views per variant
   - Monitor sales by color
   - Analyze add-to-cart rate
   - Gather customer feedback

---

## 📞 Quick Reference

**Product Details:**
- Name: VISTAPACK
- Slug: `vistapack`
- Category: Backpack
- Price: ₹4,499
- Variants: 4
- Stock per variant: 20

**URLs:**
- Product: `/products/vistapack`
- Collection: `/collections/backpack`

**Files:**
- JSON: `vistapack-import.json`
- SQL: `IMPORT_VISTAPACK.sql`
- Guide: `VISTAPACK_SETUP_GUIDE.md`

**Images Needed:**
- vistapack-dark-green.png
- vistapack-green.png
- vistapack-brown.png
- vistapack-blue.png

---

## ✅ Completion Checklist

- [ ] 4 PNG images prepared
- [ ] Images uploaded to Supabase
- [ ] Public URLs obtained
- [ ] Backpack category ID found
- [ ] Import method chosen
- [ ] Product imported (JSON or SQL)
- [ ] Database verified (4 variants, 4 images)
- [ ] Collection page shows 4 cards
- [ ] Product detail page works
- [ ] All colors selectable
- [ ] Add to cart functions
- [ ] Specifications display
- [ ] Mobile view tested
- [ ] SEO metadata present
- [ ] Ready for launch! 🚀

---

**Status:** ✅ Ready to Import  
**Time Required:** 20-30 minutes  
**Difficulty:** Easy (follow step-by-step)

**Result:** 4 beautiful VISTAPACK cards on your Backpack collection page! 🎒✨
