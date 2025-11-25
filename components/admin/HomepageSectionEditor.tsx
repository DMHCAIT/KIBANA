'use client'

import { HomepageSection } from '@/app/admin/homepage/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'
import { useState } from 'react'

interface HomepageSectionEditorProps {
  section: HomepageSection
  onUpdate: (data: any) => void
  onClose: () => void
}

export function HomepageSectionEditor({ section, onUpdate, onClose }: HomepageSectionEditorProps) {
  const [data, setData] = useState(section.data || {})

  const handleUpdate = () => {
    onUpdate(data)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Edit {getSectionName(section.type)}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.type === 'hero' && (
          <>
            <div>
              <Label>Title</Label>
              <Input
                value={data.title || ''}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Textarea
                value={data.subtitle || ''}
                onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Video URL</Label>
              <Input
                value={data.video_url || ''}
                onChange={(e) => setData({ ...data, video_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={data.image_url || ''}
                onChange={(e) => setData({ ...data, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </>
        )}

        {section.type === 'products' && (
          <>
            <div>
              <Label>Section Title</Label>
              <Input
                value={data.title || 'Featured Products'}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Number of Products</Label>
              <Input
                type="number"
                value={data.count || 8}
                onChange={(e) => setData({ ...data, count: parseInt(e.target.value) || 8 })}
              />
            </div>
          </>
        )}

        {section.type === 'banner' && (
          <>
            <div>
              <Label>Banner Title</Label>
              <Input
                value={data.title || ''}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Banner Image URL</Label>
              <Input
                value={data.image_url || ''}
                onChange={(e) => setData({ ...data, image_url: e.target.value })}
              />
            </div>
            <div>
              <Label>Link URL</Label>
              <Input
                value={data.link_url || ''}
                onChange={(e) => setData({ ...data, link_url: e.target.value })}
              />
            </div>
          </>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={handleUpdate} className="flex-1">
            Save Changes
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function getSectionName(type: string) {
  const names: Record<string, string> = {
    hero: 'Hero Section',
    categories: 'Categories',
    products: 'Featured Products',
    banner: 'Banner',
    testimonials: 'Testimonials',
    newsletter: 'Newsletter',
  }
  return names[type] || type
}

