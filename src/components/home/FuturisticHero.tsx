'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ParticleField } from '@/components/effects/ParticleField'
import { TypewriterText } from '@/components/effects/TypewriterText'
import { AnimatedCounter } from '@/components/effects/AnimatedCounter'
import { GlowOrb } from '@/components/effects/GlowOrb'

export function FuturisticHero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#03050f]">
      {/* 粒子场 */}
      <ParticleField />

      {/* 光晕球体 */}
      <GlowOrb color="radial-gradient(circle, #6366f1, transparent)" size={300} top="10%" left="-10%" duration={10} />
      <GlowOrb color="radial-gradient(circle, #06b6d4, transparent)" size={250} top="50%" right="-5%" delay={3} duration={12} />
      <GlowOrb color="radial-gradient(circle, #8b5cf6, transparent)" size={200} bottom="10%" left="30%" delay={6} duration={9} />

      {/* 渐变网格线 */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-6 text-center py-16">
        {/* Logo */}
        <div className="relative mx-auto mb-8 w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 blur-xl opacity-40 animate-pulse-glow" />
          <img
            src="/images/logoblack.jpg"
            alt="AIIA"
            className="relative w-24 h-24 rounded-2xl object-contain bg-white p-3 shadow-lg shadow-indigo-500/20"
          />
        </div>

        {/* 标签 */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] mb-6">
          <span className="text-[11px] text-slate-400 tracking-widest uppercase"> ai Innovate   </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] text-slate-400 tracking-widest uppercase"> Accelerate</span>
        </div>

        {/* 主标题 */}
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">
          HITSZ AIIA
        </h1>

        {/* 打字机副标题 */}
        <div className="text-xl md:text-2xl font-extrabold mb-4 h-9">
          <TypewriterText
            texts={['AI 驱动的创新社区', 'AI-Driven Inno Community', 'Build the Future']}
            className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent"
            speed={100}
            pause={2000}
          />
        </div>

        {/* 描述 */}
        <p className="text-sm text-slate-400/80 leading-relaxed max-w-xs mx-auto mb-10">
          汇聚热爱技术的同学，在智能时代的前沿探索中打造属于我们的创新社区
        </p>

        {/* CTA */}
        <div className="flex items-center justify-center gap-3 mb-14">
          <Link href="/events" className="group relative inline-flex items-center gap-2 h-11 px-6 rounded-xl font-semibold text-sm text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              探索活动 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
          <Link href="/about" className="h-11 px-6 rounded-xl border border-white/[0.12] text-sm font-medium text-slate-300 hover:bg-white/[0.04] hover:border-white/[0.2] transition-all flex items-center">
            了解更多
          </Link>
        </div>

        {/* 数据指标 */}
        <div className="grid grid-cols-3 gap-6 max-w-[280px] mx-auto">
          {[
            { label: '活动举办', value: 3, suffix: '+' },
            { label: '社区成员', value: 80, suffix: '+' },
            { label: '合作组织', value: 12, suffix: '+' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <AnimatedCounter end={item.value} suffix={item.suffix} className="text-2xl font-black text-white block" />
              <span className="text-[10px] text-slate-500 tracking-wider uppercase mt-1 block">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
