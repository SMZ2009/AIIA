import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ClipboardList } from 'lucide-react'
import type { Metadata } from 'next'
import { RegistrationsClient } from './RegistrationsClient'

export const metadata: Metadata = { title: '报名管理 | 管理后台' }

export default async function AdminRegistrationsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const [registrations, events] = await Promise.all([
    prisma.registration.findMany({
      include: { event: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.event.findMany({
      where: { status: { not: 'draft' } },
      select: { id: true, title: true },
      orderBy: { startDate: 'desc' },
    }),
  ])

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">报名管理</h1>

      {registrations.length > 0 ? (
        <RegistrationsClient
          registrations={JSON.parse(JSON.stringify(registrations))}
          events={JSON.parse(JSON.stringify(events))}
        />
      ) : (
        <div className="bg-[#0a0e1a] rounded-2xl border border-white/[0.06]">
          <EmptyState icon={ClipboardList} title="暂无报名记录" />
        </div>
      )}
    </div>
  )
}
