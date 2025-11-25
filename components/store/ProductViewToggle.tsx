'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Grid3x3, List } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProductViewToggle() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentView = searchParams.get('view') || 'grid'

  const handleViewChange = (view: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams.toString())
    if (view === 'grid') {
      params.delete('view')
    } else {
      params.set('view', view)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 border rounded-lg p-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleViewChange('grid')}
        className={cn(
          'h-8 w-8',
          currentView === 'grid' && 'bg-background shadow-sm'
        )}
        aria-label="Grid view"
      >
        <Grid3x3 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleViewChange('list')}
        className={cn(
          'h-8 w-8',
          currentView === 'list' && 'bg-background shadow-sm'
        )}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}

