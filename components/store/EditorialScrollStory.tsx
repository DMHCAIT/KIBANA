'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface EditorialScrollStoryProps {
  product: Product
  scenes?: Array<{
    image: string
    headline: string
    caption: string
    rotation?: number
  }>
}

export function EditorialScrollStory({ product, scenes }: EditorialScrollStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const productRef = useRef<HTMLDivElement>(null)
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const [currentScene, setCurrentScene] = useState(0)

  // Default scenes if not provided
  const defaultScenes = scenes || [
    {
      image: product.images?.[0]?.image_url || '/placeholder-bag.jpg',
      headline: 'Crafted for Elegance',
      caption: 'Every detail refined to perfection',
      rotation: 0,
    },
    {
      image: product.images?.[1]?.image_url || product.images?.[0]?.image_url || '/placeholder-bag.jpg',
      headline: 'Timeless Design',
      caption: 'A statement piece for the modern woman',
      rotation: 15,
    },
    {
      image: product.images?.[2]?.image_url || product.images?.[0]?.image_url || '/placeholder-bag.jpg',
      headline: 'Luxury Redefined',
      caption: 'Where sophistication meets functionality',
      rotation: -15,
    },
  ]

  useEffect(() => {
    if (!containerRef.current || !productRef.current) return

    const container = containerRef.current
    const productElement = productRef.current

    // Create scroll-triggered rotation animation
    const rotationTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=300%',
        scrub: 1.5, // Smooth, deliberate scrolling
        pin: true,
        anticipatePin: 1,
      },
    })

    // Rotate product through scenes
    defaultScenes.forEach((scene, index) => {
      const progress = index / (defaultScenes.length - 1)
      const nextProgress = (index + 1) / (defaultScenes.length - 1)
      const rotation = scene.rotation || 0
      const nextRotation = defaultScenes[index + 1]?.rotation || rotation

      rotationTimeline.to(
        productElement,
        {
          rotationY: rotation,
          rotationX: Math.sin(progress * Math.PI) * 5,
          ease: 'power2.inOut',
        },
        progress
      )

      // Update current scene
      rotationTimeline.call(
        () => setCurrentScene(index),
        [],
        progress + 0.1
      )
    })

    // Animate text transitions
    textRefs.current.forEach((textRef, index) => {
      if (!textRef) return

      const sceneProgress = index / defaultScenes.length
      const nextSceneProgress = (index + 1) / defaultScenes.length

      gsap.fromTo(
        textRef,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '+=300%',
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress
              const sceneStart = sceneProgress
              const sceneEnd = nextSceneProgress
              const sceneProgressValue = (progress - sceneStart) / (sceneEnd - sceneStart)
              
              if (progress >= sceneStart && progress <= sceneEnd) {
                const opacity = 1 - Math.abs(sceneProgressValue - 0.5) * 2
                gsap.set(textRef, { opacity: Math.max(0, Math.min(1, opacity)) })
              } else if (progress < sceneStart || progress > sceneEnd) {
                gsap.set(textRef, { opacity: 0 })
              }
            },
          },
          duration: 1,
          ease: 'power3.out',
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [defaultScenes])

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-white"
      style={{ minHeight: '400vh' }}
    >
      {/* Sticky Product Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-b from-white via-gray-50/20 to-white">
        <div className="relative h-full w-full flex items-center justify-center">
          {/* Product Image with 3D Rotation */}
          <div
            ref={productRef}
            className="relative w-full max-w-5xl mx-auto px-8"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
          >
            <div className="relative aspect-square w-full max-w-3xl mx-auto">
              <Image
                src={defaultScenes[currentScene]?.image || defaultScenes[0].image}
                alt={product.name}
                fill
                className="object-contain"
                priority
                quality={95}
              />
            </div>
          </div>

          {/* Text Overlays - One per scene */}
          {defaultScenes.map((scene, index) => (
            <div
              key={index}
              ref={(el) => (textRefs.current[index] = el)}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ opacity: index === currentScene ? 1 : 0 }}
            >
              <div className="text-center px-4 max-w-4xl mx-auto">
                <h2 className="font-hero text-5xl md:text-6xl lg:text-7xl mb-6 text-gray-900 leading-tight tracking-tight">
                  {scene.headline}
                </h2>
                <p className="font-body text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                  {scene.caption}
                </p>
              </div>
            </div>
          ))}

          {/* Subtle Gold Accent Line */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>
      </div>

      {/* Scene Markers */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-6">
          {defaultScenes.map((_, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                index === currentScene
                  ? 'w-3 h-3 bg-amber-400'
                  : 'w-2 h-2 bg-gray-300'
              } rounded-full`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface EditorialGridProps {
  products: Product[]
  title?: string
  description?: string
}

export function EditorialGrid({ products, title, description }: EditorialGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="w-full bg-white py-20 md:py-32">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {(title || description) && (
          <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
            {title && (
              <h2 className="font-hero text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900 leading-tight tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="font-body text-base md:text-lg text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Clean Modular Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {products.map((product, index) => {
            const primaryImage = product.images?.[0]?.image_url
            const isHovered = hoveredIndex === index

            return (
              <div
                key={product.id}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link href={`/products/${product.slug || product.id}`}>
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 mb-6">
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-700 ease-out ${
                          isHovered ? 'scale-105' : 'scale-100'
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-hero text-gray-200">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Caption - Reveals on Hover */}
                  <div
                    className={`transition-all duration-300 ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <h3 className="font-menu text-base md:text-lg mb-2 text-gray-900 tracking-wide">
                      {product.name.toUpperCase()}
                    </h3>
                    {product.short_description && (
                      <p className="font-body text-sm text-gray-600 line-clamp-2 mb-4">
                        {product.short_description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-900 transition-colors">
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Price - Always Visible */}
                  <div className="mt-4">
                    {product.sale_price ? (
                      <div className="flex items-center gap-3">
                        <span className="font-menu text-lg text-gray-900">
                          ₹{product.sale_price.toLocaleString()}
                        </span>
                        <span className="font-body text-sm text-gray-500 line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="font-menu text-lg text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

