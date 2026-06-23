import { AdminSidebar } from '@/components/admin/AdminSidebar'
import type { ReactNode } from 'react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen-safe bg-[#060918] flex">
      <AdminSidebar />
      <main className="flex-1 md:pl-56 pt-14 md:pt-0">
        <div className="p-4 md:p-6 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}
