'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { useForm } from 'react-hook-form'
import { Plus, Trash2, X, GripVertical, Upload, ImagePlus } from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const CATEGORIES = [
  { value: 'ENTERPRISE', label: '企业伙伴' },
  { value: 'UNIVERSITY', label: '高校伙伴' },
  { value: 'COMMUNITY', label: '社区伙伴' },
]

const categoryClass: Record<string, string> = {
  ENTERPRISE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  UNIVERSITY: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  COMMUNITY: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

// ── 可拖拽的卡片 ──────────────────────────────
function SortableCard({ p, onEdit, onDelete, deleting }: { p: any; onEdit: () => void; onDelete: () => void; deleting: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 bg-[#0a0e1a] border border-white/[0.06] rounded-xl px-4 py-3 hover:border-white/[0.10] transition-colors">
      <button type="button" {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none p-1 -ml-1">
        <GripVertical className="w-4 h-4 text-slate-600 hover:text-slate-400" />
      </button>

      <div className="w-10 h-10 rounded-lg bg-[#111827] flex items-center justify-center shrink-0 overflow-hidden">
        {p.logoUrl ? (
          <img src={p.logoUrl} alt={p.name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-sm font-bold text-slate-600">{p.name?.[0]}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{p.name}</p>
        {p.link && <p className="text-[11px] text-slate-600 truncate">{p.link}</p>}
      </div>

      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryClass[p.category] || categoryClass.COMMUNITY}`}>
        {CATEGORIES.find(c => c.value === p.category)?.label || p.category}
      </span>

      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={onEdit}>编辑</Button>
        <Button variant="ghost" size="sm" loading={deleting} onClick={onDelete}>
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </Button>
      </div>
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
    defaultValues: { name: '', logoUrl: '', link: '', category: 'COMMUNITY', sortOrder: 0 },
  })

  const logoUrl = watch('logoUrl')

  const openNew = () => {
    reset({ name: '', logoUrl: '', link: '', category: 'COMMUNITY', sortOrder: 0 })
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = (p: any) => {
    reset({ name: p.name, logoUrl: p.logoUrl || '', link: p.link || '', category: p.category, sortOrder: p.sortOrder })
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

  // ── 拖拽排序 ──────────────────────────────
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setPartners((prev) => {
      const oldIdx = prev.findIndex((p) => p.id === active.id)
      const newIdx = prev.findIndex((p) => p.id === over.id)
      const reordered = arrayMove(prev, oldIdx, newIdx)
      // 批量更新 sortOrder
      const updates = reordered.map((p, i) => ({ id: p.id, sortOrder: i }))
      fetch('/api/partners/reorder', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) }).catch(() => {})
      return reordered
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
      toast('success', 'Logo 上传成功')
    } catch { toast('error', '上传失败') }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">拖拽左侧手柄可调整排序</p>
        </div>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" />添加伙伴</Button>
      </div>

      {/* 可拖拽列表 */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={partners.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {partners.length === 0 && <p className="text-sm text-slate-600 py-8 text-center">暂无合作伙伴，点击右上角添加</p>}
            {partners.map((p) => (
              <SortableCard key={p.id} p={p} onEdit={() => openEdit(p)} onDelete={() => handleDelete(p.id)} deleting={deleting === p.id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <form onSubmit={handleSubmit(onSubmit)} className="relative bg-[#0a0e1a] w-full max-w-lg rounded-t-3xl md:rounded-2xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto border border-white/[0.08]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">{editing ? '编辑伙伴' : '添加伙伴'}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/[0.06]">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <Input label="名称 *" {...register('name', { required: true })} />

              {/* Logo 上传 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Logo</label>
                {logoUrl ? (
                  <div className="relative inline-block">
                    <img src={logoUrl} alt="Logo" className="w-20 h-20 rounded-xl object-contain bg-[#111827] border border-white/[0.08]" />
                    <button type="button" onClick={() => setValue('logoUrl', '')} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">×</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full h-20 rounded-xl border-2 border-dashed border-white/[0.08] hover:border-indigo-500/40 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-indigo-400 transition-colors">
                    {uploading ? <span className="text-sm">上传中...</span> : <><Upload className="w-5 h-5" /><span className="text-xs">点击上传 Logo</span></>}
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>

              <Input label="网站链接" {...register('link')} placeholder="https://..." />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">分类</label>
                <select {...register('category')} className="w-full h-11 px-4 rounded-xl bg-[#111827] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
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
