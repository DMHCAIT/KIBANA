'use client'

import { Product } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const price = product.sale_price || product.price
  const originalPrice = product.sale_price ? product.price : null
  const discount = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0
  
  // Generate slug if missing
  const productSlug = product.slug || product.id || `product-${product.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`

  // Check if product is wishlisted
  useEffect(() => {
    const checkWishlist = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check database for logged-in users
        const { data } = await supabase
          .from('wishlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .single()
        setIsWishlisted(!!data)
      } else {
        // Check localStorage for guest users
        const wishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]')
        setIsWishlisted(wishlist.includes(product.id))
      }
    }
    checkWishlist()
  }, [product.id, supabase])

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    // For logged-in users, use database
    if (user) {
      if (isWishlisted) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id)

        if (!error) {
          setIsWishlisted(false)
          toast.success('Removed from wishlist')
        } else {
          toast.error('Failed to remove from wishlist')
        }
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: product.id,
          })

        if (!error) {
          setIsWishlisted(true)
          toast.success('Added to wishlist')
        } else {
          toast.error('Failed to add to wishlist')
        }
      }
    } else {
      // For guest users, use localStorage
      const wishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]')
      
      if (isWishlisted) {
        const updatedWishlist = wishlist.filter((id: string) => id !== product.id)
        localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist))
        setIsWishlisted(false)
        toast.success('Removed from wishlist')
      } else {
        wishlist.push(product.id)
        localStorage.setItem('guestWishlist', JSON.stringify(wishlist))
        setIsWishlisted(true)
        toast.success('Added to wishlist')
      }
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setAddingToCart(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    try {
      const selectedVariant = product.variants?.[0] || null
      
      // For logged-in users, use database
      if (user) {
        const { error } = await supabase
          .from('cart')
          .upsert({
            user_id: user.id,
            product_id: product.id,
            variant_id: selectedVariant?.id || null,
            quantity: 1,
          }, {
            onConflict: 'user_id,product_id,variant_id'
          })

        if (error) throw error
        toast.success('Added to cart')
        router.refresh()
      } else {
        // For guest users, use localStorage
        const cart = JSON.parse(localStorage.getItem('guestCart') || '[]')
        const existingItemIndex = cart.findIndex((item: any) => 
          item.product_id === product.id && item.variant_id === selectedVariant?.id
        )
        
        if (existingItemIndex >= 0) {
          cart[existingItemIndex].quantity += 1
        } else {
          cart.push({
            product_id: product.id,
            variant_id: selectedVariant?.id || null,
            quantity: 1,
            product: product // Store product data for guest cart display
          })
        }
        
        localStorage.setItem('guestCart', JSON.stringify(cart))
        toast.success('Added to cart')
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error)
      toast.error(error.message || 'Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

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
              onClick={handleWishlist}
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
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {addingToCart ? 'Adding...' : 'Quick Add'}
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
          onClick={handleAddToCart}
          disabled={addingToCart}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  )
}

