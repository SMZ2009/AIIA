import type { Metadata, Viewport } from 'next'
import { ToastProvider } from '@/components/ui/Toast'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { PwaRegister } from '@/components/layout/PwaRegister'
import './globals.css'

export const metadata: Metadata = {
  title: { default: '哈工大深圳人工智能创协', template: '%s — HITSZ AIIA' },
  description: '哈尔滨工业大学（深圳）人工智能创新协会 — 创新 · 协作 · 成长',
  icons: {
    icon: '/images/logoblack.jpg',
    apple: '/images/logoblack.jpg',
  },
  appleWebApp: {
    capable: true,
    title: 'HITSZ AIIA',
    statusBarStyle: 'black-translucent',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#060918',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="bg-[#060918]">
      <head>
        {/* 手动添加 manifest，避免 Next.js 自动加 crossorigin="use-credentials" */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#060918" />
      </head>
      <body className="min-h-screen-safe font-sans antialiased">
        <ToastProvider>
          <div className="pt-safe min-h-screen-safe">
            {children}
          </div>
          <BottomTabBar />
          <PwaRegister />
        </ToastProvider>
      </body>
    </html>
  )
}
