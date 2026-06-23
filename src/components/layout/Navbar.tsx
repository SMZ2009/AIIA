'use client'

import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于' },
  { href: '/members', label: '成员' },
  { href: '/events', label: '活动' },
  { href: '/news', label: '新闻' },
  { href: '/partners', label: '合作' },
]

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === '/'
  const bgClass = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-nav'

  return (
    <header className={cn('sticky top-0 z-40 transition-all duration-300', bgClass)}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/images/logoblack.jpg" alt="AIIA" className="w-8 h-8 rounded-lg object-contain" />
          <span className={cn('font-bold text-base', isHome && !scrolled ? 'text-white' : 'text-slate-900')}>HITSZ AIIA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link key={link.href} href={link.href} className={cn(
                'px-3.5 py-2 rounded-lg text-sm font-medium transition-all',
                active
                  ? isHome && !scrolled ? 'bg-white/15 text-white' : 'bg-brand-50 text-brand-700'
                  : isHome && !scrolled ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50',
              )}>{link.label}</Link>
            )
          })}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn('md:hidden w-10 h-10 flex items-center justify-center rounded-lg', isHome && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-slate-100')}
          aria-label="菜单"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setMenuOpen(false)} />
          <nav className="md:hidden fixed top-0 right-0 bottom-0 w-64 bg-white z-50 shadow-2xl animate-slide-in-right">
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">导航菜单</span>
              <button onClick={() => setMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    active ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:bg-slate-50',
                  )}>{link.label}</Link>
                )
              })}
            </div>
          </nav>
        </>
      )}
    </header>
  )
}
