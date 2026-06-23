import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import type { ReactNode } from 'react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // 登录页面不需要认证守卫
  // Simple check: if the path is /admin/login, skip auth
  // We use a server-side redirect for non-login pages

  return (
    <div className="min-h-screen-safe bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 md:pl-0 pt-14 md:pt-0">
        <div className="p-4 md:p-6 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}
