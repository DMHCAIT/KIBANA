import { HeroSection } from '@/components/store/HeroSection'
import { FeaturedCategories } from '@/components/store/FeaturedCategories'
import { FeaturedProducts } from '@/components/store/FeaturedProducts'
import { Bestsellers } from '@/components/store/Bestsellers'
import { TestimonialsSection } from '@/components/store/TestimonialsSection'
import { NewsletterSection } from '@/components/store/NewsletterSection'
import { StorySection } from '@/components/store/StorySection'
import { createClient } from '@/lib/supabase/server'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'

export const metadata = {
  title: 'KIBANA - Luxury Handbags | Elegance Redefined',
  description: 'Discover our curated collection of luxury handbags, crafted for the modern woman who values style and sophistication.',
  openGraph: {
    title: 'KIBANA - Luxury Handbags',
    description: 'Discover our curated collection of luxury handbags',
    type: 'website',
  },
}

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch active banner for hero section (gracefully handle missing Supabase)
  let banner = null
  try {
    const bannerResult = await supabase
      .from('banners')
      .select('*')
      .eq('position', 'hero')
      .eq('is_active', true)
      .order('order', { ascending: true })
      .limit(1)
      .single()
    banner = bannerResult.data
  } catch (error) {
    console.warn('Error fetching banner:', error)
  }

  // Fetch featured categories
  let categories = []
  try {
    const categoriesResult = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })
      .limit(6)
    categories = categoriesResult.data || []
  } catch (error) {
    console.warn('Error fetching categories:', error)
  }

  // Fetch featured products
  let featuredProducts = []
  try {
    const featuredResult = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(8)
    featuredProducts = featuredResult.data || []
  } catch (error) {
    console.warn('Error fetching featured products:', error)
  }

  // Fetch bestsellers
  let bestsellers = []
  try {
    const bestsellersResult = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8)
    bestsellers = bestsellersResult.data || []
  } catch (error) {
    console.warn('Error fetching bestsellers:', error)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StoreHeader />
      <main className="flex-1 bg-white">
        <div className="space-y-0 bg-white">
          <HeroSection banner={banner || undefined} />
          <FeaturedCategories categories={categories} />
          <FeaturedProducts products={featuredProducts} />
          <Bestsellers products={bestsellers} />
          <StorySection />
          <TestimonialsSection />
          <NewsletterSection />
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
