'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Category } from '@/types'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  category?: Category
  productName?: string
  collectionMode?: boolean
}

export function Breadcrumbs({ items, category, productName, collectionMode = false }: BreadcrumbsProps) {
  // If custom items provided, use them
  if (items) {
    return (
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Home className="h-4 w-4" />
          Home
        </Link>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium truncate max-w-xs">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    )
  }

  // Original product breadcrumbs logic
  const basePath = collectionMode ? '/collections' : '/categories'
  const baseLabel = collectionMode ? 'Collections' : 'Products'
  
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
      <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
        <Home className="h-4 w-4" />
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href={collectionMode ? '/collections' : '/products'} className="hover:text-foreground transition-colors">
        {baseLabel}
      </Link>
      {category && (
        <>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`${basePath}/${category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {category.name}
          </Link>
        </>
      )}
      {productName && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate max-w-xs">
            {productName}
          </span>
        </>
      )}
    </nav>
  )
}

