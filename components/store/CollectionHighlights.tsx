'use client'

import { Package, TrendingUp, Star, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface CollectionHighlightsProps {
  totalProducts: number
  featuredCount?: number
  avgPrice?: number
  topBrand?: string
}

export function CollectionHighlights({ 
  totalProducts, 
  featuredCount = 0,
  avgPrice,
  topBrand 
}: CollectionHighlightsProps) {
  const highlights = [
    {
      icon: Package,
      label: 'Total Products',
      value: totalProducts.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Star,
      label: 'Featured Items',
      value: featuredCount.toString(),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      show: featuredCount > 0,
    },
    {
      icon: TrendingUp,
      label: 'Avg Price',
      value: avgPrice ? `₹${avgPrice.toFixed(0)}` : 'N/A',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      show: avgPrice !== undefined,
    },
    {
      icon: Award,
      label: 'Top Brand',
      value: topBrand || 'Various',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      show: topBrand !== undefined,
    },
  ].filter(item => item.show !== false)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {highlights.map((item, index) => (
        <Card key={index} className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                <p className={`text-lg font-bold ${item.color} truncate`}>
                  {item.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
