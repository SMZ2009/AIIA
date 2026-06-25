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

      // 触发浏览器下载
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'seed.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast('success', 'seed.json 已下载，请将其放入 prisma/ 目录并提交到 Git')
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
        <p className="text-xs text-slate-500 mt-0.5">将当前数据库内容下载为 seed.json，放入 prisma/ 目录提交到 Git 后部署即可同步</p>
      </div>
      <Button size="sm" onClick={handleExport} loading={exporting}>
        <Download className="w-4 h-4 mr-1" />导出 seed.json
      </Button>
    </div>
  )
}
