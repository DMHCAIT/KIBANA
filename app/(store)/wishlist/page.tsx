'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag, Trash2, Share2, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { EmptyWishlist } from '@/components/store/EmptyWishlist'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'in_stock' | 'on_sale'>('all')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const loadWishlist = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?redirect=/wishlist')
        return
      }

      const { data } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:products(
            *,
            category:categories(*),
            images:product_images(*),
            variants:product_variants(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        const products = data.map((item: { product: Product }) => item.product).filter(Boolean)
        setWishlistItems(products)
      }
      setLoading(false)
    }
    loadWishlist()
  }, [router, supabase])

  const removeFromWishlist = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (!error) {
      setWishlistItems(items => items.filter(item => item.id !== productId))
      toast.success('Removed from wishlist')
    }
  }

  const addToCart = async (product: Product) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login?redirect=/wishlist')
      return
    }

    const { error } = await supabase
      .from('cart')
      .upsert({
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
      })

    if (!error) {
      toast.success('Added to cart')
    } else {
      toast.error('Failed to add to cart')
    }
  }

  const shareWishlist = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My KIBANA Wishlist',
          text: 'Check out my favorite handbags!',
          url,
        })
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Wishlist link copied to clipboard')
    }
  }

  const filteredItems = wishlistItems.filter(item => {
    if (filter === 'in_stock') {
      return item.stock_status === 'in_stock'
    }
    if (filter === 'on_sale') {
      return !!item.sale_price
    }
    return true
  })

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StoreHeader />
      <main className="flex-1">
        <div className="container px-4 py-12">
          <div className="mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-black text-white text-xs font-medium tracking-wider uppercase rounded-full">
              <span>My Wishlist</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900">
              My Wishlist
            </h1>
            <p className="text-base text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
        {wishlistItems.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={shareWishlist}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Wishlist
            </Button>
          </div>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <>
          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({wishlistItems.length})
            </Button>
            <Button
              variant={filter === 'in_stock' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('in_stock')}
            >
              In Stock ({wishlistItems.filter(i => i.stock_status === 'in_stock').length})
            </Button>
            <Button
              variant={filter === 'on_sale' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('on_sale')}
            >
              On Sale ({wishlistItems.filter(i => i.sale_price).length})
            </Button>
          </div>

          {/* Wishlist Grid */}
          <AnimatePresence mode="wait">
            {filteredItems.length === 0 ? (
              <motion.div
                key="empty-filtered"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  No items match your filter criteria
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="wishlist-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredItems.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <WishlistCard
                      product={product}
                      onRemove={() => removeFromWishlist(product.id)}
                      onAddToCart={() => addToCart(product)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions */}
          {filteredItems.length > 0 && (
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    filteredItems.forEach(product => {
                      if (product.stock_status === 'in_stock') {
                        addToCart(product)
                      }
                    })
                    toast.success('Added all in-stock items to cart')
                  }}
                >
                  Add All In-Stock to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    filteredItems.forEach(product => removeFromWishlist(product.id))
                    toast.success('Cleared wishlist')
                  }}
                >
                  Clear Wishlist
                </Button>
              </div>
            </div>
          )}
        </>
      )}
        </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

interface WishlistCardProps {
  product: Product
  onRemove: () => void
  onAddToCart: () => void
}

function WishlistCard({ product, onRemove, onAddToCart }: WishlistCardProps) {
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const price = product.sale_price || product.price
  const originalPrice = product.sale_price ? product.price : null
  const isInStock = product.stock_status === 'in_stock'

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 relative">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-6xl font-bold text-gray-300">{product.name.charAt(0)}</span>
            </div>
          )}
          {product.sale_price && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white">
              SALE
            </Badge>
          )}
          {!isInStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <Link href={`/products/${product.slug}`} className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1 line-clamp-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => {
              e.preventDefault()
              onRemove()
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold">₹{price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              onAddToCart()
            }}
            disabled={!isInStock}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              window.open(`/products/${product.slug}`, '_blank')
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

