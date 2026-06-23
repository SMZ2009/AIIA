import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/admin/StatsCard'
import { Calendar, ClipboardList, Newspaper } from 'lucide-react'
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
      <h1 className="text-xl font-bold text-white mb-6">仪表盘</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatsCard label="活动总数" value={totalEvents} icon={Calendar} />
        <StatsCard label="即将开始" value={upcomingEvents} icon={Calendar} />
        <StatsCard label="报名总数" value={totalRegistrations} icon={ClipboardList} />
        <StatsCard label="文章总数" value={totalArticles} icon={Newspaper} />
      </div>

      {/* 近期报名 */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white text-sm">近期报名</h2>
        </div>
        {recentRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left py-3 px-5 font-medium text-slate-500 text-xs">姓名</th>
                  <th className="text-left py-3 px-5 font-medium text-slate-500 text-xs">学号</th>
                  <th className="text-left py-3 px-5 font-medium text-slate-500 text-xs">活动</th>
                  <th className="text-left py-3 px-5 font-medium text-slate-500 text-xs">时间</th>
                  <th className="text-left py-3 px-5 font-medium text-slate-500 text-xs">状态</th>
                </tr>
              </thead>
              <tbody>
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-white/[0.04]">
                    <td className="py-2.5 px-5 text-slate-200">{reg.name}</td>
                    <td className="py-2.5 px-5 text-slate-400">{reg.studentId}</td>
                    <td className="py-2.5 px-5 text-slate-300">{reg.event.title}</td>
                    <td className="py-2.5 px-5 text-slate-500 text-xs">
                      {formatDate(reg.createdAt, 'datetime')}
                    </td>
                    <td className="py-2.5 px-5">
                      <span className={
                        reg.status === 'confirmed' ? 'text-emerald-400' :
                        reg.status === 'cancelled' ? 'text-red-400' :
                        'text-amber-400'
                      }>
                        {reg.status === 'confirmed' ? '已确认' : reg.status === 'cancelled' ? '已取消' : '待确认'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-slate-500">暂无报名记录</p>
        )}
      </div>
    </div>
  )
}
