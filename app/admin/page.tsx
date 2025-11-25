import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingBag, AlertCircle } from 'lucide-react'
import { AdminStats } from '@/components/admin/AdminStats'
import { RecentOrders } from '@/components/admin/RecentOrders'
import { SalesChart } from '@/components/admin/SalesChart'
import { TopProducts } from '@/components/admin/TopProducts'
import { RecentActivity } from '@/components/admin/RecentActivity'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | KIBANA',
  description: 'KIBANA admin dashboard - Manage products, orders, and store settings',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: '/admin',
  },
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch stats - gracefully handle errors if tables don't exist
  const [productsRes, ordersRes, usersRes, revenueRes, recentOrdersRes] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }).catch(() => ({ count: 0, error: null })),
    supabase.from('orders').select('id', { count: 'exact', head: true }).catch(() => ({ count: 0, error: null })),
    supabase.from('users').select('id', { count: 'exact', head: true }).catch(() => ({ count: 0, error: null })),
    supabase
      .from('orders')
      .select('total_amount, created_at')
      .eq('payment_status', 'paid')
      .catch(() => ({ data: [], error: null })),
    supabase
      .from('orders')
      .select(`
        *,
        user:users(email, full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)
      .catch(() => ({ data: [], error: null })),
  ])

  const totalRevenue = revenueRes.data?.reduce((sum: number, order: { total_amount: number }) => sum + order.total_amount, 0) || 0

  // Calculate this month's revenue
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)
  const monthRevenue = revenueRes.data
    ?.filter((order: { created_at: string }) => new Date(order.created_at) >= thisMonth)
    .reduce((sum: number, order: { total_amount: number }) => sum + order.total_amount, 0) || 0

  // Get pending orders count - gracefully handle errors
  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
    .catch(() => ({ count: 0, error: null }))

  const stats = [
    {
      title: 'Total Products',
      value: productsRes.count || 0,
      iconName: 'Package',
      color: 'text-blue-600',
      change: '+12%',
      trend: 'up' as const,
    },
    {
      title: 'Total Orders',
      value: ordersRes.count || 0,
      iconName: 'ShoppingBag',
      color: 'text-green-600',
      change: '+8%',
      trend: 'up' as const,
    },
    {
      title: 'Total Users',
      value: usersRes.count || 0,
      iconName: 'Users',
      color: 'text-purple-600',
      change: '+15%',
      trend: 'up' as const,
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      iconName: 'DollarSign',
      color: 'text-orange-600',
      change: `₹${monthRevenue.toLocaleString()} this month`,
      trend: 'up' as const,
    },
  ]

  return (
    <div className="space-y-6 bg-white min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Welcome to the KIBANA admin panel</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <AdminStats stats={stats} />

      {/* Alerts */}
      {(pendingOrders || 0) > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  {pendingOrders} pending {pendingOrders === 1 ? 'order' : 'orders'} need attention
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-200">
                  Review and process these orders to keep your customers happy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart revenueData={revenueRes.data || []} />
        <TopProducts />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={recentOrdersRes.data || []} />
        <RecentActivity />
      </div>
    </div>
  )
}
