import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Image } from 'lucide-react'
import Link from 'next/link'
import { BannersList } from '@/components/admin/BannersList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Banners Management | KIBANA Admin',
  description: 'Manage homepage and promotional banners',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: '/admin/banners',
  },
}

export default async function AdminBannersPage() {
  const supabase = await createClient()

  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .order('order', { ascending: true })

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
              <Image className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Banners
              </h1>
              <p className="text-muted-foreground mt-1">Manage homepage and promotional banners</p>
            </div>
          </div>
          <Button asChild className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all">
            <Link href="/admin/banners/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <BannersList banners={banners || []} />
      </div>
    </div>
  )
}

