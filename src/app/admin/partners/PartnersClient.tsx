'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { useForm } from 'react-hook-form'
import { Plus, Trash2, X } from 'lucide-react'

const CATEGORIES = [
  { value: 'ENTERPRISE', label: '企业伙伴' },
  { value: 'UNIVERSITY', label: '高校伙伴' },
  { value: 'COMMUNITY', label: '社区伙伴' },
]

const categoryColor: Record<string, string> = {
  ENTERPRISE: 'bg-blue-500/10 text-blue-400',
  UNIVERSITY: 'bg-amber-500/10 text-amber-400',
  COMMUNITY: 'bg-emerald-500/10 text-emerald-400',
}

export function PartnersClient({ partners: initial }: { partners: any[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [partners, setPartners] = useState(initial)
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: { name: '', logoUrl: '', link: '', category: 'COMMUNITY', sortOrder: 0 },
  })

  const openNew = () => {
    reset({ name: '', logoUrl: '', link: '', category: 'COMMUNITY', sortOrder: 0 })
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = (p: any) => {
    reset({ name: p.name, logoUrl: p.logoUrl, link: p.link, category: p.category, sortOrder: p.sortOrder })
    setEditing(p)
    setShowForm(true)
  }

  const onSubmit = async (data: any) => {
    setSaving(true)
    try {
      const url = editing ? `/api/partners/${editing.id}` : '/api/partners'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error()
      toast('success', editing ? '已更新' : '已创建')
      setShowForm(false)
      router.refresh()
    } catch { toast('error', '保存失败') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除？')) return
    setDeleting(id)
    try {
      await fetch(`/api/partners/${id}`, { method: 'DELETE' })
      setPartners((p) => p.filter((x) => x.id !== id))
      toast('success', '已删除')
      router.refresh()
    } catch { toast('error', '删除失败') }
    finally { setDeleting(null) }
  }

  // Group by category
  const grouped: Record<string, any[]> = {}
  for (const c of CATEGORIES) grouped[c.value] = partners.filter((p) => p.category === c.value)

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" />添加伙伴</Button>
      </div>

      {/* Category sections */}
      {CATEGORIES.map((cat) => (
        <div key={cat.value}>
          <h2 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${cat.value === 'ENTERPRISE' ? 'bg-blue-400' : cat.value === 'UNIVERSITY' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            {cat.label}
            <span className="text-slate-600 text-xs ml-1">({grouped[cat.value].length})</span>
          </h2>
          {grouped[cat.value].length === 0 ? (
            <p className="text-xs text-slate-600 py-4">暂无</p>
          ) : (
            <div className="space-y-2">
              {grouped[cat.value].map((p) => (
                <div key={p.id} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                    {p.logoUrl ? <img src={p.logoUrl} alt={p.name} className="w-6 h-6 object-contain opacity-70" /> : <span className="text-sm font-bold text-slate-500">{p.name[0]}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 font-medium truncate">{p.name}</p>
                    {p.link && <p className="text-[11px] text-slate-600 truncate">{p.link}</p>}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${categoryColor[p.category]}`}>{cat.label}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>编辑</Button>
                    <Button variant="ghost" size="sm" loading={deleting === p.id} onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <form onSubmit={handleSubmit(onSubmit)} className="relative bg-[#111827] w-full max-w-lg rounded-t-3xl md:rounded-2xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{editing ? '编辑伙伴' : '添加伙伴'}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/[0.06]">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <Input label="名称 *" {...register('name', { required: true })} />
              <Input label="Logo URL" {...register('logoUrl')} placeholder="https://..." />
              <Input label="网站链接" {...register('link')} placeholder="https://..." />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">分类</label>
                <select {...register('category')} className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <Input label="排序" type="number" {...register('sortOrder', { valueAsNumber: true })} placeholder="数字越小越靠前" />

              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={saving}>{editing ? '保存' : '创建'}</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>取消</Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
