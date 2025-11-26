'use client'

import { useState, useEffect } from 'react'
import { Product, Category } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ProductVariantsManager } from './ProductVariantsManager'
import { ProductImagesManager } from './ProductImagesManager'

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    brand: product?.brand || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price || 0,
    sale_price: product?.sale_price || null,
    category_id: product?.category_id || '',
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    stock_status: product?.stock_status || 'in_stock',
    seo_title: product?.seo_title || '',
    seo_description: product?.seo_description || '',
  })
  const [variants, setVariants] = useState(product?.variants || [])
  const [images, setImages] = useState(product?.images || [])
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (!formData.slug && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Save images and variants first
      const productData = {
        ...formData,
        sale_price: formData.sale_price || null,
        specifications: null, // Can be added later if needed
      }

      if (product) {
        // Update existing product using API route to bypass RLS
        const response = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: product.id,
            ...productData,
            updated_at: new Date().toISOString(),
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to update product')
        }

        // Save images
        if (images.length > 0) {
          for (const image of images) {
            if (image.id && image.id.startsWith('temp-')) {
              // New image, save it
              await supabase
                .from('product_images')
                .insert({
                  product_id: product.id,
                  variant_id: image.variant_id || null,
                  image_url: image.image_url,
                  alt_text: image.alt_text || '',
                  order: image.order || 0,
                  is_primary: image.is_primary || false,
                })
            } else if (image.id) {
              // Update existing image
              await supabase
                .from('product_images')
                .update({
                  alt_text: image.alt_text || '',
                  order: image.order || 0,
                  is_primary: image.is_primary || false,
                })
                .eq('id', image.id)
            }
          }
        }

        // Save variants
        if (variants.length > 0) {
          for (const variant of variants) {
            if (variant.id && variant.id.startsWith('temp-')) {
              // New variant
              await supabase
                .from('product_variants')
                .insert({
                  product_id: product.id,
                  color: variant.color,
                  size: variant.size,
                  material: variant.material,
                  sku: variant.sku,
                  price: variant.price,
                  stock_quantity: variant.stock_quantity || 0,
                  is_active: variant.is_active ?? true,
                })
            } else if (variant.id) {
              // Update existing variant
              await supabase
                .from('product_variants')
                .update({
                  color: variant.color,
                  size: variant.size,
                  material: variant.material,
                  sku: variant.sku,
                  price: variant.price,
                  stock_quantity: variant.stock_quantity || 0,
                  is_active: variant.is_active ?? true,
                })
                .eq('id', variant.id)
            }
          }
        }

        toast.success('Product updated successfully')
        router.push('/admin/products')
        router.refresh()
      } else {
        // Create new product using API route
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to create product')
        }

        const newProduct = result.data

        // Save images
        if (images.length > 0 && newProduct.id) {
          for (const image of images) {
            await supabase
              .from('product_images')
              .insert({
                product_id: newProduct.id,
                variant_id: image.variant_id || null,
                image_url: image.image_url,
                alt_text: image.alt_text || '',
                order: image.order || 0,
                is_primary: image.is_primary || false,
              })
          }
        }

        // Save variants
        if (variants.length > 0 && newProduct.id) {
          for (const variant of variants) {
            await supabase
              .from('product_variants')
              .insert({
                product_id: newProduct.id,
                color: variant.color,
                size: variant.size,
                material: variant.material,
                sku: variant.sku,
                price: variant.price,
                stock_quantity: variant.stock_quantity || 0,
                is_active: variant.is_active ?? true,
              })
          }
        }

        toast.success('Product created successfully')
        router.push(`/admin/products/${newProduct.slug || newProduct.id}/edit`)
        router.refresh()
      }
    } catch (error: any) {
      console.error('Product save error:', error)
      toast.error(error.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="images">Images ({images.length})</TabsTrigger>
          <TabsTrigger value="variants">Variants ({variants.length})</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sale_price">Sale Price (₹)</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    value={formData.sale_price || ''}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value ? parseFloat(e.target.value) : null })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stock_status">Stock Status *</Label>
                <Select
                  value={formData.stock_status}
                  onValueChange={(value: any) => setFormData({ ...formData, stock_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="pre_order">Pre-Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: !!checked })}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Product is active and visible to customers
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: !!checked })}
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Feature this product on homepage
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images */}
        <TabsContent value="images">
          <ProductImagesManager
            productId={product?.id}
            images={images}
            onImagesChange={setImages}
          />
        </TabsContent>

        {/* Variants */}
        <TabsContent value="variants">
          <ProductVariantsManager
            productId={product?.id}
            variants={variants}
            onVariantsChange={setVariants}
          />
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input
                  id="seo_title"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="Optimized title for search engines"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.seo_title.length}/60 characters
                </p>
              </div>
              <div>
                <Label htmlFor="seo_description">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  rows={3}
                  placeholder="Meta description for search engines"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.seo_description.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}

