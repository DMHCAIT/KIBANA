import { createClient } from '@/lib/supabase/server'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'
import { Metadata } from 'next'
import { Category } from '@/types'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Collections | KIBANA - Luxury Handbags',
  description: 'Browse our complete collection of luxury handbag collections',
}

export default async function CollectionsPage() {
  const supabase = await createClient()

  // Fetch banner for hero section
  let banner = null
  try {
    const bannerResult = await supabase
      .from('banners')
      .select('*')
      .eq('position', 'collections')
      .eq('is_active', true)
      .order('order', { ascending: true })
      .limit(1)
      .single()
    banner = bannerResult.data
  } catch (error) {
    console.warn('Error fetching collections banner:', error)
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  const displayCategories: Category[] = categories || []

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StoreHeader />
      <main className="flex-1 bg-white">
        {/* Hero Section with Small Banner */}
        {banner && (banner.image_url || banner.video_url) && (
          <section className="relative w-full h-[40vh] min-h-[300px] max-h-[400px] overflow-hidden bg-black">
            {banner.video_url ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={banner.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : banner.image_url ? (
              <div className="absolute inset-0">
                <Image
                  src={banner.image_url}
                  alt={banner.title || 'Collections'}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center px-4">
                {banner.title && (
                  <h1 className="font-hero text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight tracking-tight">
                    {banner.title}
                  </h1>
                )}
                {banner.subtitle && (
                  <p className="font-body text-base md:text-lg text-white/90 max-w-2xl mx-auto">
                    {banner.subtitle}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Intro Section */}
        {banner && (
          <section className="w-full bg-white py-12 md:py-16 lg:py-20">
            <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="font-hero text-3xl md:text-4xl lg:text-5xl mb-6 text-gray-900 leading-tight tracking-tight">
                  Explore Our Collections
                </h2>
                <p className="font-body text-base md:text-lg text-gray-600 leading-relaxed">
                  Each collection represents a unique expression of luxury, carefully curated to reflect timeless elegance and contemporary sophistication.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Collections Content */}
        <section className="w-full bg-white section-luxury">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            {!banner && (
              <div className="text-center mb-16 md:mb-20 lg:mb-24">
                <h1 className="font-hero text-4xl md:text-5xl lg:text-6xl mb-8 md:mb-10 text-gray-900 leading-tight tracking-tight">
                  Collections
                </h1>
                <p className="font-body text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover our curated collection of luxury handbags, organized by style and purpose
                </p>
              </div>
            )}

            {/* Collections Count */}
            {displayCategories.length > 0 && (
              <div className="mb-12 md:mb-16 text-center">
                <p className="font-body text-sm text-gray-500 uppercase tracking-wider">
                  {displayCategories.length} {displayCategories.length === 1 ? 'Collection' : 'Collections'}
                </p>
              </div>
            )}

            {/* Collections Grid */}
            {displayCategories.length === 0 ? (
              <div className="text-center py-16 md:py-24">
                <div className="max-w-md mx-auto">
                  <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="font-hero text-xl mb-2 text-gray-900">No Collections Yet</h3>
                  <p className="font-body text-gray-600 mb-6">
                    Add collections from the admin panel to display them here
                  </p>
                  <Button asChild>
                    <Link href="/admin/categories/new">Add Collections</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-12 max-w-7xl w-full">
                  {displayCategories.map((category: Category) => (
                    <Link key={category.id} href={`/categories/${category.slug || category.id}`}>
                      <Card className="group overflow-hidden cursor-pointer border-luxury border-gray-200 hover:border-gray-400 transition-all duration-300 bg-white h-full">
                        {/* Image Section */}
                        <div className="relative h-80 lg:h-96 overflow-hidden bg-gray-50">
                          {category.banner_image ? (
                            <Image
                              src={category.banner_image}
                              alt={category.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-8xl font-hero text-gray-200">
                                {category.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Content Section */}
                        <CardContent className="p-6 md:p-8 text-center">
                          <h3 className="font-menu text-base md:text-lg mb-3 text-gray-900 tracking-wide">
                            {category.name.toUpperCase()}
                          </h3>
                          {category.description && (
                            <p className="font-body text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                              {category.description}
                            </p>
                          )}
                          <div className="mt-6 pt-6 border-luxury border-t border-gray-100">
                            <Link 
                              href={`/categories/${category.slug || category.id}`}
                              className="font-menu text-xs text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider"
                            >
                              View Collection →
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <StoreFooter />
    </div>
  )
}

