import { SessionOptions } from 'iron-session'

export interface SessionData {
  userId?: string
  username?: string
  displayName?: string
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'a-very-long-dev-secret-at-least-32-chars!!',
  cookieName: 'aiia-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24, // 24 hours
  },
}
