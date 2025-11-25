'use client'

import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface BestsellersProps {
  products: Product[]
}

export function Bestsellers({ products }: BestsellersProps) {
  // Default placeholder products if none provided
  const defaultProducts: Partial<Product>[] = [
    {
      id: '1',
      name: 'Premium Leather Handbag',
      slug: 'premium-leather-handbag',
      brand: 'KIBANA',
      description: 'Premium quality leather handbag with elegant design',
      short_description: 'Premium quality',
      price: 17999,
      sale_price: 14999,
      category_id: '1',
      is_active: true,
      is_featured: true,
      stock_status: 'in_stock',
      images: [],
      variants: [],
    },
    {
      id: '2',
      name: 'Stylish Tote Bag',
      slug: 'stylish-tote-bag',
      brand: 'KIBANA',
      description: 'A stylish and spacious tote bag for everyday elegance',
      short_description: 'Stylish and spacious',
      price: 11999,
      sale_price: null,
      category_id: '1',
      is_active: true,
      is_featured: true,
      stock_status: 'in_stock',
      images: [],
      variants: [],
    },
    {
      id: '3',
      name: 'Chic Crossbody',
      slug: 'chic-crossbody',
      brand: 'KIBANA',
      description: 'Chic and modern crossbody bag for the fashion-forward',
      short_description: 'Chic and modern',
      price: 9999,
      sale_price: 8499,
      category_id: '2',
      is_active: true,
      is_featured: true,
      stock_status: 'in_stock',
      images: [],
      variants: [],
    },
    {
      id: '4',
      name: 'Luxury Satchel',
      slug: 'luxury-satchel',
      brand: 'KIBANA',
      description: 'Professional and stylish satchel for work and travel',
      short_description: 'Professional and stylish',
      price: 19999,
      sale_price: null,
      category_id: '6',
      is_active: true,
      is_featured: true,
      stock_status: 'in_stock',
      images: [],
      variants: [],
    },
  ]

  const displayProducts = products.length > 0 ? products : (defaultProducts as Product[])

  return (
    <section className="container px-4 py-16 bg-white border-t border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <div className="inline-block mb-3 px-3 py-1 bg-black text-white text-xs font-medium tracking-wider uppercase rounded-full">
            <span>Bestsellers</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Bestsellers
          </h2>
          <p className="text-base text-gray-600">
            Our most loved handbags, chosen by thousands of satisfied customers
          </p>
        </div>
        <Button 
          variant="outline" 
          className="px-6 border-2 border-black hover:bg-black hover:text-white transition-all duration-300"
          asChild
        >
          <Link href="/products?sort=bestsellers">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
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
    </section>
  )
}

