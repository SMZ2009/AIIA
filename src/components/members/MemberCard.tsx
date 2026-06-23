interface MemberCardProps {
  name: string; role: string; bio: string; avatarUrl: string
}

export function MemberCard({ name, role, bio, avatarUrl }: MemberCardProps) {
  return (
    <div className="glass-card p-4 text-center hover:border-white/[0.12] transition-all duration-300 group">
      <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden ring-2 ring-white/[0.06] group-hover:ring-indigo-500/30 transition-all">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-xl font-bold text-indigo-300">{name[0]}</span>
          </div>
        )}
      </div>
      <h3 className="font-bold text-white text-[14px]">{name}</h3>
      <p className="text-[11px] text-indigo-400 font-semibold mt-1 bg-indigo-500/10 inline-block px-2.5 py-0.5 rounded-full">{role}</p>
      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{bio}</p>
    </div>
  )
}
