// 每次数据变更后自动同步 prisma/seed.json，防止部署后数据丢失
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

function dateStr(d: any): string | null {
  if (!d) return null
  return new Date(d).toISOString()
}

export async function syncSeedJson() {
  try {
    const [events, articles, partners] = await Promise.all([
      prisma.event.findMany({ orderBy: { startDate: 'asc' } }),
      prisma.article.findMany({ orderBy: { publishedAt: 'desc' } }),
      prisma.partner.findMany({ orderBy: { sortOrder: 'asc' } }),
    ])

    const data = {
      events: events.map((e: any) => ({
        title: e.title, summary: e.summary || '', content: e.content || '',
        coverImage: e.coverImage || '', startDate: dateStr(e.startDate), endDate: dateStr(e.endDate),
        location: e.location, maxParticipants: e.maxParticipants,
        registrationDeadline: dateStr(e.registrationDeadline), registrationLink: e.registrationLink || '',
        status: e.status,
      })),
      articles: articles.map((a: any) => ({
        title: a.title, summary: a.summary, link: a.link,
        coverImage: a.coverImage || '', status: a.status,
        publishedAt: dateStr(a.publishedAt),
      })),
      partners: partners.map((p: any) => ({
        name: p.name, logoUrl: p.logoUrl || '', link: p.link || '',
        category: p.category, sortOrder: p.sortOrder,
      })),
    }

    const seedPath = path.join(process.cwd(), 'prisma', 'seed.json')
    fs.writeFileSync(seedPath, JSON.stringify(data, null, 2), 'utf-8')
    console.log(`[seed-sync] Written ${data.events.length} events, ${data.articles.length} articles, ${data.partners.length} partners → prisma/seed.json`)
  } catch (err) {
    console.error('[seed-sync] Failed to sync seed.json:', err)
  }
}
