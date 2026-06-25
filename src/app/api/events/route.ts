import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { syncSeedJson } from '@/lib/seed-sync'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'published'
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  const events = await prisma.event.findMany({
    where: { status },
    orderBy: { startDate: 'asc' },
    take: limit,
    skip: offset,
    include: { _count: { select: { registrations: true } } },
  })

  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const data = await req.json()
  const event = await prisma.event.create({
    data: {
      title: data.title,
      summary: data.summary,
      content: data.content || '',
      coverImage: data.coverImage || '',
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      location: data.location,
      maxParticipants: data.maxParticipants || null,
      registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
      registrationLink: data.registrationLink || '',
      status: data.status || 'draft',
    },
  })

  syncSeedJson().catch(err => console.error('seed sync failed:', err))
  return NextResponse.json(event, { status: 201 })
}
