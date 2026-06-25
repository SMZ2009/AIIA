import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

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
        <a
          key={article.id}
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block group rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.10] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {article.coverImage && (
            <div className="relative w-full aspect-[2/1] overflow-hidden">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>
          )}

          <div className="px-5 pt-4 pb-5">
            <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2.5 tracking-wide">
              {article.publishedAt && (
                <span>{formatDate(article.publishedAt, 'short')}</span>
              )}
              <span className="w-1 h-1 rounded-full bg-white/[0.15]" />
              <span>微信公众号</span>
            </div>

            <h3 className="text-[15px] font-semibold text-white/95 group-hover:text-white leading-relaxed line-clamp-2 transition-colors duration-300">
              {article.title}
            </h3>

            <p className="text-[13px] text-slate-500 leading-relaxed mt-1.5 line-clamp-2">
              {article.summary}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
