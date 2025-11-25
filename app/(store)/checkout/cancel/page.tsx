'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'
import Link from 'next/link'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StoreHeader />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="shadow-2xl border-0 rounded-[2rem] bg-gradient-to-br from-white via-red-50/20 to-white">
          <CardContent className="p-12">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-red-100 p-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
            <p className="text-muted-foreground mb-6">
              Your payment was cancelled. No charges were made.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/cart">Return to Cart</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
      </main>
      <StoreFooter />
    </div>
  )
}

