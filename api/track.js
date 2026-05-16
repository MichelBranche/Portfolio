import crypto from 'node:crypto'
import { isBotUserAgent, isDuplicateVisit } from './_lib/filters.js'
import { addVisit, getVisits } from './_lib/store.js'

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function hashIp(req) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    'unknown'
  return crypto.createHash('sha256').update(String(ip)).digest('hex').slice(0, 16)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  const userAgent = req.headers['user-agent'] || ''
  if (isBotUserAgent(userAgent)) {
    return json(res, 204, { ok: true, skipped: 'bot' })
  }

  let body = {}
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
  } catch {
    return json(res, 400, { error: 'Invalid JSON' })
  }

  const path = typeof body.path === 'string' ? body.path.slice(0, 200) : '/'
  if (path.startsWith('/admin')) {
    return json(res, 204, { ok: true, skipped: true })
  }

  const visit = {
    id: crypto.randomUUID(),
    ts: Date.now(),
    path,
    referrer: typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : null,
    lang: typeof body.lang === 'string' ? body.lang.slice(0, 32) : null,
    sessionId: typeof body.sessionId === 'string' ? body.sessionId.slice(0, 64) : null,
    ipHash: hashIp(req),
  }

  try {
    const recent = await getVisits()
    const window = recent.slice(0, 200)
    if (isDuplicateVisit(window, visit)) {
      return json(res, 204, { ok: true, skipped: 'duplicate' })
    }
    await addVisit(visit)
    return json(res, 201, { ok: true })
  } catch (err) {
    console.error('track error', err)
    return json(res, 500, { error: 'Storage unavailable' })
  }
}
