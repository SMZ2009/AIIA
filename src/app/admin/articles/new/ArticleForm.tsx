'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useRef, useState } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'

const articleSchema = z.object({
  title: z.string().min(2, '请输入标题'),
  summary: z.string().optional(),
  link: z.string().url('请输入有效的 URL').min(1, '请输入公众号链接'),
  coverImage: z.string().optional(),
  publishedAt: z.string().optional(),
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
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>(defaultValues?.coverImage || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: defaultValues || {
      title: '',
      summary: '',
      link: '',
      coverImage: '',
      publishedAt: new Date().toISOString().slice(0, 16),
      status: 'draft',
    },
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast('error', '文件大小不能超过 5MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '上传失败')
      }

      const { url } = await res.json()
      setPreview(url)
      setValue('coverImage', url)
      toast('success', '封面上传成功')
    } catch (err: any) {
      toast('error', err.message || '上传失败')
    } finally {
      setUploading(false)
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const clearCover = () => {
    setPreview('')
    setValue('coverImage', '')
  }

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

      <Textarea label="简介" rows={3} {...register('summary')} error={errors.summary?.message} />

      <Input
        label="公众号链接 *"
        {...register('link')}
        error={errors.link?.message}
        placeholder="https://mp.weixin.qq.com/s/..."
      />

      {/* 封面上传 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          封面图片（比例 2.35:1，建议 940×400）
        </label>

        {preview ? (
          <div className="relative rounded-xl overflow-hidden border border-white/[0.08] mb-2">
            <div className="aspect-[2.35/1]">
              <img src={preview} alt="封面预览" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={clearCover}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full aspect-[2.35/1] max-h-[200px] rounded-xl border-2 border-dashed border-white/[0.08] hover:border-indigo-500/40 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors bg-white/[0.02]"
          >
            {uploading ? (
              <>
                <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs">上传中...</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-xs">点击上传封面图片</span>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />

        {/* 手动输入 URL 备选 */}
        <div className="mt-2">
          <Input
            placeholder="或输入图片 URL..."
            {...register('coverImage')}
            onChange={(e) => {
              setValue('coverImage', e.target.value)
              setPreview(e.target.value)
            }}
          />
        </div>
      </div>

      <Input
        label="发布日期"
        type="datetime-local"
        {...register('publishedAt')}
        error={errors.publishedAt?.message}
      />

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">状态</label>
        <select
          {...register('status')}
          className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        >
          <option value="draft">草稿</option>
          <option value="published">发布</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={submitting}>
          {isEdit ? '保存修改' : '创建'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>取消</Button>
      </div>
    </form>
  )
}
