const SESSION_KEY = 'portfolio_visit_sid'

function getSessionId() {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY)
    if (!sid) {
      sid = crypto.randomUUID()
      sessionStorage.setItem(SESSION_KEY, sid)
    }
    return sid
  } catch {
    return crypto.randomUUID()
  }
}

/** Solo host pubblico in build di produzione (niente localhost / dev). */
function shouldTrackVisits() {
  if (!import.meta.env.PROD) return false
  const host = window.location.hostname
  return host !== 'localhost' && host !== '127.0.0.1' && !host.endsWith('.local')
}

export function trackVisit(path = window.location.pathname) {
  if (!shouldTrackVisits()) return
  if (path.startsWith('/admin')) return

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    keepalive: true,
    body: JSON.stringify({
      path,
      referrer: document.referrer || null,
      lang: navigator.language,
      sessionId: getSessionId(),
    }),
  }).catch(() => {})
}
