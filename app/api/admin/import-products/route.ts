import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { importAllProducts } from '@/lib/import-products'

export async function POST(request: NextRequest) {
  try {
    // Verify Supabase connection
    const supabase = createAdminClient()
    const { error: testError } = await supabase.from('products').select('id').limit(1)
    
    if (testError) {
      return NextResponse.json({ 
        error: 'Database connection failed. Please check your Supabase credentials.',
        details: testError.message 
      }, { status: 500 })
    }

    // Run the import
    const result = await importAllProducts()

    if (!result.success) {
      return NextResponse.json({ 
        error: result.message,
        details: result.details,
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true,
      message: result.message,
      details: result.details,
    }, { status: 200 })
  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to import products',
    }, { status: 500 })
  }
}

