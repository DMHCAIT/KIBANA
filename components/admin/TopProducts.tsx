'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'

export function TopProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadTopProducts()
  }, [])

  const loadTopProducts = async () => {
    // Get top products by order count
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, quantity')

    const productCounts = (orderItems || []).reduce((acc: any, item: any) => {
      acc[item.product_id] = (acc[item.product_id] || 0) + item.quantity
      return acc
    }, {})

    const topProductIds = Object.entries(productCounts)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 5)
      .map(([id]) => id)

    if (topProductIds.length === 0) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*)
      `)
      .in('id', topProductIds)

    // Sort by count
    const sorted = (data || []).sort((a: any, b: any) => {
      const countA = productCounts[a.id] || 0
      const countB = productCounts[b.id] || 0
      return countB - countA
    })

    setProducts(sorted)
    setLoading(false)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No data available</p>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => {
              const image = product.images?.[0]
              return (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.slug || product.id}/edit`}
                  className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    {image && (
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                        <Image
                          src={image.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {product.is_featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

