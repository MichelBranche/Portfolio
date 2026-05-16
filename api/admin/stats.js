import { aggregateVisits } from '../_lib/aggregate.js'
import { isAuthenticated } from '../_lib/auth.js'
import { getVisits, hasRemoteStore, getStoreKind } from '../_lib/store.js'

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  if (!isAuthenticated(req)) {
    return json(res, 401, { error: 'Non autenticato' })
  }

  try {
    const raw = await getVisits()
    const stats = aggregateVisits(raw)
    return json(res, 200, {
      ...stats,
      meta: {
        source: getStoreKind(),
        realVisitsOnly: hasRemoteStore(),
      },
    })
  } catch (err) {
    console.error('stats error', err)
    return json(res, 500, { error: 'Impossibile caricare le statistiche' })
  }
}
