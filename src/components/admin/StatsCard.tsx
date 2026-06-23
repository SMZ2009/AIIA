import { type LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: number
  icon: LucideIcon
}

export function StatsCard({ label, value, icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
      </div>
    </div>
  )
}
