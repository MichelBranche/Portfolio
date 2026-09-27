import { NextResponse } from 'next/server'
import { createSessionToken, sessionCookieHeader, verifyPassword } from '../../../../api/_lib/auth.js'

export async function POST(request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Imposta ADMIN_PASSWORD in .env.local (dev) o su Vercel (produzione)' },
      { status: 503 },
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const password = typeof body?.password === 'string' ? body.password : ''
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Password non valida' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.headers.set('Set-Cookie', sessionCookieHeader(createSessionToken()))
  return response
}
