'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const testimonials = [
  {
    id: 1,
    name: 'Lahareesh',
    role: 'Fashion Blogger',
    image: '/testimonials/sarah.jpg',
    rating: 5,
    text: 'The quality of KIBANA handbags is exceptional. I\'ve been using my tote bag for months and it still looks brand new. The craftsmanship is truly remarkable.',
  },
  {
    id: 2,
    name: 'Saranya',
    
    role: 'Business Executive',
    image: '/testimonials/emily.jpg',
    rating: 5,
    text: 'I love how versatile KIBANA bags are. Perfect for both professional settings and casual outings. The design is timeless and elegant.',
  },
  {
    id: 3,
    name: 'Angela',
    role: 'Lifestyle Influencer',
    image: '/testimonials/maria.jpg',
    rating: 5,
    text: 'As someone who travels frequently, I appreciate the durability and style of KIBANA bags. They\'re my go-to choice for every occasion.',
  },
  {
    id: 4,
    name: 'Jessica Williams',
    role: 'Interior Designer',
    image: '/testimonials/jessica.jpg',
    rating: 5,
    text: 'The attention to detail in every KIBANA handbag is incredible. Each piece feels like a work of art. Highly recommended!',
  },
]

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll('[data-testimonial-card]')
    
    cards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        delay: index * 0.1,
        duration: 0.8,
        ease: 'power3.out',
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-white section-luxury border-t border-gray-100">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto py-16 md:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 lg:mb-20 text-center max-w-3xl mx-auto"
        >
          <div className="inline-block mb-4 px-4 py-1.5 bg-black text-white text-xs font-medium tracking-wider uppercase rounded-full">
            <span>Testimonials</span>
          </div>
          <h2 className="font-hero text-4xl md:text-5xl lg:text-6xl mb-6 md:mb-8 text-gray-900 leading-tight tracking-tight">
            What Our Customers Say
          </h2>
          <p className="font-body text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust KIBANA for their luxury handbag needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              data-testimonial-card
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-gray-200 hover:border-black">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-semibold">
                      <span className="text-sm">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                      <p className="text-xs text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

