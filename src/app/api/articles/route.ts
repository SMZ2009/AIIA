import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { syncSeedJson } from '@/lib/seed-sync'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    skip: offset,
  })

  return NextResponse.json(articles)
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const data = await req.json()
  const article = await prisma.article.create({
    data: {
      title: data.title,
      summary: data.summary,
      link: data.link || '',
      coverImage: data.coverImage || '',
      status: data.status || 'draft',
      publishedAt:
        data.status === 'published'
          ? data.publishedAt
            ? new Date(data.publishedAt)
            : new Date()
          : null,
    },
  })

  syncSeedJson().catch(err => console.error('seed sync failed:', err))
  return NextResponse.json(article, { status: 201 })
}
