'use client'

import { useState, useEffect } from 'react'
import { Banner } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'

interface BannerFormProps {
  banner?: Banner
}

export function BannerForm({ banner }: BannerFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    image_url: banner?.image_url || '',
    video_url: banner?.video_url || '',
    link_url: banner?.link_url || '',
    position: banner?.position || 'homepage',
    is_active: banner?.is_active ?? true,
    order: banner?.order || 0,
    valid_from: banner?.created_at ? new Date(banner.created_at).toISOString().split('T')[0] : '',
    valid_until: banner?.updated_at ? new Date(banner.updated_at).toISOString().split('T')[0] : '',
  })
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `banners/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('banner-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('banner-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, image_url: publicUrl }))
      toast.success('Image uploaded')
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingVideo(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `banners/videos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('banner-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('banner-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, video_url: publicUrl }))
      toast.success('Video uploaded')
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload video')
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (banner) {
        const { error } = await supabase
          .from('banners')
          .update({
            title: formData.title,
            subtitle: formData.subtitle,
            image_url: formData.image_url,
            video_url: formData.video_url || null,
            link_url: formData.link_url,
            position: formData.position,
            is_active: formData.is_active,
            order: formData.order,
            updated_at: new Date().toISOString(),
          })
          .eq('id', banner.id)

        if (error) throw error
        toast.success('Banner updated')
      } else {
        // Get max order
        const { data: maxOrder } = await supabase
          .from('banners')
          .select('order')
          .eq('position', formData.position)
          .order('order', { ascending: false })
          .limit(1)

        const { error } = await supabase
          .from('banners')
          .insert({
            title: formData.title,
            subtitle: formData.subtitle,
            image_url: formData.image_url,
            video_url: formData.video_url || null,
            link_url: formData.link_url,
            position: formData.position,
            is_active: formData.is_active,
            order: (maxOrder?.[0]?.order || 0) + 1,
          })

        if (error) throw error
        toast.success('Banner created')
      }
      router.push('/admin/banners')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save banner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banner Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="position">Position *</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => setFormData({ ...formData, position: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">Hero Section</SelectItem>
                <SelectItem value="homepage">Homepage</SelectItem>
                <SelectItem value="sidebar">Sidebar</SelectItem>
                <SelectItem value="footer">Footer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="link_url">Link URL</Label>
            <Input
              id="link_url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          {formData.position === 'hero' ? (
            <div>
              <Label>Hero Video (for Hero Section)</Label>
              {formData.video_url ? (
                <div className="mt-2 relative w-full h-64 rounded-lg overflow-hidden bg-muted border-2">
                  <video
                    src={formData.video_url}
                    className="w-full h-full object-cover"
                    controls
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, video_url: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    disabled={uploadingVideo}
                    className="hidden"
                    id="banner-video-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('banner-video-upload')?.click()}
                    disabled={uploadingVideo}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingVideo ? 'Uploading...' : 'Upload Hero Video'}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Upload a video file for the hero section. Video will be displayed full-screen with no text.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Label>Banner Image</Label>
              {formData.image_url ? (
                <div className="mt-2 relative w-full h-64 rounded-lg overflow-hidden bg-muted border-2">
                  <Image
                    src={formData.image_url}
                    alt="Banner"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                    id="banner-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('banner-upload')?.click()}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload Banner Image'}
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: !!checked })}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Banner is active
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : banner ? 'Update Banner' : 'Create Banner'}
        </Button>
      </div>
    </form>
  )
}

