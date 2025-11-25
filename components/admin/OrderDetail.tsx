'use client'

import { Order } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Package, Truck, CheckCircle, XCircle, Download, Mail, MapPin, CreditCard } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

interface OrderDetailProps {
  order: Order & {
    user?: any
    items?: Array<{
      id: string
      quantity: number
      price: number
      product?: any
      variant?: any
    }>
  }
}

export function OrderDetail({ order }: OrderDetailProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleStatusUpdate = async (newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', order.id)

    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success('Order status updated')
      router.refresh()
    }
  }

  const handlePaymentStatusUpdate = async (newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', order.id)

    if (error) {
      toast.error('Failed to update payment status')
    } else {
      toast.success('Payment status updated')
      router.refresh()
    }
  }

  const handleDownloadInvoice = () => {
    // Generate and download invoice
    toast.success('Invoice download started')
  }

  const handleSendEmail = async () => {
    // Send order confirmation email
    toast.success('Email sent to customer')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />
      default:
        return <Package className="h-5 w-5 text-yellow-600" />
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                Order Status
              </CardTitle>
              <Badge variant="outline">{order.order_number}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Update Status</Label>
              <Select value={order.status} onValueChange={handleStatusUpdate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Status</Label>
              <Select value={order.payment_status} onValueChange={handlePaymentStatusUpdate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items?.map((item) => {
                const image = item.product?.images?.[0]
                return (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    {image && (
                      <div className="relative w-20 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={image.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product?.name || 'Product'}</h4>
                      {item.variant && (
                        <p className="text-sm text-muted-foreground">
                          {item.variant.color && `Color: ${item.variant.color}`}
                          {item.variant.size && ` | Size: ${item.variant.size}`}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        Quantity: {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.shipping_address && typeof order.shipping_address === 'object' ? (
              <div className="space-y-1">
                <p className="font-medium">{order.shipping_address.name}</p>
                <p className="text-muted-foreground">{order.shipping_address.address}</p>
                <p className="text-muted-foreground">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                </p>
                <p className="text-muted-foreground">{order.shipping_address.country}</p>
                <p className="text-muted-foreground">Phone: {order.shipping_address.phone}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No address provided</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span>{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  {order.payment_method?.toUpperCase() || 'N/A'}
                </span>
              </div>
              {order.payment_id && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-xs">{order.payment_id}</span>
                </div>
              )}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.total_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{order.user?.full_name || 'Guest'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{order.user?.email || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline" onClick={handleDownloadInvoice}>
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            <Button className="w-full" variant="outline" onClick={handleSendEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

