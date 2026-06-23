import { ExternalLink } from 'lucide-react'

interface PartnerCardProps {
  name: string; description: string; logoUrl: string; websiteUrl: string
}

export function PartnerCard({ name, description, logoUrl, websiteUrl }: PartnerCardProps) {
  const content = (
    <div className="glass-card p-5 text-center hover:border-white/[0.12] transition-all duration-300 group">
      <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-white/[0.03] border border-white/[0.06] group-hover:border-indigo-500/20 transition-colors">
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
        ) : (
          <span className="text-lg font-bold text-slate-600 group-hover:text-indigo-400 transition-colors">{name[0]}</span>
        )}
      </div>
      <h3 className="font-bold text-white text-[14px]">{name}</h3>
      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{description}</p>
      {websiteUrl && (
        <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400 mt-2 font-medium">
          访问官网 <ExternalLink className="w-3 h-3" />
        </span>
      )}
    </div>
  )
  if (websiteUrl) return <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  return content
}
