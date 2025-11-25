'use client'

import { Product } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const price = product.sale_price || product.price
  const originalPrice = product.sale_price ? product.price : null
  const discount = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0
  
  // Generate slug if missing
  const productSlug = product.slug || product.id || `product-${product.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`

  return (
    <Card 
      className="group overflow-hidden border border-gray-200 hover:border-black transition-all duration-300 bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${productSlug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              fill
              className={`object-cover transition-all duration-700 ${
                isHovered ? 'scale-110 brightness-105' : 'scale-100'
              }`}
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 360px"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-6xl font-bold text-gray-300">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.sale_price && (
              <Badge className="bg-red-600 text-white border-0 px-2 py-1 text-xs">
                -{discount}%
              </Badge>
            )}
            {product.is_featured && (
              <Badge className="bg-black text-white border-0 px-2 py-1 text-xs">
                Featured
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 bg-white hover:bg-gray-100 border border-gray-200 transition-all"
              onClick={(e) => {
                e.preventDefault()
                setIsWishlisted(!isWishlisted)
              }}
            >
              <Heart
                className={`h-4 w-4 transition-all ${
                  isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-900'
                }`}
              />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 bg-white hover:bg-gray-100 border border-gray-200 transition-all"
              onClick={(e) => {
                e.preventDefault()
                window.open(`/products/${productSlug}`, '_blank')
              }}
            >
              <Eye className="h-4 w-4 text-gray-900" />
            </Button>
          </div>

          {/* Quick Add Button Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 bg-black/90 p-3 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Button
              className="w-full bg-white text-black hover:bg-gray-100 font-medium"
              onClick={(e) => {
                e.preventDefault()
                // Add to cart logic
              }}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4 bg-white">
        <Link href={`/products/${productSlug}`}>
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {product.brand || 'KIBANA'}
            </p>
            <h3 className="font-semibold text-base mb-2 line-clamp-2 hover:text-gray-600 transition-colors text-gray-900">
              {product.name}
            </h3>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">
              ₹{price.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </Link>

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-black hover:bg-gray-900 text-white transition-all duration-300 font-medium"
          onClick={() => {
            // Add to cart logic
          }}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}

