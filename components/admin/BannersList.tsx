'use client'

import { Banner } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye, Calendar, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BannersListProps {
  banners: Banner[]
}

export function BannersList({ banners: initialBanners }: BannersListProps) {
  const [banners, setBanners] = useState(initialBanners)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete banner')
    } else {
      setBanners(banners.filter(b => b.id !== id))
      toast.success('Banner deleted')
    }
  }

  const handleToggleStatus = async (banner: Banner) => {
    const { error } = await supabase
      .from('banners')
      .update({ is_active: !banner.is_active })
      .eq('id', banner.id)

    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success(`Banner ${banner.is_active ? 'deactivated' : 'activated'}`)
      router.refresh()
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {banners.length === 0 ? (
        <div className="col-span-full text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-muted-foreground font-medium">No banners found</p>
          </div>
        </div>
      ) : (
        banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden border-2 border-gray-200 hover:border-pink-300 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
            <div className="relative h-56 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
              {banner.image_url ? (
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-pink-300" />
                </div>
              )}
              {!banner.is_active && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <Badge className="bg-gray-600 text-white border-0">Inactive</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-5 bg-white">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                  <Badge className={banner.is_active 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0' 
                    : 'bg-gray-200 text-gray-700 border-0'}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                  <Calendar className="h-3 w-3" />
                  <span>Position: <span className="font-semibold">{banner.position}</span></span>
                  <span>•</span>
                  <span>Order: <span className="font-semibold">{banner.order}</span></span>
                </div>
                {banner.link_url && (
                  <p className="text-xs text-blue-600 truncate bg-blue-50 rounded px-2 py-1">{banner.link_url}</p>
                )}
              </div>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" size="sm" className="flex-1 border-2 hover:bg-purple-50 hover:border-purple-300 rounded-lg" asChild>
                  <Link href={`/admin/banners/${banner.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleToggleStatus(banner)}>
                      {banner.is_active ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(banner.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

