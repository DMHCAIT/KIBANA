import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { OrderDetail } from '@/components/admin/OrderDetail'
import { Metadata } from 'next'
import { ShoppingBag, FileText } from 'lucide-react'

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  return {
    title: 'Order Details | KIBANA Admin',
    description: 'View and manage order details',
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `/admin/orders/${params.id}`,
    },
  }
}

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      user:users(*),
      items:order_items(
        *,
        product:products(*, images:product_images(*)),
        variant:product_variants(*)
      )
    `)
    .eq('id', params.id)
    .single()

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Order Details
            </h1>
            <p className="text-muted-foreground mt-1">Order #{order.order_number}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <OrderDetail order={order} />
      </div>
    </div>
  )
}

