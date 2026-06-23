import { members } from '@/data/members'
import { MemberCard } from '@/components/members/MemberCard'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '成员介绍' }

export default function MembersPage() {
  return (
    <div className="pb-[70px]">
      <div className="sticky top-0 z-30 bg-[#060918]/80 backdrop-blur-xl border-b border-white/[0.06] pt-safe">
        <div className="flex items-center h-11 px-4">
          <Link href="/more" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回
          </Link>
          <span className="flex-1 text-center text-sm font-semibold text-white mr-6">成员介绍</span>
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-box bg-indigo-500/10">
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-xs text-slate-500">核心管理团队</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {members.map((m) => <MemberCard key={m.id} {...m} />)}
        </div>
      </div>
    </div>
  )
}
