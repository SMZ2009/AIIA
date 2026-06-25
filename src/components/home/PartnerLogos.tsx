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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {partners.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 hover:bg-white/[0.06] transition-colors">
            {p.logoUrl ? (
              <Image src={p.logoUrl} alt={p.name} width={40} height={40} className="w-10 h-10 rounded-lg object-contain opacity-80 hover:opacity-100 transition-opacity" unoptimized={p.logoUrl?.startsWith('data:')} />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
                <span className="text-sm font-bold text-slate-400">{p.name?.[0] || '?'}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/80 truncate">{p.name}</p>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-indigo-400 truncate block transition-colors">
                  {p.link.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
