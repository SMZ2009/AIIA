import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export async function PartnerLogos() {
  const partners = await prisma.partner.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: 12,
  })

  if (partners.length === 0) return null

  return (
    <section className="px-5 py-10 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <span className="text-xs text-slate-400 tracking-widest uppercase">Partners</span>
      </div>
      <div className="flex items-center justify-center gap-5 flex-wrap">
        {partners.map((p) => (
          <div key={p.id} className="py-1.5 px-1">
            {p.logoUrl ? (
              <Image src={p.logoUrl} alt={p.name} width={120} height={32} className="h-7 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" unoptimized={p.logoUrl?.startsWith('data:')} />
            ) : (
              <span className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{p.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
