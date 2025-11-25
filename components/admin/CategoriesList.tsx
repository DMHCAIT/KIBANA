'use client'

import { Category } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, GripVertical, Image as ImageIcon, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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

interface CategoriesListProps {
  categories: Category[]
}

function SortableCategoryItem({ category, onDelete }: { category: Category; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      {category.banner_image ? (
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex-shrink-0 border-2 border-gray-200 shadow-md">
          <Image
            src={category.banner_image}
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center flex-shrink-0 border-2 border-gray-200 shadow-md">
          <ImageIcon className="h-8 w-8 text-purple-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
          {category.is_active ? (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">Active</Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-200 text-gray-700">Inactive</Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-1 mb-1">
          {category.description || 'No description'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Slug: <span className="font-mono">{category.slug}</span> • Order: {category.order}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 rounded-lg" asChild>
          <Link href={`/categories/${category.slug}`} target="_blank">
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-purple-50 hover:text-purple-600 rounded-lg" asChild>
          <Link href={`/admin/categories/${category.id}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(category.id)}
          className="hover:bg-red-50 hover:text-red-600 rounded-lg"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function CategoriesList({ categories: initialCategories }: CategoriesListProps) {
  const [categories, setCategories] = useState(initialCategories)
  const supabase = createClient()
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)

        // Update order in database
        newItems.forEach(async (item, index) => {
          await supabase
            .from('categories')
            .update({ order: index })
            .eq('id', item.id)
        })

        return newItems
      })

      toast.success('Category order updated')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete category')
    } else {
      setCategories(categories.filter(c => c.id !== id))
      toast.success('Category deleted')
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories found</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categories.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {categories.map((category) => (
                  <SortableCategoryItem
                    key={category.id}
                    category={category}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  )
}

