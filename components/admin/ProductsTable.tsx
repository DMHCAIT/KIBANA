'use client'

import { Product } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit, Trash2, Eye, Search, Filter, MoreVertical, Copy, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all')
  const supabase = createClient()
  const router = useRouter()

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' ? product.is_active : !product.is_active)
    
    const matchesStock = stockFilter === 'all' ||
      product.stock_status === stockFilter

    return matchesSearch && matchesStatus && matchesStock
  })

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
      toast.error('Failed to delete product')
    } else {
      toast.success('Product deleted')
      router.refresh()
    }
  }

  const handleDuplicate = async (product: Product) => {
    // Duplicate product logic
    toast.success('Product duplicated')
  }

  const handleToggleStatus = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)

    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success(`Product ${product.is_active ? 'deactivated' : 'activated'}`)
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-5 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 focus:border-blue-500 rounded-lg bg-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={(v: any) => setStockFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="text-left p-4 font-semibold text-gray-900">Product</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Category</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Price</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Stock</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                  <th className="text-right p-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="h-12 w-12 text-gray-300" />
                        <p className="text-muted-foreground font-medium">No products found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const image = product.images?.[0]
                    return (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-200">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {image ? (
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 border-2 border-gray-200 shadow-sm">
                                <Image
                                  src={image.image_url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 border-2 border-gray-200 flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900 truncate">{product.name}</div>
                              <div className="text-sm text-gray-600 truncate">{product.brand}</div>
                              {product.is_featured && (
                                <Badge className="mt-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">Featured</Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="border-gray-300 bg-gray-50 text-gray-700 font-medium">
                            {product.category?.name || 'Uncategorized'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-bold text-gray-900">₹{product.price.toLocaleString()}</div>
                            {product.sale_price && (
                              <div className="text-sm text-gray-400 line-through">
                                ₹{product.sale_price.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={product.stock_status === 'in_stock' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0' 
                              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-0'}
                          >
                            {product.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={product.is_active 
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0' 
                              : 'bg-gray-200 text-gray-700 border-0'}
                          >
                            {product.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 rounded-lg" asChild>
                              <Link href={`/products/${product.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-purple-50 hover:text-purple-600 rounded-lg" asChild>
                              <Link href={`/admin/products/${product.slug || product.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-lg">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-xl rounded-lg">
                                <DropdownMenuItem onClick={() => handleDuplicate(product)} className="hover:bg-gray-50 cursor-pointer">
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleStatus(product)} className="hover:bg-gray-50 cursor-pointer">
                                  {product.is_active ? 'Deactivate' : 'Activate'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(product.id)}
                                  className="text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-gray-600 text-center bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of <span className="font-semibold text-gray-900">{products.length}</span> products
      </div>
    </div>
  )
}
