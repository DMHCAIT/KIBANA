'use client'

import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { ProductVariantCard } from './ProductVariantCard'
import { ProductListItem } from './ProductListItem'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface ProductGridProps {
  products: Product[]
  totalCount: number
  currentPage: number
  limit: number
  view?: 'grid' | 'list'
  error?: any
}

export function ProductGrid({ 
  products, 
  totalCount, 
  currentPage, 
  limit,
  view = 'grid',
  error 
}: ProductGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(totalCount / limit)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(false)
  }, [products])

  const changePage = (page: number) => {
    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    // Use current pathname to maintain category/product page context
    const pathname = window.location.pathname
    router.push(`${pathname}?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
          <Package className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Error Loading Products</h3>
        <p className="text-muted-foreground mb-4">
          We encountered an error while loading products. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push('/products')}
        >
          Clear Filters
        </Button>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Products Display */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : view === 'list' ? (
        <div className="space-y-4 mb-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProductListItem product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {products.map((product, index) => {
            // Check if this is a variant card (expanded from color variants)
            const isVariantCard = (product as any)._isVariantCard
            const displayVariant = (product as any)._displayVariant
            const displayVariantImage = (product as any)._displayVariantImage
            
            return (
              <motion.div
                key={isVariantCard ? `${product.id}-${displayVariant?.id}` : product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {isVariantCard ? (
                  <ProductVariantCard 
                    product={product} 
                    variant={displayVariant}
                    variantImage={displayVariantImage}
                  />
                ) : (
                  <ProductCard product={product} />
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Advanced Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} products
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 7) {
                  pageNum = i + 1
                } else if (currentPage <= 4) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i
                } else {
                  pageNum = currentPage - 3 + i
                }

                if (totalPages > 7 && i === 0 && currentPage > 4) {
                  return (
                    <>
                      <Button
                        key="first"
                        variant="outline"
                        size="sm"
                        onClick={() => changePage(1)}
                        className="w-10"
                      >
                        1
                      </Button>
                      <span className="px-2 text-muted-foreground">...</span>
                    </>
                  )
                }

                if (totalPages > 7 && i === 6 && currentPage < totalPages - 3) {
                  return (
                    <>
                      <span className="px-2 text-muted-foreground">...</span>
                      <Button
                        key="last"
                        variant="outline"
                        size="sm"
                        onClick={() => changePage(totalPages)}
                        className="w-10"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => changePage(pageNum)}
                    disabled={isLoading}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
