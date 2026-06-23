'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { BottomSheet } from '@/components/layout/BottomSheet'
import { useToast } from '@/components/ui/Toast'
import { useState } from 'react'

const registrationSchema = z.object({
  name: z.string().min(2, '姓名至少 2 个字'),
  studentId: z.string().min(5, '请输入正确的学号'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入正确的手机号'),
  email: z.string().email('请输入正确的邮箱').or(z.literal('')).optional(),
  notes: z.string().max(500, '备注不能超过 500 字').optional(),
})

type RegistrationFormData = z.infer<typeof registrationSchema>

export function RegistrationForm({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  const onSubmit = async (data: RegistrationFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '报名失败')
      toast('success', '报名成功！')
      reset()
      setOpen(false)
    } catch (err: any) {
      toast('error', err.message || '报名失败，请稍后再试')
    } finally { setSubmitting(false) }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#060918]/90 backdrop-blur-xl border-t border-white/[0.06] pb-safe z-30">
        <div className="max-w-lg mx-auto">
          <Button className="w-full" size="lg" onClick={() => setOpen(true)}>立即报名</Button>
        </div>
      </div>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={`报名：${eventTitle}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
          <Input label="姓名 *" placeholder="请输入您的姓名" {...register('name')} error={errors.name?.message} />
          <Input label="学号 *" placeholder="请输入您的学号" {...register('studentId')} error={errors.studentId?.message} />
          <Input label="手机号 *" placeholder="请输入您的手机号" type="tel" {...register('phone')} error={errors.phone?.message} />
          <Input label="邮箱（选填）" placeholder="请输入您的邮箱" type="email" {...register('email')} error={errors.email?.message} />
          <Textarea label="备注（选填）" placeholder="如有特殊需求请在此说明" rows={3} {...register('notes')} error={errors.notes?.message} />
          <Button type="submit" className="w-full" size="lg" loading={submitting}>提交报名</Button>
        </form>
      </BottomSheet>
    </>
  )
}
