import { formatDate } from '@/lib/utils'
import { MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface EventCardProps {
  id: string; title: string; summary: string; coverImage: string
  startDate: Date | string; location: string; status?: string
}

export function EventCard({ id, title, summary, coverImage, startDate, location }: EventCardProps) {
  const d = typeof startDate === 'string' ? new Date(startDate) : startDate
  return (
    <Link href={`/events/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500">
        <div className="flex">
          {/* 日期栏 */}
          <div className="w-[72px] shrink-0 flex flex-col items-center justify-center py-4 border-r border-white/[0.05] bg-white/[0.02]">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{d.getMonth() + 1}月</span>
            <span className="text-2xl font-black text-white">{d.getDate()}</span>
          </div>
          {/* 内容 */}
          <div className="flex-1 p-4 min-w-0">
            <h3 className="font-bold text-white/90 group-hover:text-white text-[14px] leading-snug line-clamp-1 transition-colors">{title}</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{summary}</p>
            <div className="flex items-center gap-3 mt-2.5 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{location}</span>
            </div>
          </div>
          <div className="shrink-0 flex items-center pr-4">
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  )
}
