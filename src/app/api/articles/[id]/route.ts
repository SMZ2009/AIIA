import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { syncSeedJson } from '@/lib/seed-sync'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const article = await prisma.article.findFirst({
    where: {
      id: params.id,
      status: 'published',
    },
  })
  if (!article) {
    return NextResponse.json({ error: '文章未找到' }, { status: 404 })
  }
  return NextResponse.json(article)
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
  const updateData: any = {}

  if (data.title !== undefined) updateData.title = data.title
  if (data.summary !== undefined) updateData.summary = data.summary
  if (data.link !== undefined) updateData.link = data.link
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage
  if (data.publishedAt !== undefined) {
    updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null
  }
  if (data.status !== undefined) {
    updateData.status = data.status
    if (data.status === 'published' && !updateData.publishedAt) {
      updateData.publishedAt = new Date()
    }
    if (data.status !== 'published') {
      updateData.publishedAt = null
    }
  }

  const article = await prisma.article.update({
    where: { id: params.id },
    data: updateData,
  })

  syncSeedJson().catch(err => console.error('seed sync failed:', err))
  return NextResponse.json(article)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  await prisma.article.delete({ where: { id: params.id } })
  syncSeedJson().catch(err => console.error('seed sync failed:', err))
  return NextResponse.json({ success: true })
}
