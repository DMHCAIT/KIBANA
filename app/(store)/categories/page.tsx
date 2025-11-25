import { createClient } from '@/lib/supabase/server'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { Metadata } from 'next'
import { Category } from '@/types'
import { Button } from '@/components/ui/button'

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

  const displayCategories: Category[] = categories || []

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StoreHeader />
      <main className="flex-1 bg-white">
        <div className="container px-4 py-16 md:py-24 lg:py-32">
          <div className="text-center mb-16 md:mb-20 lg:mb-24">
            <h1 className="font-hero text-4xl md:text-5xl lg:text-6xl mb-8 md:mb-10 text-gray-900 leading-tight tracking-tight">
              Shop by Category
            </h1>
          </div>

          {/* Centered Categories Grid */}
          {displayCategories.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <div className="max-w-md mx-auto">
                <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-hero text-xl mb-2 text-gray-900">No Categories Yet</h3>
                <p className="font-body text-gray-600 mb-6">
                  Add categories from the admin panel to display them here
                </p>
                <Button asChild>
                  <Link href="/admin/categories/new">Add Categories</Link>
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
                        <h3 className="font-menu text-base md:text-lg mb-2 text-gray-900 tracking-wide">
                          {category.name.toUpperCase()}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

