# PRIZMA SLING - Complete Setup Guide

## 🎯 Quick Overview

This guide will help you add the **PRIZMA SLING** product to your store with all 4 color variants.

**Product Details:**
- **Name:** PRIZMA SLING
- **Price:** ₹3,999
- **Category:** Sling Bag
- **Style:** Luxury–Chic Sling
- **Capacity:** 4-5 Liters
- **Shoulder Drop:** 26 cm

**Result:** When complete, `/collections/sling-bag` will show **4 separate cards** (one for each color)

---

## 📸 STEP 1: Prepare Your Product Images

### Required Images (4 PNG files):

Based on your file names, rename them as:

1. **Teal Blue (dark green):** `prizma-sling-dark-green.png`
2. **Pastel Green:** `prizma-sling-pastel-green.png`
3. **Brown:** `prizma-sling-brown.png`
4. **Milky Blue:** `prizma-sling-milky-blue.png`

### Image Specifications:
- **Format:** PNG (as you have)
- **Recommended Size:** 1200x1200px or larger
- **Aspect Ratio:** Square (1:1) preferred
- **Background:** White or neutral
- **Show:** Geometric cuts and gold hardware clearly visible

### Upload to Supabase Storage:

1. Go to **Supabase Dashboard** → **Storage**
2. Select or create the **`products`** bucket
3. Upload all 4 PNG files
4. Click each file → **Get public URL**
5. Copy the 4 URLs (you'll need them in Step 3)

---

## 💾 STEP 2: Get Your Category ID

Before importing, you need the Sling Bag category ID:

```sql
-- Run this in Supabase SQL Editor:
SELECT id, name, slug FROM categories WHERE name ILIKE '%sling%';
```

**Copy the UUID** that returns

---

## 🚀 STEP 3: Choose Your Import Method

### **Option A: Using Import Script (Recommended)**

1. **File created:** `prizma-sling-import.json` ✅
2. **Update image URLs** in the JSON file (4 places)
3. **Run import:**
   ```bash
   node scripts/import-products.js prizma-sling-import.json
   ```

### **Option B: Using SQL Script**

1. **File created:** `IMPORT_PRIZMA_SLING.sql` ✅
2. **Open file** and replace placeholders
3. **Execute in Supabase SQL Editor**

---

## ✅ STEP 4: Verify the Product

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
WHERE p.slug = 'prizma-sling'
GROUP BY p.id, p.name, p.slug, p.price, c.name;
```

**Expected:**
- variant_count: 4
- image_count: 4
- price: 3999

---

## 🎨 STEP 5: See Your Product Live!

Visit: **`http://localhost:3000/collections/sling-bag`**

**You should see 4 separate cards:**

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│    TEAL BLUE        │  │    MINT GREEN       │  │    MOCHA TAN        │  │    MILKY BLUE       │
│   [Image]           │  │   [Image]           │  │   [Image]           │  │   [Image]           │
│  PRIZMA SLING       │  │  PRIZMA SLING       │  │  PRIZMA SLING       │  │  PRIZMA SLING       │
│  Color: Teal Blue   │  │  Color: Mint Green  │  │  Color: Mocha Tan   │  │  Color: Milky Blue  │
│  ₹3,999             │  │  ₹3,999             │  │  ₹3,999             │  │  ₹3,999             │
│  [Add to Cart]      │  │  [Add to Cart]      │  │  [Add to Cart]      │  │  [Add to Cart]      │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## 📋 Complete Specifications

### Product Information:
- **Name:** PRIZMA SLING
- **Inspiration:** Brilliance of a prism
- **Style:** Luxury–Chic, Bold, Modern, Unstoppable
- **Design:** Geometric cuts, refined craftsmanship

### Physical Specifications:
- **Capacity:** 4-5 Liters
- **Material:** 100% PU Leather
- **Texture:** Smooth, Fine-Grained
- **Hardware:** Gold-Tone Accents
- **Closure:** Square metallic push-lock (gold finish)
- **Shoulder Drop:** 26 cm (adjustable strap)

### Compartments:
- Main compartment (spacious for essentials)
- Internal zipper pocket
- Slip pocket for phone/cards

### Can Fit:
✓ Wallet
✓ Phone
✓ Sunglasses
✓ Small accessories
✓ Cards and essentials

### Ideal For:
- Evening outings
- Brunch
- Parties
- Formal wear companion
- Festive occasions

### Color Variants:

1. **Teal Blue** (Dark Blue)
   - SKU: PRIZMA-TEAL-001
   - Image: prizma-sling-dark-green.png

2. **Mint Green** (Pastel Green)
   - SKU: PRIZMA-GREEN-001
   - Image: prizma-sling-pastel-green.png

3. **Mocha Tan**
   - SKU: PRIZMA-TAN-001
   - Image: prizma-sling-brown.png

4. **Milky Blue**
   - SKU: PRIZMA-BLUE-001
   - Image: prizma-sling-milky-blue.png

---

## 🎯 Files Created

### 1. **prizma-sling-import.json**
- JSON for import script
- All 4 colors included
- Complete specifications

### 2. **IMPORT_PRIZMA_SLING.sql**
- SQL import script
- Step-by-step commands
- Verification query

### 3. **PRIZMA_SLING_SETUP_GUIDE.md**
- This setup guide
- Complete instructions
- Troubleshooting

---

## ✨ Marketing Copy

### Product Tagline:
**"Bold. Modern. Unstoppable."**

### Description:
"PRIZMA is sophistication made effortless. Carry Prizma and shine at every angle."

### Social Media:
```
Introducing PRIZMA SLING ✨

Bold geometric cuts meet luxury craftsmanship
Square metallic push-lock with gold finish
Perfect for evening outings & parties

Which color is your vibe?
💙 Teal Blue
💚 Mint Green
🤎 Mocha Tan
💙 Milky Blue

Shop now! ₹3,999
#PRIZMA #KIBANA #LuxurySling
```

---

## 🔧 Troubleshooting

### Images not showing?
- Check image URLs are public
- Verify variant_id matches
- Check file format is PNG

### Only 1 card showing?
- Ensure all variants have is_active = true
- Check each has unique color value
- Verify variant_id links correct

### Wrong category?
- Check category_id is Sling Bag
- Verify category is active
- Refresh browser cache

---

## ✅ Success Checklist

✅ Product in database  
✅ 4 color variants created  
✅ 4 images uploaded and linked  
✅ Collection page shows 4 cards  
✅ Each card shows correct image  
✅ Product detail page works  
✅ Specifications display correctly  
✅ Add to cart functions  
✅ No console errors  

---

## 📞 Quick Reference

**Product:** PRIZMA SLING  
**Price:** ₹3,999  
**Category:** Sling Bag  
**Colors:** 4 (Teal Blue, Mint Green, Mocha Tan, Milky Blue)  
**SKU Prefix:** PRIZMA  
**Collection URL:** `/collections/sling-bag`  
**Product URL:** `/products/prizma-sling`  

**Image Files:**
1. prizma-sling-dark-green.png
2. prizma-sling-pastel-green.png
3. prizma-sling-brown.png
4. prizma-sling-milky-blue.png

---

**Time to Complete:** 15-20 minutes  
**Ready to Import:** ✅ YES  
**All Files Created:** ✅ COMPLETE
