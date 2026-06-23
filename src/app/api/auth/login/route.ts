import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: '请输入用户名和密码' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 })
    }

    const session = await getSession()
    session.userId = user.id
    session.username = user.username
    session.displayName = user.displayName
    await session.save()

    return NextResponse.json({
      success: true,
      user: { userId: user.id, username: user.username, displayName: user.displayName },
    })
  } catch (err) {
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}
