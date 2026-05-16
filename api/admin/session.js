import { isAuthenticated } from '../_lib/auth.js'

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' })
  }
  return json(res, 200, { authenticated: isAuthenticated(req) })
}
