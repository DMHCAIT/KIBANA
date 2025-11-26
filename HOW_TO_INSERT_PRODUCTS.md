# 📦 HOW TO INSERT ALL PRODUCTS - Step by Step

## 🎯 Quick Overview

You'll insert **5 products** with **20 color variants** into your database.

---

## ✅ **Step-by-Step Guide**

### **Step 1: Get Your Category IDs**

Run this in Supabase SQL Editor:

```sql
SELECT id, name, slug FROM categories ORDER BY name;
```

**Write down these IDs:**
```
Tote Bag: ___________________________________
Sling Bag: __________________________________
Backpack: ___________________________________
Laptop Bag: _________________________________
Wallet/Clutch: ______________________________
```

---

### **Step 2: Choose Your SQL File**

**Option A - Simple (Recommended):**
- File: `INSERT_ALL_PRODUCTS_SIMPLE.sql`
- Easier to read
- Copy each product section one by one

**Option B - Complete:**
- File: `INSERT_ALL_PRODUCTS.sql`
- More detailed descriptions
- All products in one go

---

### **Step 3: Replace Category IDs**

Open your chosen SQL file and find these lines:

```sql
'PUT-TOTE-BAG-CATEGORY-ID-HERE'::uuid      ← Replace with Tote Bag ID
'PUT-SLING-BAG-CATEGORY-ID-HERE'::uuid     ← Replace with Sling Bag ID
'PUT-BACKPACK-CATEGORY-ID-HERE'::uuid      ← Replace with Backpack ID
'PUT-LAPTOP-BAG-CATEGORY-ID-HERE'::uuid    ← Replace with Laptop Bag ID
'PUT-WALLET-CATEGORY-ID-HERE'::uuid        ← Replace with Wallet ID
```

**Example:**
```sql
-- BEFORE:
'PUT-TOTE-BAG-CATEGORY-ID-HERE'::uuid

-- AFTER:
'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid
```

---

### **Step 4: Run the SQL**

1. Go to **Supabase Dashboard**
2. Click **SQL Editor**
3. Paste your modified SQL
4. Click **"Run"**
5. Wait for success message

---

## 📊 **What Gets Created**

### **Product 1: VISTARA TOTE (₹4,999)**
```
Category: Tote Bag
Variants:
├─ Teal Blue (20 in stock)
├─ Mint Green (20 in stock)
├─ Mocha Tan (20 in stock)
└─ Milky Blue (20 in stock)
```

### **Product 2: PRIZMA SLING (₹3,999)**
```
Category: Sling Bag
Variants:
├─ Teal Blue (20 in stock)
├─ Mint Green (20 in stock)
├─ Mocha Tan (20 in stock)
└─ Milky Blue (20 in stock)
```

### **Product 3: VISTAPACK (₹4,499)**
```
Category: Backpack
Variants:
├─ Teal Blue (20 in stock)
├─ Mint Green (20 in stock)
├─ Mocha Tan (20 in stock)
└─ Milky Blue (20 in stock)
```

### **Product 4: SANDESH LAPTOP BAG (₹6,499)**
```
Category: Laptop Bag
Variants:
├─ Teal Blue (15 in stock)
├─ Mint Green (15 in stock)
├─ Mocha Tan (15 in stock)
└─ Milky Blue (15 in stock)
```

### **Product 5: Lekha Wallet (₹2,199)**
```
Category: Wallet/Clutch
Variants:
├─ Teal Blue (25 in stock)
├─ Mint Green (25 in stock)
├─ Mocha Tan (25 in stock)
└─ Milky Blue (25 in stock)
```

---

## ✅ **Verify Products Were Created**

After running the SQL, verify:

```sql
-- Check products
SELECT name, slug, price FROM products 
WHERE slug IN (
  'vistara-tote', 
  'prizma-sling', 
  'vistapack', 
  'sandesh-laptop-bag', 
  'lekha-wallet'
)
ORDER BY price DESC;
```

**Expected Result:** 5 rows

```sql
-- Check variants
SELECT 
  p.name,
  COUNT(pv.id) as variant_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.slug IN ('vistara-tote', 'prizma-sling', 'vistapack', 'sandesh-laptop-bag', 'lekha-wallet')
GROUP BY p.name
ORDER BY p.name;
```

**Expected Result:** 5 rows, each showing 4 variants

---

## 📸 **Next: Add Product Images**

After products are created, you need to add images:

### **Step 1: Upload Images to Supabase Storage**

1. Go to **Storage** in Supabase
2. Create bucket named `products` (if not exists)
3. Upload these 20 PNG files:
   - vistara-tote-teal-blue.png
   - vistara-tote-mint-green.png
   - vistara-tote-mocha-tan.png
   - vistara-tote-milky-blue.png
   - prizma-sling-teal-blue.png
   - prizma-sling-mint-green.png
   - prizma-sling-mocha-tan.png
   - prizma-sling-milky-blue.png
   - vistapack-teal-blue.png
   - vistapack-mint-green.png
   - vistapack-mocha-tan.png
   - vistapack-milky-blue.png
   - sandesh-laptop-bag-teal-blue.png
   - sandesh-laptop-bag-mint-green.png
   - sandesh-laptop-bag-mocha-tan.png
   - sandesh-laptop-bag-milky-blue.png
   - lekha-wallet-teal-blue.png
   - lekha-wallet-mint-green.png
   - lekha-wallet-mocha-tan.png
   - lekha-wallet-milky-blue.png

### **Step 2: Link Images to Variants**

After uploading, you'll need to insert `product_images` records. I can create SQL for this once you have the image URLs.

---

## 🎯 **Collection Pages Will Show**

### `/collections/tote-bag` → 4 cards
```
[Teal Blue]  [Mint Green]  [Mocha Tan]  [Milky Blue]
VISTARA TOTE - ₹4,999 each
```

### `/collections/sling-bag` → 4 cards
```
[Teal Blue]  [Mint Green]  [Mocha Tan]  [Milky Blue]
PRIZMA SLING - ₹3,999 each
```

### `/collections/backpack` → 4 cards
```
[Teal Blue]  [Mint Green]  [Mocha Tan]  [Milky Blue]
VISTAPACK - ₹4,499 each
```

### `/collections/laptop-bag` → 4 cards
```
[Teal Blue]  [Mint Green]  [Mocha Tan]  [Milky Blue]
SANDESH LAPTOP BAG - ₹6,499 each
```

### `/collections/wallet` → 4 cards
```
[Teal Blue]  [Mint Green]  [Mocha Tan]  [Milky Blue]
Lekha Wallet - ₹2,199 each
```

**Total: 20 product cards!**

---

## 🆘 **Troubleshooting**

### **Error: violates foreign key constraint**
**Cause:** Category ID doesn't exist  
**Fix:** Run `SELECT id, name FROM categories;` and use correct IDs

### **Error: duplicate key value violates unique constraint "products_slug_key"**
**Cause:** Products already exist  
**Fix:** Products are already in database! Check with:
```sql
SELECT * FROM products WHERE slug LIKE '%vistara%';
```

### **Error: violates unique constraint "product_variants_sku_key"**
**Cause:** Variants already exist  
**Fix:** Variants are already created!

### **Products created but not showing on website**
**Causes:**
1. Images not uploaded yet → Upload images
2. Category not active → Check: `UPDATE categories SET is_active = true WHERE id = 'your-id';`
3. Product not active → Check: `UPDATE products SET is_active = true;`

---

## 📋 **Complete Checklist**

### Before Import:
- [ ] Tables created (`product_variants`, `product_images`)
- [ ] Categories exist in database
- [ ] Category IDs noted down
- [ ] SQL file downloaded

### During Import:
- [ ] Category IDs replaced in SQL
- [ ] SQL executed successfully
- [ ] 5 products created
- [ ] 20 variants created
- [ ] Verification queries run

### After Import:
- [ ] 20 product images prepared
- [ ] Images uploaded to Supabase Storage
- [ ] Image URLs obtained
- [ ] `product_images` records created
- [ ] Website tested

---

## ⏱️ **Time Required**

- Get category IDs: 1 minute
- Modify SQL: 2 minutes
- Run SQL: 30 seconds
- Verify: 1 minute

**Total: ~5 minutes for all 5 products!**

---

## 🎉 **Success!**

Once done:
- ✅ 5 products in database
- ✅ 20 color variants
- ✅ All specifications included
- ✅ Ready for images
- ✅ Ready to display on website

---

**Next:** Upload product images and link them to variants!
