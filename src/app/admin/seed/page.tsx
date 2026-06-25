'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Plus, Trash2, FileJson } from 'lucide-react'

type Event = {
  title: string; summary: string; content: string; coverImage: string
  startDate: string; endDate: string; location: string
  maxParticipants: number | null; registrationDeadline: string; status: string
}
type Article = {
  title: string; summary: string; link: string; coverImage: string
  status: string; publishedAt: string
}
type Partner = {
  name: string; category: string; sortOrder: number
  logoUrl?: string; link?: string
}

type SeedData = { events: Event[]; articles: Article[]; partners: Partner[] }

const blankEvent: Event = { title: '', summary: '', content: '', coverImage: '',
  startDate: '', endDate: '', location: '', maxParticipants: null,
  registrationDeadline: '', status: 'published' }
const blankArticle: Article = { title: '', summary: '', link: '', coverImage: '',
  status: 'published', publishedAt: '' }
const blankPartner: Partner = { name: '', category: 'COMMUNITY', sortOrder: 0 }

const CATEGORIES = ['ENTERPRISE', 'UNIVERSITY', 'COMMUNITY']
const STATUSES = ['published', 'draft']

export default function SeedEditorPage() {
  const router = useRouter()
  const [data, setData] = useState<SeedData>({ events: [], articles: [], partners: [] })
  const [tab, setTab] = useState<'events' | 'articles' | 'partners'>('events')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => { fetch('/api/seed').then(r => r.json()).then(setData) }, [])

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/seed', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaving(false)
    setMessage(res.ok ? '✅ 已保存到 prisma/seed.json' : '❌ 保存失败')
    setTimeout(() => setMessage(''), 3000)
  }

  function update(idx: number, field: string, value: any) {
    setData(prev => {
      const copy = { ...prev, [tab]: [...(prev as any)[tab]] }
      copy[tab][idx] = { ...copy[tab][idx], [field]: value }
      return copy
    })
  }

  function addItem() {
    const blank: any = { events: blankEvent, articles: blankArticle, partners: blankPartner }
    setData(prev => ({ ...prev, [tab]: [...(prev as any)[tab], { ...blank[tab] }] }))
  }

  function removeItem(idx: number) {
    setData(prev => ({ ...prev, [tab]: (prev as any)[tab].filter((_: any, i: number) => i !== idx) }))
  }

  return (
    <div className="p-5 max-w-3xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <FileJson className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-400/50 tracking-widest uppercase block">Local Only</span>
            <h1 className="text-base font-bold text-white">种子数据编辑</h1>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors disabled:opacity-50">
          <Save className="w-3.5 h-3.5" />{saving ? '保存中...' : '保存'}
        </button>
      </div>

      {message && <div className="mb-4 px-3 py-2 rounded-lg bg-white/[0.04] text-sm text-slate-300">{message}</div>}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white/[0.02] rounded-xl p-1">
        {(['events', 'articles', 'partners'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
            {t === 'events' ? '活动' : t === 'articles' ? '文章' : '合作伙伴'}（{(data as any)[t].length}）
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-4">
        {tab === 'events' && data.events.map((e, i) => (
          <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">活动 #{i + 1}</span>
              <button onClick={() => removeItem(i)} className="p-1 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <Input label="标题" value={e.title} onChange={v => update(i, 'title', v)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="摘要" value={e.summary} onChange={v => update(i, 'summary', v)} />
              <Input label="地点" value={e.location} onChange={v => update(i, 'location', v)} />
            </div>
            <Textarea label="内容 (Markdown)" value={e.content} onChange={v => update(i, 'content', v)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="开始时间" type="datetime-local" value={toLocal(e.startDate)} onChange={v => update(i, 'startDate', toISO(v))} />
              <Input label="结束时间" type="datetime-local" value={toLocal(e.endDate)} onChange={v => update(i, 'endDate', toISO(v))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label="人数上限" type="number" value={String(e.maxParticipants ?? '')} onChange={v => update(i, 'maxParticipants', v ? Number(v) : null)} />
              <Input label="报名截止" type="datetime-local" value={toLocal(e.registrationDeadline)} onChange={v => update(i, 'registrationDeadline', toISO(v))} />
              <Select label="状态" value={e.status} onChange={v => update(i, 'status', v)} options={STATUSES} />
            </div>
            <Input label="封面图 URL" value={e.coverImage} onChange={v => update(i, 'coverImage', v)} />
          </div>
        ))}

        {tab === 'articles' && data.articles.map((a, i) => (
          <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">文章 #{i + 1}</span>
              <button onClick={() => removeItem(i)} className="p-1 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <Input label="标题" value={a.title} onChange={v => update(i, 'title', v)} />
            <Input label="摘要" value={a.summary} onChange={v => update(i, 'summary', v)} />
            <Input label="公众号链接" value={a.link} onChange={v => update(i, 'link', v)} />
            <Input label="封面图 URL" value={a.coverImage} onChange={v => update(i, 'coverImage', v)} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="状态" value={a.status} onChange={v => update(i, 'status', v)} options={STATUSES} />
              <Input label="发布时间" type="datetime-local" value={toLocal(a.publishedAt)} onChange={v => update(i, 'publishedAt', toISO(v))} />
            </div>
          </div>
        ))}

        {tab === 'partners' && data.partners.map((p, i) => (
          <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">伙伴 #{i + 1}</span>
              <button onClick={() => removeItem(i)} className="p-1 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="名称" value={p.name} onChange={v => update(i, 'name', v)} />
              <Select label="类别" value={p.category} onChange={v => update(i, 'category', v)} options={CATEGORIES} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Logo URL" value={p.logoUrl || ''} onChange={v => update(i, 'logoUrl', v)} />
              <Input label="链接" value={p.link || ''} onChange={v => update(i, 'link', v)} />
            </div>
            <Input label="排序" type="number" value={String(p.sortOrder)} onChange={v => update(i, 'sortOrder', Number(v))} />
          </div>
        ))}

        <button onClick={addItem} className="w-full py-3 rounded-xl border border-dashed border-white/[0.1] text-slate-500 text-sm hover:border-white/[0.2] hover:text-slate-300 transition-colors flex items-center justify-center gap-1.5">
          <Plus className="w-3.5 h-3.5" />添加{tab === 'events' ? '活动' : tab === 'articles' ? '文章' : '伙伴'}
        </button>
      </div>
    </div>
  )
}

// ── 小组件 ────────────────────────────────

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] text-slate-500 mb-1 block">{label}</span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors" />
    </label>
  )
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] text-slate-500 mb-1 block">{label}</span>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={4}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-y" />
    </label>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-[11px] text-slate-500 mb-1 block">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}

// ── 日期工具 ──────────────────────────────
function toLocal(iso?: string) { if (!iso) return ''; const d = new Date(iso); if (isNaN(d.getTime())) return ''; return d.toISOString().slice(0, 16) }
function toISO(local: string) { if (!local) return ''; return new Date(local).toISOString() }
