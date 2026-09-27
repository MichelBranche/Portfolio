import { NextResponse } from 'next/server'
import { isAuthenticated } from '../../../../api/_lib/auth.js'

export async function GET(request) {
  return NextResponse.json({ authenticated: isAuthenticated(request) })
}
