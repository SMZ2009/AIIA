import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { PartnersClient } from './PartnersClient'

export const metadata: Metadata = { title: '合作伙伴管理 | 管理后台' }

export default async function AdminPartnersPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const partners = await prisma.partner.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">合作伙伴管理</h1>
      <PartnersClient partners={partners} />
    </div>
  )
}
