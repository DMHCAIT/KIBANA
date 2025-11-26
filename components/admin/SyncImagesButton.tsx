'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw, Image } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function SyncImagesButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSync = async () => {
    if (!confirm('This will scan Supabase Storage and link all images to products in the database. Continue?')) {
      return
    }

    setLoading(true)
    toast.info('Scanning storage and syncing images... This may take a while.')

    try {
      const response = await fetch('/api/admin/sync-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to sync images')
      }

      toast.success(
        `Successfully synced images! Added ${result.totalAdded} new images, ${result.totalExists} already existed.`
      )
      router.refresh() // Refresh the product list
    } catch (error: any) {
      console.error('Sync error:', error)
      toast.error(error.message || 'Error syncing images.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSync}
      disabled={loading}
      variant="outline"
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all border-0"
    >
      {loading ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Syncing...
        </>
      ) : (
        <>
          <Image className="mr-2 h-4 w-4" />
          Sync Images from Storage
        </>
      )}
    </Button>
  )
}

