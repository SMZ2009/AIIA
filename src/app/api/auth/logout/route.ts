import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await getSession()
  session.destroy()
  return NextResponse.json({ success: true })
}
