import { createClient } from '@/lib/supabase/server'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Tag, Edit } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: EditCategoryPageProps): Promise<Metadata> {
  return {
    title: 'Edit Category | KIBANA Admin',
    description: 'Update category information',
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `/admin/categories/${params.id}/edit`,
    },
  }
}

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
            <Edit className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Edit Category
            </h1>
            <p className="text-muted-foreground mt-1">Update category information</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CategoryForm category={category} />
      </div>
    </div>
  )
}

