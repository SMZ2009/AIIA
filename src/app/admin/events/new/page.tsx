import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import EventForm from './EventForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '新建活动 | 管理后台' }

export default async function NewEventPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">新建活动</h1>
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
        <EventForm />
      </div>
    </div>
  )
}
