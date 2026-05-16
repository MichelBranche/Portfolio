import { createSessionToken, sessionCookieHeader, verifyPassword } from '../_lib/auth.js'

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  if (!process.env.ADMIN_PASSWORD) {
    return json(res, 503, {
      error: 'Imposta ADMIN_PASSWORD in .env.local (dev) o su Vercel (produzione)',
    })
  }

  let body
  try {
    body = await readBody(req)
  } catch {
    return json(res, 400, { error: 'Invalid JSON' })
  }

  const password = typeof body.password === 'string' ? body.password : ''
  if (!verifyPassword(password)) {
    return json(res, 401, { error: 'Password non valida' })
  }

  const token = createSessionToken()
  res.setHeader('Set-Cookie', sessionCookieHeader(token))
  return json(res, 200, { ok: true })
}
