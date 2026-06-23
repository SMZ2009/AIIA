import { prisma } from '@/lib/prisma'
import { ArticleCard } from '@/components/news/ArticleCard'
import { ArrowRight, Newspaper } from 'lucide-react'
import Link from 'next/link'

export async function LatestNews() {
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })

  return (
    <section className="max-w-6xl mx-auto px-5 py-10 md:py-16">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-brand-600 text-xs font-semibold mb-1.5">
            <Newspaper className="w-3.5 h-3.5" />
            LATEST
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">最新动态</h2>
        </div>
        <Link href="/news" className="hidden sm:flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
          查看全部 <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {articles.map((article, i) => (
            <div key={article.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <ArticleCard title={article.title} summary={article.summary} link={article.link} coverImage={article.coverImage} publishedAt={article.publishedAt} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <p className="text-slate-400 text-xs">暂无新闻</p>
        </div>
      )}

      <div className="mt-4 text-center sm:hidden">
        <Link href="/news" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600">
          查看全部新闻 <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  )
}
