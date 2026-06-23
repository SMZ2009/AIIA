'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface Registration {
  id: string
  eventId: string
  name: string
  studentId: string
  phone: string
  email: string
  notes: string
  status: string
  createdAt: string
  event: { title: string }
}

interface Event {
  id: string
  title: string
}

interface Props {
  registrations: Registration[]
  events: Event[]
}

export function RegistrationsClient({ registrations, events }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const [filterEventId, setFilterEventId] = useState('')

  const filtered = filterEventId
    ? registrations.filter((r) => r.eventId === filterEventId)
    : registrations

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error('更新失败')
      toast('success', status === 'confirmed' ? '已确认' : '已取消')
      router.refresh()
    } catch {
      toast('error', '操作失败')
    }
  }

  return (
    <div>
      {/* 筛选 */}
      <div className="mb-4">
        <select
          value={filterEventId}
          onChange={(e) => setFilterEventId(e.target.value)}
          className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        >
          <option value="">全部活动</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs">姓名</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs">学号</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs">手机号</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs">活动</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs">报名时间</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs">状态</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg) => (
                <tr key={reg.id} className="border-b border-gray-50">
                  <td className="py-2.5 px-4">{reg.name}</td>
                  <td className="py-2.5 px-4 text-gray-500">{reg.studentId}</td>
                  <td className="py-2.5 px-4 text-gray-500">{reg.phone}</td>
                  <td className="py-2.5 px-4 text-gray-600">{reg.event.title}</td>
                  <td className="py-2.5 px-4 text-gray-400 text-xs">{formatDate(reg.createdAt, 'datetime')}</td>
                  <td className="py-2.5 px-4">
                    <span className={reg.status === 'confirmed' ? 'text-green-600' : reg.status === 'cancelled' ? 'text-red-500' : 'text-yellow-600'}>
                      {reg.status === 'confirmed' ? '已确认' : reg.status === 'cancelled' ? '已取消' : '待确认'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {reg.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => updateStatus(reg.id, 'confirmed')}>
                            确认
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => updateStatus(reg.id, 'cancelled')}>
                            取消
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 手机端卡片 */}
        <div className="md:hidden divide-y divide-gray-50">
          {filtered.map((reg) => (
            <div key={reg.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium text-sm">{reg.name}</span>
                  <span className="text-gray-400 text-xs ml-2">{reg.studentId}</span>
                </div>
                <span className={
                  reg.status === 'confirmed' ? 'text-green-600 text-xs' :
                  reg.status === 'cancelled' ? 'text-red-500 text-xs' :
                  'text-yellow-600 text-xs'
                }>
                  {reg.status === 'confirmed' ? '已确认' : reg.status === 'cancelled' ? '已取消' : '待确认'}
                </span>
              </div>
              <p className="text-xs text-gray-500">{reg.event.title}</p>
              <p className="text-xs text-gray-400 mt-1">{reg.phone} · {formatDate(reg.createdAt, 'datetime')}</p>
              {reg.status === 'pending' && (
                <div className="flex gap-2 mt-2">
                  <Button variant="primary" size="sm" onClick={() => updateStatus(reg.id, 'confirmed')}>确认</Button>
                  <Button variant="ghost" size="sm" onClick={() => updateStatus(reg.id, 'cancelled')}>取消</Button>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-12">无匹配记录</p>
          )}
        </div>
      </div>
    </div>
  )
}
