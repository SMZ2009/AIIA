import { prisma } from '@/lib/prisma'
import { EventCard } from '@/components/events/EventCard'
import { ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'

export async function UpcomingEvents() {
  const events = await prisma.event.findMany({
    where: { status: 'published', startDate: { gte: new Date() } },
    orderBy: { startDate: 'asc' },
    take: 3,
  })

  return (
    <section className="max-w-6xl mx-auto px-5 py-10 md:py-16">
      {/* 区块标题 */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-brand-600 text-xs font-semibold mb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            UPCOMING
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">近期活动</h2>
        </div>
        <Link href="/events" className="hidden sm:flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
          查看全部 <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {events.map((event, i) => (
            <div key={event.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <EventCard {...event} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <p className="text-slate-400 text-xs">暂无活动，敬请期待</p>
        </div>
      )}

      <div className="mt-4 text-center sm:hidden">
        <Link href="/events" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600">
          查看全部活动 <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  )
}
