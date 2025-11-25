import { ReactNode } from 'react'
import { AccountSidebar } from '@/components/store/AccountSidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'

export const dynamic = 'force-dynamic'

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/account')
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StoreHeader />
      <main className="flex-1">
        <div className="container px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-full border border-pink-100/50 shadow-sm">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">My Account</span>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                My Account
              </span>
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <AccountSidebar />
            </aside>
            <main className="lg:col-span-3">{children}</main>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

