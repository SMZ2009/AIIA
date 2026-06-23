import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始填充种子数据...')

  // 1. 创建管理员 (用户名: admin, 密码: admin123)
  const passwordHash = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
      displayName: '管理员',
    },
  })
  console.log('✅ 管理员账号: admin / admin123')

  // 2. 创建示例活动
  const events = [
    {
      title: '2024 年秋季招新宣讲会',
      summary: '欢迎加入我们的大家庭！现场了解社团文化与各部门职责。',
      content: `## 活动介绍\n\n欢迎参加 2024 年秋季招新宣讲会！\n\n### 活动流程\n\n1. **社团介绍** - 了解我们的历史与愿景\n2. **部门展示** - 各部门部长介绍工作内容\n3. **Q&A 环节** - 现场答疑\n4. **自由交流** - 与社团成员面对面交流\n\n### 我们需要这样的你\n\n- 有热情、有责任心\n- 每周能投入 3-5 小时\n- 对任一部门工作感兴趣\n\n> 现场可提交报名表，也可扫码在线报名。`,
      coverImage: '',
      startDate: new Date('2025-09-15T18:30:00'),
      endDate: new Date('2025-09-15T20:30:00'),
      location: '学生活动中心 301 会议室',
      maxParticipants: 80,
      registrationDeadline: new Date('2025-09-14T23:59:00'),
      status: 'published',
    },
    {
      title: '技术分享会：AI 时代的编程新范式',
      summary: '探讨大语言模型如何改变软件开发流程，现场演示 Claude Code 使用技巧。',
      content: `## 分享主题\n\n### AI 辅助编程的现在与未来\n\n- GitHub Copilot 的底层原理\n- Claude 在代码生成中的优势\n- Prompt Engineering 实战技巧\n\n### 动手环节\n\n现场使用 AI 工具完成一个小型 Web 项目。\n\n**准备工作**：请携带笔记本电脑。`,
      coverImage: '',
      startDate: new Date('2025-10-20T14:00:00'),
      endDate: new Date('2025-10-20T17:00:00'),
      location: '教学楼 B 栋 201',
      maxParticipants: 50,
      registrationDeadline: new Date('2025-10-19T18:00:00'),
      status: 'published',
    },
    {
      title: '社团团建：户外拓展日',
      summary: '金秋十月，一起走出校园，在户外活动中增进友谊。',
      content: `## 团建安排\n\n### 行程\n\n| 时间 | 内容 |\n|------|------|\n| 08:30 | 校门口集合出发 |\n| 10:00 | 抵达营地，破冰游戏 |\n| 12:00 | 户外 BBQ 午餐 |\n| 14:00 | 团队挑战项目 |\n| 17:00 | 返程 |\n\n### 费用\n\n每人 50 元（社团补贴后），包含交通和午餐。\n\n### 注意事项\n\n- 穿着运动休闲服装\n- 建议携带防晒用品`,
      coverImage: '',
      startDate: new Date('2025-10-28T08:30:00'),
      endDate: new Date('2025-10-28T17:00:00'),
      location: '郊区阳光营地',
      maxParticipants: 30,
      registrationDeadline: new Date('2025-10-25T23:59:00'),
      status: 'published',
    },
  ]

  for (const eventData of events) {
    await prisma.event.create({ data: eventData })
  }
  console.log('✅ 创建 3 场示例活动')

  // 3. 创建示例文章（公众号外链）
  const articles = [
    {
      title: '社团顺利完成换届选举',
      summary: '新一届社团管理团队正式上任，将带来全新的发展计划。',
      link: 'https://mp.weixin.qq.com/s/example-1',
      coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=940&h=400&fit=crop',
      status: 'published' as const,
      publishedAt: new Date('2024-09-01T10:00:00'),
    },
    {
      title: '回顾：春季校园文化节圆满落幕',
      summary: '为期三天的校园文化节吸引了超过 500 名同学参与。',
      link: 'https://mp.weixin.qq.com/s/example-2',
      coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=940&h=400&fit=crop',
      status: 'published' as const,
      publishedAt: new Date('2024-05-22T14:00:00'),
    },
    {
      title: '新生指南：如何平衡学业与社团生活',
      summary: '给大一新生的建议：在社团活动中成长，同时保持学业成绩。',
      link: 'https://mp.weixin.qq.com/s/example-3',
      coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=940&h=400&fit=crop',
      status: 'published' as const,
      publishedAt: new Date('2024-08-15T09:00:00'),
    },
  ]

  for (const articleData of articles) {
    await prisma.article.create({ data: articleData })
  }
  console.log('✅ 创建 3 篇示例文章（公众号外链）')

  // 4. 创建示例合作伙伴
  const partners = [
    { name: '华为技术有限公司', category: 'ENTERPRISE', sortOrder: 0 },
    { name: '腾讯科技', category: 'ENTERPRISE', sortOrder: 1 },
    { name: '深圳清华大学研究院', category: 'UNIVERSITY', sortOrder: 0 },
    { name: '南方科技大学', category: 'UNIVERSITY', sortOrder: 1 },
    { name: '校学生会', category: 'COMMUNITY', sortOrder: 0 },
    { name: '青年志愿者协会', category: 'COMMUNITY', sortOrder: 1 },
    { name: '计算机协会', category: 'COMMUNITY', sortOrder: 2 },
    { name: '摄影社', category: 'COMMUNITY', sortOrder: 3 },
  ]
  for (const p of partners) {
    await prisma.partner.create({ data: p })
  }
  console.log('✅ 创建 8 个示例合作伙伴')

  console.log('\n🎉 种子数据填充完成！')
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
