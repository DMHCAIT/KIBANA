'use client'

import { useState } from 'react'
import { ProductImage } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Star, GripVertical } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ProductImagesManagerProps {
  productId?: string
  images: ProductImage[]
  onImagesChange: (images: ProductImage[]) => void
}

export function ProductImagesManager({ productId, images, onImagesChange }: ProductImagesManagerProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `products/${fileName}`

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        return {
          id: `temp-${Date.now()}`,
          product_id: productId || '',
          image_url: publicUrl,
          alt_text: file.name,
          order: images.length,
          is_primary: images.length === 0,
        } as ProductImage
      })

      const newImages = await Promise.all(uploadPromises)
      onImagesChange([...images, ...newImages])
      toast.success(`${newImages.length} image(s) uploaded`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (imageId: string) => {
    onImagesChange(images.filter(img => img.id !== imageId))
  }

  const handleSetPrimary = (imageId: string) => {
    onImagesChange(
      images.map(img => ({
        ...img,
        is_primary: img.id === imageId,
      }))
    )
  }

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [moved] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, moved)
    onImagesChange(newImages.map((img, index) => ({ ...img, order: index })))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="image-upload">Upload Images</Label>
          <div className="mt-2">
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={uploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Images'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Upload multiple images. First image will be set as primary.
          </p>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border-2 border-transparent group-hover:border-primary transition-colors">
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || 'Product image'}
                    fill
                    className="object-cover"
                  />
                  {image.is_primary && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-primary">
                        <Star className="h-3 w-3 mr-1" />
                        Primary
                      </Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => handleSetPrimary(image.id)}
                      disabled={image.is_primary}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => handleRemove(image.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Input
                  value={image.alt_text || ''}
                  onChange={(e) => {
                    const updated = images.map(img =>
                      img.id === image.id ? { ...img, alt_text: e.target.value } : img
                    )
                    onImagesChange(updated)
                  }}
                  placeholder="Alt text"
                  className="mt-2 text-xs"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

