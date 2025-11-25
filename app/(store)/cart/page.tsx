'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2, ShoppingBag, Heart, Tag, Truck, AlertCircle, X, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [savedItems, setSavedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponError, setCouponError] = useState('')
  const [shippingCost, setShippingCost] = useState(0)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadCart()
    loadSavedItems()
  }, [])

  const loadCart = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('cart')
      .select(`
        *,
        product:products(*, images:product_images(*)),
        variant:product_variants(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setCartItems(data || [])
    setLoading(false)
    calculateShipping(data || [])
  }

  const loadSavedItems = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Load from localStorage for now (could be a separate table)
    const saved = JSON.parse(localStorage.getItem('savedForLater') || '[]')
    setSavedItems(saved)
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    const item = cartItems.find(i => i.id === itemId)
    if (!item) return

    const maxStock = item.variant?.stock_quantity || 10
    if (newQuantity > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`)
      return
    }

    if (newQuantity < 1) {
      removeItem(itemId)
      return
    }

    const { error } = await supabase
      .from('cart')
      .update({ quantity: newQuantity })
      .eq('id', itemId)

    if (!error) {
      loadCart()
      toast.success('Quantity updated')
    } else {
      toast.error('Failed to update quantity')
    }
  }

  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', itemId)

    if (!error) {
      loadCart()
      toast.success('Item removed from cart')
    }
  }

  const saveForLater = async (item: any) => {
    const saved = JSON.parse(localStorage.getItem('savedForLater') || '[]')
    saved.push(item)
    localStorage.setItem('savedForLater', JSON.stringify(saved))
    
    await removeItem(item.id)
    loadSavedItems()
    toast.success('Item saved for later')
  }

  const moveToCart = async (item: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('cart')
      .upsert({
        user_id: user.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      })

    if (!error) {
      const saved = JSON.parse(localStorage.getItem('savedForLater') || '[]')
      const updated = saved.filter((i: any) => i.id !== item.id)
      localStorage.setItem('savedForLater', JSON.stringify(updated))
      loadSavedItems()
      loadCart()
      toast.success('Item moved to cart')
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !data) {
      setCouponError('Invalid coupon code')
      return
    }

    const now = new Date()
    const validFrom = new Date(data.valid_from)
    const validUntil = new Date(data.valid_until)

    if (now < validFrom || now > validUntil) {
      setCouponError('Coupon has expired')
      return
    }

    setAppliedCoupon(data)
    setCouponError('')
    toast.success('Coupon applied successfully!')
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  const calculateShipping = (items: any[]) => {
    const subtotal = items.reduce((sum, item) => {
      const price = item.variant?.price || item.product.sale_price || item.product.price
      return sum + price * item.quantity
    }, 0)

    // Free shipping over ₹5000
    if (subtotal >= 5000) {
      setShippingCost(0)
    } else {
      setShippingCost(200) // Standard shipping
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.variant?.price || item.product.sale_price || item.product.price
    return sum + price * item.quantity
  }, 0)

  const discount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? (subtotal * appliedCoupon.discount_value) / 100
      : appliedCoupon.discount_value
    : 0

  const total = subtotal - discount + shippingCost

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your cart...</p>
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
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-full border border-pink-100/50 shadow-sm">
          <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Shopping Cart</span>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Shopping Cart
          </span>
        </h1>
        {cartItems.length > 0 && (
          <p className="text-lg text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        )}
      </div>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button size="lg" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => {
                const price = item.variant?.price || item.product.sale_price || item.product.price
                const image = item.product.images?.[0]
                const maxStock = item.variant?.stock_quantity || 10
                const isLowStock = maxStock < 5 && item.quantity >= maxStock

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {image && (
                            <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                                <Image
                                  src={image.image_url}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </Link>
                          )}
                          <div className="flex-1 min-w-0">
                            <Link href={`/products/${item.product.slug}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                                {item.product.name}
                              </h3>
                            </Link>
                            {item.variant && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {item.variant.color && (
                                  <Badge variant="outline" className="text-xs">
                                    {item.variant.color}
                                  </Badge>
                                )}
                                {item.variant.size && (
                                  <Badge variant="outline" className="text-xs">
                                    {item.variant.size}
                                  </Badge>
                                )}
                              </div>
                            )}
                            <p className="text-lg font-bold mt-2">₹{price.toLocaleString()}</p>
                            {isLowStock && (
                              <div className="flex items-center gap-1 mt-2 text-sm text-amber-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>Only {maxStock} left in stock</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end justify-between gap-2">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => saveForLater(item)}
                                title="Save for later"
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                title="Remove"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= maxStock}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm font-semibold">
                              ₹{(price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Saved for Later */}
            {savedItems.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Saved for Later ({savedItems.length})
                </h2>
                <div className="space-y-2">
                  {savedItems.map((item: any) => (
                    <Card key={item.id} className="opacity-75">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {item.product?.images?.[0] && (
                              <div className="relative w-16 h-16 rounded overflow-hidden">
                                <Image
                                  src={item.product.images[0].image_url}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm">{item.product?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                ₹{((item.variant?.price || item.product?.price || 0) * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveToCart(item)}
                          >
                            Move to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Button variant="outline" asChild>
                <Link href="/products">
                  ← Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon Code */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value)
                        setCouponError('')
                      }}
                      disabled={!!appliedCoupon}
                      className="flex-1"
                    />
                    {appliedCoupon ? (
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={removeCoupon}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    ) : (
                                      <Button onClick={applyCoupon}>
                                        <Tag className="h-4 w-4 mr-2" />
                                        Apply
                                      </Button>
                                    )}
                  </div>
                  {couponError && (
                    <p className="text-sm text-red-600">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/20 p-2 rounded">
                      <Check className="h-4 w-4" />
                      <span>
                        {appliedCoupon.discount_type === 'percentage'
                          ? `${appliedCoupon.discount_value}% off`
                          : `₹${appliedCoupon.discount_value} off`}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      Shipping
                      <Truck className="h-3 w-3" />
                    </span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        `₹${shippingCost.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  {subtotal < 5000 && (
                    <p className="text-xs text-muted-foreground">
                      Add ₹{(5000 - subtotal).toLocaleString()} more for free shipping
                    </p>
                  )}
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure checkout with SSL encryption
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
