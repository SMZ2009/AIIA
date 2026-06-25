'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'

const eventSchema = z.object({
  title: z.string().min(2, '请输入标题'),
  summary: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  startDate: z.string().min(1, '请选择开始时间'),
  endDate: z.string().min(1, '请选择结束时间'),
  location: z.string().min(1, '请输入地点'),
  maxParticipants: z.string().optional(),
  registrationDeadline: z.string().optional(),
  registrationLink: z.string().optional(),
  status: z.enum(['draft', 'published']),
})

type EventFormData = z.infer<typeof eventSchema>

interface EventFormProps {
  defaultValues?: any
  isEdit?: boolean
  eventId?: string
}

export default function EventForm({ defaultValues, isEdit, eventId }: EventFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          startDate: defaultValues.startDate?.slice(0, 16),
          endDate: defaultValues.endDate?.slice(0, 16),
          registrationDeadline: defaultValues.registrationDeadline?.slice(0, 16) || '',
          maxParticipants: defaultValues.maxParticipants?.toString() || '',
          content: defaultValues.content || '',
          coverImage: defaultValues.coverImage || '',
          registrationLink: defaultValues.registrationLink || '',
        }
      : {
          title: '', summary: '', content: '', coverImage: '',
          startDate: '', endDate: '', location: '',
          maxParticipants: '', registrationDeadline: '', registrationLink: '',
          status: 'draft',
        },
  })

  const coverImage = watch('coverImage')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setValue('coverImage', url)
    } catch { toast('error', '上传失败') }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  const onSubmit = async (data: EventFormData) => {
    setSubmitting(true)
    try {
      const payload = {
        ...data,
        maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : null,
        registrationDeadline: data.registrationDeadline || null,
      }
      const url = isEdit ? `/api/events/${eventId}` : '/api/events'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || '保存失败') }
      toast('success', isEdit ? '更新成功' : '创建成功')
      router.push('/admin/events')
      router.refresh()
    } catch (err: any) {
      toast('error', err.message || '操作失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <Input label="标题 *" {...register('title')} error={errors.title?.message} />
      <Textarea label="摘要" rows={2} {...register('summary')} placeholder="选填" />
      <Textarea label="详细内容（Markdown）" rows={8} {...register('content')} placeholder="支持 Markdown 格式..." />

      {/* 封面上传 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">封面图片</label>
        {coverImage ? (
          <div className="relative w-full aspect-[16/9] max-h-[180px] rounded-xl overflow-hidden bg-[#111827] border border-white/[0.08]">
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            <button type="button" onClick={() => setValue('coverImage', '')}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-red-500 transition-colors">×</button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="w-full h-24 rounded-xl border-2 border-dashed border-white/[0.08] hover:border-indigo-500/40 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-indigo-400 transition-colors">
            {uploading ? <span className="text-sm">上传中...</span> : <><Upload className="w-5 h-5" /><span className="text-xs">点击上传封面</span></>}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="开始时间 *" type="datetime-local" {...register('startDate')} error={errors.startDate?.message} />
        <Input label="结束时间 *" type="datetime-local" {...register('endDate')} error={errors.endDate?.message} />
      </div>
      <Input label="地点 *" {...register('location')} error={errors.location?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="人数上限" type="number" {...register('maxParticipants')} placeholder="不填则不限" />
        <Input label="报名截止" type="datetime-local" {...register('registrationDeadline')} />
      </div>
      <Input label="报名链接" {...register('registrationLink')} placeholder="https://... 或小程序二维码链接" />

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">状态</label>
        <select {...register('status')}
          className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
          <option value="draft">草稿</option>
          <option value="published">发布</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={submitting}>{isEdit ? '保存修改' : '创建活动'}</Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>取消</Button>
      </div>
    </form>
  )
}
