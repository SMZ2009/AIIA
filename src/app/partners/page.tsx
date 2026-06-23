import { partners } from '@/data/partners'
import { PartnerCard } from '@/components/partners/PartnerCard'
import { ArrowLeft, Handshake } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '合作伙伴' }

export default function PartnersPage() {
  return (
    <div className="pb-[70px]">
      <div className="sticky top-0 z-30 bg-[#060918]/80 backdrop-blur-xl border-b border-white/[0.06] pt-safe">
        <div className="flex items-center h-11 px-4">
          <Link href="/more" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回
          </Link>
          <span className="flex-1 text-center text-sm font-semibold text-white mr-6">合作伙伴</span>
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-box bg-purple-500/10">
            <Handshake className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-xs text-slate-500">感谢以下组织的支持</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {partners.map((p) => <PartnerCard key={p.id} {...p} />)}
        </div>
      </div>
    </div>
  )
}
