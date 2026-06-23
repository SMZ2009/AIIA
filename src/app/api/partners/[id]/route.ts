import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

// PUT — 编辑
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const data = await req.json()
  const updateData: any = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl
  if (data.link !== undefined) updateData.link = data.link
  if (data.category !== undefined) updateData.category = data.category
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder

  const partner = await prisma.partner.update({ where: { id: params.id }, data: updateData })
  return NextResponse.json(partner)
}

// DELETE — 删除
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })

  await prisma.partner.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
