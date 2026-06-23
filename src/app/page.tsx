import { FuturisticHero } from '@/components/home/FuturisticHero'
import { FuturisticEvents } from '@/components/home/FuturisticEvents'
import { FuturisticNews } from '@/components/home/FuturisticNews'
import { partners } from '@/data/partners'
import { Calendar, Newspaper, Handshake, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export default function HomePage() {
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
      <section className="relative z-20 px-5 pb-16">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Handshake className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <span className="text-[10px] text-purple-400/60 tracking-widest uppercase block text-center">Partners</span>
              <h2 className="text-base font-bold text-white text-center">合作伙伴</h2>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {partners.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
                <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.name} className="w-6 h-6 object-contain opacity-60" />
                  ) : (
                    <span className="text-sm font-bold text-slate-600">{p.name[0]}</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 底部品牌 */}
      <div className="text-center pb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.04]">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span className="text-[11px] text-slate-500 tracking-wider">HITSZ AIIA · 创新 · 协作 · 成长</span>
        </div>
      </div>
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
