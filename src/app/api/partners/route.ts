import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

// GET — 公开，用于前端展示
export async function GET() {
  const partners = await prisma.partner.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json(partners)
}

// POST — 管理员创建
export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const data = await req.json()
  const partner = await prisma.partner.create({
    data: {
      name: data.name,
      logoUrl: data.logoUrl || '',
      link: data.link || '',
      category: data.category || 'COMMUNITY',
      sortOrder: data.sortOrder || 0,
    },
  })
  return NextResponse.json(partner, { status: 201 })
}
