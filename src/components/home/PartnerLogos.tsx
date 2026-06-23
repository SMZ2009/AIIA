import { prisma } from '@/lib/prisma'

export async function PartnerLogos() {
  const partners = await prisma.partner.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: 12,
  })

  if (partners.length === 0) return null

  return (
    <section className="px-5 py-10 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <span className="text-[10px] text-slate-600 tracking-widest uppercase">Partners</span>
      </div>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {partners.map((p) => (
          <div key={p.id} className="py-2 px-1">
            {p.logoUrl ? (
              <img src={p.logoUrl} alt={p.name} className="h-6 object-contain opacity-50 hover:opacity-80 transition-opacity" />
            ) : (
              <span className="text-xs font-medium text-slate-600 hover:text-slate-400 transition-colors">{p.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
