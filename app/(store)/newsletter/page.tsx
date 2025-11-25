'use client'

import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate subscription
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
      setEmail('')
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <div className="container px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Subscribe to Our Newsletter</h1>
              <p className="text-lg text-muted-foreground">
                Stay updated with the latest collections, exclusive offers, and fashion trends
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Join the KIBANA Community</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubscribed ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Thank You for Subscribing!</h3>
                    <p className="text-muted-foreground mb-6">
                      You've successfully subscribed to our newsletter. Check your email for a confirmation message.
                    </p>
                    <Button onClick={() => setIsSubscribed(false)} variant="outline">
                      Subscribe Another Email
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your.email@example.com"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">What You'll Receive:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Early access to new collections</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Exclusive discounts and special offers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Fashion tips and styling guides</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Behind-the-scenes content</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Birthday specials and rewards</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        By subscribing, you agree to receive marketing emails from KIBANA. 
                        You can unsubscribe at any time by clicking the link in our emails.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Weekly Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Get our weekly newsletter with the latest trends and offers
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Exclusive Offers</h3>
                  <p className="text-sm text-muted-foreground">
                    Subscribers get access to special discounts and early sales
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">No Spam</h3>
                  <p className="text-sm text-muted-foreground">
                    We respect your inbox. Unsubscribe anytime with one click
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

