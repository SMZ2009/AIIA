export function Loading({ className, text = '加载中...' }: { className?: string; text?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className || ''}`}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-white/[0.04]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-400 animate-spin" />
      </div>
      <p className="mt-4 text-sm text-slate-600">{text}</p>
    </div>
  )
}

export function CardSkeleton() {
  return <div className="glass-card h-20 animate-pulse" />
}

export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return <div className="space-y-3">{Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}</div>
}
