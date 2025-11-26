import { createClient } from '@/lib/supabase/server'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import { ProductGrid } from '@/components/store/ProductGrid'
import { ProductFilters } from '@/components/store/ProductFilters'
import { ProductSort } from '@/components/store/ProductSort'
import { ProductViewToggle } from '@/components/store/ProductViewToggle'
import { Breadcrumbs } from '@/components/store/Breadcrumbs'
import { CollectionHighlights } from '@/components/store/CollectionHighlights'
import { RelatedCollections } from '@/components/store/RelatedCollections'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

interface CollectionPageProps {
  params: {
    slug: string
  }
  searchParams: {
    sort?: string
    page?: string
    view?: 'grid' | 'list'
  }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const supabase = await createClient()
  
  // Try to find category with same logic as main page
  const normalizedSlug = params.slug.toLowerCase().trim()
  let category = null
  
  const { data: categoryBySlug } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (categoryBySlug) {
    category = categoryBySlug
  } else {
    const { data: allCategories } = await supabase
      .from('categories')
      .select('name, description')
      .eq('is_active', true)
    
    if (allCategories) {
      const matched = allCategories.find(
        (cat: { name: string | null; description: string | null }) => cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === normalizedSlug
      ) || allCategories.find((cat: { name: string | null; description: string | null }) => cat.name?.toLowerCase().includes(normalizedSlug))
      
      if (matched) {
        category = matched
      }
    }
  }

  return {
    title: category ? `${category.name} | KIBANA Collections` : 'Collection | KIBANA',
    description: category?.description || 'Browse our luxury handbag collection',
  }
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const supabase = await createClient()
  const page = parseInt(searchParams.page || '1')
  const limit = 24
  const offset = (page - 1) * limit

  // Fetch category - try multiple methods
  let category = null
  
  // Normalize the slug for matching
  const normalizedSlug = params.slug.toLowerCase().trim()
  
  // Method 1: Try exact slug match
  const { data: categoryBySlug } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (categoryBySlug) {
    category = categoryBySlug
  } else {
    // Method 2: Try case-insensitive slug match
    const { data: allCategories } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
    
    if (allCategories) {
      const matchedCategory = allCategories.find(
        (cat: any) => cat.slug?.toLowerCase() === normalizedSlug
      )
      if (matchedCategory) {
        category = matchedCategory
      } else {
        // Method 3: Try matching by name (normalized)
        const matchedByName = allCategories.find((cat: any) => {
          const normalizedName = cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          return normalizedName === normalizedSlug || normalizedName?.includes(normalizedSlug) || normalizedSlug.includes(normalizedName)
        })
        if (matchedByName) {
          category = matchedByName
        } else {
          // Method 4: Try by ID
          const { data: categoryById } = await supabase
            .from('categories')
            .select('*')
            .eq('id', params.slug)
            .eq('is_active', true)
            .maybeSingle()
          
          if (categoryById) {
            category = categoryById
          }
        }
      }
    }
  }

  if (!category) {
    console.error(`Category not found with slug/id: ${params.slug}`)
    console.error('Tried methods: exact slug, case-insensitive slug, name matching, ID matching')
    notFound()
  }

  // Fetch products in this category
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `, { count: 'exact' })
    .eq('is_active', true)
  
  // Only filter by category_id if we have a valid category
  if (category?.id) {
    query = query.eq('category_id', category.id)
  } else {
    // If category not found, try to find products by category name match
    const { data: allCategories } = await supabase
      .from('categories')
      .select('id, name')
      .eq('is_active', true)
    
    if (allCategories) {
      const matchedCategory = allCategories.find((cat: any) => {
        const normalizedName = cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        return normalizedName === normalizedSlug || normalizedName?.includes(normalizedSlug)
      })
      
      if (matchedCategory) {
        query = query.eq('category_id', matchedCategory.id)
        // Update category object
        const { data: fullCategory } = await supabase
          .from('categories')
          .select('*')
          .eq('id', matchedCategory.id)
          .single()
        if (fullCategory) {
          category = fullCategory
        }
      }
    }
  }

  // Sort
  switch (searchParams.sort) {
    case 'price-low':
      query = query.order('price', { ascending: true })
      break
    case 'price-high':
      query = query.order('price', { ascending: false })
      break
    case 'name-asc':
      query = query.order('name', { ascending: true })
      break
    case 'name-desc':
      query = query.order('name', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'featured':
      query = query.eq('is_featured', true).order('created_at', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data: productsRaw, error } = await query

  // Transform products to show each color variant as a separate item
  const productsExpanded: any[] = []
  if (productsRaw) {
    for (const product of productsRaw) {
      const colorVariants = product.variants?.filter((v: any) => v.color && v.is_active) || []
      
      if (colorVariants.length > 0) {
        // Create a card for each color variant
        for (const variant of colorVariants) {
          // Find the image for this specific variant
          const variantImage = product.images?.find((img: any) => img.variant_id === variant.id)
          productsExpanded.push({
            ...product,
            _displayVariant: variant,
            _displayVariantImage: variantImage,
            _isVariantCard: true,
          })
        }
      } else {
        // No color variants, show the product as is
        productsExpanded.push(product)
      }
    }
  }

  // Paginate the expanded products
  const products = productsExpanded.slice(offset, offset + limit)
  const count = productsExpanded.length

  // Fetch categories for filter and related collections
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  // Fetch unique brands
  let brands: string[] = []
  
  if (category?.id) {
    const { data: brandsData } = await supabase
      .from('products')
      .select('brand')
      .eq('is_active', true)
      .eq('category_id', category.id)
    
    brands = Array.from(new Set(brandsData?.map((p: { brand: string }) => p.brand).filter(Boolean))) as string[]
  } else if (products && products.length > 0) {
    // Extract brands from products if category not found
    brands = Array.from(new Set(products.map((p: any) => p.brand).filter(Boolean))) as string[]
  }

  // Calculate collection stats
  let featuredCount = 0
  let avgPrice = 0
  let topBrand = ''
  
  if (category?.id) {
    // Get featured count
    const { count: featCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('category_id', category.id)
      .eq('is_featured', true)
    
    featuredCount = featCount || 0

    // Calculate average price
    if (products && products.length > 0) {
      const prices = products.map((p: any) => p.sale_price || p.price).filter(Boolean)
      if (prices.length > 0) {
        avgPrice = prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length
      }
    }

    // Get top brand
    if (brands.length > 0) {
      topBrand = brands[0] // Could enhance this to actually count occurrences
    }
  }

  // Get category image for hero
  const getCategoryImage = (categoryName: string, bannerImage?: string | null): string => {
    if (bannerImage) return bannerImage
    
    const categoryImageMap: Record<string, string> = {
      'Backpack': '/BACKPACK.jpg',
      'backpack': '/BACKPACK.jpg',
      'Clutch': '/CLUTCH.jpg',
      'clutch': '/CLUTCH.jpg',
      'Laptop Bag': '/LAPTOP%20BAG.jpg',
      'laptop bag': '/LAPTOP%20BAG.jpg',
      'Sling Bag': '/SLING%20BAG.jpg',
      'sling bag': '/SLING%20BAG.jpg',
      'Tote Bag': '/TOTE%20BAG.jpg',
      'tote bag': '/TOTE%20BAG.jpg',
      'Wallet': '/WALLET.jpg',
      'wallet': '/WALLET.jpg',
    }
    
    if (categoryImageMap[categoryName]) {
      return categoryImageMap[categoryName]
    }
    
    const lowerName = categoryName.toLowerCase()
    for (const [key, value] of Object.entries(categoryImageMap)) {
      if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
        return value
      }
    }
    
    return ''
  }

  const heroImage = getCategoryImage(category.name, category.banner_image)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StoreHeader />
      <main className="flex-1">
        {/* Hero Section 16:4 Aspect Ratio */}
        {heroImage && (
          <section className="relative w-full overflow-hidden bg-black">
            <div className="relative w-full" style={{ aspectRatio: '16/4' }}>
              <Image
                src={heroImage}
                alt={category.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                  <h1 className="font-hero text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight tracking-tight">
                    {category.name}
                  </h1>
                  {category.description && (
                    <p className="font-body text-base md:text-lg text-white/90 max-w-2xl mx-auto">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="container px-4 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            category={category} 
            collectionMode={true}
          />

          {/* Header (if no hero) */}
          {!heroImage && (
            <div className="mb-8">
              <h1 className="font-hero text-4xl md:text-5xl lg:text-6xl mb-2 text-gray-900 leading-tight tracking-tight">
                {category.name}
              </h1>
              {category.description && (
                <p className="font-body text-base md:text-lg text-gray-600 max-w-3xl">
                  {category.description}
                </p>
              )}
            </div>
          )}

          {/* Collection Highlights */}
          <CollectionHighlights
            totalProducts={count || 0}
            featuredCount={featuredCount}
            avgPrice={avgPrice}
            topBrand={topBrand}
          />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 shrink-0">
              <Suspense fallback={<div>Loading filters...</div>}>
                <ProductFilters 
                  categories={categories || []}
                  brands={brands}
                  colors={[]}
                  materials={[]}
                />
              </Suspense>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <Suspense fallback={<div className="h-10 w-[180px] bg-muted animate-pulse rounded" />}>
                  <ProductSort />
                </Suspense>
                <Suspense fallback={<div className="h-10 w-20 bg-muted animate-pulse rounded" />}>
                  <ProductViewToggle />
                </Suspense>
              </div>

              {/* Products Grid */}
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid
                  products={products || []}
                  totalCount={count || 0}
                  currentPage={page}
                  limit={limit}
                  view={searchParams.view || 'grid'}
                  error={error}
                />
              </Suspense>
            </div>
          </div>

          {/* Related Collections */}
          {categories && categories.length > 0 && (
            <RelatedCollections 
              collections={categories}
              currentCollectionId={category.id}
            />
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-muted rounded-lg mb-4" />
          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

