import { ArrowRight, Sparkles, Users, Calendar, BookOpen } from 'lucide-react'
import Link from 'next/link'

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      {/* 背景 - 手机端更小的网格 */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.25) 0.5px, transparent 0.5px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* 渐变光晕 - 手机端缩小 */}
      <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-brand-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-indigo-500/8 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4" />

      <div className="relative max-w-6xl mx-auto px-5 py-16 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* 徽章 */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 text-xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            创新 · 协作 · 成长
          </div>

          {/* 主标题 - 手机端缩小 */}
          <h1 className="text-[28px] leading-tight md:text-5xl md:leading-tight font-extrabold text-white tracking-tight">
            <span className="block">AIIA 社团</span>
            <span className="block mt-1.5 bg-gradient-to-r from-brand-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              用技术连接未来
            </span>
          </h1>

          {/* 副标题 */}
          <p className="mt-4 text-sm md:text-base text-slate-300/80 leading-relaxed max-w-xs md:max-w-lg mx-auto">
            汇聚热爱技术的同学，打造开放包容的学生社区，在创新与协作中发现无限可能。
          </p>

          {/* CTA 按钮 */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/events"
              className="group inline-flex items-center gap-1.5 h-11 px-6 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
            >
              参与活动
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 h-11 px-6 border border-white/20 text-white rounded-xl font-medium text-sm hover:bg-white/10 transition-all active:scale-95"
            >
              了解我们
            </Link>
          </div>

          {/* 数据指标 - 手机端缩小 */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-[300px] mx-auto">
            {[
              { icon: BookOpen, label: '活动', value: '12+' },
              { icon: Users, label: '成员', value: '50+' },
              { icon: Calendar, label: '成立', value: '2023' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-1 text-white/40 mb-1">
                  <item.icon className="w-3 h-3" />
                  <span className="text-[11px]">{item.label}</span>
                </div>
                <p className="text-xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部波浪 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 393 30" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-auto">
          <path d="M0 15C65 30 130 0 196 15C262 30 327 0 393 15V30H0V15Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
