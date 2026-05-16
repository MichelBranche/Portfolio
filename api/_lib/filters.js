const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|lighthouse|headless|phantom|selenium|pingdom|uptime/i

const DEDUPE_MS = 30 * 60 * 1000

export function isBotUserAgent(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') return true
  return BOT_PATTERN.test(userAgent)
}

function parseVisit(raw) {
  if (!raw) return null
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
  return typeof raw === 'object' ? raw : null
}

export function isDuplicateVisit(visits, nextVisit) {
  const sessionId = nextVisit.sessionId
  const path = nextVisit.path
  const ts = Number(nextVisit.ts) || 0
  if (!sessionId || !path || !ts) return false

  return visits.some((raw) => {
    const v = parseVisit(raw)
    if (!v) return false
    return (
      v.sessionId === sessionId &&
      v.path === path &&
      ts - (Number(v.ts) || 0) < DEDUPE_MS
    )
  })
}
