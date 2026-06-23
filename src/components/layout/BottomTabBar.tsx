'use client'

import { cn } from '@/lib/utils'
import { Home, Calendar, Newspaper, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: '首页', icon: Home },
  { href: '/events', label: '活动', icon: Calendar },
  { href: '/news', label: '新闻', icon: Newspaper },
  { href: '/more', label: '更多', icon: Menu },
]

const hideOnPaths = ['/events/', '/news/', '/admin']

export function BottomTabBar() {
  const pathname = usePathname()
  if (hideOnPaths.some((p) => pathname.startsWith(p) && pathname !== p.replace('/', ''))) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#060918]/90 backdrop-blur-xl border-t border-white/[0.06] pb-safe">
      <div className="flex items-center justify-around h-[50px]">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          return (
            <Link key={tab.href} href={tab.href} className={cn(
              'flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[42px] px-4 transition-colors',
              active ? 'text-indigo-400' : 'text-slate-600',
            )}>
              <Icon className={cn('w-5 h-5 transition-all', active && 'scale-110')} strokeWidth={active ? 2.5 : 1.5} />
              <span className={cn('text-[10px] font-medium leading-none', active && 'font-semibold')}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
