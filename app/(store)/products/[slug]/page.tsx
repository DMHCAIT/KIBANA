import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/store/ProductDetail'
import { RelatedProducts } from '@/components/store/RelatedProducts'
import { AIPoweredRecommendations } from '@/components/store/AIPoweredRecommendations'
import { RecentlyViewed } from '@/components/store/RecentlyViewed'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import { Metadata } from 'next'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('name, description, images:product_images(image_url), brand')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    return {
      title: 'Product Not Found | KIBANA',
    }
  }

  const imageUrl = product.images?.[0]?.image_url

  return {
    title: `${product.name} | KIBANA`,
    description: product.description || product.name,
    openGraph: {
      title: product.name,
      description: product.description || product.name,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || product.name,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient()

  // Try to find by slug first, then by ID (for backward compatibility)
  let product = null
  
  // First try by slug
  const { data: productBySlug } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      images:product_images(*),
      specifications
    `)
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (productBySlug) {
    product = productBySlug
  } else {
    // If not found by slug, try by ID
    const { data: productById } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*),
        images:product_images(*),
        specifications
      `)
      .eq('id', params.slug)
      .eq('is_active', true)
      .single()
    
    if (productById) {
      product = productById
    }
  }

  if (!product) {
    console.error(`Product not found with slug/id: ${params.slug}`)
    notFound()
  }

  // Fetch related products (same category)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq('category_id', product.category_id)
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(8)

  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <div className="container px-4 py-8">
          <ProductDetail product={product} relatedProducts={relatedProducts || []} />
          
          {/* AI-Powered Recommendations */}
          <AIPoweredRecommendations productId={product.id} />
          
          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts} />
          )}
          
          {/* Recently Viewed */}
          <RecentlyViewed currentProductId={product.id} />
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
