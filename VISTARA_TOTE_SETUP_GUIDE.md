# VISTARA TOTE - Complete Setup Guide

## 🎯 Quick Overview

This guide will help you add the **VISTARA TOTE** product to your store with all 4 color variants.

**Product Details:**
- **Name:** VISTARA TOTE
- **Price:** ₹4,999
- **Category:** Tote Bag
- **Colors:** 4 variants (Teal Blue, Mint Green, Mocha Tan, Milky Blue)
- **Height:** 28 cm
- **Capacity:** 14-16 Liters

**Result:** When complete, `/collections/tote-bag` will show **4 separate cards** (one for each color)

---

## 📸 STEP 1: Prepare Your Product Images

### Required Images (4 PNG files):

You mentioned you have PNG files for each color. Name them as follows:

1. **Teal Blue image:** `vistara-tote-teal-blue.png`
2. **Pastel Green image:** `vistara-tote-pastel-green.png`
3. **Brown image:** `vistara-tote-brown.png`
4. **Milky Blue image:** `vistara-tote-milky-blue.png`

### Image Specifications:
- **Format:** PNG (as you have)
- **Recommended Size:** 1200x1200px or larger
- **Aspect Ratio:** Square (1:1) preferred
- **Background:** White or neutral
- **Show:** V-stitching pattern clearly visible

### Upload to Supabase Storage:

1. Go to **Supabase Dashboard** → **Storage**
2. Select or create the **`products`** bucket
3. Upload all 4 PNG files
4. Click each file → **Get public URL**
5. Copy the 4 URLs (you'll need them in Step 3)

Example URL format:
```
https://abcdefgh.supabase.co/storage/v1/object/public/products/vistara-tote-teal-blue.png
```

---

## 💾 STEP 2: Get Your Category ID

Before importing, you need the Tote Bag category ID:

```sql
-- Run this in Supabase SQL Editor:
SELECT id, name, slug FROM categories WHERE name ILIKE '%tote%';
```

**Copy the UUID** that returns (something like: `123e4567-e89b-12d3-a456-426614174000`)

---

## 🚀 STEP 3: Choose Your Import Method

### **Option A: Using Import Script (Recommended - Easiest)**

If you have the import script available:

1. **File created:** `vistara-tote-import.json` ✅
2. **Update image URLs** in the JSON file (4 places)
3. **Run import:**
   ```bash
   node scripts/import-products.js vistara-tote-import.json
   ```

### **Option B: Using SQL Script (Direct Database)**

If you prefer SQL:

1. **File created:** `IMPORT_VISTARA_TOTE.sql` ✅
2. **Open file** and replace:
   - `YOUR_TOTE_BAG_CATEGORY_ID` → your category UUID from Step 2
   - `YOUR_PRODUCT_ID` → will get after first INSERT
   - `VARIANT_TEAL_ID`, etc. → will get after variant INSERTs
   - Image URLs → your actual Supabase URLs from Step 1
3. **Execute in Supabase SQL Editor** (step by step)

---

## ✅ STEP 4: Verify the Product

After import, run this verification query:

```sql
SELECT 
  p.name,
  p.slug,
  p.price,
  c.name as category_name,
  COUNT(DISTINCT pv.id) as variant_count,
  COUNT(DISTINCT pi.id) as image_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.slug = 'vistara-tote'
GROUP BY p.id, p.name, p.slug, p.price, c.name;
```

**Expected Result:**
```
name: VISTARA TOTE
variant_count: 4
image_count: 4
category_name: Tote Bag
price: 4999
```

---

## 🎨 STEP 5: See Your Product Live!

### On Collection Page:

Visit: **`http://localhost:3000/collections/tote-bag`**

**You should see 4 separate cards:**

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│    TEAL BLUE        │  │    MINT GREEN       │  │    MOCHA TAN        │  │    MILKY BLUE       │
│   [Teal Image]      │  │   [Green Image]     │  │   [Brown Image]     │  │   [Blue Image]      │
│                     │  │                     │  │                     │  │                     │
│  VISTARA TOTE       │  │  VISTARA TOTE       │  │  VISTARA TOTE       │  │  VISTARA TOTE       │
│  Color: Teal Blue   │  │  Color: Mint Green  │  │  Color: Mocha Tan   │  │  Color: Milky Blue  │
│  ₹4,999             │  │  ₹4,999             │  │  ₹4,999             │  │  ₹4,999             │
│  20 in stock        │  │  20 in stock        │  │  20 in stock        │  │  20 in stock        │
│  [Add to Cart]      │  │  [Add to Cart]      │  │  [Add to Cart]      │  │  [Add to Cart]      │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

### On Product Detail Page:

Click any card → **`http://localhost:3000/products/vistara-tote`**

**You should see:**
- Large product images with zoom
- **4 color swatches** (80x80px each):
  - Teal Blue
  - Mint Green
  - Mocha Tan
  - Milky Blue
- Color names below each swatch
- Full specifications in tab
- Add to cart button

---

## 📋 Complete Specifications Reference

### Product Information:
- **Name:** VISTARA TOTE
- **Meaning:** "expanse" (hints at V-shape)
- **Style:** Youth-Trendy, Bold, Catchy, Fashionable
- **Tagline:** Bold. Stylish. Limitless.

### Physical Specifications:
- **Height:** 28 cm
- **Capacity:** 14-16 Liters
- **Material:** 100% PU Leather
- **Texture:** Smooth, Fine-Grained
- **Hardware:** Gold-Tone Accents
- **Closure:** Magnetic Flap with concealed zipper top

### Compartments:
- One Main Compartment
- Flap/Top Zipper
- Padded laptop sleeve (fits 14-15 inch)
- Inner zip pocket
- Organizer slip pockets

### Carrying Options:
- **Strap:** Detachable long strap (adjustable 50–60 cm)
- **Handle:** Top handle (8–10 cm drop)

### Can Fit:
✓ Laptop (14-15 inch)
✓ Diary
✓ Wallet
✓ Makeup pouch
✓ Charger
✓ Daily essentials

### Ideal For:
- Office meetings
- Day-to-evening transitions
- Professional settings
- Everyday use

### Color Variants:

1. **Teal Blue** (Also called: Dark Blue)
   - SKU: VISTARA-TEAL-001
   - Image: vistara-tote-teal-blue.png

2. **Mint Green** (Also called: Pastel Green)
   - SKU: VISTARA-GREEN-001
   - Image: vistara-tote-pastel-green.png

3. **Mocha Tan** (Brown)
   - SKU: VISTARA-TAN-001
   - Image: vistara-tote-brown.png

4. **Milky Blue**
   - SKU: VISTARA-BLUE-001
   - Image: vistara-tote-milky-blue.png

---

## 🎯 Files Created for You

### 1. **vistara-tote-import.json**
- Ready-to-use JSON for import script
- Contains all 4 color variants
- Complete specifications
- Update image URLs before using

### 2. **IMPORT_VISTARA_TOTE.sql**
- Complete SQL script
- Step-by-step instructions
- Replace placeholders with your IDs
- Execute in Supabase SQL Editor

### 3. **VISTARA_TOTE_SETUP_GUIDE.md** (This file)
- Complete setup instructions
- Step-by-step process
- Verification steps
- Troubleshooting guide

---

## 🔧 Troubleshooting

### Issue: Product not showing on collection page
**Check:**
- [ ] product.is_active = true
- [ ] product.category_id is correct (Tote Bag category)
- [ ] At least one variant has is_active = true
- [ ] Refresh browser cache (Ctrl+Shift+R)

### Issue: Only 1 card instead of 4
**Check:**
- [ ] All 4 variants created with `is_active = true`
- [ ] Each variant has a unique color value
- [ ] Color field is not empty for any variant

### Issue: Images not showing
**Check:**
- [ ] Images uploaded to Supabase Storage
- [ ] Bucket is public
- [ ] Image URLs are correct in database
- [ ] variant_id in product_images matches variant.id
- [ ] Image files are valid PNG format

### Issue: Wrong specifications showing
**Check:**
- [ ] specifications field is valid JSON
- [ ] No syntax errors in JSON
- [ ] All fields properly escaped
- [ ] Check database directly: `SELECT specifications FROM products WHERE slug = 'vistara-tote'`

---

## ✨ Marketing Launch Checklist

After successful import:

### Website:
- [ ] Verify all 4 colors show on collection page
- [ ] Test add to cart for each color
- [ ] Check product detail page
- [ ] Verify specifications tab
- [ ] Test on mobile view

### Content:
- [ ] Add to homepage featured products
- [ ] Create social media posts
- [ ] Update "New Arrivals" section
- [ ] Add to email newsletter

### SEO:
- [ ] Verify meta titles and descriptions
- [ ] Check OpenGraph images
- [ ] Submit sitemap to search engines
- [ ] Create blog post about VISTARA

### Social Media Posts:

**Instagram/Facebook:**
```
Introducing VISTARA TOTE 💼✨

Bold. Stylish. Limitless.

Our newest power tote featuring:
✓ Striking V-shape pattern
✓ Structured elegance
✓ 100% PU Leather
✓ Gold-tone hardware
✓ Fits your laptop + essentials
✓ 4 stunning colors

Which color speaks to you?
💙 Teal Blue
💚 Mint Green
🤎 Mocha Tan
💙 Milky Blue

Shop now! Link in bio
#VISTARA #KIBANA #NewArrivals #ToteBag #FashionBag
```

**Twitter/X:**
```
Meet VISTARA TOTE 💼
Bold V-shape design | 4 stunning colors | Perfect for office & beyond
₹4,999
[Link]
#VISTARA #KIBANA
```

---

## 📊 Expected Analytics

Track these metrics after launch:

- **Views per color variant**
- **Add to cart rate per color**
- **Most popular color**
- **Conversion rate**
- **Average order value**
- **Cart abandonment rate**

Use this data to:
- Stock popular colors more
- Create targeted ads for specific colors
- Optimize product photos
- Adjust pricing if needed

---

## 🎉 Success Checklist

Your VISTARA TOTE is successfully added when:

✅ Product appears in database  
✅ All 4 color variants exist  
✅ All 4 images linked to variants  
✅ Collection page shows 4 separate cards  
✅ Each card shows correct color image  
✅ Product detail page shows all 4 colors  
✅ Color swatches are large and clear  
✅ Specifications tab shows complete info  
✅ Add to cart works for each color  
✅ Cart shows correct color when added  
✅ Product is searchable  
✅ No errors in browser console  
✅ Works on mobile view  

---

## 📞 Quick Reference

### URLs:
- Collection Page: `/collections/tote-bag`
- Product Page: `/products/vistara-tote`

### Files:
- JSON Import: `vistara-tote-import.json`
- SQL Script: `IMPORT_VISTARA_TOTE.sql`
- This Guide: `VISTARA_TOTE_SETUP_GUIDE.md`

### Image Files Needed:
1. `vistara-tote-teal-blue.png`
2. `vistara-tote-pastel-green.png`
3. `vistara-tote-brown.png`
4. `vistara-tote-milky-blue.png`

### SKUs:
- VISTARA-TEAL-001
- VISTARA-GREEN-001
- VISTARA-TAN-001
- VISTARA-BLUE-001

---

## 🚀 Ready to Launch!

Everything is prepared for you. Just follow the steps:

1. ✅ Prepare images (Step 1)
2. ✅ Get category ID (Step 2)
3. ✅ Run import (Step 3)
4. ✅ Verify (Step 4)
5. ✅ Launch (Step 5)

**Time Required:** 15-20 minutes

**Files Ready:**
- ✅ JSON import file
- ✅ SQL script
- ✅ Complete guide
- ✅ All specifications included

**Good luck with your launch! 🎉**
