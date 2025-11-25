'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingBag, User, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'

interface Activity {
  id: number
  type: string
  message: string
  icon: typeof ShoppingBag
  time: Date
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Generate dates only on client side to avoid hydration mismatch
    const now = Date.now()
    setActivities([
      {
        id: 1,
        type: 'order',
        message: 'New order #ORD-12345 placed',
        icon: ShoppingBag,
        time: new Date(now - 1000 * 60 * 5),
      },
      {
        id: 2,
        type: 'product',
        message: 'Product "Luxury Tote Bag" was updated',
        icon: Package,
        time: new Date(now - 1000 * 60 * 30),
      },
      {
        id: 3,
        type: 'user',
        message: 'New user registered',
        icon: User,
        time: new Date(now - 1000 * 60 * 60),
      },
      {
        id: 4,
        type: 'category',
        message: 'Category "Evening Bags" was created',
        icon: Tag,
        time: new Date(now - 1000 * 60 * 60 * 2),
      },
    ])
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Loading activity...</p>
          ) : (
            activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(activity.time, 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}

