'use client'

import { CheckCircle, XCircle, X } from 'lucide-react'
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface Toast { id: string; type: 'success' | 'error'; message: string }
interface ToastContextValue { toast: (type: Toast['type'], message: string) => void }

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-in-right text-sm font-medium ${
            t.type === 'success' ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/20' : 'bg-red-900/80 text-red-200 border border-red-500/20'
          }`}>
            {t.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" /> : <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
