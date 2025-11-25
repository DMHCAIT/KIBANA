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
    <section className="w-full bg-white section-luxury">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mb-12 md:mb-16 lg:mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-hero text-4xl md:text-5xl lg:text-6xl mb-6 md:mb-8 text-gray-900 leading-tight tracking-tight">
            Featured Collection
          </h2>
        </div>
        
        {displayProducts.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="font-hero text-xl mb-2 text-gray-900">No Featured Products Yet</h3>
              <p className="font-body text-gray-600 mb-6">
                Mark products as featured in the admin panel to display them here
              </p>
              <Button asChild>
                <Link href="/admin/products/new">Add Products</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Centered Grid for Desktop */}
            <div className="flex justify-center">
              <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-12 max-w-7xl w-full">
                {displayProducts.slice(0, 8).map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            {/* Horizontal Scroll for Mobile/Tablet */}
            <div className="lg:hidden">
              <div className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="flex gap-6 min-w-max">
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

