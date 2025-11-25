import { createClient } from '@/lib/supabase/server'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import { Category } from '@/types'

export const metadata: Metadata = {
  title: 'Categories | KIBANA - Luxury Handbags',
  description: 'Browse our complete collection of luxury handbag categories',
}

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  // Default categories if none in database
  const defaultCategories = [
    { id: '1', name: 'Tote Bags', slug: 'tote-bags', description: 'Spacious and versatile handbags perfect for everyday use', banner_image: null },
    { id: '2', name: 'Crossbody Bags', slug: 'crossbody-bags', description: 'Hands-free convenience with style', banner_image: null },
    { id: '3', name: 'Clutches', slug: 'clutches', description: 'Elegant evening essentials', banner_image: null },
    { id: '4', name: 'Shoulder Bags', slug: 'shoulder-bags', description: 'Classic and timeless designs', banner_image: null },
    { id: '5', name: 'Backpacks', slug: 'backpacks', description: 'Modern and practical for the active lifestyle', banner_image: null },
    { id: '6', name: 'Satchels', slug: 'satchels', description: 'Professional and stylish for work', banner_image: null },
    { id: '7', name: 'Hobo Bags', slug: 'hobo-bags', description: 'Casual and comfortable designs', banner_image: null },
    { id: '8', name: 'Bucket Bags', slug: 'bucket-bags', description: 'Trendy and spacious options', banner_image: null },
  ]

  const displayCategories: (Category | { id: string; name: string; slug: string; description: string | null; banner_image: string | null })[] = (categories && categories.length > 0) ? categories : defaultCategories

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StoreHeader />
      <main className="flex-1 bg-white">
        <div className="container px-4 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-full border border-pink-100/50 shadow-sm">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Categories</span>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Shop by Category
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover our curated collection of luxury handbags, organized by style and purpose
            </p>
          </div>

          {/* Centered Categories Grid */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl">
              {displayCategories.map((category: Category | { id: string; name: string; slug: string; description: string | null; banner_image: string | null }) => (
                <Link key={category.id} href={`/categories/${category.slug || category.id}`}>
                  <Card className="group overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full bg-gradient-to-br from-white via-gray-50/30 to-white rounded-[2rem]">
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden rounded-t-[2rem] bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
                      {category.banner_image ? (
                        <Image
                          src={category.banner_image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent opacity-60 group-hover:opacity-100 transition-opacity">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Content Section */}
                    <CardContent className="p-6 bg-gradient-to-br from-white via-gray-50/30 to-white rounded-b-[2rem]">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-gray-900">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                        <span>Shop Now</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

