export function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs
    .flat()
    .filter((x): x is string => typeof x === 'string' && x.length > 0)
    .join(' ')
}

function toDate(v: unknown): Date | null {
  if (v instanceof Date) return v
  if (typeof v === 'string' && v) return new Date(v)
  return null
}

export function formatDate(date: unknown, format: 'short' | 'long' | 'datetime' = 'short'): string {
  const d = toDate(date)
  if (!d || isNaN(d.getTime())) return '--'
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')

  if (format === 'datetime') return `${y}-${m}-${day} ${h}:${min}`
  if (format === 'long') return `${y}年${m}月${day}日`
  return `${m}-${day}`
}

export function formatDateRange(start: unknown, end: unknown): string {
  const s = toDate(start)
  const e = toDate(end)
  if (!s || !e) return '--'
  const sStr = formatDate(s, 'short')
  const eStr = formatDate(e, 'short')
  if (sStr === eStr) return sStr
  return `${sStr} - ${eStr}`
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}
