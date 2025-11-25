'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Plus, GripVertical, Eye, Settings } from 'lucide-react'
import { HomepageSectionEditor } from '@/components/admin/HomepageSectionEditor'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface HomepageSection {
  id: string
  type: 'hero' | 'categories' | 'products' | 'banner' | 'testimonials' | 'newsletter'
  order: number
  enabled: boolean
  data: any
}

const defaultSections: HomepageSection[] = [
  { id: '1', type: 'hero', order: 1, enabled: true, data: {} },
  { id: '2', type: 'categories', order: 2, enabled: true, data: {} },
  { id: '3', type: 'products', order: 3, enabled: true, data: {} },
  { id: '4', type: 'banner', order: 4, enabled: true, data: {} },
  { id: '5', type: 'testimonials', order: 5, enabled: true, data: {} },
  { id: '6', type: 'newsletter', order: 6, enabled: true, data: {} },
]

export default function HomepageEditorPage() {
  const [sections, setSections] = useState<HomepageSection[]>(defaultSections)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    const { data } = await supabase
      .from('home_settings')
      .select('*')
      .eq('key', 'homepage_sections')
      .single()

    if (data?.value) {
      setSections(data.value)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index + 1,
        }))
      })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('home_settings')
        .upsert({
          key: 'homepage_sections',
          value: sections,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      toast.success('Homepage sections saved')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleSection = (sectionId: string) => {
    setSections(sections.map(s =>
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    ))
  }

  const getSectionName = (type: string) => {
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

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Homepage Editor
              </h1>
              <p className="text-muted-foreground mt-1">Customize your homepage layout</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="border-2 hover:bg-gray-50">
              <a href="/" target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </a>
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sections List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Available Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['hero', 'categories', 'products', 'banner', 'testimonials', 'newsletter'].map((type) => {
                  const section = sections.find(s => s.type === type)
                  return (
                    <Button
                      key={type}
                      variant={section?.enabled ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => {
                        if (section) {
                          setEditingSection(section.id)
                        } else {
                          const newSection: HomepageSection = {
                            id: Date.now().toString(),
                            type: type as any,
                            order: sections.length + 1,
                            enabled: true,
                            data: {},
                          }
                          setSections([...sections, newSection])
                          setEditingSection(newSection.id)
                        }
                      }}
                    >
                      {getSectionName(type)}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="text-gray-900">Page Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {sections.map((section) => (
                      <SortableSectionItem
                        key={section.id}
                        section={section}
                        onEdit={() => setEditingSection(section.id)}
                        onToggle={() => handleToggleSection(section.id)}
                        isEditing={editingSection === section.id}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>

          {editingSection && (
            <HomepageSectionEditor
              section={sections.find(s => s.id === editingSection)!}
              onUpdate={(data) => {
                setSections(sections.map(s =>
                  s.id === editingSection ? { ...s, data } : s
                ))
              }}
              onClose={() => setEditingSection(null)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function SortableSectionItem({
  section,
  onEdit,
  onToggle,
  isEditing,
}: {
  section: HomepageSection
  onEdit: () => void
  onToggle: () => void
  isEditing: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 border rounded-lg ${
        isEditing ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
      } ${!section.enabled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{getSectionName(section.type)}</h3>
            {section.enabled ? (
              <Badge variant="default">Enabled</Badge>
            ) : (
              <Badge variant="secondary">Disabled</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Order: {section.order}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            {section.enabled ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>
    </div>
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

