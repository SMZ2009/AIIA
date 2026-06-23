import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ArticleForm from './ArticleForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '新建文章 | 管理后台' }

export default async function NewArticlePage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">新建文章</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <ArticleForm />
      </div>
    </div>
  )
}
