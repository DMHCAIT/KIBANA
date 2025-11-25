import { createClient } from '@/lib/supabase/server'
import { BannerForm } from '@/components/admin/BannerForm'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Image, Edit } from 'lucide-react'

export async function generateMetadata({ params }: EditBannerPageProps): Promise<Metadata> {
  return {
    title: 'Edit Banner | KIBANA Admin',
    description: 'Update banner information',
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `/admin/banners/${params.id}/edit`,
    },
  }
}

interface EditBannerPageProps {
  params: {
    id: string
  }
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const supabase = await createClient()

  const { data: banner } = await supabase
    .from('banners')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!banner) {
    notFound()
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
            <Edit className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Edit Banner
            </h1>
            <p className="text-muted-foreground mt-1">Update banner information</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <BannerForm banner={banner} />
      </div>
    </div>
  )
}

