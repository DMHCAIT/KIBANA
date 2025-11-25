'use client'

import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const displayProducts = products || []

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-12 lg:mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 bg-black text-white text-xs font-bold tracking-wider uppercase rounded-full">
            <span>Featured</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900 leading-tight">
            Featured KIBANA Collection
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our most loved handbags and accessories
          </p>
        </div>
        
        {displayProducts.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No Featured Products Yet</h3>
              <p className="text-gray-600 mb-6">
                Mark products as featured in the admin panel to display them here
              </p>
              <Button asChild>
                <Link href="/admin/products/new">Add Products</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Responsive Grid for Desktop */}
            <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 max-w-7xl mx-auto">
              {displayProducts.slice(0, 8).map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Horizontal Scroll for Mobile/Tablet */}
            <div className="lg:hidden">
              <div className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="flex gap-4 md:gap-5 min-w-max">
                  {displayProducts.map((product) => (
                    <div key={product.id} className="w-[280px] sm:w-[320px] shrink-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

