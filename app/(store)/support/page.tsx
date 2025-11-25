import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MessageCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Customer Support | KIBANA',
  description: 'Get help with your KIBANA order, product questions, or account issues',
}

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <div className="container px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Support</h1>
              <p className="text-lg text-muted-foreground">
                We're here to help! Get in touch with our support team for any questions or concerns.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-6 w-6 text-primary" />
                    <CardTitle>Email Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Send us an email and we'll respond within 24 hours.
                  </p>
                  <div className="space-y-2 mb-4">
                    <p className="font-semibold">General Inquiries:</p>
                    <a href="mailto:hello@kibana.com" className="text-primary hover:underline">
                      hello@kibana.com
                    </a>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Support:</p>
                    <a href="mailto:support@kibana.com" className="text-primary hover:underline">
                      support@kibana.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="h-6 w-6 text-primary" />
                    <CardTitle>Phone Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Call us during business hours for immediate assistance.
                  </p>
                  <div className="space-y-2 mb-4">
                    <p className="font-semibold">Main Line:</p>
                    <a href="tel:+15551234567" className="text-primary hover:underline">
                      +1 (555) 123-4567
                    </a>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Support Line:</p>
                    <a href="tel:+15551234568" className="text-primary hover:underline">
                      +1 (555) 123-4568
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    <CardTitle>Live Chat</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Chat with our support team in real-time.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Available Monday-Friday, 9 AM - 6 PM
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/contact">Start Chat</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-6 w-6 text-primary" />
                    <CardTitle>Business Hours</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                    <p><strong>Sunday:</strong> Closed</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    All times are in Eastern Standard Time (EST)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Common Issues */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Common Support Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Order Issues</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Questions about your order status, shipping, or delivery?
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/account/orders">View Orders</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Returns & Exchanges</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Need to return or exchange an item?
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/returns">Return Policy</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Product Questions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Want to know more about our products?
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/products">Browse Products</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Account Help</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Issues with your account or password?
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/account">Manage Account</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form CTA */}
            <Card>
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
                <p className="text-muted-foreground mb-6">
                  Can't find what you're looking for? Fill out our contact form and we'll get back to you as soon as possible.
                </p>
                <Button size="lg" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

