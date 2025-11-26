import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Package } from 'lucide-react'
import Link from 'next/link'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { ImportProductsButton } from '@/components/admin/ImportProductsButton'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Products Management | KIBANA Admin',
  description: 'Manage your product catalog - Add, edit, and organize products',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: '/admin/products',
  },
}

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Products
              </h1>
              <p className="text-muted-foreground mt-1">Manage your product catalog</p>
            </div>
          </div>
          <div className="flex gap-3">
            <ImportProductsButton />
            <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all">
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ProductsTable products={products || []} />
      </div>
    </div>
  )
}

