'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Search, User, Heart, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function StoreHeader() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-50 w-full border-luxury border-b border-gray-200 bg-white">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.jpg"
            alt="KIBANA Logo"
            width={120}
            height={40}
            className="h-8 md:h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link 
            href="/collections" 
            className="font-menu text-sm text-gray-900 hover:text-gray-600 transition-colors"
          >
            Collections
          </Link>
          <Link 
            href="/about" 
            className="font-menu text-sm text-gray-900 hover:text-gray-600 transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 relative" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5 text-gray-900" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 relative" asChild>
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5 text-gray-900" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-black rounded-full" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100" asChild>
            <Link href="/account">
              <User className="h-5 w-5 text-gray-900" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 lg:hidden">
            <Menu className="h-5 w-5 text-gray-900" />
          </Button>
        </div>
      </div>
    </header>
  )
}

