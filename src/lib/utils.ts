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

export function formatDateRange(start: unknown, end: unknown, format: 'short' | 'long' | 'datetime' = 'short'): string {
  const s = toDate(start)
  const e = toDate(end)
  if (!s || !e) return '--'

  if (format === 'datetime') {
    const y = s.getFullYear()
    const sm = String(s.getMonth() + 1).padStart(2, '0')
    const sd = String(s.getDate()).padStart(2, '0')
    const sh = String(s.getHours()).padStart(2, '0')
    const smin = String(s.getMinutes()).padStart(2, '0')
    const eh = String(e.getHours()).padStart(2, '0')
    const emin = String(e.getMinutes()).padStart(2, '0')

    // 同一天：2026-06-22 09:30-19:00
    if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth() && s.getDate() === e.getDate()) {
      return `${y}-${sm}-${sd} ${sh}:${smin}-${eh}:${emin}`
    }
    // 跨天：2026-06-22 09:30 - 2026-06-23 19:00
    const ey = e.getFullYear()
    const em = String(e.getMonth() + 1).padStart(2, '0')
    const ed = String(e.getDate()).padStart(2, '0')
    return `${y}-${sm}-${sd} ${sh}:${smin} - ${ey}-${em}-${ed} ${eh}:${emin}`
  }

  const sStr = formatDate(s, format)
  const eStr = formatDate(e, format)
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
