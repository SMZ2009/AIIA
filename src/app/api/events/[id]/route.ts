import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { syncSeedJson } from '@/lib/seed-sync'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { _count: { select: { registrations: true } } },
  })
  if (!event) {
    return NextResponse.json({ error: '活动未找到' }, { status: 404 })
  }
  return NextResponse.json(event)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const data = await req.json()
  const event = await prisma.event.update({
    where: { id: params.id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.summary !== undefined && { summary: data.summary }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.maxParticipants !== undefined && { maxParticipants: data.maxParticipants }),
      ...(data.registrationDeadline !== undefined && { registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null }),
      ...(data.registrationLink !== undefined && { registrationLink: data.registrationLink }),
      ...(data.status && { status: data.status }),
    },
  })

  syncSeedJson().catch(err => console.error('seed sync failed:', err))
  return NextResponse.json(event)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  await prisma.event.delete({ where: { id: params.id } })
  syncSeedJson().catch(err => console.error('seed sync failed:', err))
  return NextResponse.json({ success: true })
}
