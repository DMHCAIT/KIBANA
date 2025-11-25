'use client'

import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'

export function AdminHeader() {
  // Login/logout removed - no authentication required
  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-background">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <span className="text-xs text-muted-foreground">(No login required)</span>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" title="Admin User">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}

