const DAY_MS = 24 * 60 * 60 * 1000

function startOfDay(ts) {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function dayKey(ts) {
  return new Date(ts).toISOString().slice(0, 10)
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

export function aggregateVisits(rawVisits) {
  const visits = rawVisits.map(parseVisit).filter(Boolean)
  const now = Date.now()
  const todayStart = startOfDay(now)
  const weekStart = todayStart - 6 * DAY_MS
  const monthStart = todayStart - 29 * DAY_MS

  const sessions = new Set()
  const sessionsToday = new Set()
  const sessionsWeek = new Set()
  const sessionsMonth = new Set()

  const byDay = new Map()
  const byHour = Array.from({ length: 24 }, (_, i) => ({ hour: `${String(i).padStart(2, '0')}:00`, visits: 0 }))
  const referrers = new Map()
  const paths = new Map()

  let total = 0
  let today = 0
  let week = 0
  let month = 0

  for (const v of visits) {
    const ts = Number(v.ts) || 0
    if (!ts) continue
    total += 1

    const sid = v.sessionId || v.id || `anon-${ts}`
    sessions.add(sid)

    if (ts >= todayStart) {
      today += 1
      sessionsToday.add(sid)
    }
    if (ts >= weekStart) {
      week += 1
      sessionsWeek.add(sid)
    }
    if (ts >= monthStart) {
      month += 1
      sessionsMonth.add(sid)

      const dk = dayKey(ts)
      byDay.set(dk, (byDay.get(dk) || 0) + 1)

      const hour = new Date(ts).getHours()
      byHour[hour].visits += 1

      const ref = v.referrer ? normalizeReferrer(v.referrer) : 'Diretto'
      referrers.set(ref, (referrers.get(ref) || 0) + 1)

      const p = v.path || '/'
      paths.set(p, (paths.get(p) || 0) + 1)
    }
  }

  const dailySeries = []
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date(todayStart - i * DAY_MS)
    const key = dayKey(d.getTime())
    dailySeries.push({
      date: key,
      label: d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
      visits: byDay.get(key) || 0,
    })
  }

  const toSorted = (map, limit = 8) =>
    [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, value]) => ({ name, value }))

  return {
    summary: {
      total,
      today,
      week,
      month,
      uniqueSessions: sessions.size,
      uniqueToday: sessionsToday.size,
      uniqueWeek: sessionsWeek.size,
      uniqueMonth: sessionsMonth.size,
    },
    dailySeries,
    hourlySeries: byHour,
    topReferrers: toSorted(referrers),
    topPaths: toSorted(paths),
    lastVisitAt: visits.reduce((max, v) => Math.max(max, Number(v.ts) || 0), 0) || null,
  }
}

function normalizeReferrer(ref) {
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '')
    return host || 'Diretto'
  } catch {
    return ref.slice(0, 48)
  }
}
