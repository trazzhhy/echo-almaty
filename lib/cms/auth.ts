import { cookies } from 'next/headers'
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { AuthUser, Role, User } from './types'
import { getUserById, getUserByEmail } from './repository'
import { getAdminPanelSecret } from '@/lib/env'

const SESSION_COOKIE = 'echo_almaty_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 12

type SessionPayload = {
  userId: string
  role: Role
  exp: number
}

function getSecret() {
  return getAdminPanelSecret()
}

function encodePayload(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

function signPayload(encoded: string): string {
  return createHmac('sha256', getSecret()).update(encoded).digest('base64url')
}

function createToken(user: User): string {
  const payload: SessionPayload = {
    userId: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }

  const encoded = encodePayload(payload)
  return `${encoded}.${signPayload(encoded)}`
}

function parseToken(token: string): SessionPayload | null {
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null

  const expected = signPayload(encoded)
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as SessionPayload

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false

  const nextHash = scryptSync(password, salt, 64)
  return timingSafeEqual(nextHash, Buffer.from(hash, 'hex'))
}

export function sanitizeUser(user: User): AuthUser {
  const { passwordHash: _passwordHash, ...safeUser } = user
  return safeUser
}

export async function setSession(user: User) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const payload = parseToken(token)
  if (!payload) return null

  const user = await getUserById(payload.userId)
  if (!user || !user.active) return null

  return sanitizeUser(user)
}

export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email)
  if (!user || !user.active) return null

  if (!verifyPassword(password, user.passwordHash)) {
    return null
  }

  return user
}
