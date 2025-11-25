import { BannerForm } from '@/components/admin/BannerForm'
import { Metadata } from 'next'
import { Image, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Add New Banner | KIBANA Admin',
  description: 'Create a new promotional banner',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: '/admin/banners/new',
  },
}

export default function NewBannerPage() {
  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Add New Banner
            </h1>
            <p className="text-muted-foreground mt-1">Create a new promotional banner</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <BannerForm />
      </div>
    </div>
  )
}

