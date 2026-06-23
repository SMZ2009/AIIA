import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '文章管理 | 管理后台' }

export default async function AdminArticlesPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">文章管理</h1>
        <Link href="/admin/articles/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" /> 新建文章
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <DataTable
          columns={[
            { key: 'title', header: '标题' },
            { key: 'author', header: '作者' },
            {
              key: 'status',
              header: '状态',
              render: (a) => (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  a.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
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
            <div className="flex items-center gap-2">
              <Link href={`/admin/articles/${article.id}/edit`}>
                <Button variant="ghost" size="sm">编辑</Button>
              </Link>
            </div>
          )}
          emptyText="暂无文章"
        />
      </div>
    </div>
  )
}
