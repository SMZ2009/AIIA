'use client'

import { X } from 'lucide-react'
import { useEffect, type ReactNode, useRef } from 'react'

export function BottomSheet({ open, onClose, title, children, className }: {
  open: boolean; onClose: () => void; title?: string; children: ReactNode; className?: string
}) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const el = sheetRef.current
    if (!el) return
    let startY = 0
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY }
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches[0].clientY - startY > 80) onClose()
    }
    el.addEventListener('touchstart', onTouchStart)
    el.addEventListener('touchend', onTouchEnd)
    return () => { el.removeEventListener('touchstart', onTouchStart); el.removeEventListener('touchend', onTouchEnd) }
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div ref={sheetRef} className={`relative bg-[#111827] w-full max-w-lg rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up px-6 pt-6 pb-safe ${className || ''}`}>
        <div className="flex justify-center -mt-2 mb-4">
          <div className="w-10 h-1 rounded-full bg-white/[0.1]" />
        </div>
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
