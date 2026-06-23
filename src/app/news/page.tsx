import { prisma } from '@/lib/prisma'
import { ArticleCard } from '@/components/news/ArticleCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Newspaper } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '新闻' }

export default async function NewsPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="pb-[70px]">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="icon-box bg-cyan-500/10">
            <Newspaper className="w-4 h-4 text-cyan-400" />
          </div>
          <h1 className="section-title text-lg">新闻</h1>
        </div>
      </div>

      <div className="px-5 space-y-3">
        {articles.length > 0
          ? articles.map((a) => <ArticleCard key={a.id} title={a.title} summary={a.summary} link={a.link} coverImage={a.coverImage} publishedAt={a.publishedAt} />)
          : <EmptyState icon={Newspaper} title="暂无新闻" />}
      </div>
    </div>
  )
}
