import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { productId, userId, userHistory } = await request.json()

    const supabase = await createClient()

    // Get current product
    const { data: currentProduct } = await supabase
      .from('products')
      .select('*, category:categories(*), images:product_images(*)')
      .eq('id', productId)
      .single()

    if (!currentProduct) {
      return NextResponse.json({ products: [] })
    }

    // If OpenAI is configured, use AI for recommendations
    const openai = getOpenAIClient()
    if (openai && userHistory) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a product recommendation assistant. Based on user browsing history and current product, suggest similar or complementary products. Return a JSON array of product IDs that would be good recommendations.',
          },
          {
            role: 'user',
            content: `Current product: ${currentProduct.name} (${currentProduct.category?.name}). User history: ${JSON.stringify(userHistory)}. Suggest 4 product IDs.`,
          },
        ],
        response_format: { type: 'json_object' },
      })

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}')
      const recommendedIds = aiResponse.productIds || []

      if (recommendedIds.length > 0) {
        const { data: products } = await supabase
          .from('products')
          .select('*, category:categories(*), images:product_images(*)')
          .in('id', recommendedIds)
          .eq('is_active', true)
          .limit(4)

        return NextResponse.json({ products: products || [] })
      }
    }

    // Fallback: Get products from same category
    const { data: products } = await supabase
      .from('products')
      .select('*, category:categories(*), images:product_images(*)')
      .eq('category_id', currentProduct.category_id)
      .eq('is_active', true)
      .neq('id', productId)
      .limit(4)

    return NextResponse.json({ products: products || [] })
  } catch (error: any) {
    console.error('AI recommendations error:', error)
    
    // Fallback to category-based recommendations
    const supabase = await createClient()
    const { productId } = await request.json()
    
    const { data: currentProduct } = await supabase
      .from('products')
      .select('category_id')
      .eq('id', productId)
      .single()

    if (!currentProduct) {
      return NextResponse.json({ products: [] })
    }

    const { data: products } = await supabase
      .from('products')
      .select('*, category:categories(*), images:product_images(*)')
      .eq('category_id', currentProduct.category_id)
      .eq('is_active', true)
      .neq('id', productId)
      .limit(4)

    return NextResponse.json({ products: products || [] })
  }
}
