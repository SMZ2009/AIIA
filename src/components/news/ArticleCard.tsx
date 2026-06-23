import { formatDate } from '@/lib/utils'

interface ArticleCardProps {
  title: string; summary: string; link: string; coverImage: string
  publishedAt: Date | string | null
}

export function ArticleCard({ title, summary, link, coverImage, publishedAt }: ArticleCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.10] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
    >
      {coverImage && (
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.01]"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      )}

      <div className="px-5 pt-4 pb-5">
        <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2.5 tracking-wide">
          {publishedAt && (
            <span>{formatDate(publishedAt, 'short')}</span>
          )}
          <span className="w-1 h-1 rounded-full bg-white/[0.15]" />
          <span>微信公众号</span>
        </div>

        <h3 className="text-[15px] font-semibold text-white/95 group-hover:text-white leading-relaxed line-clamp-2 transition-colors duration-300">
          {title}
        </h3>

        <p className="text-[13px] text-slate-500 leading-relaxed mt-1.5 line-clamp-2">
          {summary}
        </p>
      </div>
    </a>
  )
}
