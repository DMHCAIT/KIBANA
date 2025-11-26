import { createClient } from '@/lib/supabase/server'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import { ProductGrid } from '@/components/store/ProductGrid'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
    sort?: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const supabase = await createClient()
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  return {
    title: category?.name ? `${category.name} | KIBANA` : 'Category | KIBANA',
    description: category?.description || 'Browse our collection of luxury handbags',
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const supabase = await createClient()
  const page = parseInt(searchParams.page || '1')
  const limit = 24
  const offset = (page - 1) * limit

  // Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  // If category not found in database, check default categories
  const defaultCategories: Record<string, any> = {
    'tote-bags': { id: '1', name: 'Tote Bags', slug: 'tote-bags', description: 'Spacious and versatile handbags perfect for everyday use' },
    'crossbody-bags': { id: '2', name: 'Crossbody Bags', slug: 'crossbody-bags', description: 'Hands-free convenience with style' },
    'clutches': { id: '3', name: 'Clutches', slug: 'clutches', description: 'Elegant evening essentials' },
    'shoulder-bags': { id: '4', name: 'Shoulder Bags', slug: 'shoulder-bags', description: 'Classic and timeless designs' },
    'backpacks': { id: '5', name: 'Backpacks', slug: 'backpacks', description: 'Modern and practical for the active lifestyle' },
    'satchels': { id: '6', name: 'Satchels', slug: 'satchels', description: 'Professional and stylish for work' },
    'hobo-bags': { id: '7', name: 'Hobo Bags', slug: 'hobo-bags', description: 'Casual and comfortable designs' },
    'bucket-bags': { id: '8', name: 'Bucket Bags', slug: 'bucket-bags', description: 'Trendy and spacious options' },
  }

  const displayCategory = category || defaultCategories[params.slug]

  if (!displayCategory) {
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
    .eq('category_id', displayCategory.id)

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
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data: productsRaw } = await query

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

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StoreHeader />
      <main className="flex-1 bg-white">
        <div className="container px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-full border border-pink-100/50 shadow-sm">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">{displayCategory.name}</span>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                {displayCategory.name}
              </span>
            </h1>
            {displayCategory.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-4">
                {displayCategory.description}
              </p>
            )}
            <p className="text-gray-500 font-medium">
              {count || 0} {count === 1 ? 'product' : 'products'} found
            </p>
          </div>

          {/* Centered Products Grid */}
          <div className="flex justify-center">
            <div className="w-full max-w-7xl">
              <ProductGrid
                products={products || []}
                totalCount={count || 0}
                currentPage={page}
                limit={limit}
                view="grid"
              />
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

