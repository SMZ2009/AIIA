import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ user: null })
  }
  return NextResponse.json({
    user: {
      userId: session.userId,
      username: session.username,
      displayName: session.displayName,
    },
  })
}
