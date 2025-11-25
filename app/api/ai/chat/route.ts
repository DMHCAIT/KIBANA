import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // If OpenAI is configured, use AI chat
    if (process.env.OPENAI_API_KEY) {
      const supabase = await createClient()

      // Get product information for context
      const { data: products } = await supabase
        .from('products')
        .select('name, description, price, stock_status')
        .eq('is_active', true)
        .limit(10)

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful customer support assistant for KIBANA, a luxury handbag e-commerce store. 
            You can help with:
            - Product information and recommendations
            - Order status inquiries
            - Shipping and returns information
            - General questions about the store
            
            Available products: ${JSON.stringify(products?.slice(0, 5) || [])}
            
            Be friendly, helpful, and concise. If you don't know something, direct the customer to contact support.`,
          },
          ...(conversationHistory || []),
          {
            role: 'user',
            content: message,
          },
        ],
      })

      const response = completion.choices[0].message.content

      return NextResponse.json({
        response,
        timestamp: new Date().toISOString(),
      })
    } else {
      // Fallback responses
      const lowerMessage = message.toLowerCase()

      if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
        return NextResponse.json({
          response: 'You can track your orders in your account dashboard. Go to /account/orders to view all your orders and their status.',
          timestamp: new Date().toISOString(),
        })
      }

      if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
        return NextResponse.json({
          response: 'We offer free standard shipping on all orders. Orders are typically processed within 1-2 business days and delivered within 5-7 business days.',
          timestamp: new Date().toISOString(),
        })
      }

      if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
        return NextResponse.json({
          response: 'We accept returns within 30 days of purchase for a full refund or exchange. Items must be in their original condition with all tags attached. Please contact support for return authorization.',
          timestamp: new Date().toISOString(),
        })
      }

      return NextResponse.json({
        response: 'Thank you for contacting KIBANA support. How can I help you today? You can ask about products, orders, shipping, or returns.',
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error: any) {
    console.error('AI chat error:', error)
    return NextResponse.json({
      response: 'I apologize, but I\'m having trouble processing your request. Please try again or contact our support team.',
      timestamp: new Date().toISOString(),
    })
  }
}
