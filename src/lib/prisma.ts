// Prisma 兼容层 — 底层使用 better-sqlite3，API 与 @prisma/client 一致
import { prisma as db } from './db'

/**
 * 类型适配：
 * - findMany 返回 any[]（而非 any），确保 .map((e) => <Comp {...e} />) 中
 *   e 的类型被正确推断（从 Array<any> 推断为 any，不触发 noImplicitAny）
 * - 其他方法返回 any，兼容所有消费方
 */
export const prisma = db as unknown as {
  partner: {
    findMany(opts?: any): any[]
    create(opts: { data: any }): any
    update(opts: { where: { id: string }; data: any }): any
    delete(opts: { where: { id: string } }): any
  }
  event: {
    findMany(opts?: any): any[]
    findUnique(opts: any): any
    create(opts: { data: any }): any
    update(opts: { where: { id: string }; data: any }): any
    delete(opts: { where: { id: string } }): any
    count(opts?: any): number
  }
  article: {
    findMany(opts?: any): any[]
    findUnique(opts: { where: { id: string } }): any
    findFirst(opts: { where: any }): any
    create(opts: { data: any }): any
    update(opts: { where: { id: string }; data: any }): any
    delete(opts: { where: { id: string } }): any
    count(opts?: any): number
  }
  user: {
    findUnique(opts: { where: { username: string } }): any
  }
  registration: {
    findMany(opts?: any): any[]
    count(opts?: any): number
    create(opts: { data: any }): any
    update(opts: { where: { id: string }; data: any }): any
  }
}
