'use client'

import { useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Sparkles, Filter, X, Loader2 } from 'lucide-react'
import { Product } from '@/types'
import { ProductCard } from '@/components/store/ProductCard'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { ProductFilters } from '@/components/store/ProductFilters'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [aiSearch, setAiSearch] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [categories] = useState<never[]>([])
  const [brands] = useState<string[]>([])
  const [colors] = useState<string[]>([])
  const [materials] = useState<string[]>([])
  const supabase = createClient()

  const performSearch = useCallback(async (searchQuery: string, useAI = false) => {
    if (!searchQuery.trim()) {
      setProducts([])
      return
    }

    setLoading(true)
    setAiSearch(useAI)

    try {
      if (useAI) {
        // AI-powered search
        const response = await fetch('/api/ai/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery }),
        })

        const data = await response.json()
        setProducts(data.products || [])
      } else {
        // Regular search
        const { data } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            images:product_images(*)
          `)
          .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`)
          .eq('is_active', true)
          .limit(50)

        setProducts(data || [])
      }

      // Save to search history
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      const updated = [searchQuery, ...history.filter((h: string) => h !== searchQuery)].slice(0, 10)
      localStorage.setItem('searchHistory', JSON.stringify(updated))
      setSearchHistory(updated)

      // Update URL
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`, { scroll: false })
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [supabase, router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query, false)
  }

  const handleAISearch = () => {
    performSearch(query, true)
  }

  const clearSearch = () => {
    setQuery('')
    setProducts([])
    router.push('/search', { scroll: false })
  }

  const suggestions = [
    'Pink office bag',
    'Leather handbag under 5000',
    'Designer tote bags',
    'Evening clutch bags',
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StoreHeader />
      <main className="flex-1">
        <div className="container px-4 py-12">
          {/* Search Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-black text-white rounded-full shadow-sm">
              <span className="text-sm font-bold uppercase tracking-wider">Search</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900">
              Search Products
            </h1>
          </div>
          <div className="mb-8">
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for handbags, brands, styles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-24 h-14 text-lg"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" size="lg" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleAISearch}
              disabled={loading || !query}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Search
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </form>

        {/* AI Search Badge */}
        {aiSearch && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="h-3 w-3" />
              AI-Powered Results
            </Badge>
            <span className="text-sm text-muted-foreground">
              Understanding your intent for better results
            </span>
          </motion.div>
        )}

        {/* Search History */}
        {!query && searchHistory.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Recent Searches</p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery(term)
                    performSearch(term, false)
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {!query && products.length === 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery(suggestion)
                    performSearch(suggestion, true)
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters Sidebar */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <ProductFilters
                categories={categories}
                brands={brands}
                colors={colors}
                materials={materials}
                minPrice={0}
                maxPrice={100000}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Searching...</p>
          </div>
        </div>
      ) : products.length === 0 && query ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground mb-4">
            We couldn&apos;t find any products matching &quot;{query}&quot;
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={clearSearch}>
              Clear Search
            </Button>
            <Button onClick={handleAISearch}>
              <Sparkles className="mr-2 h-4 w-4" />
              Try AI Search
            </Button>
          </div>
        </motion.div>
      ) : products.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Found {products.length} {products.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <div className="text-center py-16">
          <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Start Your Search</h3>
          <p className="text-muted-foreground">
            Enter a search term or use AI search for natural language queries
          </p>
        </div>
      )}
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

