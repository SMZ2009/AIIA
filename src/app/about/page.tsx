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
          <h2 className="text-lg font-bold text-white">哈尔滨工业大学（深圳）</h2>
          <h2 className="text-lg font-bold text-white">人工智能创新协会</h2>
          <p className="text-sm text-slate-400 mt-1.5 max-w-xs mx-auto">HITSZ AI Innovation Association</p>
        </div>

        {/* 使命 + 架构 */}
        <div className="glass-card p-5">
          <div className="icon-box bg-indigo-500/10 mb-3">
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">我们的使命</h3>
          <p className="text-sm text-slate-400 leading-relaxed">搭建跨学科、开放性的人工智能交流与创新实践平台，聚焦AI落地创新应用、互联网全栈开发、产品设计与市场推广，融合技术与商业思维学习、产品开发比赛活动、校企资源对接共建、校际交流等内容，助力成员全面成长</p>
        </div>

        <div className="glass-card p-5">
          <div className="icon-box bg-purple-500/10 mb-3">
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">组织架构</h3>
          <ul className="text-sm text-slate-400 space-y-1 leading-relaxed">
            初始阶段由 <strong className="text-white">协会筹备委员会</strong> 统筹事项
            后计划构建理事会，下设秘书部、共学部、外联部、宣传部
          </ul>
        </div>

        {/* 联系 */}
        <div className="glass-card p-5 text-center">
          <h3 className="text-base font-bold text-white mb-3">联系我们</h3>
          <div className="flex flex-col items-center gap-2.5 text-sm text-slate-400">
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-400" />hitszaiia@qq.com</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400" />微信公众号：哈工深AIIA</span>
          </div>
        </div>
      </div>
    </div>
  )
}
