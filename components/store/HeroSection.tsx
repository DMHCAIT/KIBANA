'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface HeroSectionProps {
  banner?: {
    title?: string
    subtitle?: string
    image_url?: string
    video_url?: string
    link_url?: string
  }
}

export function HeroSection({ banner }: HeroSectionProps) {
  const title = banner?.title || 'Elegance Redefined'
  const subtitle = banner?.subtitle || 'Discover our curated collection of luxury handbags, crafted for the modern woman who values style and sophistication.'

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white border-b border-gray-100">
      {/* Clean Minimal Background */}
      {banner?.image_url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={banner.image_url}
            alt={title}
            fill
            priority
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container px-4 text-center py-20">
        <div className="max-w-5xl mx-auto">
          {/* Minimal Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-black text-white text-xs font-medium tracking-wider uppercase rounded-full">
            <span>Luxury Collection</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900 tracking-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="group px-8 py-6 bg-black text-white hover:bg-gray-900 transition-all duration-300 rounded-none" 
              asChild
            >
              <Link href="/products" className="flex items-center">
                <span>Shop Now</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="group px-8 py-6 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 rounded-none" 
              asChild
            >
              <Link href="/categories" className="flex items-center">
                Explore Collections
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
