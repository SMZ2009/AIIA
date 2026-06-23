'use client'

import { cn } from '@/lib/utils'
import { LayoutDashboard, Calendar, Newspaper, ClipboardList, LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/admin', label: '仪表盘', icon: LayoutDashboard },
  { href: '/admin/events', label: '活动管理', icon: Calendar },
  { href: '/admin/articles', label: '文章管理', icon: Newspaper },
  { href: '/admin/registrations', label: '报名管理', icon: ClipboardList },
]

function SidebarNav({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-14 flex items-center px-4 border-b border-slate-100">
        <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
          <img src="/images/logoblack.jpg" alt="AIIA" className="w-7 h-7 rounded object-contain" />
          <span className="font-bold text-sm text-slate-900">HITSZ AIIA 管理</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          return (
            <Link key={link.href} href={link.href} onClick={onClose} className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50',
            )}><Icon className="w-4 h-4" />{link.label}</Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full">
          <LogOut className="w-4 h-4" />退出登录
        </button>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <aside className="hidden md:flex w-56 bg-white border-r border-slate-100 h-screen sticky top-0 shrink-0 flex-col">
        <SidebarNav />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-100 z-30 flex items-center px-4">
        <button onClick={() => setMobileOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100">
          <Menu className="w-5 h-5" />
        </button>
        <img src="/images/logoblack.jpg" alt="AIIA" className="w-6 h-6 rounded object-contain ml-2" />
        <span className="ml-1.5 font-bold text-sm text-slate-900">HITSZ AIIA 管理</span>
      </div>

      {mobileOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setMobileOpen(false)} />
          <div className="md:hidden fixed top-0 left-0 bottom-0 w-64 bg-white z-50 shadow-xl animate-slide-in-left">
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100">
              <span className="font-bold text-sm">HITSZ AIIA 管理</span>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarNav onClose={() => setMobileOpen(false)} />
          </div>
        </>
      )}
    </>
  )
}
