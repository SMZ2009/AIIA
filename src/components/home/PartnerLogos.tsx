import { partners } from '@/data/partners'
import { Handshake } from 'lucide-react'

export function PartnerLogos() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-10 md:py-16">
      <div className="flex items-center justify-center gap-1.5 text-brand-600 text-xs font-semibold mb-1.5">
        <Handshake className="w-3.5 h-3.5" />
        PARTNERS
      </div>
      <h2 className="text-xl font-extrabold text-slate-900 text-center mb-6">合作伙伴</h2>
      <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
            title={partner.name}
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-white group-hover:shadow-card transition-all flex items-center justify-center">
              {partner.logoUrl ? (
                <img src={partner.logoUrl} alt={partner.name} className="w-7 h-7 object-contain" />
              ) : (
                <span className="text-base font-bold text-slate-300 group-hover:text-brand-400 transition-colors">{partner.name[0]}</span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors">{partner.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
