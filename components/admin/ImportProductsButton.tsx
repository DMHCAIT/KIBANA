'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function ImportProductsButton() {
  const [importing, setImporting] = useState(false)
  const router = useRouter()

  const handleImport = async () => {
    if (!confirm('This will import all products from the spreadsheet. This may take a few minutes. Continue?')) {
      return
    }

    setImporting(true)
    toast.loading('Importing products...', { id: 'import' })

    try {
      const response = await fetch('/api/admin/import-products', {
        method: 'POST',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Import failed')
      }

      toast.success('Products imported successfully!', { id: 'import' })
      
      // Refresh the page to show new products
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to import products', { id: 'import' })
      console.error('Import error:', error)
    } finally {
      setImporting(false)
    }
  }

  return (
    <Button
      onClick={handleImport}
      disabled={importing}
      variant="outline"
      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
    >
      {importing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Importing...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          Import All Products
        </>
      )}
    </Button>
  )
}

