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
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // If OpenAI is configured, use AI-powered search
    const openai = getOpenAIClient()
    if (openai) {
      // Generate search terms from natural language query
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a search assistant for an e-commerce store selling handbags. Extract key search terms, filters, and intent from user queries. Return a JSON object with: searchTerms (array of keywords), category (if mentioned), priceRange (min/max if mentioned), color (if mentioned), material (if mentioned).',
          },
          {
            role: 'user',
            content: query,
          },
        ],
        response_format: { type: 'json_object' },
      })

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}')
      
      // Use AI-extracted terms for database search
      const supabase = await createClient()
      let dbQuery = supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('is_active', true)

      // Apply search terms
      if (aiResponse.searchTerms && aiResponse.searchTerms.length > 0) {
        const searchTerm = aiResponse.searchTerms.join(' ')
        dbQuery = dbQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      // Apply filters
      if (aiResponse.priceRange) {
        if (aiResponse.priceRange.min) {
          dbQuery = dbQuery.gte('price', aiResponse.priceRange.min)
        }
        if (aiResponse.priceRange.max) {
          dbQuery = dbQuery.lte('price', aiResponse.priceRange.max)
        }
      }

      const { data: products } = await dbQuery.limit(20)

      return NextResponse.json({
        products: products || [],
        aiExtracted: aiResponse,
      })
    } else {
      // Fallback to regular search
      const supabase = await createClient()
      const { data: products } = await supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(20)

      return NextResponse.json({
        products: products || [],
        aiExtracted: null,
      })
    }
  } catch (error: any) {
    console.error('AI search error:', error)
    // Fallback to regular search on error
    const supabase = await createClient()
    const { query } = await request.json()
    const { data: products } = await supabase
      .from('products')
      .select('*, category:categories(*), images:product_images(*)')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20)

    return NextResponse.json({
      products: products || [],
      aiExtracted: null,
    })
  }
}
