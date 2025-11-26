'use client'

import { Category } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

interface RelatedCollectionsProps {
  collections: Category[]
  currentCollectionId: string
}

export function RelatedCollections({ collections, currentCollectionId }: RelatedCollectionsProps) {
  const relatedCollections = collections
    .filter(c => c.id !== currentCollectionId)
    .slice(0, 4)

  if (relatedCollections.length === 0) {
    return null
  }

  const getCategoryImage = (categoryName: string, bannerImage?: string | null): string => {
    if (bannerImage) return bannerImage
    
    const categoryImageMap: Record<string, string> = {
      'Backpack': '/BACKPACK.jpg',
      'backpack': '/BACKPACK.jpg',
      'Clutch': '/CLUTCH.jpg',
      'clutch': '/CLUTCH.jpg',
      'Laptop Bag': '/LAPTOP%20BAG.jpg',
      'laptop bag': '/LAPTOP%20BAG.jpg',
      'Sling Bag': '/SLING%20BAG.jpg',
      'sling bag': '/SLING%20BAG.jpg',
      'Tote Bag': '/TOTE%20BAG.jpg',
      'tote bag': '/TOTE%20BAG.jpg',
      'Wallet': '/WALLET.jpg',
      'wallet': '/WALLET.jpg',
    }
    
    if (categoryImageMap[categoryName]) {
      return categoryImageMap[categoryName]
    }
    
    const lowerName = categoryName.toLowerCase()
    for (const [key, value] of Object.entries(categoryImageMap)) {
      if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
        return value
      }
    }
    
    return ''
  }

  return (
    <section className="mt-16 pt-16 border-t">
      <div className="mb-8">
        <h2 className="font-hero text-3xl md:text-4xl mb-2 text-gray-900">
          Explore Other Collections
        </h2>
        <p className="font-body text-gray-600">
          Discover more styles from our curated collections
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {relatedCollections.map((collection) => {
          const imageUrl = getCategoryImage(collection.name, collection.banner_image)
          return (
            <Link key={collection.id} href={`/collections/${collection.slug}`}>
              <Card className="group overflow-hidden cursor-pointer border hover:border-gray-400 transition-all duration-300 h-full">
                <div className="relative h-48 md:h-56 overflow-hidden bg-gray-50">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl font-hero text-gray-200">
                        {collection.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-menu text-sm mb-1 text-gray-900 tracking-wide">
                    {collection.name.toUpperCase()}
                  </h3>
                  {collection.description && (
                    <p className="font-body text-xs text-gray-600 line-clamp-2 mb-2">
                      {collection.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-gray-900 transition-colors">
                    <span>View Collection</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
