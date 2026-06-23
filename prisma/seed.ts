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

  // 3. 创建示例文章
  const articles = [
    {
      title: '社团顺利完成换届选举',
      slug: '2024-leadership-election',
      summary: '新一届社团管理团队正式上任，将带来全新的发展计划。',
      content: `近日，我社举行了年度换届选举大会。经过候选人演讲、现场答辩和全体成员投票，新一届管理团队正式产生。\n\n## 新一届管理团队\n\n- **社长**：张三\n- **副社长**：李四\n- **技术部部长**：王五\n- **宣传部部长**：赵六\n- **外联部部长**：陈七\n- **活动部部长**：刘八\n\n## 未来展望\n\n新团队提出了"数字化 + 社区化"的发展方向，计划在本学年推出以下举措：\n\n1. 建设社团官方网站\n2. 建立成员积分与成长体系\n3. 每月开展技术分享活动\n4. 拓展校外合作组织网络\n\n让我们共同期待！`,
      coverImage: '',
      author: '社团宣传部',
      status: 'published',
      publishedAt: new Date('2024-09-01T10:00:00'),
    },
    {
      title: '回顾：春季校园文化节圆满落幕',
      slug: '2024-spring-festival-recap',
      summary: '为期三天的校园文化节吸引了超过 500 名同学参与。',
      content: `2024 年春季校园文化节于 5 月 20 日圆满落幕。本次活动以 "青春绽放" 为主题，涵盖文艺演出、创意市集、科技展览三大板块。\n\n## 精彩瞬间\n\n### 开幕式\n\n校长亲临现场致辞，鼓励同学们在课外活动中锻炼综合能力。\n\n### 创意市集\n\n30 个学生团队展示了手工艺品、数字绘画、自制美食等创意产品。\n\n### 科技展览\n\n我社展示了 AI 绘画、3D 打印和机器人编程等项目，吸引大批同学驻足体验。\n\n## 致谢\n\n感谢校团委、学生会以及各合作组织的大力支持。明年春天，我们再相聚！`,
      coverImage: '',
      author: '社团宣传部',
      status: 'published',
      publishedAt: new Date('2024-05-22T14:00:00'),
    },
    {
      title: '新生指南：如何平衡学业与社团生活',
      slug: 'freshman-guide-balance',
      summary: '给大一新生的建议：在社团活动中成长，同时保持学业成绩。',
      content: `大学生活丰富多彩，社团是重要的成长平台。但同时，学业也不能落下。以下是一些建议：\n\n## 1. 合理规划时间\n\n- 使用日历工具记录课程、作业和社团活动\n- 每周日晚上规划下周安排\n- 给重要任务预留缓冲时间\n\n## 2. 学会说"不"\n\n不是所有活动都要参加。选择对你真正有意义的事情投入时间。\n\n## 3. 利用碎片时间\n\n- 通勤时间听播客/看书\n- 等待时间处理短任务\n\n## 4. 团队协作\n\n社团工作不需要一个人扛。学会分工合作，发挥团队力量。\n\n## 5. 保持沟通\n\n如果学业压力大，及时和社团负责人沟通，大家都会理解。\n\n> 大学的意义在于探索与成长。社团是课堂之外的课堂，但不要让它成为负担。`,
      coverImage: '',
      author: '社长 张三',
      status: 'published',
      publishedAt: new Date('2024-08-15T09:00:00'),
    },
  ]

  for (const articleData of articles) {
    await prisma.article.create({ data: articleData })
  }
  console.log('✅ 创建 3 篇示例文章')

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
