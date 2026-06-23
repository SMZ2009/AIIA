import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export async function FuturisticNews() {
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })

  if (articles.length === 0) return null

  return (
    <div className="space-y-3">
      {articles.map((article, i) => (
        <Link key={article.id} href={`/news/${article.slug}`} className="block group">
          <div
            className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 p-4"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white/90 group-hover:text-white text-[14px] leading-snug transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{article.summary}</p>
                <div className="flex items-center gap-2 mt-2.5">
                  {article.author && <span className="text-[11px] text-slate-500">{article.author}</span>}
                  {article.publishedAt && <span className="text-[11px] text-slate-600">· {formatDate(article.publishedAt, 'short')}</span>}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
