# Collection Pages Development Guide

## Overview
This guide explains how the collection pages work in the KIBANA e-commerce application, specifically how products with multiple color variants are displayed.

## Key Features

### 1. Variant Expansion
**Problem Solved:** If a product (e.g., "Tote Bag") has 4 different colors, customers need to see all 4 color options clearly.

**Solution:** Each color variant is displayed as a separate product card on collection pages.

**Example:**
- Product: "Premium Tote Bag"
- Colors: Black, Brown, Navy, Beige
- **Result:** 4 separate cards are shown on the collection page, each displaying the specific color variant

### 2. Collection URLs

All collection pages are accessible via clean URLs:

```
https://your-site.com/collections/tote-bag
https://your-site.com/collections/sling-bag
https://your-site.com/collections/backpack
https://your-site.com/collections/laptop-bag
https://your-site.com/collections/clutch
https://your-site.com/collections/wallet
```

### 3. Product Cards Display

Each variant card shows:
- ✅ Specific color variant image
- ✅ Product name with color label
- ✅ Price (variant-specific or product price)
- ✅ Stock availability
- ✅ Quick add to cart functionality
- ✅ Wishlist button
- ✅ Quick view button

### 4. Smart Card Behavior

**For products WITH color variants:**
- Each active color variant gets its own card
- Variant-specific image is displayed
- Variant-specific stock count shown
- "Out of stock" badge if unavailable

**For products WITHOUT color variants:**
- Single card displayed
- Primary product image shown
- Standard product display

## Technical Implementation

### Components Created/Modified

#### 1. ProductVariantCard Component
**Location:** `/components/store/ProductVariantCard.tsx`

**Purpose:** Displays a single color variant as a product card

**Key Props:**
```typescript
interface ProductVariantCardProps {
  product: Product              // Base product info
  variant?: ProductVariant      // Specific variant to display
  variantImage?: ProductImage   // Image for this variant
}
```

**Features:**
- Variant-specific pricing
- Stock quantity display
- Color label shown prominently
- "Out of stock" state handling
- Low stock warnings (≤ 5 items)

#### 2. ProductGrid Component
**Location:** `/components/store/ProductGrid.tsx`

**Enhancement:** Now detects variant cards and renders them appropriately

**Logic:**
```typescript
// Checks if product has _isVariantCard flag
const isVariantCard = (product as any)._isVariantCard
const displayVariant = (product as any)._displayVariant
const displayVariantImage = (product as any)._displayVariantImage

// Renders ProductVariantCard or regular ProductCard
{isVariantCard ? (
  <ProductVariantCard 
    product={product} 
    variant={displayVariant}
    variantImage={displayVariantImage}
  />
) : (
  <ProductCard product={product} />
)}
```

#### 3. Collection Page [slug]
**Location:** `/app/(store)/collections/[slug]/page.tsx`

**Key Enhancement: Product Expansion**

```typescript
// Transform products to show each color variant as separate item
const productsExpanded: any[] = []
if (productsRaw) {
  for (const product of productsRaw) {
    const colorVariants = product.variants?.filter(
      (v: any) => v.color && v.is_active
    ) || []
    
    if (colorVariants.length > 0) {
      // Create a card for each color variant
      for (const variant of colorVariants) {
        const variantImage = product.images?.find(
          (img: any) => img.variant_id === variant.id
        )
        productsExpanded.push({
          ...product,
          _displayVariant: variant,
          _displayVariantImage: variantImage,
          _isVariantCard: true,
        })
      }
    } else {
      // No color variants, show product as is
      productsExpanded.push(product)
    }
  }
}
```

## Database Structure

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name TEXT,
  slug TEXT UNIQUE,
  price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  category_id UUID,
  is_active BOOLEAN,
  is_featured BOOLEAN,
  -- ... other fields
);
```

### Product Variants Table
```sql
CREATE TABLE product_variants (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  color TEXT,              -- e.g., "Black", "Brown"
  size TEXT,               -- e.g., "Medium", "Large"
  material TEXT,           -- e.g., "Leather", "Canvas"
  sku TEXT UNIQUE,
  price DECIMAL(10,2),     -- Variant-specific price (optional)
  stock_quantity INTEGER,
  is_active BOOLEAN,
  -- ... other fields
);
```

### Product Images Table
```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),  -- Links to specific variant
  image_url TEXT,
  alt_text TEXT,
  "order" INTEGER,
  is_primary BOOLEAN,
  -- ... other fields
);
```

## User Flow

### Browsing Collections

1. **User navigates to `/collections/tote-bag`**
   - System fetches all products in "Tote Bag" category
   - Each product is expanded by its color variants
   - Grid displays all variants as individual cards

2. **User sees a specific color they like**
   - Card shows the color name clearly
   - Stock availability is visible
   - Price is displayed

3. **User clicks on a variant card**
   - Redirected to `/products/[slug]`
   - Product detail page opens
   - All variants are available for selection
   - User can switch between colors on detail page

4. **User adds to cart**
   - Specific variant (color) is added
   - Cart stores both product_id and variant_id
   - Checkout will show the exact color chosen

## Benefits

### For Customers
✅ **Clear Visual Choice:** See all color options at a glance
✅ **Stock Transparency:** Know which colors are available
✅ **Quick Shopping:** Add specific colors directly to cart
✅ **Better Discovery:** Don't miss color options

### For Store Owners
✅ **Increased Visibility:** Each variant gets its own spotlight
✅ **Better Analytics:** Track which colors are most popular
✅ **Inventory Management:** Display stock per variant
✅ **Higher Conversion:** Customers see exactly what they want

## Example Scenarios

### Scenario 1: Tote Bag with 4 Colors

**Database:**
- 1 Product: "Classic Tote Bag" (ID: abc-123)
- 4 Variants: Black, Brown, Navy, Beige
- 4 Images: One per color variant

**Collection Page Display:**
- 4 separate cards shown
- Each card shows different color image
- Each card labeled with color name
- Each card shows individual stock count

**Result:** Customer sees 4 distinct options and can choose their preferred color immediately

### Scenario 2: Wallet with No Color Variants

**Database:**
- 1 Product: "Minimalist Wallet"
- 0 Color variants (or no color specified)
- 1 Primary image

**Collection Page Display:**
- 1 single card shown
- Standard product display
- No color labels

**Result:** Normal product card behavior

### Scenario 3: Backpack with Mixed Variants

**Database:**
- 1 Product: "Travel Backpack"
- 3 Color variants: Black, Gray, Olive
- 2 Size options per color: Regular, Large
- Stock varies by color+size combination

**Collection Page Display:**
- 3 cards shown (one per color)
- Size selection happens on product detail page
- Stock shows lowest available for that color across sizes

**Result:** Colors are clearly visible, sizes selected after clicking

## Best Practices

### For Product Setup

1. **Color Variants:**
   - Always provide variant-specific images
   - Use consistent color naming
   - Set individual stock quantities
   - Mark inactive colors as `is_active = false`

2. **Product Images:**
   - Link images to specific variants via `variant_id`
   - Provide high-quality images
   - Use consistent aspect ratios
   - Set proper alt text for SEO

3. **Pricing:**
   - Use variant price if color affects price
   - Otherwise, use base product price
   - Show sale prices prominently

### For Category Management

1. **Collection Organization:**
   - Create clear category names (Tote Bag, Sling Bag, etc.)
   - Use SEO-friendly slugs (tote-bag, sling-bag, etc.)
   - Add category descriptions
   - Upload category banner images

2. **Product Assignment:**
   - Assign each product to correct category
   - Use category_id foreign key
   - Keep active products visible

## SEO Considerations

### Collection Pages
- Unique title per collection
- Meta descriptions with variant info
- OpenGraph images from collection
- Breadcrumb navigation
- Schema markup for products

### Product Detail Pages
- Include all variant info in metadata
- Alt text for all images
- Structured data for variants
- Color names in page title

## Performance Optimization

### Query Optimization
```typescript
// Fetch products with all related data in one query
.select(`
  *,
  category:categories(*),
  variants:product_variants(*),
  images:product_images(*)
`)
```

### Pagination
- Expand variants BEFORE pagination
- Paginate the expanded array
- Accurate counts for navigation

### Image Loading
- Use Next.js Image component
- Proper sizes attribute
- Priority loading for above-fold images
- Lazy loading for below-fold

## Troubleshooting

### Issue: Variant not showing
**Check:**
- Is variant.is_active = true?
- Does variant have a color value?
- Is product.is_active = true?
- Is category_id correct?

### Issue: Wrong image displaying
**Check:**
- Does image have correct variant_id?
- Is image.is_primary set correctly?
- Check image.order value
- Verify image URL is valid

### Issue: Stock count wrong
**Check:**
- variant.stock_quantity value
- Multiple size variants for same color
- Recent orders not reflected

## Future Enhancements

### Potential Improvements
1. **Variant Filtering:** Filter by specific colors
2. **Color Swatches:** Show color dots on main image
3. **Size Availability:** Show size options on hover
4. **Variant Comparison:** Compare variants side-by-side
5. **Recently Viewed:** Track variant-specific views
6. **Recommended Variants:** AI-powered color suggestions

## Conclusion

The variant expansion system provides:
- **Better UX:** Clear visibility of all options
- **Higher Sales:** Easier for customers to find what they want
- **Better Inventory:** Clear stock management per variant
- **Scalability:** Works for products with any number of variants

This approach transforms how customers browse your collections, making it easier to discover and purchase the exact product they want.
