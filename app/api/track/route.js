import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { isBotUserAgent, isDuplicateVisit } from '../../../api/_lib/filters.js'
import { addVisit, getVisits } from '../../../api/_lib/store.js'

function hashIp(request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  return crypto.createHash('sha256').update(String(ip)).digest('hex').slice(0, 16)
}

export async function POST(request) {
  const userAgent = request.headers.get('user-agent') || ''
  if (isBotUserAgent(userAgent)) {
    return new NextResponse(null, { status: 204 })
  }

  let body = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const path = typeof body.path === 'string' ? body.path.slice(0, 200) : '/'
  if (path.startsWith('/admin')) {
    return new NextResponse(null, { status: 204 })
  }

  const visit = {
    id: crypto.randomUUID(),
    ts: Date.now(),
    path,
    referrer: typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : null,
    lang: typeof body.lang === 'string' ? body.lang.slice(0, 32) : null,
    sessionId: typeof body.sessionId === 'string' ? body.sessionId.slice(0, 64) : null,
    ipHash: hashIp(request),
  }

  try {
    const recent = await getVisits()
    const window = recent.slice(0, 200)
    if (isDuplicateVisit(window, visit)) {
      return new NextResponse(null, { status: 204 })
    }
    await addVisit(visit)
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('track error', err)
    return NextResponse.json({ error: 'Storage unavailable' }, { status: 500 })
  }
}
