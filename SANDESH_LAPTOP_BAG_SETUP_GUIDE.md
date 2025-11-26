# 💼 SANDESH LAPTOP BAG - Complete Setup Guide

**Laptop Bag / Work Bag | Carry Your Story. Own Your Style.**

**Part of the "Message & Writing" Collection** 🇮🇳

---

## 📋 Product Overview

- **Name:** SANDESH LAPTOP BAG
- **Meaning:** Sandesh = "Message" in Sanskrit/Hindi
- **Tagline:** "Carry Your Story. Own Your Style."
- **Category:** Laptop Bag / Work Bag
- **Price:** ₹6,499
- **Brand:** KIBANA
- **Style:** Envelope-inspired, Geometric, Professional
- **Target:** Professionals, students, style-conscious users

---

## 🎨 Color Variants (4 Colors)

| Color | SKU | Image File | Stock |
|-------|-----|------------|-------|
| Teal Blue | SANDESH-TEAL-001 | sandesh-laptop-bag-teal-blue.png | 15 |
| Mint Green | SANDESH-GREEN-001 | sandesh-laptop-bag-green.png | 15 |
| Mocha Tan | SANDESH-TAN-001 | sandesh-laptop-bag-brown.png | 15 |
| Milky Blue | SANDESH-BLUE-001 | sandesh-laptop-bag-milky-blue.png | 15 |

---

## 📝 Product Description

### Short Version:
"Carry Your Story. Own Your Style. Envelope-inspired laptop bag with geometric design, padded compartment for 14\"–15.6\" laptop, and premium gold accents. A bold statement piece."

### Full Version:
Inspired by the timeless shape of an envelope, Sandesh blends tradition with trend. Its sharp geometric front and sleek silhouette make it a bold fashion statement, while the smartly designed laptop compartment keeps you ready for work, play, and everything in between.

From café catch-ups to boardroom meetings, Sandesh is more than a bag — it's your message to the world.

**Cultural Heritage:** Sandesh (meaning "message" in Sanskrit/Hindi) represents communication and connection. This laptop bag is your message to the world — a statement of professionalism, style, and cultural heritage.

---

## ✨ Key Features

### Design:
- ✅ Envelope-inspired timeless design
- ✅ Sharp geometric front panel
- ✅ Sleek structured silhouette
- ✅ Bold fashion statement

### Material & Hardware:
- ✅ 100% PU Leather
- ✅ Smooth, fine-grained texture
- ✅ Gold-tone hardware accents
- ✅ Premium construction

### Closure & Security:
- ✅ Magnetic flap closure
- ✅ Concealed zipper for secure storage
- ✅ Multiple secure compartments

### Compartments:
- ✅ Main padded compartment (fits 14\"–15.6\" laptop)
- ✅ Front envelope-style pocket (documents/tablet)
- ✅ Internal zipper pocket (valuables)
- ✅ Slip pockets (phone & cards)

### Carrying Options:
- ✅ Detachable adjustable strap (50-60 cm)
- ✅ Top handle (8-10 cm drop)
- ✅ Versatile carrying styles

### Dimensions & Capacity:
- ✅ Height: 28 cm
- ✅ Capacity: 12-14 Liters
- ✅ Professional size
- ✅ Fits all daily essentials

### Perfect For:
- ✅ Professionals and executives
- ✅ Students with laptops
- ✅ Style-conscious users
- ✅ Work, café, boardroom
- ✅ Daily commute

---

## 📦 What Fits Inside

✓ Laptop (14\"–15.6\") in padded compartment  
✓ Tablet or documents in front envelope pocket  
✓ Diary and notebooks  
✓ Charger and cables organized  
✓ Wallet secured in zipper pocket  
✓ Phone in slip pocket  
✓ Keys and cards  
✓ All your daily essentials  

---

## 🇮🇳 "Message & Writing" Collection

**Cultural Roots Meet Modern Style**

SANDESH (Message) pairs beautifully with **Lekha Wallet** (Writing/Record):

```
💼 SANDESH LAPTOP BAG (₹6,499) - Carry your message
✍️ Lekha Wallet (₹2,199) - Write your style

Together: ₹8,698 → Bundle offer: ₹7,999
SAVE ₹699!
```

**Collection Story:**
- Sandesh = Message (communication, connection)
- Lekha = Writing/Record (documentation, expression)
- Both feature envelope-inspired geometric design
- Both available in matching colors
- Perfect professional pairing

---

## 🚀 Quick Import Instructions

### Step 1: Prepare Images

**You need 4 PNG images:**
1. `sandesh-laptop-bag-teal-blue.png` (for Teal Blue variant)
2. `sandesh-laptop-bag-green.png` (for Mint Green variant)
3. `sandesh-laptop-bag-brown.png` (for Mocha Tan variant)
4. `sandesh-laptop-bag-milky-blue.png` (for Milky Blue variant)

**Image Requirements:**
- Format: PNG with transparent or white background
- Resolution: Minimum 1200x1200 px (recommended 2000x2000 px)
- Aspect: Square (1:1)
- Size: Under 500KB per image
- Quality: High-resolution product shots showing envelope flap

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
node scripts/import-products.js sandesh-laptop-bag-import.json
```

**Before running:**
- Open `sandesh-laptop-bag-import.json`
- Update `image_filename` values with actual Supabase URLs
- Ensure Supabase credentials are in `.env`

#### Method B: Using SQL Script (Manual)

1. Find your Laptop Bag category ID:
```sql
SELECT id, name, slug FROM categories WHERE name ILIKE '%laptop%';
```

2. Open `IMPORT_SANDESH_LAPTOP_BAG.sql`

3. Replace placeholders:
   - `YOUR_LAPTOP_BAG_CATEGORY_ID` → actual category UUID
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
WHERE slug = 'sandesh-laptop-bag';
```

**Expected:**
- name: SANDESH LAPTOP BAG
- price: 6499.00
- is_active: true
- is_featured: true

### 2. Check Variants
```sql
SELECT pv.id, pv.color, pv.sku, pv.price, pv.stock_quantity, pv.is_active
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE p.slug = 'sandesh-laptop-bag'
ORDER BY pv.color;
```

**Expected: 4 rows**
- Milky Blue (SANDESH-BLUE-001)
- Mint Green (SANDESH-GREEN-001)
- Mocha Tan (SANDESH-TAN-001)
- Teal Blue (SANDESH-TEAL-001)

### 3. Check Images
```sql
SELECT pi.image_url, pi.alt_text, pv.color, pi.is_primary
FROM product_images pi
JOIN products p ON pi.product_id = p.id
JOIN product_variants pv ON pi.variant_id = pv.id
WHERE p.slug = 'sandesh-laptop-bag'
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
WHERE p.slug = 'sandesh-laptop-bag'
GROUP BY p.id, p.name, p.price, c.name;
```

**Expected:**
```
name: SANDESH LAPTOP BAG
price: 6499
category_name: Laptop Bag
variant_count: 4
image_count: 4
```

---

## 🌐 Test on Website

### 1. Visit Collection Page
Navigate to: `https://kibana-one.vercel.app/collections/laptop-bag`

**Should see:**
- 4 separate SANDESH LAPTOP BAG cards
- Each card shows a different color
- Each priced at ₹6,499
- All display correct images

### 2. Click Each Color Card
Test all 4 variants:
- Click "Teal Blue" card → Opens product detail
- Click "Mint Green" card → Opens product detail
- Click "Mocha Tan" card → Opens product detail
- Click "Milky Blue" card → Opens product detail

### 3. Test Product Detail Page
On the product detail page, verify:
- [ ] Product name displays: "SANDESH LAPTOP BAG"
- [ ] Price shows: ₹6,499
- [ ] All 4 color swatches visible
- [ ] Can select each color
- [ ] Image changes when selecting colors
- [ ] "Add to Cart" works for each variant
- [ ] Specifications display correctly
- [ ] Description renders properly
- [ ] Laptop size (14-15.6\") mentioned

### 4. Test Shopping Cart
- [ ] Add Teal Blue to cart → Shows correct variant
- [ ] Add Mint Green to cart → Shows correct variant
- [ ] Can adjust quantities
- [ ] Total price calculates correctly
- [ ] Can proceed to checkout

---

## 🎯 Expected Display on Collection Page

When you visit `/collections/laptop-bag`, you should see **4 product cards**:

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  [Teal Blue]        │  │  [Mint Green]       │  │  [Mocha Tan]        │  │  [Milky Blue]       │
│  SANDESH LAPTOP BAG │  │  SANDESH LAPTOP BAG │  │  SANDESH LAPTOP BAG │  │  SANDESH LAPTOP BAG │
│      ₹6,499         │  │      ₹6,499         │  │      ₹6,499         │  │      ₹6,499         │
│   [Add to Cart]     │  │   [Add to Cart]     │  │   [Add to Cart]     │  │   [Add to Cart]     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## 🛠️ Troubleshooting

### Issue 1: Product Not Showing
**Check:**
```sql
SELECT is_active, category_id FROM products WHERE slug = 'sandesh-laptop-bag';
```
- Ensure `is_active = true`
- Verify `category_id` matches Laptop Bag category

### Issue 2: Only 1 Card Instead of 4
**Check:**
```sql
SELECT COUNT(*) FROM product_variants WHERE product_id = 
  (SELECT id FROM products WHERE slug = 'sandesh-laptop-bag');
```
- Should return 4
- If less, variants not created properly

### Issue 3: Images Not Loading
**Check:**
```sql
SELECT image_url FROM product_images WHERE product_id = 
  (SELECT id FROM products WHERE slug = 'sandesh-laptop-bag');
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
WHERE p.slug = 'sandesh-laptop-bag';
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
- Capacity: 12-14 Liters

**Laptop Size:**
- Fits 14\"–15.6\" laptop

**Hardware:**
- Gold-Tone Accents

**Closure:**
- Magnetic Flap with concealed zipper for secure storage

**Compartments:**
- One main padded compartment (fits 14–15.6\" laptop)
- One front envelope-style pocket for documents/tablet
- Internal zipper pocket + slip pockets for phone & cards

**Carrying Options:**
- Detachable long strap (adjustable 50–60 cm)
- Top handle (8–10 cm drop)

**Ideal For:**
- Professionals, students, and style-conscious users who want a luxury laptop bag with a bold geometric identity

---

## 🎁 Marketing Ideas

### Product Positioning:
**Target Audience:** Professionals, students, laptop users  
**Use Cases:** Work, meetings, café, boardroom, daily commute  
**Key Benefit:** Envelope design + laptop protection + professional style

### Launch Promotion:
```
💼 NEW: SANDESH LAPTOP BAG
Carry Your Story. Own Your Style.

Envelope-inspired design meets laptop protection
✨ Fits 14"–15.6" laptop
💼 Professional & stylish
🎨 4 stunning colors
💰 ₹6,499

From café to boardroom, Sandesh is your message to the world.

Shop now! Limited launch stock.
```

### Instagram Caption:
```
Meet SANDESH – your new work companion 💼

Envelope-inspired ✉️
Geometric perfection ✨
Fits your laptop (14-15.6") 💻
4 gorgeous colors 🌈

From café catch-ups to boardroom meetings,
Sandesh is more than a bag — it's your message to the world. 🌍

Swipe to see all colors →
Which one speaks to you? 💙💚🤎

Sandesh = "Message" in Sanskrit/Hindi 🇮🇳

#SANDESH #KIBANA #LaptopBag #CarryYourStory
#MessageToTheWorld #EnvelopeDesign
```

### Bundle Offer - "Message & Writing" Collection:
```
✍️ COMPLETE YOUR STORY ✍️

SANDESH LAPTOP BAG + Lekha Wallet
(Message + Writing Collection)

₹8,698 → ₹7,999
SAVE ₹699!

Professional pairing with cultural roots 🇮🇳
Perfect gift for the modern professional! 💼

Both in matching colors:
💙 Teal Blue | 💚 Mint Green | 🤎 Mocha Tan | 💙 Milky Blue
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
   - Highlight laptop-friendly feature

3. **Create Content:**
   - Product photography showing laptop inside
   - Lifestyle shots (café, office, commute)
   - Video walkthroughs of compartments
   - Customer testimonials from professionals

4. **Launch Marketing:**
   - Social media posts
   - Email newsletter to professionals
   - LinkedIn marketing
   - Influencer outreach (career/tech influencers)
   - Paid ads targeting professionals

5. **Cross-Promote with Lekha:**
   - Bundle offers
   - "Complete the look" sections
   - Matching color promotions
   - Gift set packaging

6. **Monitor Performance:**
   - Track views per variant
   - Monitor sales by color
   - Analyze add-to-cart rate
   - Gather customer feedback
   - Track laptop bag searches

---

## 📞 Quick Reference

**Product Details:**
- Name: SANDESH LAPTOP BAG
- Slug: `sandesh-laptop-bag`
- Category: Laptop Bag / Work Bag
- Price: ₹6,499
- Variants: 4
- Stock per variant: 15
- Laptop Size: 14\"–15.6\"

**URLs:**
- Product: `/products/sandesh-laptop-bag`
- Collection: `/collections/laptop-bag`

**Files:**
- JSON: `sandesh-laptop-bag-import.json`
- SQL: `IMPORT_SANDESH_LAPTOP_BAG.sql`
- Guide: `SANDESH_LAPTOP_BAG_SETUP_GUIDE.md`

**Images Needed:**
- sandesh-laptop-bag-teal-blue.png
- sandesh-laptop-bag-green.png
- sandesh-laptop-bag-brown.png
- sandesh-laptop-bag-milky-blue.png

---

## ✅ Completion Checklist

- [ ] 4 PNG images prepared (showing envelope design)
- [ ] Images uploaded to Supabase
- [ ] Public URLs obtained
- [ ] Laptop Bag category ID found
- [ ] Import method chosen
- [ ] Product imported (JSON or SQL)
- [ ] Database verified (4 variants, 4 images)
- [ ] Collection page shows 4 cards
- [ ] Product detail page works
- [ ] All colors selectable
- [ ] Add to cart functions
- [ ] Specifications display (including laptop size)
- [ ] Mobile view tested
- [ ] SEO metadata present
- [ ] Bundle with Lekha Wallet promoted
- [ ] Ready for launch! 🚀

---

**Status:** ✅ Ready to Import  
**Time Required:** 25-35 minutes  
**Difficulty:** Easy (follow step-by-step)  
**Collection:** "Message & Writing" 🇮🇳

**Result:** 4 beautiful SANDESH LAPTOP BAG cards on your Laptop Bag collection page! 💼✨
