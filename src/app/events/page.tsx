import { prisma } from '@/lib/prisma'
import { EventCard } from '@/components/events/EventCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Calendar } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: '活动' }

export default async function EventsPage() {
  const now = new Date()
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({ where: { status: 'published', startDate: { gte: now } }, orderBy: { startDate: 'asc' } }),
    prisma.event.findMany({ where: { status: { in: ['published', 'completed'] }, startDate: { lt: now } }, orderBy: { startDate: 'desc' }, take: 12 }),
  ])

  return (
    <div className="pb-[70px]">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="icon-box bg-indigo-500/10">
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <h1 className="section-title text-lg">活动</h1>
        </div>
      </div>

      <Section label="即将开始" dotColor="bg-green-400">
        {upcoming.length > 0
          ? upcoming.map((e) => <EventCard key={e.id} {...e} />)
          : <EmptyState icon={Calendar} title="暂无即将开始的活动" />}
      </Section>

      {past.length > 0 && (
        <Section label="往期活动" dotColor="bg-slate-500">
          {past.map((e) => <EventCard key={e.id} {...e} />)}
        </Section>
      )}
    </div>
  )
}

function Section({ label, dotColor, children }: { label: string; dotColor: string; children: React.ReactNode }) {
  return (
    <div className="px-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <h2 className="text-xs font-semibold text-slate-500 tracking-wide">{label}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
