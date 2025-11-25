'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface AIPoweredRecommendationsProps {
  productId: string
}

export function AIPoweredRecommendations({ productId }: AIPoweredRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch AI recommendations
    fetch('/api/ai/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [productId])

  if (loading || products.length === 0) return null

  return (
    <section className="mt-16">
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-black" />
            <CardTitle>AI-Powered Recommendations</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Handpicked just for you based on your preferences
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

