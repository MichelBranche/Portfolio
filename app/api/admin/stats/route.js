import { NextResponse } from 'next/server'
import { aggregateVisits } from '../../../../api/_lib/aggregate.js'
import { isAuthenticated } from '../../../../api/_lib/auth.js'
import { getStoreKind, getVisits, hasRemoteStore } from '../../../../api/_lib/store.js'

export async function GET(request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  try {
    const raw = await getVisits()
    const stats = aggregateVisits(raw)
    return NextResponse.json({
      ...stats,
      meta: {
        source: getStoreKind(),
        realVisitsOnly: hasRemoteStore(),
      },
    })
  } catch (err) {
    console.error('stats error', err)
    return NextResponse.json({ error: 'Impossibile caricare le statistiche' }, { status: 500 })
  }
}
