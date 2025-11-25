'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Category } from '@/types'
import { Card } from '@/components/ui/card'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef, useState, useEffect } from 'react'

interface FeaturedCategoriesProps {
  categories: Category[]
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  // Default categories if none provided
  const defaultCategories = [
    { id: '1', name: 'Tote Bags', slug: 'tote-bags', description: 'Spacious and versatile', banner_image: null },
    { id: '2', name: 'Crossbody Bags', slug: 'crossbody-bags', description: 'Hands-free convenience', banner_image: null },
    { id: '3', name: 'Clutches', slug: 'clutches', description: 'Elegant evening essentials', banner_image: null },
    { id: '4', name: 'Shoulder Bags', slug: 'shoulder-bags', description: 'Classic and timeless', banner_image: null },
    { id: '5', name: 'Backpacks', slug: 'backpacks', description: 'Modern and practical', banner_image: null },
    { id: '6', name: 'Satchels', slug: 'satchels', description: 'Professional and stylish', banner_image: null },
    { id: '7', name: 'Hobo Bags', slug: 'hobo-bags', description: 'Casual and comfortable', banner_image: null },
    { id: '8', name: 'Bucket Bags', slug: 'bucket-bags', description: 'Trendy and spacious', banner_image: null },
  ]

  const displayCategories = categories.length > 0 ? categories : defaultCategories
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollability()
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollability)
      window.addEventListener('resize', checkScrollability)
      return () => {
        scrollElement.removeEventListener('scroll', checkScrollability)
        window.removeEventListener('resize', checkScrollability)
      }
    }
  }, [displayCategories])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="container px-4 py-16 bg-white">
      <div className="mb-12">
        <div className="inline-block mb-3 px-3 py-1 bg-black text-white text-xs font-medium tracking-wider uppercase rounded-full">
          <span>Categories</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
          Shop by Category
        </h2>
        <p className="text-base text-gray-600 max-w-2xl">
          Discover our curated collection organized by style and purpose
        </p>
      </div>
      
      <div className="relative">
        {/* Scroll Buttons */}
        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50 hidden md:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50 hidden md:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {displayCategories.map((category, index) => (
            <div
              key={category.id || index}
              className="shrink-0 w-[320px] md:w-[380px]"
            >
              <Link href={`/categories/${category.slug || category.id}`}>
                <Card className="group overflow-hidden cursor-pointer border border-gray-200 hover:border-black transition-all duration-300 bg-white h-full">
                  <div className="relative h-80 overflow-hidden">
                    {category.banner_image ? (
                      <Image
                        src={category.banner_image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-6xl font-bold text-gray-300">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 wrap-break-word">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 wrap-break-word">
                        {category.description}
                      </p>
                    )}
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-black group-hover:gap-3 transition-all">
                      <span>Shop Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

