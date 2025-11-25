'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Category } from '@/types'

interface BreadcrumbsProps {
  category?: Category
  productName: string
}

export function Breadcrumbs({ category, productName }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
        <Home className="h-4 w-4" />
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/products" className="hover:text-foreground transition-colors">
        Products
      </Link>
      {category && (
        <>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/categories/${category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {category.name}
          </Link>
        </>
      )}
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium truncate max-w-xs">
        {productName}
      </span>
    </nav>
  )
}

