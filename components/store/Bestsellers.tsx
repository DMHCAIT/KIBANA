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
          {/* Responsive Grid - 2 columns on mobile, 2x2 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {displayProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* View All Button */}
          {displayProducts.length > 4 && (
            <div className="mt-8 md:mt-12 text-center">
              <Button asChild variant="outline" className="px-8 py-6 text-base">
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          )}
        </>
      )}
      </div>
    </section>
  )
}

