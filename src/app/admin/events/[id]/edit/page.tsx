import { getAdminSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EventForm from '../../new/EventForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '编辑活动 | 管理后台' }

interface Props {
  params: { id: string }
}

export default async function EditEventPage({ params }: Props) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const event = await prisma.event.findUnique({ where: { id: params.id } })
  if (!event) notFound()

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">编辑活动</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <EventForm
          defaultValues={{
            title: event.title,
            summary: event.summary,
            content: event.content,
            coverImage: event.coverImage,
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            location: event.location,
            maxParticipants: event.maxParticipants,
            registrationDeadline: event.registrationDeadline?.toISOString(),
            status: event.status,
          }}
          isEdit
          eventId={event.id}
        />
      </div>
    </div>
  )
}
