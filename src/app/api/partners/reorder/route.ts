import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { syncSeedJson } from '@/lib/seed-sync'

export async function PUT(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const items: { id: string; sortOrder: number }[] = await req.json()
    for (const item of items) {
      await prisma.partner.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
    }
    syncSeedJson().catch(err => console.error('seed sync failed:', err))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
