import { type LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: number
  icon: LucideIcon
}

export function StatsCard({ label, value, icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
      </div>
    </div>
  )
}
