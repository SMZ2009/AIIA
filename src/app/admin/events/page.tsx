import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { EventsClient } from './EventsClient'

export const metadata: Metadata = { title: '活动管理 | 管理后台' }

export default async function AdminEventsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const events = await prisma.event.findMany({
    orderBy: { startDate: 'desc' },
    include: { _count: { select: { registrations: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">活动管理</h1>
        <Link href="/admin/events/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" /> 新建活动
          </Button>
        </Link>
      </div>

      <div className="bg-[#0a0e1a] rounded-2xl border border-white/[0.06] overflow-hidden">
        <EventsClient events={events} />
      </div>
    </div>
  )
}
