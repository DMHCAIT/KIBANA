'use client'

import { useState } from 'react'
import { ProductVariant } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ProductVariantsManagerProps {
  productId?: string
  variants: ProductVariant[]
  onVariantsChange: (variants: ProductVariant[]) => void
}

export function ProductVariantsManager({ productId, variants, onVariantsChange }: ProductVariantsManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newVariant, setNewVariant] = useState<Partial<ProductVariant>>({
    color: '',
    size: '',
    material: '',
    sku: '',
    price: null,
    stock_quantity: 0,
    is_active: true,
  })

  const handleAddVariant = () => {
    if (!newVariant.sku) {
      toast.error('SKU is required')
      return
    }

    const variant: ProductVariant = {
      id: `temp-${Date.now()}`,
      product_id: productId || '',
      color: newVariant.color || null,
      size: newVariant.size || null,
      material: newVariant.material || null,
      sku: newVariant.sku,
      price: newVariant.price || null,
      stock_quantity: newVariant.stock_quantity || 0,
      is_active: newVariant.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    onVariantsChange([...variants, variant])
    setNewVariant({
      color: '',
      size: '',
      material: '',
      sku: '',
      price: null,
      stock_quantity: 0,
      is_active: true,
    })
    setShowAddForm(false)
    toast.success('Variant added')
  }

  const handleRemove = (variantId: string) => {
    onVariantsChange(variants.filter(v => v.id !== variantId))
  }

  const handleUpdate = (variantId: string, field: keyof ProductVariant, value: any) => {
    onVariantsChange(
      variants.map(v =>
        v.id === variantId ? { ...v, [field]: value } : v
      )
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Product Variants</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <Card className="border-primary">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={newVariant.color || ''}
                    onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                    placeholder="e.g., Black, Red"
                  />
                </div>
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    value={newVariant.size || ''}
                    onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                    placeholder="e.g., Small, Medium"
                  />
                </div>
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={newVariant.material || ''}
                    onChange={(e) => setNewVariant({ ...newVariant, material: e.target.value })}
                    placeholder="e.g., Leather, Canvas"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={newVariant.sku || ''}
                    onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                    required
                    placeholder="Unique SKU"
                  />
                </div>
                <div>
                  <Label htmlFor="variant-price">Price (₹)</Label>
                  <Input
                    id="variant-price"
                    type="number"
                    step="0.01"
                    value={newVariant.price || ''}
                    onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="Override product price"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newVariant.stock_quantity || 0}
                    onChange={(e) => setNewVariant({ ...newVariant, stock_quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="variant-active"
                  checked={newVariant.is_active}
                  onCheckedChange={(checked) => setNewVariant({ ...newVariant, is_active: !!checked })}
                />
                <Label htmlFor="variant-active" className="cursor-pointer">
                  Variant is active
                </Label>
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={handleAddVariant}>
                  Add Variant
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {variants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No variants added. Click "Add Variant" to create one.
          </div>
        ) : (
          <div className="space-y-2">
            {variants.map((variant) => (
              <Card key={variant.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <Label className="text-xs text-muted-foreground">SKU</Label>
                      <Input
                        value={variant.sku}
                        onChange={(e) => handleUpdate(variant.id, 'sku', e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Color</Label>
                      <Input
                        value={variant.color || ''}
                        onChange={(e) => handleUpdate(variant.id, 'color', e.target.value)}
                        placeholder="Color"
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Size</Label>
                      <Input
                        value={variant.size || ''}
                        onChange={(e) => handleUpdate(variant.id, 'size', e.target.value)}
                        placeholder="Size"
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price || ''}
                        onChange={(e) => handleUpdate(variant.id, 'price', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="Auto"
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Stock</Label>
                      <Input
                        type="number"
                        value={variant.stock_quantity}
                        onChange={(e) => handleUpdate(variant.id, 'stock_quantity', parseInt(e.target.value) || 0)}
                        className="h-9"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Checkbox
                        checked={variant.is_active}
                        onCheckedChange={(checked) => handleUpdate(variant.id, 'is_active', checked)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(variant.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

