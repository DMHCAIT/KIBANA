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
    <section className="w-full py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="inline-block mb-3 px-3 py-1 bg-black text-white text-xs font-medium tracking-wider uppercase rounded-full">
            <span>Featured</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Featured Collection
          </h2>
          <p className="text-base text-gray-600 max-w-2xl">
            Handpicked selections from our latest collection
          </p>
        </div>
        
        {/* Centered Horizontal Scrollable Cards */}
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="flex gap-6 lg:gap-8 min-w-max justify-center">
                {displayProducts.map((product) => (
                  <div key={product.id} className="w-[280px] sm:w-[320px] lg:w-[360px] shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

