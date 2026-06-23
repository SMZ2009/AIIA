'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast('success', '登录成功')
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      toast('error', err.message || '登录失败')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen-safe bg-slate-50 flex items-center justify-center p-5">
      <div className="w-full max-w-[340px]">
        <div className="text-center mb-8">
          <img src="/images/logoblack.jpg" alt="AIIA" className="w-16 h-16 rounded-2xl object-contain mx-auto mb-4 border border-slate-100 shadow-sm" />
          <h1 className="text-xl font-bold text-slate-900">管理员登录</h1>
          <p className="text-sm text-slate-500 mt-1">HITSZ AIIA 后台管理系统</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          <Input label="用户名" placeholder="请输入用户名" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <Input label="密码" type="password" placeholder="请输入密码" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button type="submit" className="w-full" loading={loading}>登录</Button>
        </form>
      </div>
    </div>
  )
}
