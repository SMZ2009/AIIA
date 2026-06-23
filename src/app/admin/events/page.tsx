import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '活动管理 | 管理后台' }

const statusMap: Record<string, string> = {
  draft: '草稿',
  published: '已发布',
  cancelled: '已取消',
  completed: '已结束',
}

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
        <h1 className="text-xl font-bold text-gray-900">活动管理</h1>
        <Link href="/admin/events/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" /> 新建活动
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <DataTable
          columns={[
            { key: 'title', header: '标题' },
            {
              key: 'startDate',
              header: '日期',
              render: (e) => formatDate(e.startDate, 'short'),
            },
            { key: 'location', header: '地点' },
            {
              key: 'status',
              header: '状态',
              render: (e) => (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  e.status === 'published' ? 'bg-green-50 text-green-700' :
                  e.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                  e.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {statusMap[e.status] || e.status}
                </span>
              ),
            },
            {
              key: '_count',
              header: '报名',
              render: (e) => e._count.registrations,
            },
          ]}
          data={events}
          onRowClick={(e) => {}}
          actions={(event) => (
            <div className="flex items-center gap-2">
              <Link href={`/admin/events/${event.id}/edit`}>
                <Button variant="ghost" size="sm">编辑</Button>
              </Link>
            </div>
          )}
          emptyText="暂无活动"
        />
      </div>
    </div>
  )
}
