'use client'

import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

export function Modal({ open, onClose, title, children, className }: {
  open: boolean; onClose: () => void; title?: string; children: ReactNode; className?: string
}) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-[#111827] w-full max-w-lg rounded-t-3xl md:rounded-2xl max-h-[85vh] overflow-y-auto animate-slide-up md:animate-scale-in px-6 pt-6 pb-safe ${className || ''}`}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/[0.06] transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
