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
      <h1 className="text-xl font-bold text-gray-900 mb-6">编辑文章</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <ArticleForm
          defaultValues={{
            title: article.title,
            slug: article.slug,
            summary: article.summary,
            content: article.content,
            coverImage: article.coverImage,
            author: article.author,
            status: article.status,
          }}
          isEdit
          articleId={article.id}
        />
      </div>
    </div>
  )
}
