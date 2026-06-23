import { type LucideIcon, Inbox } from 'lucide-react'
import { type ReactNode } from 'react'

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: {
  icon?: LucideIcon; title: string; description?: string; action?: ReactNode; className?: string
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className || ''}`}>
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-slate-600" />
      </div>
      <h3 className="text-sm font-medium text-slate-300 mb-1">{title}</h3>
      {description && <p className="text-xs text-slate-600 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}
