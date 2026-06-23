import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/admin/StatsCard'
import { Calendar, ClipboardList, Newspaper, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '仪表盘 | 管理后台' }

export default async function AdminDashboard() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const now = new Date()
  const [totalEvents, upcomingEvents, totalRegistrations, totalArticles, recentRegistrations] =
    await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { status: 'published', startDate: { gte: now } } }),
      prisma.registration.count(),
      prisma.article.count(),
      prisma.registration.findMany({
        include: { event: { select: { title: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">仪表盘</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatsCard label="活动总数" value={totalEvents} icon={Calendar} />
        <StatsCard label="即将开始" value={upcomingEvents} icon={Calendar} />
        <StatsCard label="报名总数" value={totalRegistrations} icon={ClipboardList} />
        <StatsCard label="文章总数" value={totalArticles} icon={Newspaper} />
      </div>

      {/* 近期报名 */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900 text-sm">近期报名</h2>
        </div>
        {recentRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left py-3 px-5 font-medium text-gray-500 text-xs">姓名</th>
                  <th className="text-left py-3 px-5 font-medium text-gray-500 text-xs">学号</th>
                  <th className="text-left py-3 px-5 font-medium text-gray-500 text-xs">活动</th>
                  <th className="text-left py-3 px-5 font-medium text-gray-500 text-xs">时间</th>
                  <th className="text-left py-3 px-5 font-medium text-gray-500 text-xs">状态</th>
                </tr>
              </thead>
              <tbody>
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-gray-50">
                    <td className="py-2.5 px-5 text-gray-900">{reg.name}</td>
                    <td className="py-2.5 px-5 text-gray-500">{reg.studentId}</td>
                    <td className="py-2.5 px-5 text-gray-600">{reg.event.title}</td>
                    <td className="py-2.5 px-5 text-gray-400 text-xs">
                      {formatDate(reg.createdAt, 'datetime')}
                    </td>
                    <td className="py-2.5 px-5">
                      <span className={reg.status === 'confirmed' ? 'text-green-600' : reg.status === 'cancelled' ? 'text-red-500' : 'text-yellow-600'}>
                        {reg.status === 'confirmed' ? '已确认' : reg.status === 'cancelled' ? '已取消' : '待确认'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-gray-400">暂无报名记录</p>
        )}
      </div>
    </div>
  )
}
