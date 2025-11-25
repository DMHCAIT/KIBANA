'use client'

import { Product } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { QuickViewModal } from './QuickViewModal'

interface ProductListItemProps {
  product: Product
}

export function ProductListItem({ product }: ProductListItemProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const price = product.sale_price || product.price
  const originalPrice = product.sale_price ? product.price : null
  
  // Generate slug if missing
  const productSlug = product.slug || product.id || `product-${product.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-black">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={`/products/${productSlug}`} className="shrink-0">
            <div className="relative w-full sm:w-48 h-48 overflow-hidden bg-gray-100">
              {primaryImage ? (
                <Image
                  src={primaryImage.image_url}
                  alt={primaryImage.alt_text || product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-300">{product.name.charAt(0)}</span>
                </div>
              )}
              {product.sale_price && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1">
                  SALE
                </div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 bg-white hover:bg-gray-100 border border-gray-200"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowQuickView(true)
                  }}
                >
                  <Eye className="h-4 w-4 text-gray-900" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 bg-white hover:bg-gray-100 border border-gray-200"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsWishlisted(!isWishlisted)
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-900'}`}
                  />
                </Button>
              </div>
            </div>
          </Link>

          <CardContent className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <Link href={`/products/${productSlug}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                    {product.category && (
                      <p className="text-xs text-muted-foreground mb-3">
                        {product.category.name}
                      </p>
                    )}
                  </div>
                </div>
                {product.short_description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.short_description}
                  </p>
                )}
              </Link>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold">₹{price.toLocaleString()}</span>
                {originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                )}
                {product.sale_price && (
                  <span className="text-sm font-semibold text-red-600">
                    {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  // Add to cart logic
                }}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowQuickView(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Quick View
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {showQuickView && (
        <QuickViewModal
          product={product}
          open={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  )
}

