import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { SessionData, sessionOptions } from './session'

export async function getSession() {
  const cookieStore = cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  return session
}

export async function getAdminSession() {
  const session = await getSession()
  if (!session.userId) return null
  return session
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session.userId) {
    throw new Error('Unauthorized')
  }
  return session
}
