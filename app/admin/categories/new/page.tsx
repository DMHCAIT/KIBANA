import { createClient } from '@/lib/supabase/server'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { Metadata } from 'next'
import { Tag, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Add New Category | KIBANA Admin',
  description: 'Create a new product category',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: '/admin/categories/new',
  },
}

export default async function NewCategoryPage() {
  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Add New Category
            </h1>
            <p className="text-muted-foreground mt-1">Create a new product category</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CategoryForm />
      </div>
    </div>
  )
}

