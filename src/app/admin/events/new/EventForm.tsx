'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useState } from 'react'

const eventSchema = z.object({
  title: z.string().min(2, '请输入标题'),
  summary: z.string().min(1, '请输入摘要'),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  startDate: z.string().min(1, '请选择开始时间'),
  endDate: z.string().min(1, '请选择结束时间'),
  location: z.string().min(1, '请输入地点'),
  maxParticipants: z.string().optional(),
  registrationDeadline: z.string().optional(),
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

  const {
    register,
    handleSubmit,
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
        }
      : {
          title: '',
          summary: '',
          content: '',
          coverImage: '',
          startDate: '',
          endDate: '',
          location: '',
          maxParticipants: '',
          registrationDeadline: '',
          status: 'draft',
        },
  })

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

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '保存失败')
      }

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
      <Textarea label="摘要 *" rows={2} {...register('summary')} error={errors.summary?.message} />
      <Textarea label="详细内容（Markdown）" rows={8} {...register('content')} placeholder="支持 Markdown 格式..." />
      <Input label="封面图片 URL" {...register('coverImage')} placeholder="https://..." />
      <div className="grid grid-cols-2 gap-4">
        <Input label="开始时间 *" type="datetime-local" {...register('startDate')} error={errors.startDate?.message} />
        <Input label="结束时间 *" type="datetime-local" {...register('endDate')} error={errors.endDate?.message} />
      </div>
      <Input label="地点 *" {...register('location')} error={errors.location?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="人数上限" type="number" {...register('maxParticipants')} placeholder="不填则不限" />
        <Input label="报名截止" type="datetime-local" {...register('registrationDeadline')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">状态</label>
        <select
          {...register('status')}
          className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        >
          <option value="draft">草稿</option>
          <option value="published">发布</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={submitting}>
          {isEdit ? '保存修改' : '创建活动'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>取消</Button>
      </div>
    </form>
  )
}
