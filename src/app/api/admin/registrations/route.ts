import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  const where: any = {}
  if (eventId) where.eventId = eventId

  const [registrations, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      include: { event: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.registration.count({ where }),
  ])

  return NextResponse.json({ registrations, total })
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const { id, status } = await req.json()
  const registration = await prisma.registration.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(registration)
}
