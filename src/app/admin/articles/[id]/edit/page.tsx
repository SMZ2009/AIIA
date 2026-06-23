import { getAdminSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ArticleForm from '../../new/ArticleForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '编辑文章 | 管理后台' }

interface Props {
  params: { id: string }
}

export default async function EditArticlePage({ params }: Props) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const article = await prisma.article.findUnique({ where: { id: params.id } })
  if (!article) notFound()

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">编辑文章</h1>
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
        <ArticleForm
          defaultValues={{
            title: article.title,
            summary: article.summary,
            link: article.link,
            coverImage: article.coverImage,
            publishedAt: article.publishedAt
              ? new Date(article.publishedAt).toISOString().slice(0, 16)
              : '',
            status: article.status,
          }}
          isEdit
          articleId={article.id}
        />
      </div>
    </div>
  )
}
