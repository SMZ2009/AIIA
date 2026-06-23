import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: { _count: { select: { registrations: true } } },
    })

    if (!event) {
      return NextResponse.json({ error: '活动未找到' }, { status: 404 })
    }

    // 校验活动状态
    if (event.status !== 'published') {
      return NextResponse.json({ error: '该活动暂不接受报名' }, { status: 400 })
    }

    // 校验时间
    if (new Date(event.startDate) <= new Date()) {
      return NextResponse.json({ error: '活动已开始，无法报名' }, { status: 400 })
    }

    // 校验报名截止
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return NextResponse.json({ error: '报名已截止' }, { status: 400 })
    }

    // 校验人数上限
    if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
      return NextResponse.json({ error: '报名人数已满' }, { status: 400 })
    }

    const body = await req.json()

    // 校验必填字段
    const { name, studentId, phone, email, notes } = body
    if (!name || !studentId || !phone) {
      return NextResponse.json({ error: '请填写必填信息' }, { status: 400 })
    }

    // 创建报名
    const registration = await prisma.registration.create({
      data: {
        eventId: params.id,
        name,
        studentId,
        phone,
        email: email || '',
        notes: notes || '',
      },
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (err: any) {
    // 重复报名
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: '您已报名该活动，请勿重复报名' }, { status: 409 })
    }
    return NextResponse.json({ error: '报名失败' }, { status: 500 })
  }
}
