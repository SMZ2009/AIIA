'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { slugify } from '@/lib/utils'
import { useState, useEffect } from 'react'

const articleSchema = z.object({
  title: z.string().min(2, '请输入标题'),
  slug: z.string().min(1, '请输入 slug'),
  summary: z.string().min(1, '请输入摘要'),
  content: z.string().min(1, '请输入正文'),
  coverImage: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(['draft', 'published']),
})

type ArticleFormData = z.infer<typeof articleSchema>

interface ArticleFormProps {
  defaultValues?: any
  isEdit?: boolean
  articleId?: string
}

export default function ArticleForm({ defaultValues, isEdit, articleId }: ArticleFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!isEdit)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: defaultValues || {
      title: '',
      slug: '',
      summary: '',
      content: '',
      coverImage: '',
      author: '',
      status: 'draft',
    },
  })

  const title = watch('title')

  useEffect(() => {
    if (autoSlug && title) {
      setValue('slug', slugify(title))
    }
  }, [title, autoSlug, setValue])

  const onSubmit = async (data: ArticleFormData) => {
    setSubmitting(true)
    try {
      const url = isEdit ? `/api/articles/${articleId}` : '/api/articles'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '保存失败')
      }

      toast('success', isEdit ? '更新成功' : '创建成功')
      router.push('/admin/articles')
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
      <Input
        label="Slug *"
        {...register('slug')}
        error={errors.slug?.message}
        onChange={(e) => {
          setAutoSlug(false)
          setValue('slug', e.target.value)
        }}
        placeholder="url-friendly-slug"
      />
      <Textarea label="摘要 *" rows={2} {...register('summary')} error={errors.summary?.message} />
      <Textarea
        label="正文 *（Markdown）"
        rows={12}
        {...register('content')}
        error={errors.content?.message}
        placeholder="支持 Markdown 格式..."
      />
      <Input label="封面图片 URL" {...register('coverImage')} placeholder="https://..." />
      <Input label="作者" {...register('author')} placeholder="署名作者" />
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
          {isEdit ? '保存修改' : '创建文章'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>取消</Button>
      </div>
    </form>
  )
}
