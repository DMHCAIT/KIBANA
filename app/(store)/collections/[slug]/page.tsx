import { createClient } from '@/lib/supabase/server'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import { ProductGrid } from '@/components/store/ProductGrid'
import { ProductFilters } from '@/components/store/ProductFilters'
import { ProductSort } from '@/components/store/ProductSort'
import { ProductViewToggle } from '@/components/store/ProductViewToggle'
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
  
  // Try by slug first
  let category = null
  const { data: categoryBySlug } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', params.slug)
    .single()

  if (categoryBySlug) {
    category = categoryBySlug
  } else {
    // Try by ID
    const { data: categoryById } = await supabase
      .from('categories')
      .select('name, description')
      .eq('id', params.slug)
      .single()
    
    if (categoryById) {
      category = categoryById
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

  // Fetch category - try by slug first, then by ID
  let category = null
  
  // First try by slug
  const { data: categoryBySlug } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (categoryBySlug) {
    category = categoryBySlug
  } else {
    // If not found by slug, try by ID
    const { data: categoryById } = await supabase
      .from('categories')
      .select('*')
      .eq('id', params.slug)
      .single()
    
    if (categoryById) {
      category = categoryById
    }
  }

  if (!category || !category.is_active) {
    console.error(`Category not found with slug/id: ${params.slug}`)
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
    .eq('category_id', category.id)

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

  const { data: products, count, error } = await query
    .range(offset, offset + limit - 1)

  // Fetch categories for filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  // Fetch unique brands
  const { data: brandsData } = await supabase
    .from('products')
    .select('brand')
    .eq('is_active', true)
    .eq('category_id', category.id)
  
  const brands = Array.from(new Set(brandsData?.map((p: { brand: string }) => p.brand).filter(Boolean))) as string[]

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
              <p className="font-body text-sm text-gray-500 mt-2">
                {count || 0} {count === 1 ? 'product' : 'products'}
              </p>
            </div>
          )}

          {heroImage && (
            <div className="mb-8 text-center">
              <p className="font-body text-sm text-gray-500">
                {count || 0} {count === 1 ? 'product' : 'products'}
              </p>
            </div>
          )}

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

