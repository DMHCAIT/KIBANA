'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Search, User, Heart, Menu, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function StoreHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  const [collections, setCollections] = useState<any[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchCollections = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('order', { ascending: true })
      
      if (data) {
        setCollections(data)
      }
    }
    fetchCollections()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-luxury border-b border-gray-200 bg-white shadow-sm">
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
          {/* Collections Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="font-menu text-sm text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-1 outline-none">
              Collections
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-white">
              <DropdownMenuItem asChild>
                <Link href="/collections" className="font-medium">
                  All Collections
                </Link>
              </DropdownMenuItem>
              {collections.map((collection) => (
                <DropdownMenuItem key={collection.id} asChild>
                  <Link href={`/collections/${collection.slug}`}>
                    {collection.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 relative" asChild>
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5 text-gray-900" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100" asChild>
            <Link href="/account">
              <User className="h-5 w-5 text-gray-900" />
            </Link>
          </Button>
          
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100">
                  <Menu className="h-5 w-5 text-gray-900" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <DropdownMenuItem asChild>
                  <Link href="/collections" className="font-medium">
                    All Collections
                  </Link>
                </DropdownMenuItem>
                {collections.map((collection) => (
                  <DropdownMenuItem key={collection.id} asChild>
                    <Link href={`/collections/${collection.slug}`}>
                      {collection.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/about">
                    About
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

