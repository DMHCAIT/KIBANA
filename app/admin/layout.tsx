import { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

// ⚠️ DEVELOPMENT ONLY: Login requirement removed
// In production, you should re-enable authentication checks
export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Skip all authentication checks - allow direct access to admin pages
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

