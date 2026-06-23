'use client'

import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface ArticlesClientProps {
  articles: any[]
}

export function ArticlesClient({ articles }: ArticlesClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
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
          key: 'link',
          header: '公众号链接',
          render: (a) => (
            <span className="text-xs text-slate-500 max-w-[180px] truncate block" title={a.link}>
              {a.link}
            </span>
          ),
        },
        {
          key: 'status',
          header: '状态',
          render: (a) => (
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              a.status === 'published'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-slate-500/10 text-slate-400'
            }`}>
              {a.status === 'published' ? '已发布' : '草稿'}
            </span>
          ),
        },
        {
          key: 'publishedAt',
          header: '发布时间',
          render: (a) => a.publishedAt ? formatDate(a.publishedAt, 'datetime') : '-',
        },
      ]}
      data={articles}
      actions={(article) => (
        <div className="flex items-center gap-1">
          <Link href={`/admin/articles/${article.id}/edit`}>
            <Button variant="ghost" size="sm">编辑</Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            loading={deleting === article.id}
            onClick={() => handleDelete(article.id)}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </Button>
        </div>
      )}
      emptyText="暂无文章"
    />
  )
}
