'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    // Parallax effect for image
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
      })
    }

    // Fade in text
    if (textRef.current) {
      gsap.from(textRef.current, {
        opacity: 0,
        x: -50,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        duration: 1,
        ease: 'power3.out',
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50 border-y border-gray-200">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] bg-gray-200 overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-gray-300">KIBANA</div>
            </div>
          </motion.div>

          <motion.div
            ref={textRef}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-block px-3 py-1 bg-black text-white text-xs font-medium tracking-wider uppercase rounded-full">
              Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Crafting Luxury, One Handbag at a Time
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              At KIBANA, we believe that every woman deserves to carry a piece of art. Our handbags are meticulously crafted using the finest materials, combining timeless elegance with modern functionality.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              Each design is thoughtfully created to reflect the sophistication and confidence of the modern woman. We source premium leathers and materials from around the world, ensuring every detail meets our exacting standards.
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" className="bg-black hover:bg-gray-900 text-white" asChild>
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">
                  Shop Collection
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

