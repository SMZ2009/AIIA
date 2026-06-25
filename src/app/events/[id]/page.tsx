import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatDate, formatDateRange } from '@/lib/utils'
import { Calendar, MapPin, Users, Clock, ArrowLeft, ExternalLink } from 'lucide-react'
import { RegistrationForm } from '@/components/events/RegistrationForm'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props { params: { id: string } }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await prisma.event.findUnique({ where: { id: params.id } })
  if (!event) return { title: '活动未找到' }
  return { title: event.title }
}

export default async function EventDetailPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { _count: { select: { registrations: true } } },
  })
  if (!event || event.status === 'draft') notFound()

  const now = new Date()
  const isUpcoming = new Date(event.startDate) > now
  const deadlinePassed = event.registrationDeadline ? new Date(event.registrationDeadline) < now : false
  const isFull = event.maxParticipants ? event._count.registrations >= event.maxParticipants : false
  const canRegister = event.status === 'published' && isUpcoming && !deadlinePassed && !isFull

  return (
    <div className="pb-24">
      {/* 返回栏 */}
      <div className="sticky top-0 z-30 bg-[#060918]/80 backdrop-blur-xl border-b border-white/[0.06] pt-safe">
        <div className="flex items-center h-11 px-4">
          <Link href="/events" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回
          </Link>
        </div>
      </div>

      {/* 封面 */}
      <div className="aspect-[16/9] max-h-[220px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 relative overflow-hidden">
        {event.coverImage ? (
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-indigo-400/30" />
          </div>
        )}
      </div>

      <div className="px-5 mt-4 space-y-4">
        {/* 信息卡片 */}
        <div className="glass-card p-5">
          <h1 className="text-lg font-extrabold text-white mb-4 leading-snug">{event.title}</h1>
          <div className="space-y-2">
            <Row icon={Calendar} text={formatDateRange(event.startDate, event.endDate, 'datetime')} />
            <Row icon={MapPin} text={event.location} />
            {event.maxParticipants && (
              <Row icon={Users} text={`限额${event.maxParticipants}人`} extra={isFull ? <span className="text-red-400 text-xs">（已满）</span> : undefined} />
            )}
            {event.registrationDeadline && (
              <Row icon={Clock} text={`报名截止 ${formatDate(event.registrationDeadline, 'datetime')}`} extra={deadlinePassed ? <span className="text-red-400 text-xs">（已截止）</span> : undefined} />
            )}
          </div>
        </div>

        {/* 正文 */}
        {event.content && (
          <div className="glass-card p-5">
            <div className="prose-dark" dangerouslySetInnerHTML={{ __html: renderMarkdown(event.content) }} />
          </div>
        )}

        {/* 报名链接 */}
        {event.registrationLink && (
          <div className="glass-card p-5 text-center">
            <h3 className="text-sm font-bold text-white mb-4">报名入口</h3>
            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors text-sm font-medium">
              <ExternalLink className="w-4 h-4" />打开报名链接
            </a>
            {/* QR 码 */}
            <div className="mt-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(event.registrationLink)}`}
                alt="报名二维码"
                className="w-[180px] h-[180px] mx-auto rounded-xl bg-white p-2"
              />
              <p className="text-xs text-slate-600 mt-2">扫码报名</p>
            </div>
          </div>
        )}

        {/* 报名表单 */}
        {canRegister && !event.registrationLink && (
          <RegistrationForm eventId={event.id} eventTitle={event.title} />
        )}
      </div>
    </div>
  )
}

function Row({ icon: Icon, text, extra }: { icon: any; text: string; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px] text-slate-400 bg-white/[0.02] rounded-xl px-3.5 py-2.5 border border-white/[0.04]">
      <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
      <span className="flex-1">{text}</span>
      {extra}
    </div>
  )
}

// 简单的 Markdown → HTML（无需客户端 JS）
function renderMarkdown(md: string): string {
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
    .replace(/(?<!<\/[hulcp]>)$/gm, '</p>')
}
