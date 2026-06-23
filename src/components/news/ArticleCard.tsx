import { formatDate } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ArticleCardProps {
  slug: string; title: string; summary: string; coverImage: string
  author: string; publishedAt: Date | string | null
}

export function ArticleCard({ slug, title, summary, author, publishedAt }: ArticleCardProps) {
  return (
    <Link href={`/news/${slug}`} className="group block">
      <div className="glass-card-hover p-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white/90 group-hover:text-white text-[14px] leading-snug line-clamp-2 transition-colors">{title}</h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{summary}</p>
          <div className="flex items-center gap-2 mt-2.5">
            {author && <span className="text-[11px] text-slate-500">{author}</span>}
            {publishedAt && <span className="text-[11px] text-slate-600">· {formatDate(publishedAt, 'short')}</span>}
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
      </div>
    </Link>
  )
}
