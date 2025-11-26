# ✍️ LEKHA WALLET - Complete Setup Guide

**Women's Wallet / Clutch | Write Your Style.**

**Part of the "Message & Writing" Collection** 🇮🇳

---

## 📋 Product Overview

- **Name:** Lekha Wallet
- **Meaning:** Lekha = "Writing/Record" in Sanskrit/Hindi
- **Tagline:** "Write Your Style."
- **Category:** Women's Wallet / Clutch
- **Price:** ₹2,199
- **Brand:** KIBANA
- **Style:** Envelope-inspired, Geometric, Elegant
- **Target:** Everyday use, evening outings, style-conscious women

---

## 🎨 Color Variants (4 Colors)

| Color | SKU | Image File | Stock |
|-------|-----|------------|-------|
| Teal Blue | LEKHA-TEAL-001 | lekha-wallet-teal-blue.png | 25 |
| Mint Green | LEKHA-GREEN-001 | lekha-wallet-pastel-green.png | 25 |
| Mocha Tan | LEKHA-TAN-001 | lekha-wallet-brown.png | 25 |
| Milky Blue | LEKHA-BLUE-001 | lekha-wallet-milky-blue.png | 25 |

---

## 📝 Product Description

### Short Version:
"Write Your Style. Envelope-inspired wallet with geometric design, 6-8 card slots, coin pocket, and gold accents. Compact yet spacious. A statement of elegance."

### Full Version:
Inspired by the lines of an envelope, Lekha (meaning "writing/record" in Sanskrit & Hindi) is a blend of heritage and trend. With its chic geometric cuts, soft leather touch, and vibrant color story, Lekha adds a bold pop to your everyday carry.

Compact yet spacious, it's designed to hold more than just essentials — it holds your statement.

**Cultural Heritage:** Lekha (meaning "writing" or "record" in Sanskrit/Hindi) represents documentation and personal expression. Part of the Indian-rooted "Message & Writing" collection.

**Perfect Pairing:** Works beautifully with SANDESH LAPTOP BAG — together they form the "Message & Writing" collection (Sandesh = Message, Lekha = Writing).

---

## ✨ Key Features

### Design:
- ✅ Envelope-inspired geometric design
- ✅ Chic geometric cuts
- ✅ Elegant lines and panels
- ✅ Heritage meets trend
- ✅ Bold color pop

### Material & Hardware:
- ✅ 100% PU Leather
- ✅ Smooth, fine-grained texture
- ✅ Soft leather touch
- ✅ Gold-tone hardware (zipper puller & trims)
- ✅ Premium construction

### Closure & Organization:
- ✅ Zip-around closure
- ✅ Envelope-style panel design
- ✅ Secure and stylish

### Compartments:
- ✅ 2 main cash compartments
- ✅ 1 center zipper pocket for coins
- ✅ 6–8 card slots for organization
- ✅ 2 slip pockets for bills/receipts

### Versatile Carrying:
- ✅ Adjustable shoulder strap (26 cm drop)
- ✅ Use as clutch (hand-carry)
- ✅ Use as crossbody (shoulder wear)
- ✅ Multiple style options

### Capacity:
- ✅ 1.5-2 liter capacity
- ✅ Compact yet spacious
- ✅ Holds all essentials

### Perfect For:
- ✅ Everyday use
- ✅ Evening outings
- ✅ Casual looks
- ✅ Professional looks
- ✅ Versatile styling

---

## 📦 What Fits Inside

✓ Cash organized in 2 main compartments  
✓ Coins secure in center zipper pocket  
✓ 6-8 cards neatly organized  
✓ Bills and receipts in slip pockets  
✓ Small essentials (lipstick, keys)  
✓ Phone (when carried as clutch)  

---

## 🇮🇳 "Message & Writing" Collection

**Cultural Roots Meet Modern Style**

**Lekha Wallet** (Writing) pairs beautifully with **SANDESH LAPTOP BAG** (Message):

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
- Indian-rooted naming with global appeal

---

## 🚀 Quick Import Instructions

### Step 1: Prepare Images

**You need 4 PNG images:**
1. `lekha-wallet-teal-blue.png` (for Teal Blue variant)
2. `lekha-wallet-pastel-green.png` (for Mint Green variant)
3. `lekha-wallet-brown.png` (for Mocha Tan variant)
4. `lekha-wallet-milky-blue.png` (for Milky Blue variant)

**Image Requirements:**
- Format: PNG with transparent or white background
- Resolution: Minimum 1000x1000 px (recommended 1500x1500 px)
- Aspect: Square (1:1)
- Size: Under 400KB per image
- Quality: High-resolution product shots showing geometric cuts

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
node scripts/import-products.js lekha-wallet-import.json
```

**Before running:**
- Open `lekha-wallet-import.json`
- Update `image_filename` values with actual Supabase URLs
- Ensure Supabase credentials are in `.env`

#### Method B: Using SQL Script (Manual)

1. Find your Wallet/Clutch category ID:
```sql
SELECT id, name, slug FROM categories WHERE name ILIKE '%wallet%' OR name ILIKE '%clutch%';
```

2. Open `IMPORT_LEKHA_WALLET.sql`

3. Replace placeholders:
   - `YOUR_WALLET_CATEGORY_ID` → actual category UUID
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
WHERE slug = 'lekha-wallet';
```

**Expected:**
- name: Lekha Wallet
- price: 2199.00
- is_active: true
- is_featured: true

### 2. Check Variants
```sql
SELECT pv.id, pv.color, pv.sku, pv.price, pv.stock_quantity, pv.is_active
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE p.slug = 'lekha-wallet'
ORDER BY pv.color;
```

**Expected: 4 rows**
- Milky Blue (LEKHA-BLUE-001)
- Mint Green (LEKHA-GREEN-001)
- Mocha Tan (LEKHA-TAN-001)
- Teal Blue (LEKHA-TEAL-001)

### 3. Check Images
```sql
SELECT pi.image_url, pi.alt_text, pv.color, pi.is_primary
FROM product_images pi
JOIN products p ON pi.product_id = p.id
JOIN product_variants pv ON pi.variant_id = pv.id
WHERE p.slug = 'lekha-wallet'
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
WHERE p.slug = 'lekha-wallet'
GROUP BY p.id, p.name, p.price, c.name;
```

**Expected:**
```
name: Lekha Wallet
price: 2199
category_name: Wallet (or Clutch)
variant_count: 4
image_count: 4
```

---

## 🌐 Test on Website

### 1. Visit Collection Page
Navigate to: `https://kibana-one.vercel.app/collections/wallet` or `/collections/clutch`

**Should see:**
- 4 separate Lekha Wallet cards
- Each card shows a different color
- Each priced at ₹2,199
- All display correct images

### 2. Click Each Color Card
Test all 4 variants:
- Click "Teal Blue" card → Opens product detail
- Click "Mint Green" card → Opens product detail
- Click "Mocha Tan" card → Opens product detail
- Click "Milky Blue" card → Opens product detail

### 3. Test Product Detail Page
On the product detail page, verify:
- [ ] Product name displays: "Lekha Wallet"
- [ ] Price shows: ₹2,199
- [ ] All 4 color swatches visible
- [ ] Can select each color
- [ ] Image changes when selecting colors
- [ ] "Add to Cart" works for each variant
- [ ] Specifications display correctly
- [ ] Description renders properly
- [ ] Card slots (6-8) mentioned
- [ ] Adjustable strap feature shown

### 4. Test Shopping Cart
- [ ] Add Teal Blue to cart → Shows correct variant
- [ ] Add Mint Green to cart → Shows correct variant
- [ ] Can adjust quantities
- [ ] Total price calculates correctly
- [ ] Can proceed to checkout

---

## 🎯 Expected Display on Collection Page

When you visit `/collections/wallet`, you should see **4 product cards**:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  [Teal Blue]    │  │  [Mint Green]   │  │  [Mocha Tan]    │  │  [Milky Blue]   │
│  Lekha Wallet   │  │  Lekha Wallet   │  │  Lekha Wallet   │  │  Lekha Wallet   │
│    ₹2,199       │  │    ₹2,199       │  │    ₹2,199       │  │    ₹2,199       │
│ [Add to Cart]   │  │ [Add to Cart]   │  │ [Add to Cart]   │  │ [Add to Cart]   │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 🛠️ Troubleshooting

### Issue 1: Product Not Showing
**Check:**
```sql
SELECT is_active, category_id FROM products WHERE slug = 'lekha-wallet';
```
- Ensure `is_active = true`
- Verify `category_id` matches Wallet/Clutch category

### Issue 2: Only 1 Card Instead of 4
**Check:**
```sql
SELECT COUNT(*) FROM product_variants WHERE product_id = 
  (SELECT id FROM products WHERE slug = 'lekha-wallet');
```
- Should return 4
- If less, variants not created properly

### Issue 3: Images Not Loading
**Check:**
```sql
SELECT image_url FROM product_images WHERE product_id = 
  (SELECT id FROM products WHERE slug = 'lekha-wallet');
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
WHERE p.slug = 'lekha-wallet';
```
- Verify `stock_quantity > 0`
- Ensure `is_active = true`

---

## 📊 Specifications Display

The product detail page will show these specs:

**Material & Texture:**
- 100% PU Leather
- Smooth, Fine-Grained

**Hardware:**
- Gold-Tone Accents (zipper puller & trims)

**Closure:**
- Zip-Around Closure with envelope-style panel design

**Compartments:**
- 2 main cash compartments
- 1 center zipper pocket for coins
- 6–8 card slots
- 2 slip pockets for bills/receipts

**Carrying Options:**
- 26 cm adjustable strap included
- Use as clutch or crossbody

**Capacity:**
- 1.5–2 Liters
- Designed to hold cash, coins, cards, and small essentials

**Ideal For:**
- Everyday use, evening outings, and as a stylish companion for both casual and professional looks

---

## 🎁 Marketing Ideas

### Product Positioning:
**Target Audience:** Fashion-conscious women, all ages  
**Use Cases:** Daily errands, work, evening out, parties  
**Key Benefit:** Envelope design + organized storage + versatile carrying

### Launch Promotion:
```
✍️ NEW: Lekha Wallet
Write Your Style.

Envelope-inspired elegance meets everyday functionality
✨ 6-8 card slots organized
💳 Coin pocket + cash compartments
🎨 4 stunning colors
💰 ₹2,199

Compact yet spacious. Use as clutch or crossbody!

Shop now! Limited launch stock.
```

### Instagram Caption:
```
Introducing Lekha – A statement of elegance in every line ✍️

Envelope-inspired ✉️
Geometric perfection ✨
6-8 card slots organized 💳
Coin pocket + cash compartments 💰
4 gorgeous colors 🌈

Compact yet spacious. Bold yet elegant.
Lekha is designed to hold more than just essentials — 
it holds your statement. 💫

Swipe to see how to style it! →
Clutch or crossbody? You choose! 👜

Lekha = "Writing" in Sanskrit/Hindi 🇮🇳

#LekhaWallet #KIBANA #WriteYourStyle
#EnvelopeWallet #StatementPiece
```

### Bundle Offer - "Message & Writing" Collection:
```
✍️ COMPLETE YOUR STORY ✍️

SANDESH LAPTOP BAG + Lekha Wallet
(Message + Writing Collection)

💼 Work bag for your laptop
👛 Wallet for your essentials

₹8,698 → ₹7,999
SAVE ₹699!

Professional pairing with cultural roots 🇮🇳
Perfect gift for yourself or someone special! 💝

Available in matching colors:
💙 Teal Blue | 💚 Mint Green | 🤎 Mocha Tan | 💙 Milky Blue
```

### Gift Promotion:
```
🎁 PERFECT GIFT ALERT 🎁

Lekha Wallet - ₹2,199
Beautifully packaged, elegantly priced.

✨ For your mother
💕 For your sister
🌟 For your best friend
💝 For yourself!

A wallet that writes a thousand compliments. ✍️

Free gift wrap on all orders!
Order now for same-day dispatch.
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
   - Add to accessories section
   - Include in featured products
   - Highlight card organization

3. **Create Content:**
   - Product photography showing compartments
   - Lifestyle shots (carried as clutch, as crossbody)
   - Video showing card slots and organization
   - Customer testimonials
   - Unboxing videos

4. **Launch Marketing:**
   - Social media posts (Instagram, Facebook, Pinterest)
   - Email newsletter to women subscribers
   - Influencer outreach (fashion/lifestyle influencers)
   - Paid ads targeting wallet shoppers
   - Gift guides

5. **Cross-Promote with SANDESH:**
   - Bundle offers
   - "Complete the look" sections
   - Matching color promotions
   - Gift set packaging
   - Professional collection story

6. **Monitor Performance:**
   - Track views per variant
   - Monitor sales by color
   - Analyze add-to-cart rate
   - Gather customer feedback
   - Track wallet searches
   - Review pairing with SANDESH

---

## 📞 Quick Reference

**Product Details:**
- Name: Lekha Wallet
- Slug: `lekha-wallet`
- Category: Women's Wallet / Clutch
- Price: ₹2,199
- Variants: 4
- Stock per variant: 25
- Card Slots: 6-8

**URLs:**
- Product: `/products/lekha-wallet`
- Collection: `/collections/wallet` or `/collections/clutch`

**Files:**
- JSON: `lekha-wallet-import.json`
- SQL: `IMPORT_LEKHA_WALLET.sql`
- Guide: `LEKHA_WALLET_SETUP_GUIDE.md`

**Images Needed:**
- lekha-wallet-teal-blue.png
- lekha-wallet-pastel-green.png
- lekha-wallet-brown.png
- lekha-wallet-milky-blue.png

---

## ✅ Completion Checklist

- [ ] 4 PNG images prepared (showing geometric cuts)
- [ ] Images uploaded to Supabase
- [ ] Public URLs obtained
- [ ] Wallet/Clutch category ID found
- [ ] Import method chosen
- [ ] Product imported (JSON or SQL)
- [ ] Database verified (4 variants, 4 images)
- [ ] Collection page shows 4 cards
- [ ] Product detail page works
- [ ] All colors selectable
- [ ] Add to cart functions
- [ ] Specifications display (including card slots)
- [ ] Mobile view tested
- [ ] SEO metadata present
- [ ] Bundle with SANDESH promoted
- [ ] Gift packaging available
- [ ] Ready for launch! 🚀

---

**Status:** ✅ Ready to Import  
**Time Required:** 20-30 minutes  
**Difficulty:** Easy (follow step-by-step)  
**Collection:** "Message & Writing" 🇮🇳

**Result:** 4 beautiful Lekha Wallet cards on your Wallet collection page! ✍️✨

**Perfect Pair:** Import with SANDESH LAPTOP BAG for complete "Message & Writing" collection!
