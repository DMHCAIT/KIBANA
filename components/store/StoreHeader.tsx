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

        {/* Search Bar */}
        <div className="hidden flex-1 max-w-lg mx-8 lg:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
                }
              }}
              className="w-full"
            >
              <Input
                type="search"
                placeholder="Search handbags, brands, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10 border-gray-300 focus:border-black transition-colors"
              />
            </form>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link 
            href="/products" 
            className="font-menu text-sm text-gray-900 hover:text-gray-600 transition-colors"
          >
            Shop
          </Link>
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
          <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100" asChild>
            <Link href="/search">
              <Search className="h-5 w-5 text-gray-900" />
            </Link>
          </Button>
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

