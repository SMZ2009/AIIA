import type { Metadata, Viewport } from 'next'
import { ToastProvider } from '@/components/ui/Toast'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import './globals.css'

export const metadata: Metadata = {
  title: { default: '哈工大深圳人工智能创协', template: '%s — HITSZ AIIA' },
  description: '哈尔滨工业大学（深圳）人工智能创新协会 — 创新 · 协作 · 成长',
  appleWebApp: { capable: true, title: 'HITSZ AIIA' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#060918',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="bg-[#060918]">
      <body className="min-h-screen-safe font-sans antialiased">
        <ToastProvider>
          <div className="pt-safe min-h-screen-safe">
            {children}
          </div>
          <BottomTabBar />
        </ToastProvider>
      </body>
    </html>
  )
}
