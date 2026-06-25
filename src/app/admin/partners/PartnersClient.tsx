'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { useForm } from 'react-hook-form'
import { Plus, Trash2, X, GripVertical, Upload, Building2, GraduationCap, Users } from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const CATEGORIES = [
  { value: 'ENTERPRISE', label: '企业伙伴', icon: Building2, dot: 'bg-blue-400', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { value: 'UNIVERSITY', label: '高校伙伴', icon: GraduationCap, dot: 'bg-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { value: 'COMMUNITY', label: '社区伙伴', icon: Users, dot: 'bg-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
]

// ── 单个可拖拽卡片 ────────────────────────────
function SortableCard({ p, onEdit, onDelete, deleting }: {
  p: any; onEdit: () => void; onDelete: () => void; deleting: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  const cat = CATEGORIES.find(c => c.value === p.category)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-[#0a0e1a] border border-white/[0.06] rounded-xl px-4 py-3 hover:border-white/[0.10] transition-all group"
    >
      <button type="button" {...attributes} {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 opacity-50 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-slate-500" />
      </button>

      <div className="w-11 h-11 rounded-xl bg-[#111827] border border-white/[0.05] flex items-center justify-center shrink-0 overflow-hidden">
        {p.logoUrl ? (
          <img src={p.logoUrl} alt={p.name} className="w-full h-full object-contain p-1.5" />
        ) : (
          <span className="text-base font-bold text-slate-400">{p.name?.[0] || '?'}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{p.name}</p>
        {p.link && (
          <a href={p.link} target="_blank" rel="noopener noreferrer"
            className="text-[11px] text-slate-500 hover:text-indigo-400 truncate block transition-colors">
            {p.link.replace(/^https?:\/\//, '')}
          </a>
        )}
      </div>

      <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${cat?.badge}`}>
        {cat?.label}
      </span>

      <button onClick={onEdit}
        className="text-[11px] text-slate-500 hover:text-white px-2 py-1 rounded-lg hover:bg-white/[0.06] transition-colors shrink-0">
        编辑
      </button>
      <button onClick={onDelete} disabled={deleting}
        className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors shrink-0">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ── 分区拖拽列表 ──────────────────────────────
function CategorySection({ cat, items, onEdit, onDelete, deleting, onDragEnd }: {
  cat: typeof CATEGORIES[0]
  items: any[]
  onEdit: (p: any) => void
  onDelete: (id: string) => void
  deleting: string | null
  onDragEnd: (event: DragEndEvent) => void
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const Icon = cat.icon

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2.5 px-1">
        <div className={`w-2 h-2 rounded-full ${cat.dot}`} />
        <Icon className="w-3.5 h-3.5 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-300">{cat.label}</h3>
        <span className="text-[11px] text-slate-400 ml-1">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-700 py-4 pl-6">暂无</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1.5">
              {items.map(p => (
                <SortableCard key={p.id} p={p} onEdit={() => onEdit(p)}
                  onDelete={() => onDelete(p.id)} deleting={deleting === p.id} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

// ── 主组件 ──────────────────────────────────────
export function PartnersClient({ partners: initial }: { partners: any[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [partners, setPartners] = useState(initial)
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: { name: '', logoUrl: '', link: '', category: 'COMMUNITY' },
  })
  const logoUrl = watch('logoUrl')

  const openNew = () => {
    reset({ name: '', logoUrl: '', link: '', category: 'COMMUNITY' })
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = (p: any) => {
    reset({ name: p.name, logoUrl: p.logoUrl || '', link: p.link || '', category: p.category })
    setEditing(p)
    setShowForm(true)
  }

  const onSubmit = async (data: any) => {
    setSaving(true)
    try {
      const payload = { ...data, sortOrder: editing ? editing.sortOrder : partners.length }
      const url = editing ? `/api/partners/${editing.id}` : '/api/partners'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
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
      setPartners(prev => prev.filter(x => x.id !== id))
      toast('success', '已删除')
      router.refresh()
    } catch { toast('error', '删除失败') }
    finally { setDeleting(null) }
  }

  // ── 拖拽排序（按分类内排序） ────────────────
  const handleDragEnd = useCallback((category: string) => (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setPartners(prev => {
      const catItems = prev.filter(p => p.category === category)
      const oldIdx = catItems.findIndex(p => p.id === active.id)
      const newIdx = catItems.findIndex(p => p.id === over.id)
      const reordered = arrayMove(catItems, oldIdx, newIdx)
      // 更新 sortOrder
      const updates = reordered.map((p, i) => ({ id: p.id, sortOrder: i }))
      fetch('/api/partners/reorder', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates)
      }).catch(() => {})
      // 合并回原数组
      const other = prev.filter(p => p.category !== category)
      return [...other, ...reordered].sort((a, b) => {
        const ci = CATEGORIES.findIndex(c => c.value === a.category)
        const cj = CATEGORIES.findIndex(c => c.value === b.category)
        if (ci !== cj) return ci - cj
        return reordered.findIndex(x => x.id === a.id) - reordered.findIndex(x => x.id === b.id)
      })
    })
  }, [])

  // ── Logo 上传 ──────────────────────────────
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast('error', '图片不能超过 5MB'); return }
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      setValue('logoUrl', url)
    } catch { toast('error', '上传失败') }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  // ── 分组 ────────────────────────────────────
  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    items: partners.filter(p => p.category === cat.value).sort((a, b) => a.sortOrder - b.sortOrder),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">拖拽手柄调整排序，仅同组内有效</p>
        <Button size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-1" />添加伙伴
        </Button>
      </div>

      {partners.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-8 h-8 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500">暂无合作伙伴</p>
          <p className="text-xs text-slate-700 mt-1">点击右上角「添加伙伴」开始</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(cat => (
            <CategorySection key={cat.value} cat={cat} items={cat.items}
              onEdit={openEdit} onDelete={handleDelete} deleting={deleting}
              onDragEnd={handleDragEnd(cat.value)} />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <form onSubmit={handleSubmit(onSubmit)}
            className="relative bg-[#0a0e1a] w-full max-w-lg rounded-t-3xl md:rounded-2xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto border border-white/[0.08] shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">{editing ? '编辑伙伴' : '添加伙伴'}</h3>
              <button type="button" onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/[0.06] transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <Input label="名称 *" {...register('name', { required: true })} />

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Logo</label>
                {logoUrl ? (
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-[#111827] border border-white/[0.08] flex items-center justify-center overflow-hidden">
                      <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
                    </div>
                    <button type="button" onClick={() => setValue('logoUrl', '')}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors">移除</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="w-full h-20 rounded-xl border-2 border-dashed border-white/[0.08] hover:border-indigo-500/40 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-indigo-400 transition-colors">
                    {uploading ? <span className="text-sm">上传中...</span> : <><Upload className="w-5 h-5" /><span className="text-xs">点击上传 Logo</span></>}
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>

              <Input label="网站链接" {...register('link')} placeholder="https://..." />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">分类</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(c => (
                    <label key={c.value} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${watch('category') === c.value ? 'border-indigo-500/50 bg-indigo-500/10 text-white' : 'border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/[0.12]'}`}>
                      <input type="radio" value={c.value} {...register('category')} className="sr-only" />
                      <c.icon className="w-3.5 h-3.5" />{c.label}
                    </label>
                  ))}
                </div>
              </div>

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
