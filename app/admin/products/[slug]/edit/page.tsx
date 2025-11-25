import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Package, Edit } from 'lucide-react'

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  return {
    title: 'Edit Product | KIBANA Admin',
    description: 'Update product information',
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `/admin/products/${params.slug}/edit`,
    },
  }
}

interface EditProductPageProps {
  params: {
    slug: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const supabase = await createClient()

  // Try to find by ID first (for backward compatibility), then by slug
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      images:product_images(*)
    `)
    .or(`id.eq.${params.slug},slug.eq.${params.slug}`)
    .single()

  if (!product) {
    notFound()
  }

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
            <Edit className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Edit Product
            </h1>
            <p className="text-muted-foreground mt-1">Update product information</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ProductForm product={product} categories={categories || []} />
      </div>
    </div>
  )
}

