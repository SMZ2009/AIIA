'use client'

import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const statusMap: Record<string, string> = {
  draft: '草稿',
  published: '已发布',
  cancelled: '已取消',
  completed: '已结束',
}

interface EventsClientProps {
  events: any[]
}

export function EventsClient({ events }: EventsClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个活动吗？此操作不可撤销。')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('删除失败')
      toast('success', '已删除')
      router.refresh()
    } catch {
      toast('error', '删除失败')
    } finally {
      setDeleting(null)
    }
  }

  return (
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
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              e.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
              e.status === 'draft' ? 'bg-slate-500/10 text-slate-400' :
              e.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
              'bg-blue-500/10 text-blue-400'
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
      actions={(event) => (
        <div className="flex items-center gap-1">
          <Link href={`/admin/events/${event.id}/edit`}>
            <Button variant="ghost" size="sm">编辑</Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            loading={deleting === event.id}
            onClick={() => handleDelete(event.id)}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </Button>
        </div>
      )}
      emptyText="暂无活动"
    />
  )
}
