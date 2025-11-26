'use client'

import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

interface BestsellersProps {
  products: Product[]
}

export function Bestsellers({ products }: BestsellersProps) {
  const displayProducts = products || []

  return (
    <section className="w-full bg-white section-luxury">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mb-12 md:mb-16 lg:mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-hero text-4xl md:text-5xl lg:text-6xl mb-6 md:mb-8 text-gray-900 leading-tight tracking-tight">
            Bestsellers
          </h2>
        </div>

      {displayProducts.length === 0 ? (
        <div className="text-center py-16 md:py-24">
          <div className="max-w-md mx-auto">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No Bestsellers Yet</h3>
            <p className="text-gray-600 mb-6">
              Products will appear here once orders are placed
            </p>
            <Button asChild>
              <Link href="/admin/products/new">Add Products</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Centered Grid for Desktop - 2x2 Grid */}
          <div className="flex justify-center">
            <div className="hidden lg:grid grid-cols-2 gap-8 xl:gap-12 max-w-4xl w-full">
              {displayProducts.slice(0, 4).map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal Scroll for Mobile/Tablet */}
          <div className="lg:hidden">
            <div 
              className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 scroll-smooth touch-pan-x"
              style={{ 
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              onTouchStart={(e) => {
                const container = e.currentTarget
                const touch = e.touches[0]
                const startX = touch.clientX
                const startScrollLeft = container.scrollLeft
                
                const handleTouchMove = (e: TouchEvent) => {
                  const touch = e.touches[0]
                  const diffX = startX - touch.clientX
                  container.scrollLeft = startScrollLeft + diffX
                }
                
                const handleTouchEnd = () => {
                  document.removeEventListener('touchmove', handleTouchMove)
                  document.removeEventListener('touchend', handleTouchEnd)
                }
                
                document.addEventListener('touchmove', handleTouchMove, { passive: false })
                document.addEventListener('touchend', handleTouchEnd)
              }}
            >
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

