import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Clock, Globe, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping Information | KIBANA',
  description: 'Learn about our shipping options, delivery times, and shipping policies',
}

export default function ShippingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <div className="container px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Information</h1>
              <p className="text-lg text-muted-foreground">
                Fast, secure, and reliable shipping to get your KIBANA handbag to you
              </p>
            </div>

            {/* Shipping Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Truck className="h-6 w-6 text-primary" />
                    <CardTitle>Standard Shipping</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    <strong>Delivery Time:</strong> 5-7 business days
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>Cost:</strong> ₹199 (Free on orders over ₹5,000)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Standard shipping is available for all domestic orders. Orders are processed within 1-2 business days.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-6 w-6 text-primary" />
                    <CardTitle>Express Shipping</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    <strong>Delivery Time:</strong> 2-3 business days
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>Cost:</strong> ₹499
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get your order faster with express shipping. Available for most locations. Orders placed before 2 PM are processed the same day.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="h-6 w-6 text-primary" />
                    <CardTitle>International Shipping</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    <strong>Delivery Time:</strong> 10-14 business days
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>Cost:</strong> Varies by location
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We ship to most countries worldwide. International shipping costs and delivery times vary by destination. Customs duties may apply.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="h-6 w-6 text-primary" />
                    <CardTitle>Order Processing</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    <strong>Processing Time:</strong> 1-2 business days
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>Same Day:</strong> Orders before 2 PM
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Orders are typically processed within 1-2 business days. Orders placed before 2 PM on weekdays may be processed the same day.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Shipping Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tracking Your Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Once your order ships, you will receive a tracking number via email. You can use this tracking number to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Track your package in real-time</li>
                    <li>See estimated delivery dates</li>
                    <li>Receive delivery notifications</li>
                    <li>View delivery history</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Restrictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Some items may have shipping restrictions:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Certain products may not be available for international shipping</li>
                    <li>Express shipping may not be available for all locations</li>
                    <li>PO Box deliveries may have limitations</li>
                    <li>Some remote areas may have extended delivery times</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery & Receiving</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    <strong>Delivery Address:</strong> Please ensure your delivery address is correct. We are not responsible for orders delivered to incorrect addresses provided by customers.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>Signature Required:</strong> Orders over ₹10,000 may require a signature upon delivery for security purposes.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Failed Delivery:</strong> If delivery is unsuccessful, the carrier will attempt redelivery. After multiple attempts, the package may be returned to us.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

