import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Clock, Package, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Returns & Exchanges | KIBANA',
  description: 'Learn about our return policy, exchange process, and refund information',
}

export default function ReturnsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <div className="container px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Returns & Exchanges</h1>
              <p className="text-lg text-muted-foreground">
                We want you to love your KIBANA handbag. If you're not completely satisfied, we're here to help.
              </p>
            </div>

            {/* Return Policy Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-6 w-6 text-primary" />
                    <CardTitle>30-Day Return Policy</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You have 30 days from the date of delivery to return any unused item in its original condition with all tags attached.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <RefreshCw className="h-6 w-6 text-primary" />
                    <CardTitle>Easy Exchanges</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Need a different size, color, or style? We make exchanges easy. Contact us to start the process.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="h-6 w-6 text-primary" />
                    <CardTitle>Free Returns</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Returns are free for all domestic orders. We provide a prepaid return shipping label for your convenience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <CardTitle>Quick Refunds</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Refunds are processed within 5-7 business days after we receive your return. You'll receive your refund in 10-14 business days.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Return Process */}
            <div className="space-y-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>How to Return an Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-4 text-muted-foreground ml-4">
                    <li>
                      <strong>Contact Us:</strong> Log into your account and initiate a return, or contact our customer service team at support@kibana.com
                    </li>
                    <li>
                      <strong>Get Return Authorization:</strong> We'll provide you with a return authorization number and prepaid shipping label
                    </li>
                    <li>
                      <strong>Package Your Item:</strong> Place the item in its original packaging with all tags attached. Include the return form if provided
                    </li>
                    <li>
                      <strong>Ship It Back:</strong> Use the prepaid shipping label to return the item. You can drop it off at any authorized shipping location
                    </li>
                    <li>
                      <strong>Receive Refund:</strong> Once we receive and inspect your return, we'll process your refund within 5-7 business days
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Return Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    To be eligible for a return, items must meet the following conditions:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Item must be unused and in original condition</li>
                    <li>All original tags and labels must be attached</li>
                    <li>Item must be in original packaging</li>
                    <li>Return must be initiated within 30 days of delivery</li>
                    <li>Proof of purchase must be provided</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Items that are damaged, used, or missing tags may not be eligible for return or may be subject to a restocking fee.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exchanges</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    We're happy to help you exchange an item for a different size, color, or style. To exchange:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Contact our customer service team with your order number and desired exchange item</li>
                    <li>We'll process your return and new order simultaneously</li>
                    <li>If the new item costs more, you'll pay the difference. If it costs less, you'll receive a refund</li>
                    <li>Exchanges are subject to product availability</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Refund Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    <strong>Processing Time:</strong> Refunds are processed within 5-7 business days after we receive your return.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>Refund Method:</strong> Refunds are issued to your original payment method. The time it takes for the refund to appear depends on your bank or credit card company, typically 10-14 business days.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>Shipping Costs:</strong> Original shipping costs are non-refundable unless the return is due to our error or a defective product.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Restocking Fee:</strong> No restocking fees apply for returns that meet our return conditions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Non-Returnable Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    The following items cannot be returned:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Items that have been used or damaged</li>
                    <li>Items without original tags or packaging</li>
                    <li>Items returned after 30 days</li>
                    <li>Custom or personalized items (unless defective)</li>
                    <li>Items purchased during final sale or clearance</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="p-6 bg-muted rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Need Help with a Return?</h3>
              <p className="text-muted-foreground mb-4">
                Our customer service team is here to assist you with any questions about returns or exchanges.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

