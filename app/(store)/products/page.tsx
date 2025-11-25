import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/store/ProductGrid'
import { ProductFilters } from '@/components/store/ProductFilters'
import { ProductSort } from '@/components/store/ProductSort'
import { ProductViewToggle } from '@/components/store/ProductViewToggle'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import { Suspense } from 'react'
import { Metadata } from 'next'

interface ProductsPageProps {
  searchParams: {
    category?: string
    search?: string
    sort?: string
    page?: string
    min_price?: string
    max_price?: string
    brand?: string
    color?: string
    material?: string
    view?: 'grid' | 'list'
  }
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const categoryName = searchParams.category || 'All'
  const searchQuery = searchParams.search

  return {
    title: searchQuery 
      ? `Search Results for "${searchQuery}" | KIBANA`
      : `${categoryName} Handbags | KIBANA`,
    description: searchQuery
      ? `Find the perfect handbag matching "${searchQuery}"`
      : `Browse our complete collection of luxury handbags`,
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const supabase = await createClient()
  const page = parseInt(searchParams.page || '1')
  const limit = 24
  const offset = (page - 1) * limit

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `, { count: 'exact' })
    .eq('is_active', true)

  // Filter by category
  if (searchParams.category) {
    query = query.eq('category_id', searchParams.category)
  }

  // Search
  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%,brand.ilike.%${searchParams.search}%`)
  }


  // Brand filter
  if (searchParams.brand) {
    query = query.eq('brand', searchParams.brand)
  }

  // Note: Color and material filtering via variants would require a join
  // For now, we'll skip these filters if variants aren't directly accessible
  // This can be implemented with a proper join query if needed

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

  // Fetch unique brands for filter
  const { data: brandsData } = await supabase
    .from('products')
    .select('brand')
    .eq('is_active', true)
  
  const brands = Array.from(new Set(brandsData?.map((p: { brand: string }) => p.brand).filter(Boolean))) as string[]

  // Fetch unique colors from variants
  let colors: string[] = []
  try {
    const { data: variantsData } = await supabase
      .from('product_variants')
      .select('color')
      .not('color', 'is', null)
    
    colors = Array.from(new Set(variantsData?.map((v: { color: string }) => v.color).filter(Boolean))) as string[]
  } catch {
    // If variants table doesn't exist or query fails, use empty array
    colors = []
  }

  // Fetch unique materials from variants
  let materials: string[] = []
  try {
    const { data: materialsData } = await supabase
      .from('product_variants')
      .select('material')
      .not('material', 'is', null)
    
    materials = Array.from(new Set(materialsData?.map((v: { material: string }) => v.material).filter(Boolean))) as string[]
  } catch {
    // If variants table doesn't exist or query fails, use empty array
    materials = []
  }


  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          {searchParams.search ? (
            <>Search Results for &quot;{searchParams.search}&quot;</>
          ) : searchParams.category ? (
            categories?.find((c: { id: string; name: string }) => c.id === searchParams.category)?.name || 'Products'
          ) : (
            'All Products'
          )}
        </h1>
        <p className="text-muted-foreground">
          {count || 0} {count === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 shrink-0">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ProductFilters 
              categories={categories || []}
              brands={brands}
              colors={colors}
              materials={materials}
            />
          </Suspense>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <ProductSort />
            <ProductViewToggle />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
