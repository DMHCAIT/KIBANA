import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { ShoppingBag } from 'lucide-react'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Orders Management | KIBANA Admin',
  description: 'Manage customer orders and track order status',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: '/admin/orders',
  },
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      user:users(*)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Orders
            </h1>
            <p className="text-muted-foreground mt-1">Manage customer orders</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <OrdersTable orders={orders || []} />
      </div>
    </div>
  )
}

