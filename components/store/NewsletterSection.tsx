'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Store newsletter subscription in Supabase
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email, subscribed_at: new Date().toISOString() })

      if (error && error.code !== '23505') { // Ignore duplicate key errors
        throw error
      }

      setSuccess(true)
      setEmail('')
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Newsletter subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-black mb-6">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Stay in the Loop
          </h2>
          <p className="text-base text-gray-600 mb-8">
            Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and fashion tips.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
              disabled={loading || success}
            />
            <Button
              type="submit"
              size="lg"
              disabled={loading || success}
              className="whitespace-nowrap bg-black hover:bg-gray-900 text-white"
            >
              {success ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Subscribed!
                </>
              ) : loading ? (
                'Subscribing...'
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>
          {success && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-green-600 mt-4"
            >
              Thank you for subscribing! Check your inbox for a confirmation email.
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

