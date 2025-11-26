'use client'

import { Product } from '@/types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag, Minus, Plus, Share2, Maximize2, Star, Check, AlertCircle, Truck, Shield, RotateCcw } from 'lucide-react'
import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ImageZoom } from './ImageZoom'
import { FullscreenGallery } from './FullscreenGallery'
import { ProductReviews } from './ProductReviews'
import { Breadcrumbs } from './Breadcrumbs'

interface ProductDetailProps {
  product: Product
  relatedProducts?: Product[]
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number } | null>(null)
  const [activeTab, setActiveTab] = useState('description')
  const [addingToCart, setAddingToCart] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  const images = product.images || []
  const price = selectedVariant?.price || product.sale_price || product.price
  const originalPrice = product.sale_price ? product.price : null
  const discount = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0

  // Get unique colors and sizes
  const colors = Array.from(new Set(product.variants?.map(v => v.color).filter(Boolean) || []))
  const sizes = Array.from(new Set(product.variants?.map(v => v.size).filter(Boolean) || []))
  const materials = Array.from(new Set(product.variants?.map(v => v.material).filter(Boolean) || []))

  // Handle image zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setZoomPosition(null)
  }

  const handleAddToCart = async () => {
    setAddingToCart(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      const productSlug = product.slug || product.id || 'unknown'
      router.push('/login?redirect=/products/' + productSlug)
      return
    }

    try {
      const { error } = await supabase
        .from('cart')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          variant_id: selectedVariant?.id || null,
          quantity: quantity,
        }, {
          onConflict: 'user_id,product_id,variant_id'
        })

      if (error) throw error

      // Show success notification
      router.refresh()
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlist = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      const productSlug = product.slug || product.id || 'unknown'
      router.push('/login?redirect=/products/' + productSlug)
      return
    }

    if (isWishlisted) {
      await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', product.id)
    } else {
      await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: product.id,
        })
    }
    setIsWishlisted(!isWishlisted)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.short_description || product.description || '',
          url: window.location.href,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const isInStock = selectedVariant 
    ? selectedVariant.stock_quantity > 0
    : product.stock_status === 'in_stock'

  return (
    <div className="space-y-12">
      <Breadcrumbs 
        category={product.category}
        productName={product.name}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Images Section */}
        <div className="space-y-4">
          {/* Main Image with Zoom */}
          <div
            ref={imageRef}
            className="relative aspect-square overflow-hidden bg-gray-50 cursor-zoom-in group border border-gray-200"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setShowFullscreen(true)}
          >
            {images[selectedImage] && (
              <>
                <Image
                  src={images[selectedImage].image_url}
                  alt={images[selectedImage].alt_text || product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {zoomPosition && (
                  <ImageZoom
                    imageUrl={images[selectedImage].image_url}
                    position={zoomPosition}
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowFullscreen(true)
                  }}
                >
                  <Maximize2 className="h-5 w-5" />
                </Button>
              </>
            )}
            {product.sale_price && (
              <Badge className="absolute top-4 left-4 bg-red-600 text-white border-0 text-sm px-3 py-1">
                -{discount}% OFF
              </Badge>
            )}
            {product.is_featured && !product.sale_price && (
              <Badge className="absolute top-4 left-4 bg-black text-white border-0 text-sm px-3 py-1">
                Featured
              </Badge>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-primary ring-4 ring-primary/20 scale-105 shadow-lg' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:scale-105'
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-primary/10" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <p className="text-sm text-center text-muted-foreground">
              Image {selectedImage + 1} of {images.length}
            </p>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          {/* Brand & Category */}
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-3">
              {product.brand || 'KIBANA'}
            </p>
            {product.category && (
              <Badge variant="outline" className="mb-4 text-xs px-3 py-1 border-gray-300">
                {product.category.name}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            {product.name}
          </h1>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">4.8</span>
            <span className="text-sm text-muted-foreground">(24 reviews)</span>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Verified Purchase</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 py-4">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">
              ₹{price.toLocaleString()}
            </span>
            {originalPrice && (
              <>
                <span className="text-3xl text-muted-foreground line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
                <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 text-sm px-3 py-1">
                  Save ₹{(originalPrice - price).toLocaleString()}
                </Badge>
              </>
            )}
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.short_description}
            </p>
          )}

          <Separator />

          {/* Variants */}
          {colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Available Colors</h3>
                <span className="text-sm text-muted-foreground font-medium">
                  {selectedVariant?.color || 'Select a color'}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => {
                  const variant = product.variants?.find(v => v.color === color)
                  const variantImage = variant 
                    ? images.find(img => img.variant_id === variant.id)
                    : null
                  const isAvailable = variant?.stock_quantity ? variant.stock_quantity > 0 : false
                  
                  return (
                    <div key={color} className="flex flex-col items-center">
                      <button
                        onClick={() => setSelectedVariant(variant || null)}
                        disabled={!isAvailable}
                        className={`relative w-20 h-20 rounded-xl border-2 transition-all overflow-hidden ${
                          selectedVariant?.color === color
                            ? 'border-primary ring-4 ring-primary/20 scale-105 shadow-lg'
                            : isAvailable
                            ? 'border-gray-300 hover:border-primary/50 hover:scale-105 shadow-sm'
                            : 'border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                        title={`${color}${!isAvailable ? ' (Out of Stock)' : ''}`}
                      >
                        {variantImage ? (
                          <Image
                            src={variantImage.image_url}
                            alt={color || 'Product color'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-400">{color?.charAt(0)}</span>
                          </div>
                        )}
                        {selectedVariant?.color === color && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="bg-white rounded-full p-1">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                        )}
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <span className="text-xs font-bold text-red-600 rotate-[-15deg]">OUT</span>
                          </div>
                        )}
                      </button>
                      <span className={`text-xs mt-1.5 font-medium text-center ${
                        selectedVariant?.color === color ? 'text-primary' : 'text-gray-600'
                      }`}>
                        {color}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Size</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variant = product.variants?.find(v => v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color))
                  const isAvailable = variant?.stock_quantity ? variant.stock_quantity > 0 : true
                  
                  return (
                    <button
                      key={size}
                      onClick={() => variant && setSelectedVariant(variant)}
                      disabled={!isAvailable || !variant}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                        selectedVariant?.size === size
                          ? 'border-primary bg-primary/10 text-primary'
                          : isAvailable
                          ? 'border hover:border-primary/50'
                          : 'border opacity-50 cursor-not-allowed line-through'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {materials.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Material</h3>
              <div className="flex flex-wrap gap-2">
                {materials.map((material) => (
                  <Badge key={material} variant="outline">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold w-16 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const maxQty = selectedVariant?.stock_quantity || 10
                  setQuantity(Math.min(quantity + 1, maxQty))
                }}
                disabled={quantity >= (selectedVariant?.stock_quantity || 10)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              {selectedVariant && (
                <span className="text-sm text-muted-foreground">
                  {selectedVariant.stock_quantity} available
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className={`p-4 rounded-lg ${isInStock ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
            <div className="flex items-center gap-2">
              {isInStock ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    {selectedVariant 
                      ? `${selectedVariant.stock_quantity} in stock`
                      : 'In stock'}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-600 font-medium">Out of stock</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              size="lg"
              className="flex-1 h-14 text-base font-semibold bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              onClick={handleAddToCart}
              disabled={!isInStock || addingToCart}
            >
              {addingToCart ? (
                'Adding to Cart...'
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={`h-14 w-14 rounded-xl border-2 transition-all duration-300 ${
                isWishlisted 
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30' 
                  : 'hover:border-primary hover:bg-primary/5'
              }`}
              onClick={handleWishlist}
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-14 rounded-xl border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-semibold mb-1">Free Shipping</p>
              <p className="text-xs text-muted-foreground">On orders over ₹5000</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <RotateCcw className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-semibold mb-1">Easy Returns</p>
              <p className="text-xs text-muted-foreground">30-day return policy</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-semibold mb-1">Secure Payment</p>
              <p className="text-xs text-muted-foreground">100% secure checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews (24)</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                {product.description ? (
                  <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {product.description}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No description available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              {product.specifications ? (
                <>
                  {/* Dimensions */}
                  {product.specifications.dimensions && (
                    <>
                      <div>
                        <h3 className="font-hero text-xl mb-4 text-gray-900">Dimensions</h3>
                        <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {product.specifications.dimensions.length && (
                            <div className="border-l-2 border-gray-200 pl-4">
                              <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-1">Length</dt>
                              <dd className="font-body text-lg font-semibold text-gray-900">{product.specifications.dimensions.length}</dd>
                            </div>
                          )}
                          {product.specifications.dimensions.width && (
                            <div className="border-l-2 border-gray-200 pl-4">
                              <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-1">Width</dt>
                              <dd className="font-body text-lg font-semibold text-gray-900">{product.specifications.dimensions.width}</dd>
                            </div>
                          )}
                          {product.specifications.dimensions.height && (
                            <div className="border-l-2 border-gray-200 pl-4">
                              <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-1">Height</dt>
                              <dd className="font-body text-lg font-semibold text-gray-900">{product.specifications.dimensions.height}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Material & Construction */}
                  <div>
                    <h3 className="font-hero text-xl mb-4 text-gray-900">Material & Construction</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.specifications.material && (
                        <div>
                          <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-2">Material</dt>
                          <dd className="font-body text-gray-900">{product.specifications.material}</dd>
                        </div>
                      )}
                      {product.specifications.texture && (
                        <div>
                          <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-2">Texture</dt>
                          <dd className="font-body text-gray-900">{product.specifications.texture}</dd>
                        </div>
                      )}
                      {product.specifications.hardware && (
                        <div>
                          <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-2">Hardware</dt>
                          <dd className="font-body text-gray-900">{product.specifications.hardware}</dd>
                        </div>
                      )}
                      {product.category && (
                        <div>
                          <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-2">Category</dt>
                          <dd className="font-body text-gray-900">{product.category.name}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <Separator />

                  {/* Features & Details */}
                  <div>
                    <h3 className="font-hero text-xl mb-4 text-gray-900">Features & Details</h3>
                    <dl className="space-y-4">
                      {product.specifications.closure && (
                        <div>
                          <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-2">Closure Type</dt>
                          <dd className="font-body text-gray-900">{product.specifications.closure}</dd>
                        </div>
                      )}
                      {product.specifications.compartments && (
                        <div>
                          <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-2">Compartments</dt>
                          <dd className="font-body text-gray-900">{product.specifications.compartments}</dd>
                        </div>
                      )}
                      {product.specifications.shoulderDrop && (
                        <div>
                          <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-2">Shoulder Drop</dt>
                          <dd className="font-body text-gray-900">{product.specifications.shoulderDrop}</dd>
                        </div>
                      )}
                      {product.specifications.capacity && (
                        <div>
                          <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-2">Capacity</dt>
                          <dd className="font-body text-gray-900">{product.specifications.capacity}</dd>
                        </div>
                      )}
                      {product.specifications.idealFor && (
                        <div>
                          <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-2">Ideal For</dt>
                          <dd className="font-body text-gray-900">{product.specifications.idealFor}</dd>
                        </div>
                      )}
                      {product.specifications.features && Array.isArray(product.specifications.features) && (
                        <div>
                          <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-2">Key Features</dt>
                          <dd className="font-body text-gray-900">
                            <ul className="list-disc list-inside space-y-1">
                              {product.specifications.features.map((feature: string, idx: number) => (
                                <li key={idx}>{feature}</li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      )}
                      <div>
                        <dt className="font-menu text-sm text-gray-600 uppercase tracking-wide mb-2">SKU</dt>
                        <dd className="font-body text-gray-900">{selectedVariant?.sku || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Specifications not available for this product.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ProductReviews productId={product.id} />
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Shipping Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Free shipping on orders over ₹5,000</li>
                  <li>• Standard shipping: 3-5 business days</li>
                  <li>• Express shipping: 1-2 business days (additional charges apply)</li>
                  <li>• International shipping available</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Returns & Exchanges</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 30-day return policy</li>
                  <li>• Items must be unused and in original packaging</li>
                  <li>• Free returns for defective items</li>
                  <li>• Exchange available within 14 days</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fullscreen Gallery */}
      {showFullscreen && (
        <FullscreenGallery
          images={images}
          initialIndex={selectedImage}
          onClose={() => setShowFullscreen(false)}
          onImageChange={setSelectedImage}
        />
      )}
    </div>
  )
}
