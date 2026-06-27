import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const now = new Date()
  const [totalEvents, upcomingEvents, totalRegistrations, totalArticles] = await Promise.all([
    prisma.event.count({ where: { status: { not: 'draft' } } }),
    prisma.event.count({ where: { status: 'published', startDate: { gte: now } } }),
    prisma.registration.count(),
    prisma.article.count({ where: { status: { not: 'draft' } } }),
  ])

  return NextResponse.json({
    totalEvents,
    upcomingEvents,
    totalRegistrations,
    totalArticles,
  })
}
