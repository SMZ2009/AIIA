import { FuturisticHero } from '@/components/home/FuturisticHero'
import { FuturisticEvents } from '@/components/home/FuturisticEvents'
import { FuturisticNews } from '@/components/home/FuturisticNews'
import { prisma } from '@/lib/prisma'
import { Calendar, Newspaper, Handshake, Building2, GraduationCap, Users } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

const PARTNER_CATS = [
  { key: 'ENTERPRISE', label: '企业伙伴', icon: Building2, textColor: 'text-blue-300' },
  { key: 'UNIVERSITY', label: '高校伙伴', icon: GraduationCap, textColor: 'text-amber-300' },
  { key: 'COMMUNITY', label: '社区伙伴', icon: Users, textColor: 'text-emerald-300' },
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
          <div className="flex items-center gap-3 mb-7">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Handshake className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs text-amber-400/50 tracking-widest uppercase">Partners</span>
              <h2 className="text-lg font-bold text-white">合作伙伴</h2>
            </div>
          </div>

          {/* 分类列表 */}
          <div className="space-y-6">
            {PARTNER_CATS.map((cat) => {
              const items = grouped[cat.key]
              if (items.length === 0) return null
              const Icon = cat.icon
              return (
                <div key={cat.key} className="flex items-start gap-5">
                  {/* 分类标签 */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    <span className={`text-sm font-medium ${cat.textColor}`}>{cat.label}</span>
                  </div>

                  {/* 伙伴列表 */}
                  <div className="flex items-center gap-4 flex-wrap">
                    {items.map((p) => (
                      <div key={p.id} className="flex items-center gap-1.5">
                        {p.logoUrl ? (
                          <img src={p.logoUrl} alt={p.name} className="h-6 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" />
                        ) : (
                          <span className="text-sm font-medium text-white/70 hover:text-white transition-colors">{p.name}</span>
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
