'use client'

import { Product } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Heart, Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface QuickViewModalProps {
  product: Product
  open: boolean
  onClose: () => void
}

export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const images = product.images || []
  const price = product.sale_price || product.price
  const originalPrice = product.sale_price ? product.price : null
  
  // Generate slug if missing
  const productSlug = product.slug || product.id || `product-${product.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`

  const handleAddToCart = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Redirect to login or show login modal
      return
    }

    // Add to cart logic
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Quick View: {product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              {images[selectedImage] && (
                <Image
                  src={images[selectedImage].image_url}
                  alt={images[selectedImage].alt_text || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              {product.category && (
                <p className="text-sm text-muted-foreground">
                  Category: {product.category.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">₹{price.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {product.short_description && (
              <p className="text-muted-foreground">{product.short_description}</p>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                />
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href={`/products/${productSlug}`} onClick={onClose}>
                View Full Details
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

