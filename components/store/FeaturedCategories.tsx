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
    <section className="container px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-white">
      <div className="mb-8 md:mb-12 lg:mb-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 bg-black text-white text-xs font-bold tracking-wider uppercase rounded-full">
          <span>Collections in Focus</span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900 leading-tight">
          Shop by Category
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
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

        {/* Responsive Grid for Desktop, Horizontal Scroll for Mobile */}
        <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
          {displayCategories.slice(0, 8).map((category, index) => (
            <Link key={category.id || index} href={`/categories/${category.slug || category.id}`}>
              <Card className="group overflow-hidden cursor-pointer border border-gray-200 hover:border-black transition-all duration-300 bg-white h-full hover:shadow-xl">
                <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  {category.banner_image ? (
                    <Image
                      src={category.banner_image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-7xl md:text-8xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5 md:p-6 text-center">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900 group-hover:text-black transition-colors">
                    {category.name.toUpperCase()}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-black group-hover:gap-3 transition-all">
                    <span>Shop Now</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Horizontal Scroll Container for Mobile/Tablet */}
        <div
          ref={scrollRef}
          className="flex lg:hidden gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-4 scroll-smooth -mx-4 px-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {displayCategories.map((category, index) => (
            <div
              key={category.id || index}
              className="shrink-0 w-[280px] sm:w-[320px]"
            >
              <Link href={`/categories/${category.slug || category.id}`}>
                <Card className="group overflow-hidden cursor-pointer border border-gray-200 hover:border-black transition-all duration-300 bg-white h-full">
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    {category.banner_image ? (
                      <Image
                        src={category.banner_image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-bold text-gray-200">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                      {category.name.toUpperCase()}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {category.description}
                      </p>
                    )}
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-black group-hover:gap-3 transition-all">
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

