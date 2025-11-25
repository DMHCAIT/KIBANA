import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { Package, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Add New Product | KIBANA Admin',
  description: 'Create a new product in your catalog',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: '/admin/products/new',
  },
}

export default async function NewProductPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Add New Product
            </h1>
            <p className="text-muted-foreground mt-1">Create a new product in your catalog</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ProductForm categories={categories || []} />
      </div>
    </div>
  )
}

