import Database from 'better-sqlite3'
import path from 'path'

// ── 数据库初始化 ────────────────────────────────────────
const DB_PATH = path.join(process.cwd(), 'prisma', 'dev.db')
const sqlite = new Database(DB_PATH)
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

// ── 建表 ──────────────────────────────────────────────
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    displayName TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Event (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    coverImage TEXT NOT NULL DEFAULT '',
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    location TEXT NOT NULL,
    maxParticipants INTEGER,
    registrationDeadline TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Registration (
    id TEXT PRIMARY KEY,
    eventId TEXT NOT NULL REFERENCES Event(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    studentId TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt TEXT NOT NULL,
    UNIQUE(eventId, studentId)
  );

  CREATE TABLE IF NOT EXISTS Article (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    link TEXT NOT NULL,
    coverImage TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft',
    publishedAt TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Partner (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logoUrl TEXT NOT NULL DEFAULT '',
    link TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'COMMUNITY',
    sortOrder INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`)

// ── 种子数据 ──────────────────────────────────────────
function maybeSeed() {
  const userCount = sqlite.prepare('SELECT COUNT(*) as c FROM User').get() as { c: number }
  if (userCount.c > 0) return // 已播种，跳过

  const now = new Date().toISOString()
  const uid = () => crypto.randomUUID()

  // 管理员
  // 密码 admin123 的 bcrypt hash（cost 12）
  const bcrypt = require('bcryptjs')
  const hash = bcrypt.hashSync('admin123', 12)
  sqlite.prepare('INSERT INTO User (id, username, passwordHash, displayName) VALUES (?, ?, ?, ?)').run(uid(), 'admin', hash, '管理员')

  // 活动
  const events = [
    [uid(), '2024 年秋季招新宣讲会', '欢迎加入我们的大家庭！现场了解社团文化与各部门职责。', '## 活动介绍\n\n欢迎参加...', '', new Date('2025-09-15T18:30:00').toISOString(), new Date('2025-09-15T20:30:00').toISOString(), '学生活动中心 301 会议室', 80, new Date('2025-09-14T23:59:00').toISOString(), 'published', now, now],
    [uid(), '技术分享会：AI 时代的编程新范式', '探讨大语言模型如何改变软件开发流程，现场演示 Claude Code 使用技巧。', '## 分享主题\n\n...', '', new Date('2025-10-20T14:00:00').toISOString(), new Date('2025-10-20T17:00:00').toISOString(), '教学楼 B 栋 201', 50, new Date('2025-10-19T18:00:00').toISOString(), 'published', now, now],
    [uid(), '社团团建：户外拓展日', '金秋十月，一起走出校园，在户外活动中增进友谊。', '## 团建安排\n\n...', '', new Date('2025-10-28T08:30:00').toISOString(), new Date('2025-10-28T17:00:00').toISOString(), '郊区阳光营地', 30, new Date('2025-10-25T23:59:00').toISOString(), 'published', now, now],
  ]
  const insertEvent = sqlite.prepare('INSERT INTO Event (id, title, summary, content, coverImage, startDate, endDate, location, maxParticipants, registrationDeadline, status, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
  for (const e of events) insertEvent.run(...e)

  // 文章
  const articles = [
    [uid(), '社团顺利完成换届选举', '新一届社团管理团队正式上任，将带来全新的发展计划。', 'https://mp.weixin.qq.com/s/example-1', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=940&h=400&fit=crop', 'published', new Date('2024-09-01T10:00:00').toISOString(), now, now],
    [uid(), '回顾：春季校园文化节圆满落幕', '为期三天的校园文化节吸引了超过 500 名同学参与。', 'https://mp.weixin.qq.com/s/example-2', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=940&h=400&fit=crop', 'published', new Date('2024-05-22T14:00:00').toISOString(), now, now],
    [uid(), '新生指南：如何平衡学业与社团生活', '给大一新生的建议：在社团活动中成长，同时保持学业成绩。', 'https://mp.weixin.qq.com/s/example-3', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=940&h=400&fit=crop', 'published', new Date('2024-08-15T09:00:00').toISOString(), now, now],
  ]
  const insertArticle = sqlite.prepare('INSERT INTO Article (id, title, summary, link, coverImage, status, publishedAt, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?)')
  for (const a of articles) insertArticle.run(...a)

  // 合作伙伴
  const partners = [
    ['华为技术有限公司', 'ENTERPRISE', 0],
    ['腾讯科技', 'ENTERPRISE', 1],
    ['深圳清华大学研究院', 'UNIVERSITY', 0],
    ['南方科技大学', 'UNIVERSITY', 1],
    ['校学生会', 'COMMUNITY', 0],
    ['青年志愿者协会', 'COMMUNITY', 1],
    ['计算机协会', 'COMMUNITY', 2],
    ['摄影社', 'COMMUNITY', 3],
  ]
  const insertPartner = sqlite.prepare('INSERT INTO Partner (id, name, logoUrl, link, category, sortOrder, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)')
  for (const p of partners) insertPartner.run(uid(), p[0], '', '', p[1], p[2], now, now)
}

maybeSeed()

// ── 工具函数 ──────────────────────────────────────────

/** 把 SQLite 的行中的日期字符串转成 Date 对象 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>

function toDates(row: Row | null, dateFields: string[]) {
  if (!row) return row
  for (const f of dateFields) {
    if (row[f] && typeof row[f] === 'string') row[f] = new Date(row[f] as string)
  }
  return row
}

function toDatesMany(rows: Row[], dateFields: string[]) {
  for (const r of rows) toDates(r, dateFields)
  return rows
}

/** 构建 WHERE 子句 */
function buildWhere(where?: Record<string, any>): { sql: string; params: any[] } {
  if (!where) return { sql: '', params: [] }
  const clauses: string[] = []
  const params: unknown[] = []

  for (const [key, val] of Object.entries(where)) {
    if (val === null || val === undefined) continue
    if (typeof val === 'object' && val !== null && !(val instanceof Date)) {
      const opMap: Record<string, string> = { gte: '>=', lte: '<=', gt: '>', lt: '<', not: '!=', in: 'IN' }
      let hasOp = false
      for (const [op, opVal] of Object.entries(val as Row)) {
        const sqlOp = opMap[op]
        if (sqlOp) {
          hasOp = true
          if (op === 'in') {
            const arr = opVal as unknown[]
            if (arr.length === 0) { clauses.push('1=0'); continue }
            clauses.push(`"${key}" IN (${arr.map(() => '?').join(',')})`)
            params.push(...arr.map(v => v instanceof Date ? (v as Date).toISOString() : v))
          } else if (op === 'not') {
            clauses.push(`"${key}" != ?`)
            params.push(opVal instanceof Date ? (opVal as Date).toISOString() : opVal)
          } else {
            clauses.push(`"${key}" ${sqlOp} ?`)
            params.push(opVal instanceof Date ? (opVal as Date).toISOString() : opVal)
          }
        }
      }
      if (!hasOp) {
        // 嵌套对象但不是操作符 — 当作等值条件（如 { where: { id: 'xxx' } }）
        clauses.push(`"${key}" = ?`)
        params.push(val)
      }
    } else {
      clauses.push(`"${key}" = ?`)
      params.push(val instanceof Date ? (val as Date).toISOString() : val)
    }
  }

  return { sql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '', params }
}

/** 构建 ORDER BY 子句 */
function buildOrderBy(orderBy?: Record<string, string> | Array<Record<string, string>>): string {
  if (!orderBy) return ''
  const entries: Array<[string, string]> = []
  if (Array.isArray(orderBy)) {
    for (const o of orderBy) {
      for (const [k, v] of Object.entries(o)) entries.push([k, v as string])
    }
  } else {
    for (const [k, v] of Object.entries(orderBy)) entries.push([k, v as string])
  }
  if (entries.length === 0) return ''
  return 'ORDER BY ' + entries.map(([k, v]) => `"${k}" ${v.toUpperCase()}`).join(', ')
}

// ── Prisma 兼容 API ────────────────────────────────────

// 用 Proxy 包装来实现 model.method() 语法
// 实际上直接定义对象更清晰

const DATE_FIELDS_EVENT = ['startDate', 'endDate', 'registrationDeadline', 'createdAt', 'updatedAt']
const DATE_FIELDS_ARTICLE = ['publishedAt', 'createdAt', 'updatedAt']
const DATE_FIELDS_PARTNER = ['createdAt', 'updatedAt']
const DATE_FIELDS_REG = ['createdAt']

function mapRow(cols: string[], row: unknown[]): Row {
  const obj: Row = {}
  for (let i = 0; i < cols.length; i++) obj[cols[i]] = row[i]
  return obj
}

function colNames(table: string): string[] {
  const stmt = sqlite.prepare(`SELECT * FROM "${table}" LIMIT 0`)
  return stmt.columns().map(c => c.name)
}

function runInsert(table: string, data: Row): Row {
  const now = new Date().toISOString()
  const id = (data.id as string) || crypto.randomUUID()
  const payload = { ...data, id, createdAt: now, updatedAt: now }
  const keys = Object.keys(payload)
  const vals = keys.map(k => payload[k] instanceof Date ? (payload[k] as Date).toISOString() : payload[k])
  const placeholders = keys.map(() => '?').join(', ')
  sqlite.prepare(`INSERT INTO "${table}" (${keys.map(k => `"${k}"`).join(', ')}) VALUES (${placeholders})`).run(...vals)
  // 返回插入后的对象
  const row = sqlite.prepare(`SELECT * FROM "${table}" WHERE id = ?`).get(id) as Row
  return row
}

// ── 包装器导出 ──────────────────────────────────────────

export const prisma = {
  partner: {
    findMany(opts?: { orderBy?: any; take?: number; skip?: number; where?: any }) {
      const { sql: whereSql, params: whereParams } = buildWhere(opts?.where)
      const orderSql = buildOrderBy(opts?.orderBy)
      let sql = `SELECT * FROM Partner ${whereSql} ${orderSql}`
      const params = [...whereParams]
      if (opts?.take != null) { sql += ' LIMIT ?'; params.push(opts.take) }
      const rows = sqlite.prepare(sql).all(...params) as Row[]
      return toDatesMany(rows, DATE_FIELDS_PARTNER)
    },
    create({ data }: { data: Row }) {
      const row = runInsert('Partner', data)
      return toDates(row, DATE_FIELDS_PARTNER)
    },
    update({ where: { id }, data }: { where: { id: string }; data: Row }) {
      const now = new Date().toISOString()
      const setData = { ...data, updatedAt: now }
      const setClauses = Object.keys(setData).map(k => `"${k}" = ?`).join(', ')
      const vals = Object.values(setData).map(v => v instanceof Date ? (v as Date).toISOString() : v)
      sqlite.prepare(`UPDATE Partner SET ${setClauses} WHERE id = ?`).run(...vals, id)
      const row = sqlite.prepare('SELECT * FROM Partner WHERE id = ?').get(id) as Row
      return toDates(row, DATE_FIELDS_PARTNER)
    },
    delete({ where: { id } }: { where: { id: string } }) {
      const row = sqlite.prepare('SELECT * FROM Partner WHERE id = ?').get(id) as Row
      sqlite.prepare('DELETE FROM Partner WHERE id = ?').run(id)
      return toDates(row, DATE_FIELDS_PARTNER)
    },
  },

  event: {
    findMany(opts?: { where?: any; orderBy?: any; take?: number; skip?: number; include?: any; select?: any }) {
      const { sql: whereSql, params: whereParams } = buildWhere(opts?.where)
      const orderSql = buildOrderBy(opts?.orderBy)
      let selectClause = '*'
      if (opts?.select) {
        const fields = Object.keys(opts.select).filter(k => opts.select![k] === true)
        if (fields.length > 0) selectClause = fields.map(f => `"${f}"`).join(', ')
      }
      let sql = `SELECT ${selectClause} FROM Event ${whereSql} ${orderSql}`
      const params = [...whereParams]
      if (opts?.take != null) { sql += ' LIMIT ?'; params.push(opts.take) }
      if (opts?.skip != null) { sql += ' OFFSET ?'; params.push(opts.skip) }
      const rows = sqlite.prepare(sql).all(...params) as Row[]
      const result = toDatesMany(rows, DATE_FIELDS_EVENT)
      // 处理 include: { _count: { select: { registrations: true } } }
      if (opts?.include?._count?.select?.registrations) {
        const countStmt = sqlite.prepare('SELECT COUNT(*) as c FROM Registration WHERE eventId = ?')
        for (const r of result) {
          (r as any)._count = { registrations: (countStmt.get(r.id) as { c: number }).c }
        }
      }
      return result
    },
    findUnique({ where: { id }, include }: { where: { id: string }; include?: any }) {
      const row = sqlite.prepare('SELECT * FROM Event WHERE id = ?').get(id) as Row
      const result = toDates(row, DATE_FIELDS_EVENT)
      if (result && include?._count?.select?.registrations) {
        const count = sqlite.prepare('SELECT COUNT(*) as c FROM Registration WHERE eventId = ?').get(id) as { c: number }
        ;(result as any)._count = { registrations: count.c }
      }
      return result
    },
    create({ data }: { data: Row }) {
      const row = runInsert('Event', data)
      return toDates(row, DATE_FIELDS_EVENT)
    },
    update({ where: { id }, data }: { where: { id: string }; data: Row }) {
      const now = new Date().toISOString()
      const setData = { ...data, updatedAt: now }
      const setClauses = Object.keys(setData).map(k => `"${k}" = ?`).join(', ')
      const vals = Object.values(setData).map(v => v instanceof Date ? (v as Date).toISOString() : v)
      sqlite.prepare(`UPDATE Event SET ${setClauses} WHERE id = ?`).run(...vals, id)
      const row = sqlite.prepare('SELECT * FROM Event WHERE id = ?').get(id) as Row
      return toDates(row, DATE_FIELDS_EVENT)
    },
    delete({ where: { id } }: { where: { id: string } }) {
      const row = sqlite.prepare('SELECT * FROM Event WHERE id = ?').get(id) as Row
      sqlite.prepare('DELETE FROM Event WHERE id = ?').run(id)
      return toDates(row, DATE_FIELDS_EVENT)
    },
    count(where?: any) {
      const { sql, params } = buildWhere(where?.where)
      const row = sqlite.prepare(`SELECT COUNT(*) as c FROM Event ${sql}`).get(...params) as { c: number }
      return row.c
    },
  },

  article: {
    findMany(opts?: { where?: any; orderBy?: any; take?: number; skip?: number }) {
      const { sql: whereSql, params: whereParams } = buildWhere(opts?.where)
      const orderSql = buildOrderBy(opts?.orderBy)
      let sql = `SELECT * FROM Article ${whereSql} ${orderSql}`
      const params = [...whereParams]
      if (opts?.take != null) { sql += ' LIMIT ?'; params.push(opts.take) }
      if (opts?.skip != null) { sql += ' OFFSET ?'; params.push(opts.skip) }
      const rows = sqlite.prepare(sql).all(...params) as Row[]
      return toDatesMany(rows, DATE_FIELDS_ARTICLE)
    },
    findUnique({ where: { id } }: { where: { id: string } }) {
      const row = sqlite.prepare('SELECT * FROM Article WHERE id = ?').get(id) as Row
      return toDates(row, DATE_FIELDS_ARTICLE)
    },
    findFirst({ where }: { where: Row }) {
      const { sql, params } = buildWhere(where)
      const row = sqlite.prepare(`SELECT * FROM Article ${sql} LIMIT 1`).get(...params) as Row
      return toDates(row, DATE_FIELDS_ARTICLE)
    },
    create({ data }: { data: Row }) {
      const row = runInsert('Article', data)
      return toDates(row, DATE_FIELDS_ARTICLE)
    },
    update({ where: { id }, data }: { where: { id: string }; data: Row }) {
      const now = new Date().toISOString()
      const setData = { ...data, updatedAt: now }
      const setClauses = Object.keys(setData).map(k => `"${k}" = ?`).join(', ')
      const vals = Object.values(setData).map(v => v instanceof Date ? (v as Date).toISOString() : v)
      sqlite.prepare(`UPDATE Article SET ${setClauses} WHERE id = ?`).run(...vals, id)
      const row = sqlite.prepare('SELECT * FROM Article WHERE id = ?').get(id) as Row
      return toDates(row, DATE_FIELDS_ARTICLE)
    },
    delete({ where: { id } }: { where: { id: string } }) {
      const row = sqlite.prepare('SELECT * FROM Article WHERE id = ?').get(id) as Row
      sqlite.prepare('DELETE FROM Article WHERE id = ?').run(id)
      return toDates(row, DATE_FIELDS_ARTICLE)
    },
    count(where?: any) {
      const { sql, params } = buildWhere(where?.where)
      const row = sqlite.prepare(`SELECT COUNT(*) as c FROM Article ${sql}`).get(...params) as { c: number }
      return row.c
    },
  },

  user: {
    findUnique({ where: { username } }: { where: { username: string } }) {
      return sqlite.prepare('SELECT * FROM User WHERE username = ?').get(username) as Row | undefined
    },
  },

  registration: {
    findMany(opts?: { where?: any; orderBy?: any; take?: number; skip?: number; include?: any }) {
      const { sql: whereSql, params: whereParams } = buildWhere(opts?.where)
      const orderSql = buildOrderBy(opts?.orderBy)
      let sql = `SELECT * FROM Registration ${whereSql} ${orderSql}`
      const params = [...whereParams]
      if (opts?.take != null) { sql += ' LIMIT ?'; params.push(opts.take) }
      if (opts?.skip != null) { sql += ' OFFSET ?'; params.push(opts.skip) }
      const rows = sqlite.prepare(sql).all(...params) as Row[]
      const result = toDatesMany(rows, DATE_FIELDS_REG)
      // include: { event: { select: { title: true } } }
      if (opts?.include?.event?.select?.title) {
        const eventStmt = sqlite.prepare('SELECT title FROM Event WHERE id = ?')
        for (const r of result) {
          const ev = eventStmt.get(r.eventId) as { title: string } | undefined
          ;(r as any).event = ev || null
        }
      }
      return result
    },
    count(where?: any) {
      const { sql, params } = buildWhere(where?.where)
      const row = sqlite.prepare(`SELECT COUNT(*) as c FROM Registration ${sql}`).get(...params) as { c: number }
      return row.c
    },
    create({ data }: { data: Row }) {
      // 检查唯一约束 (eventId, studentId)
      const existing = sqlite.prepare('SELECT id FROM Registration WHERE eventId = ? AND studentId = ?').get(data.eventId, data.studentId)
      if (existing) {
        const err = new Error('Unique constraint failed on the fields: (`eventId`,`studentId`)') as any
        err.code = 'P2002'
        throw err
      }
      const row = runInsert('Registration', data)
      return toDates(row, DATE_FIELDS_REG)
    },
    update({ where: { id }, data }: { where: { id: string }; data: Row }) {
      const setClauses = Object.keys(data).map(k => `"${k}" = ?`).join(', ')
      const vals = Object.values(data).map(v => v instanceof Date ? (v as Date).toISOString() : v)
      sqlite.prepare(`UPDATE Registration SET ${setClauses} WHERE id = ?`).run(...vals, id)
      const row = sqlite.prepare('SELECT * FROM Registration WHERE id = ?').get(id) as Row
      return toDates(row, DATE_FIELDS_REG)
    },
  },
}
