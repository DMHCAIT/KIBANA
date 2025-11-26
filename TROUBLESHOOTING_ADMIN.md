# 🔧 Troubleshooting Admin Panel Issues

## ❌ Problem: "404 Not Found" when trying to Edit/Add Products

### **Possible Causes:**

1. **Product doesn't exist in database**
2. **Slug mismatch** (e.g., "lekha-wallet" vs "lekha-wallet-clutch")
3. **RLS (Row Level Security) blocking access**
4. **Route not found**

### **Solutions:**

#### **Solution 1: Check if Product Exists**

1. Go to `/admin/products`
2. Check if the product appears in the list
3. If not, the product needs to be created first

#### **Solution 2: Use Product ID Instead of Slug**

If the slug doesn't match, try using the product ID:
- URL format: `/admin/products/[product-id]/edit`
- You can find the product ID in the database or by inspecting the product list

#### **Solution 3: Import Products First**

If products don't exist:
1. Go to `/admin/products`
2. Click **"Import All Products"** button
3. Wait for import to complete
4. Then try editing

#### **Solution 4: Create Product Manually**

1. Go to `/admin/products/new`
2. Fill in all product details:
   - Name: e.g., "Lekha Wallet"
   - Category: Select appropriate category
   - Price: Enter price
   - Description: Add full description
   - Specifications: Add all specs
3. Click **"Save Product"**
4. You'll be redirected to the edit page

---

## ❌ Problem: "Unable to Add or Edit Products"

### **Possible Causes:**

1. **RLS (Row Level Security) restrictions**
2. **Missing admin API routes**
3. **Supabase configuration issues**
4. **Missing service role key**

### **Solutions:**

#### **Solution 1: Check Supabase RLS Policies**

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Policies**
3. Check `products` table policies
4. Ensure admin users can INSERT/UPDATE/DELETE

#### **Solution 2: Verify Service Role Key**

1. Check `.env.local` file:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
2. Verify in Vercel environment variables
3. The service role key bypasses RLS

#### **Solution 3: Check Browser Console**

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try adding/editing a product
4. Look for error messages
5. Common errors:
   - `401 Unauthorized` → RLS issue
   - `404 Not Found` → Route/API issue
   - `500 Internal Server Error` → Server issue

#### **Solution 4: Test API Routes Directly**

Test the admin API route:
```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","slug":"test-product","brand":"KIBANA","price":1000,"category_id":"..."}'
```

---

## ❌ Problem: Images Not Uploading

### **Solutions:**

1. **Check Supabase Storage Bucket**
   - Go to Supabase Dashboard → Storage
   - Ensure `product-images` bucket exists
   - Check bucket is **public**

2. **Check File Size**
   - Maximum: 10MB per image
   - Compress large images

3. **Check Browser Console**
   - Look for upload errors
   - Check Network tab for failed requests

4. **Manual Upload**
   - Upload images directly to Supabase Storage
   - Copy public URLs
   - Add URLs manually in product form

---

## ❌ Problem: Variants Not Saving

### **Solutions:**

1. **Check Variant Data**
   - Ensure SKU is unique
   - Check all required fields are filled

2. **Check Database**
   - Verify `product_variants` table exists
   - Check RLS policies

3. **Save Product First**
   - Create/update product first
   - Then add variants
   - Variants need a product_id

---

## ✅ Quick Fixes

### **If Nothing Works:**

1. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

2. **Check Network Connection**
   - Ensure Supabase is accessible
   - Check Vercel deployment status

3. **Redeploy**
   - Push latest code to GitHub
   - Vercel will auto-deploy

4. **Check Logs**
   - Vercel Dashboard → Functions → Logs
   - Look for error messages

---

## 📋 Step-by-Step: Adding a New Product

1. **Go to Admin Panel**
   ```
   https://your-domain.com/admin/products
   ```

2. **Click "Add Product"**
   - Or go to `/admin/products/new`

3. **Fill Basic Information**
   - Name: Product name
   - Slug: Auto-generated (or edit manually)
   - Brand: KIBANA
   - Category: Select from dropdown
   - Price: Enter price
   - Description: Full description
   - Short Description: Brief summary

4. **Add Images**
   - Go to "Images" tab
   - Click "Upload Images"
   - Select image files
   - Set primary image (star icon)

5. **Add Variants**
   - Go to "Variants" tab
   - Click "Add Variant"
   - Fill in:
     - Color: e.g., "Teal Blue / Dark Blue"
     - SKU: Unique SKU
     - Price: (optional, uses product price if empty)
     - Stock: Quantity available

6. **Add Specifications** (if needed)
   - Can be added via admin panel or database

7. **Save Product**
   - Click "Save Product" button
   - You'll be redirected to edit page

---

## 🔍 Debugging Checklist

- [ ] Product exists in database?
- [ ] Slug matches in URL?
- [ ] RLS policies allow admin access?
- [ ] Service role key configured?
- [ ] API routes working?
- [ ] Browser console shows errors?
- [ ] Network requests succeeding?
- [ ] Supabase Storage bucket exists?
- [ ] Images uploading correctly?
- [ ] Variants saving correctly?

---

## 📞 Still Having Issues?

1. **Check Vercel Logs**
   - Go to Vercel Dashboard
   - Click on your project
   - Go to "Functions" → "Logs"
   - Look for error messages

2. **Check Supabase Logs**
   - Go to Supabase Dashboard
   - Navigate to "Logs" → "API Logs"
   - Look for failed requests

3. **Test Locally**
   - Run `npm run dev`
   - Test admin panel locally
   - Check for different errors

4. **Verify Environment Variables**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

## 🎯 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `404 Not Found` | Product doesn't exist or wrong slug | Check product exists, use correct slug/ID |
| `401 Unauthorized` | RLS blocking access | Use admin API routes or fix RLS policies |
| `500 Internal Server Error` | Server error | Check logs, verify service role key |
| `Failed to save product` | Validation error | Check all required fields are filled |
| `Images not uploading` | Storage bucket issue | Check bucket exists and is public |

