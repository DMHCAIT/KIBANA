'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { CreditCard, Wallet, MapPin, Truck, Shield, Lock, CheckCircle, Plus, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { AddressManager } from '@/components/store/AddressManager'
import { toast } from 'sonner'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'

interface Address {
  id?: string
  name: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  is_default?: boolean
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<Address | null>(null)
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<Address | null>(null)
  const [useBillingAsShipping, setUseBillingAsShipping] = useState(true)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe' | 'cod'>('razorpay')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showAddressManager, setShowAddressManager] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadCart()
    loadAddresses()
  }, [])

  const loadCart = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login?redirect=/checkout')
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

    if (!data || data.length === 0) {
      router.push('/cart')
      return
    }

    setCartItems(data)
    setLoading(false)
  }

  const loadAddresses = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Load from user profile or addresses table
    const { data: addresses } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    if (addresses && addresses.length > 0) {
      setSavedAddresses(addresses)
      const defaultAddress = addresses.find((a: Address) => a.is_default) || addresses[0]
      setSelectedShippingAddress(defaultAddress)
      setSelectedBillingAddress(defaultAddress)
    } else {
      // Load from user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        const address: Address = {
          name: profile.full_name || '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          country: 'India',
        }
        setSelectedShippingAddress(address)
        setSelectedBillingAddress(address)
      }
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.variant?.price || item.product.sale_price || item.product.price
    return sum + price * item.quantity
  }, 0)

  const shippingCost = shippingMethod === 'express' ? 500 : shippingMethod === 'standard' ? 200 : 0
  const discount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? (subtotal * appliedCoupon.discount_value) / 100
      : appliedCoupon.discount_value
    : 0

  const total = subtotal - discount + shippingCost

  const handleAddressSelect = (address: Address, type: 'shipping' | 'billing') => {
    if (type === 'shipping') {
      setSelectedShippingAddress(address)
      if (useBillingAsShipping) {
        setSelectedBillingAddress(address)
      }
    } else {
      setSelectedBillingAddress(address)
    }
  }

  const handlePayment = async () => {
    if (!selectedShippingAddress || !selectedBillingAddress) {
      toast.error('Please provide shipping and billing addresses')
      return
    }

    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions')
      return
    }

    setProcessing(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: total,
          payment_method: paymentMethod,
          shipping_address: selectedShippingAddress,
          billing_address: selectedBillingAddress,
          status: paymentMethod === 'cod' ? 'pending' : 'pending',
          payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.variant?.price || item.product.sale_price || item.product.price,
      }))

      await supabase.from('order_items').insert(orderItems)

      // Clear cart
      await supabase.from('cart').delete().eq('user_id', user.id)

      if (paymentMethod === 'cod') {
        router.push(`/checkout/success?order=${order.order_number}`)
        return
      }

      if (paymentMethod === 'razorpay') {
        const response = await fetch('/api/payments/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            orderId: order.id,
          }),
        })

        const { orderId: razorpayOrderId, key } = await response.json()

        const options = {
          key,
          amount: total * 100,
          currency: 'INR',
          name: 'KIBANA',
          description: `Order #${orderNumber}`,
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            await fetch('/api/payments/razorpay', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: order.id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            })

            router.push(`/checkout/success?order=${order.order_number}`)
          },
          prefill: {
            name: selectedShippingAddress.name,
            email: user.email || '',
            contact: selectedShippingAddress.phone,
          },
          theme: {
            color: '#000000',
          },
          modal: {
            ondismiss: function() {
              setProcessing(false)
            }
          }
        }

        const razorpay = new (window as any).Razorpay(options)
        razorpay.open()
      } else if (paymentMethod === 'stripe') {
        const response = await fetch('/api/payments/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            orderId: order.id,
            items: cartItems.map(item => ({
              name: item.product.name,
              price: item.variant?.price || item.product.sale_price || item.product.price,
              quantity: item.quantity,
              images: item.product.images?.[0]?.image_url ? [item.product.images[0].image_url] : [],
            })),
          }),
        })

        const { url } = await response.json()
        window.location.href = url
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="flex min-h-screen flex-col bg-white">
        <StoreHeader />
        <main className="flex-1">
          <div className="container px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-full border border-pink-100/50 shadow-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Checkout</span>
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Checkout
            </span>
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                <span
                  className={`hidden sm:block ${
                    step >= s ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                </span>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 ${
                      step > s ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping Address
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddressManager(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Manage Addresses
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {savedAddresses.length > 0 && (
                      <div className="space-y-2">
                        <Label>Select Saved Address</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {savedAddresses.map((address) => (
                            <button
                              key={address.id}
                              onClick={() => handleAddressSelect(address, 'shipping')}
                              className={`p-4 border-2 rounded-lg text-left transition-all ${
                                selectedShippingAddress?.id === address.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border hover:border-primary/50'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-semibold">{address.name}</p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {address.address}, {address.city}, {address.state} {address.zip}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                                </div>
                                {address.is_default && (
                                  <Badge variant="secondary">Default</Badge>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        <Separator />
                      </div>
                    )}

                    <AddressManager
                      address={selectedShippingAddress}
                      onSave={(address) => {
                        setSelectedShippingAddress(address)
                        if (useBillingAsShipping) {
                          setSelectedBillingAddress(address)
                        }
                      }}
                      open={showAddressManager}
                      onClose={() => setShowAddressManager(false)}
                    />
                  </CardContent>
                </Card>

                {/* Shipping Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="free" id="free" />
                            <div>
                              <p className="font-medium">Free Shipping</p>
                              <p className="text-sm text-muted-foreground">5-7 business days</p>
                            </div>
                          </div>
                          <span className="font-semibold">Free</span>
                        </label>
                        <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="standard" id="standard" />
                            <div>
                              <p className="font-medium">Standard Shipping</p>
                              <p className="text-sm text-muted-foreground">3-5 business days</p>
                            </div>
                          </div>
                          <span className="font-semibold">₹200</span>
                        </label>
                        <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="express" id="express" />
                            <div>
                              <p className="font-medium">Express Shipping</p>
                              <p className="text-sm text-muted-foreground">1-2 business days</p>
                            </div>
                          </div>
                          <span className="font-semibold">₹500</span>
                        </label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    if (!selectedShippingAddress) {
                      toast.error('Please select or add a shipping address')
                      return
                    }
                    setStep(2)
                  }}
                >
                  Continue to Payment
                </Button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="razorpay" id="razorpay" />
                            <div>
                              <p className="font-medium">Razorpay</p>
                              <p className="text-sm text-muted-foreground">Cards, UPI, Netbanking, Wallets</p>
                            </div>
                          </div>
                          <Wallet className="h-5 w-5 text-muted-foreground" />
                        </label>
                        <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="stripe" id="stripe" />
                            <div>
                              <p className="font-medium">Stripe</p>
                              <p className="text-sm text-muted-foreground">International cards</p>
                            </div>
                          </div>
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                        </label>
                        <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="cod" id="cod" />
                            <div>
                              <p className="font-medium">Cash on Delivery</p>
                              <p className="text-sm text-muted-foreground">Pay when you receive</p>
                            </div>
                          </div>
                          <Badge>Available</Badge>
                        </label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Billing Address</CardTitle>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="same-as-shipping"
                          checked={useBillingAsShipping}
                          onCheckedChange={setUseBillingAsShipping}
                        />
                        <Label htmlFor="same-as-shipping" className="cursor-pointer">
                          Same as shipping address
                        </Label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {useBillingAsShipping ? (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-medium">{selectedShippingAddress?.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedShippingAddress?.address}, {selectedShippingAddress?.city}, {selectedShippingAddress?.state} {selectedShippingAddress?.zip}
                        </p>
                      </div>
                    ) : (
                      <AddressManager
                        address={selectedBillingAddress}
                        onSave={setSelectedBillingAddress}
                      />
                    )}
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={() => setStep(3)}
                  >
                    Review Order
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => {
                      const price = item.variant?.price || item.product.sale_price || item.product.price
                      const image = item.product.images?.[0]
                      return (
                        <div key={item.id} className="flex gap-4">
                          {image && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={image.image_url}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            {item.variant && (
                              <p className="text-sm text-muted-foreground">
                                {item.variant.color && `Color: ${item.variant.color}`}
                                {item.variant.size && ` | Size: ${item.variant.size}`}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">₹{(price * item.quantity).toLocaleString()}</p>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{selectedShippingAddress?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedShippingAddress?.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedShippingAddress?.city}, {selectedShippingAddress?.state} {selectedShippingAddress?.zip}
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedShippingAddress?.phone}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={setTermsAccepted}
                  />
                  <Label htmlFor="terms" className="cursor-pointer text-sm">
                    I agree to the{' '}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handlePayment}
                    disabled={processing || !termsAccepted}
                  >
                    {processing ? (
                      'Processing...'
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => {
                    const price = item.variant?.price || item.product.sale_price || item.product.price
                    const image = item.product.images?.[0]
                    return (
                      <div key={item.id} className="flex gap-3">
                        {image && (
                          <div className="relative w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={image.image_url}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold mt-1">₹{(price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        `₹${shippingCost.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
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

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <Shield className="h-4 w-4" />
                  <span>Secure SSL encrypted payment</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </div>
        </main>
        <StoreFooter />
      </div>
    </>
  )
}
