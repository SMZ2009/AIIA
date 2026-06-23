'use client'

import { cn } from '@/lib/utils'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  actions?: (item: T) => React.ReactNode
  onRowClick?: (item: T) => void
  emptyText?: string
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  actions,
  onRowClick,
  emptyText = '暂无数据',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-sm text-slate-500">
        {emptyText}
      </div>
    )
  }

  return (
    <>
      {/* 桌面表格 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn('text-left py-3 px-4 font-medium text-slate-500 text-xs', col.className)}
                >
                  {col.header}
                </th>
              ))}
              {actions && <th className="py-3 px-4 text-right font-medium text-slate-500 text-xs w-24">操作</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className={cn(
                  'border-b border-white/[0.04]',
                  onRowClick && 'cursor-pointer hover:bg-white/[0.04] transition-colors',
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('py-3 px-4 text-slate-300', col.className)}>
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="py-3 px-4 text-right">
                    {actions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 手机端卡片列表 */}
      <div className="md:hidden space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4"
            onClick={() => onRowClick?.(item)}
          >
            {columns.slice(0, 3).map((col) => (
              <div key={col.key} className="flex items-center justify-between py-1">
                <span className="text-xs text-slate-500">{col.header}</span>
                <span className="text-sm text-slate-200">
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </span>
              </div>
            ))}
            {actions && (
              <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-white/[0.06]">
                {actions(item)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
