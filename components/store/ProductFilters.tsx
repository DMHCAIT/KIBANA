'use client'

import { Category } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'

interface ProductFiltersProps {
  categories: Category[]
  brands: string[]
  colors: string[]
  materials: string[]
}

export function ProductFilters({ 
  categories, 
  brands, 
  colors, 
  materials
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand')?.split(',') || []
  )
  const [selectedColors, setSelectedColors] = useState<string[]>(
    searchParams.get('color')?.split(',') || []
  )
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    searchParams.get('material')?.split(',') || []
  )

  const applyFilter = (key: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(','))
      } else {
        params.delete(key)
      }
    } else {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }
    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }


  const toggleBrand = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand]
    setSelectedBrands(newBrands)
    applyFilter('brand', newBrands)
  }

  const toggleColor = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color]
    setSelectedColors(newColors)
    applyFilter('color', newColors)
  }

  const toggleMaterial = (material: string) => {
    const newMaterials = selectedMaterials.includes(material)
      ? selectedMaterials.filter(m => m !== material)
      : [...selectedMaterials, material]
    setSelectedMaterials(newMaterials)
    applyFilter('material', newMaterials)
  }

  const clearAllFilters = () => {
    setSelectedBrands([])
    setSelectedColors([])
    setSelectedMaterials([])
    router.push('/products')
  }

  const activeFiltersCount = 
    (searchParams.get('category') ? 1 : 0) +
    selectedBrands.length +
    selectedColors.length +
    selectedMaterials.length

  return (
    <div className="space-y-4">
      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">
                  {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} active
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 text-xs"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <button
            onClick={() => applyFilter('category', '')}
            className={`text-sm w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors ${
              !searchParams.get('category') ? 'bg-muted font-medium' : ''
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => applyFilter('category', category.id)}
              className={`text-sm w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors ${
                searchParams.get('category') === category.id ? 'bg-muted font-medium' : ''
              }`}
            >
              {category.name}
            </button>
          ))}
        </CardContent>
      </Card>


      {/* Brands */}
      {brands.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Brands</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-60 overflow-y-auto">
            {brands.slice(0, 10).map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {colors.slice(0, 12).map((color) => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                    selectedColors.includes(color)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border hover:border-primary/50'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Materials */}
      {materials.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Materials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-60 overflow-y-auto">
            {materials.map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox
                  id={`material-${material}`}
                  checked={selectedMaterials.includes(material)}
                  onCheckedChange={() => toggleMaterial(material)}
                />
                <Label
                  htmlFor={`material-${material}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {material}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
