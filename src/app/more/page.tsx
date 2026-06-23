import { Users, Info, ChevronRight, Shield } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '更多' }

const menuItems = [
  { icon: Info, label: '关于我们', href: '/about', color: 'text-indigo-400 bg-indigo-500/10' },
  { icon: Users, label: '成员介绍', href: '/members', color: 'text-cyan-400 bg-cyan-500/10' },
  { icon: Shield, label: '后台管理', href: '/admin/login', color: 'text-slate-400 bg-white/[0.04]' },
]

export default function MorePage() {
  return (
    <div className="pb-[70px]">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-extrabold text-white">更多</h1>
      </div>

      {/* 品牌卡片 */}
      <div className="px-5 mb-6">
        <div className="glass-card p-5 flex items-center gap-4">
          <img src="/images/logoblack.jpg" alt="AIIA" className="w-14 h-14 rounded-xl object-contain bg-white p-1.5" />
          <div>
            <h3 className="font-bold text-white">哈工大深圳人工智能创协</h3>
            <p className="text-xs text-slate-500 mt-0.5">HITSZ AIIA · 创新 · 协作 · 成长</p>
          </div>
        </div>
      </div>

      {/* 菜单 */}
      <div className="px-5">
        <div className="glass-card overflow-hidden !rounded-2xl !p-0">
          {menuItems.map((item, i) => {
            const Icon = item.icon
            return (
              <Link
                key={i}
                href={item.href}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors active:bg-white/[0.06] border-b border-white/[0.04] last:border-b-0"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="flex-1 text-sm font-medium text-slate-200">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
