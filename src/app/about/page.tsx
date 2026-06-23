import type { Metadata } from 'next'
import { ArrowLeft, Target, Users, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: '关于我们' }

export default function AboutPage() {
  return (
    <div className="pb-[70px]">
      <div className="sticky top-0 z-30 bg-[#060918]/80 backdrop-blur-xl border-b border-white/[0.06] pt-safe">
        <div className="flex items-center h-11 px-4">
          <Link href="/more" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回
          </Link>
          <span className="flex-1 text-center text-sm font-semibold text-white mr-6">关于我们</span>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-4">
        {/* Logo */}
        <div className="glass-card p-5 text-center">
          <img src="/images/logoblack.jpg" alt="HITSZ AIIA" className="w-16 h-16 rounded-2xl object-contain mx-auto mb-3 bg-white p-2" />
          <h2 className="text-lg font-bold text-white">哈尔滨工业大学（深圳）人工智能创新协会</h2>
          <p className="text-sm text-slate-400 mt-1.5 max-w-xs mx-auto">哈工大深圳人工智能创协 · HITSZ AIIA</p>
        </div>

        {/* 使命 + 架构 */}
        <div className="glass-card p-5">
          <div className="icon-box bg-indigo-500/10 mb-3">
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">我们的使命</h3>
          <p className="text-sm text-slate-400 leading-relaxed">哈尔滨工业大学（深圳）人工智能创新协会（简称：哈工大深圳人工智能创协，英文 HITSZ AIIA）秉承「创新 · 协作 · 成长」的理念，通过技术分享、项目实战、行业交流等活动，帮助成员拓展视野、提升技能、建立人脉。</p>
        </div>

        <div className="glass-card p-5">
          <div className="icon-box bg-purple-500/10 mb-3">
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">组织架构</h3>
          <ul className="text-sm text-slate-400 space-y-1 leading-relaxed">
            <li>· <strong className="text-white">社长团</strong> — 整体规划与对外联络</li>
            <li>· <strong className="text-white">技术部</strong> — 技术培训、项目开发</li>
            <li>· <strong className="text-white">活动部</strong> — 活动策划与执行</li>
            <li>· <strong className="text-white">宣传部</strong> — 品牌推广与新媒体</li>
            <li>· <strong className="text-white">外联部</strong> — 校内外合作对接</li>
          </ul>
        </div>

        {/* 联系 */}
        <div className="glass-card p-5 text-center">
          <h3 className="text-base font-bold text-white mb-3">联系我们</h3>
          <div className="flex flex-col items-center gap-2.5 text-sm text-slate-400">
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-400" />aiia@example.com</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400" />微信公众号：HITSZ_AIIA</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-400" />学生活动中心 205</span>
          </div>
        </div>
      </div>
    </div>
  )
}
