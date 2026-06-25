// Prisma 兼容层 — 底层使用 better-sqlite3，API 与 @prisma/client 一致
import { prisma as db } from './db'
import type { PartnerRow, EventRow, ArticleRow, UserRow, RegistrationRow } from './db'

/** 泛型模型接口 — 模拟 Prisma 生成的类型，消除索引签名 */
interface Model<T> {
  findMany(opts?: any): T[]
  findUnique?(opts: { where: { id: string }; include?: any }): T | null
  findFirst?(opts: { where: any }): T | null
  create(opts: { data: any }): T
  update(opts: { where: { id: string }; data: any }): T
  delete(opts: { where: { id: string } }): T
  count(opts?: any): number
}

export const prisma = db as unknown as {
  partner: Model<PartnerRow>
  event: Model<EventRow>
  article: Model<ArticleRow>
  user: { findUnique(opts: { where: { username: string } }): UserRow | null }
  registration: Model<RegistrationRow>
}
