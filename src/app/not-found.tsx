import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center min-h-screen-safe">
      <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
        <span className="text-3xl font-black text-slate-600">404</span>
      </div>
      <h1 className="text-xl font-bold text-white mb-2">页面未找到</h1>
      <p className="text-sm text-slate-500 mb-8">您访问的页面不存在或已被移除</p>
      <Link href="/" className="inline-flex items-center gap-2 h-11 px-6 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors">
        <Home className="w-4 h-4" /> 返回首页
      </Link>
    </div>
  )
}
