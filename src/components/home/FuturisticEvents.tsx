import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export async function FuturisticEvents() {
  const events = await prisma.event.findMany({
    where: { status: 'published', startDate: { gte: new Date() } },
    orderBy: { startDate: 'asc' },
    take: 3,
  })

  if (events.length === 0) return null

  return (
    <div className="space-y-3">
      {events.map((event, i) => (
        <Link key={event.id} href={`/events/${event.id}`} className="block group">
          <div
            className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex">
              {/* 日期区块 */}
              <div className="w-[72px] shrink-0 flex flex-col items-center justify-center py-4 border-r border-white/[0.05] bg-white/[0.02]">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  {new Date(event.startDate).toLocaleDateString('zh-CN', { month: 'short' })}
                </span>
                <span className="text-2xl font-black text-white">
                  {new Date(event.startDate).getDate()}
                </span>
              </div>

              {/* 内容 */}
              <div className="flex-1 p-4 min-w-0">
                <h3 className="font-bold text-white/90 group-hover:text-white text-[14px] leading-snug transition-colors line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{event.summary}</p>
                <div className="flex items-center gap-3 mt-2.5 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                </div>
              </div>

              {/* 箭头 */}
              <div className="shrink-0 flex items-center pr-4">
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
