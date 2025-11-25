'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { createClient } from '@/lib/supabase/client'

interface RecentlyViewedProps {
  currentProductId: string
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const [products, setProducts] = useState<Product[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Get recently viewed from localStorage
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
    const filtered = viewed
      .filter((id: string) => id !== currentProductId)
      .slice(0, 4)

    if (filtered.length === 0) return

    // Fetch products
    Promise.all(
      filtered.map((id: string) =>
        supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            images:product_images(*)
          `)
          .eq('id', id)
          .eq('is_active', true)
          .single()
      )
    ).then(results => {
      const products = results
        .map(r => r.data)
        .filter(Boolean) as Product[]
      setProducts(products)
    })

    // Add current product to recently viewed
    const updated = [currentProductId, ...viewed.filter((id: string) => id !== currentProductId)]
    localStorage.setItem('recentlyViewed', JSON.stringify(updated.slice(0, 10)))
  }, [currentProductId, supabase])

  if (products.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

