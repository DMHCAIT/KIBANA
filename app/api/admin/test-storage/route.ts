import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Test listing root
    const { data: rootList, error: rootError } = await supabase.storage
      .from('product-images')
      .list('', {
        limit: 100,
        offset: 0,
      })

    // Test listing with undefined
    const { data: undefinedList, error: undefinedError } = await supabase.storage
      .from('product-images')
      .list(undefined, {
        limit: 100,
        offset: 0,
      })

    // Test listing products folder
    const { data: productsList, error: productsError } = await supabase.storage
      .from('product-images')
      .list('products', {
        limit: 100,
        offset: 0,
      })

    return NextResponse.json({
      root: {
        data: rootList,
        error: rootError?.message,
        count: rootList?.length || 0,
      },
      undefined: {
        data: undefinedList,
        error: undefinedError?.message,
        count: undefinedList?.length || 0,
      },
      products: {
        data: productsList,
        error: productsError?.message,
        count: productsList?.length || 0,
      },
      allRootItems: rootList?.map(item => ({
        name: item.name,
        id: item.id,
        metadata: item.metadata,
        updated_at: item.updated_at,
      })) || [],
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to test storage' }, { status: 500 })
  }
}

