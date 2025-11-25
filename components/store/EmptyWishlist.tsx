'use client'

import { Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function EmptyWishlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
        <Heart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Your Wishlist is Empty</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Start adding your favorite handbags to your wishlist. You can save items for later and get notified when they go on sale.
      </p>
      <div className="flex gap-4 justify-center">
        <Button size="lg" asChild>
          <Link href="/products">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Start Shopping
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/categories">
            Browse Categories
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}

