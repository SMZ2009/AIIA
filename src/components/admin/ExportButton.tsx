'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export function ExportButton() {
  const { toast } = useToast()
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/seed/export', { method: 'POST' })
      if (!res.ok) throw new Error()
      const { count } = await res.json()
      toast('success', `已导出 → prisma/seed.json（${count.events}活动 ${count.articles}文章 ${count.partners}伙伴）`)
    } catch {
      toast('error', '导出失败')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="bg-[#0a0e1a] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-white font-medium">导出数据</p>
        <p className="text-xs text-slate-500 mt-0.5">将当前数据库内容导出为 prisma/seed.json，提交到 Git 后 Render 部署即可同步</p>
      </div>
      <Button size="sm" onClick={handleExport} loading={exporting}>
        <Download className="w-4 h-4 mr-1" />导出 seed.json
      </Button>
    </div>
  )
}
