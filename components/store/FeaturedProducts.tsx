'use client'

import { Product } from '@/types'
import { ProductCard } from './ProductCard'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  // Default placeholder products if none provided
  const defaultProducts: Partial<Product>[] = [
    {
      id: '1',
      name: 'Elegant Leather Tote',
      slug: 'elegant-leather-tote',
      brand: 'KIBANA',
      description: 'A spacious and versatile tote bag perfect for everyday use',
      short_description: 'Spacious and versatile',
      price: 12999,
      sale_price: null,
      category_id: '1',
      is_active: true,
      is_featured: true,
      stock_status: 'in_stock',
      images: [],
      variants: [],
    },
    {
      id: '2',
      name: 'Classic Crossbody Bag',
      slug: 'classic-crossbody-bag',
      brand: 'KIBANA',
      description: 'Hands-free convenience with timeless style',
      short_description: 'Hands-free convenience',
      price: 8999,
      sale_price: 7499,
      category_id: '2',
      is_active: true,
      is_featured: true,
      stock_status: 'in_stock',
      images: [],
      variants: [],
    },
    {
      id: '3',
      name: 'Luxury Evening Clutch',
      slug: 'luxury-evening-clutch',
      brand: 'KIBANA',
      description: 'Elegant evening essentials for special occasions',
      short_description: 'Elegant evening essentials',
      price: 5999,
      sale_price: null,
      category_id: '3',
      is_active: true,
      is_featured: true,
      stock_status: 'in_stock',
      images: [],
      variants: [],
    },
    {
      id: '4',
      name: 'Designer Shoulder Bag',
      slug: 'designer-shoulder-bag',
      brand: 'KIBANA',
      description: 'Classic and timeless designs for the modern woman',
      short_description: 'Classic and timeless',
      price: 14999,
      sale_price: null,
      category_id: '4',
      is_active: true,
      is_featured: true,
      stock_status: 'in_stock',
      images: [],
      variants: [],
    },
  ]

  const displayProducts = products.length > 0 ? products : (defaultProducts as Product[])

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
      </div>
    </section>
  )
}

