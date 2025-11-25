import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Tag } from 'lucide-react'
import Link from 'next/link'
import { CategoriesList } from '@/components/admin/CategoriesList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Categories Management | KIBANA Admin',
  description: 'Organize your products into categories',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: '/admin/categories',
  },
}

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('order', { ascending: true })

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Categories
              </h1>
              <p className="text-muted-foreground mt-1">Organize your products into categories</p>
            </div>
          </div>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all">
            <Link href="/admin/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CategoriesList categories={categories || []} />
      </div>
    </div>
  )
}

