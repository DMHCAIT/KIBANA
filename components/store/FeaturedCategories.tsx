'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Category } from '@/types'
import { Card } from '@/components/ui/card'
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef, useState, useEffect } from 'react'

interface FeaturedCategoriesProps {
  categories: Category[]
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const displayCategories = categories || []
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
    <section className="w-full bg-white section-luxury">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mb-12 md:mb-16 lg:mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-hero text-4xl md:text-5xl lg:text-6xl mb-6 md:mb-8 text-gray-900 leading-tight tracking-tight">
            Collections
          </h2>
      </div>
      
      {displayCategories.length === 0 ? (
        <div className="text-center py-16 md:py-24">
          <div className="max-w-md mx-auto">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No Categories Yet</h3>
            <p className="text-gray-600 mb-6">
              Add categories from the admin panel to display them here
            </p>
            <Button asChild>
              <Link href="/admin/categories/new">Add Categories</Link>
            </Button>
          </div>
        </div>
      ) : (
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

          {/* Centered Grid for Desktop */}
          <div className="flex justify-center">
            <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-12 max-w-7xl w-full">
              {displayCategories.slice(0, 8).map((category, index) => (
                <Link key={category.id || index} href={`/categories/${category.slug || category.id}`}>
                  <Card className="group overflow-hidden cursor-pointer border-luxury border-gray-200 hover:border-gray-400 transition-all duration-300 bg-white h-full">
                    <div className="relative h-80 lg:h-96 overflow-hidden bg-gray-50">
                      {category.banner_image ? (
                        <Image
                          src={category.banner_image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-8xl font-hero text-gray-200">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 md:p-8 text-center">
                      <h3 className="font-menu text-base md:text-lg mb-3 text-gray-900 tracking-wide">
                        {category.name.toUpperCase()}
                      </h3>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Horizontal Scroll Container for Mobile/Tablet */}
        <div
          ref={scrollRef}
            className="flex lg:hidden gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth -mx-4 px-4"
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
                  <Card className="group overflow-hidden cursor-pointer border-luxury border-gray-200 hover:border-gray-400 transition-all duration-300 bg-white h-full">
                    <div className="relative h-64 overflow-hidden bg-gray-50">
                    {category.banner_image ? (
                      <Image
                        src={category.banner_image}
                        alt={category.name}
                        fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl font-hero text-gray-200">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                      <h3 className="font-menu text-base mb-2 text-gray-900 tracking-wide">
                        {category.name.toUpperCase()}
                    </h3>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
      )}
      </div>
    </section>
  )
}

