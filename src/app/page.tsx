import { FuturisticHero } from '@/components/home/FuturisticHero'
import { FuturisticEvents } from '@/components/home/FuturisticEvents'
import { FuturisticNews } from '@/components/home/FuturisticNews'
import { prisma } from '@/lib/prisma'
import { Calendar, Newspaper, Handshake, Building2, GraduationCap, Users } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

const PARTNER_CATS = [
  { key: 'ENTERPRISE', label: '企业伙伴', icon: Building2, accent: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-300' },
  { key: 'UNIVERSITY', label: '高校伙伴', icon: GraduationCap, accent: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-300' },
  { key: 'COMMUNITY', label: '社区伙伴', icon: Users, accent: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-300' },
]

export default async function HomePage() {
  const partners = await prisma.partner.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  const grouped: Record<string, typeof partners> = {}
  for (const c of PARTNER_CATS) grouped[c.key] = partners.filter((p) => p.category === c.key)
  return (
    <div className="bg-[#03050f] pb-[70px]">
      <FuturisticHero />

      {/* 渐变过渡 */}
      <div className="relative h-24 -mt-12 bg-gradient-to-b from-transparent via-[#03050f] to-[#060918] z-20 pointer-events-none" />

      {/* 近期活动 */}
      <SectionBlock
        icon={<Calendar className="w-4 h-4 text-indigo-400" />}
        tag="Upcoming"
        title="近期活动"
        linkHref="/events"
        accentClass="bg-indigo-500/10 border-indigo-500/20 text-indigo-400/60"
      >
        <Suspense fallback={<SkeletonCards />}>
          <FuturisticEvents />
        </Suspense>
      </SectionBlock>

      {/* 最新动态 */}
      <SectionBlock
        icon={<Newspaper className="w-4 h-4 text-cyan-400" />}
        tag="Latest"
        title="最新动态"
        linkHref="/news"
        accentClass="bg-cyan-500/10 border-cyan-500/20 text-cyan-400/60"
      >
        <Suspense fallback={<SkeletonCards />}>
          <FuturisticNews />
        </Suspense>
      </SectionBlock>

      {/* 合作伙伴 */}
      <section className="relative z-20 px-5 pb-14">
        <div className="max-w-lg mx-auto">
          {/* 区块标题 */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Handshake className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-xs text-amber-400/50 tracking-widest uppercase">Partners</span>
              <h2 className="text-lg font-bold text-white">合作伙伴</h2>
            </div>
          </div>

          {/* 分类列表 */}
          <div className="space-y-8">
            {PARTNER_CATS.map((cat) => {
              const items = grouped[cat.key]
              if (items.length === 0) return null
              const Icon = cat.icon
              return (
                <div key={cat.key}>
                  {/* 分类标题 */}
                  <div className="flex items-center gap-2 mb-3.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <h3 className="text-sm font-semibold text-slate-300">{cat.label}</h3>
                    <span className="text-xs text-slate-500 ml-1">{items.length}</span>
                  </div>

                  {/* 伙伴卡片网格 */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {items.map((p) => (
                      <div
                        key={p.id}
                        className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-4 py-4 transition-all duration-300 hover:bg-white/[0.06]"
                      >
                        {/* Logo / 首字 */}
                        <div className="w-10 h-10 rounded-lg bg-[#0a0f1e] border border-white/[0.06] flex items-center justify-center mb-3 overflow-hidden group-hover:border-white/[0.12] transition-colors">
                          {p.logoUrl ? (
                            <img src={p.logoUrl} alt={p.name} className="w-full h-full object-contain p-1.5" />
                          ) : (
                            <span className="text-base font-bold text-slate-400">{p.name?.[0] || '?'}</span>
                          )}
                        </div>

                        {/* 名称 */}
                        <p className="text-sm font-medium text-white/80 group-hover:text-white leading-snug line-clamp-2 transition-colors">
                          {p.name}
                        </p>

                        {/* 链接指示 */}
                        {p.link && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-xs text-slate-500 hover:text-indigo-400 truncate max-w-full transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {p.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}

/** 可复用的区块模板 */
function SectionBlock({
  icon, tag, title, linkHref, accentClass, children,
}: {
  icon: React.ReactNode; tag: string; title: string; linkHref: string; accentClass: string; children: React.ReactNode;
}) {
  return (
    <section className="relative z-20 px-5 pb-12">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accentClass}`}>{icon}</div>
            <div>
              <span className={`text-[10px] tracking-widest uppercase block ${accentClass}`}>{tag}</span>
              <h2 className="text-base font-bold text-white">{title}</h2>
            </div>
          </div>
          <Link href={linkHref} className={`flex items-center gap-1 text-[11px] ${accentClass} hover:opacity-80 transition-opacity`}>
            全部 <span className="opacity-50">→</span>
          </Link>
        </div>
        {children}
      </div>
    </section>
  )
}

function SkeletonCards() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/[0.04] h-20 animate-pulse" />
      ))}
    </div>
  )
}
