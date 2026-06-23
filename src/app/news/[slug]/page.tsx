import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article) return { title: '文章未找到' }
  return { title: article.title, description: article.summary }
}

export default async function ArticleDetailPage({ params }: Props) {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article || article.status !== 'published') notFound()

  return (
    <div className="pb-[70px]">
      {/* 返回栏 */}
      <div className="sticky top-0 z-30 bg-[#060918]/80 backdrop-blur-xl border-b border-white/[0.06] pt-safe">
        <div className="flex items-center h-11 px-4">
          <Link href="/news" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回
          </Link>
        </div>
      </div>

      <div className="px-5 pt-5">
        {article.coverImage && (
          <img src={article.coverImage} alt={article.title} className="w-full rounded-2xl mb-5 aspect-[16/9] object-cover" />
        )}

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">新闻</span>
          {article.author && <span className="text-xs text-slate-500">{article.author}</span>}
          {article.publishedAt && <span className="text-xs text-slate-600">{formatDate(article.publishedAt, 'long')}</span>}
        </div>

        <h1 className="text-xl font-extrabold text-white mb-6 leading-snug">{article.title}</h1>

        <div className="glass-card p-5">
          <div className="prose-dark" dangerouslySetInnerHTML={{ __html: mdToHtml(article.content) }} />
        </div>

        <div className="mt-8 pt-5 border-t border-white/[0.06] text-center">
          <Link href="/news" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> 返回新闻列表
          </Link>
        </div>
      </div>
    </div>
  )
}

function mdToHtml(md: string): string {
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hulc])/gm, '<p>')
}
