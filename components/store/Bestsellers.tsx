'use client'

import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag } from 'lucide-react'

interface BestsellersProps {
  products: Product[]
}

export function Bestsellers({ products }: BestsellersProps) {
  const displayProducts = products || []

  return (
    <section className="container px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 lg:mb-16 gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 bg-black text-white text-xs font-bold tracking-wider uppercase rounded-full">
            <span>Bestsellers</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900 leading-tight">
            Bestsellers
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Our most loved handbags, chosen by thousands of satisfied customers
          </p>
        </div>
        <Button 
          variant="outline" 
          size="lg"
          className="px-6 md:px-8 py-6 border-2 border-black hover:bg-black hover:text-white transition-all duration-300 rounded-none"
          asChild
        >
          <Link href="/products?sort=bestsellers" className="flex items-center">
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
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
    </section>
  )
}

