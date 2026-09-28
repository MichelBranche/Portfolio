import { NextResponse } from 'next/server'

const LANGS = new Set(['it', 'en', 'fr', 'de', 'es'])

export function middleware(request) {
  const query = request.nextUrl.searchParams.get('lang')
  const cookie = request.cookies.get('mb-lang')?.value
  const lang = LANGS.has(query) ? query : LANGS.has(cookie) ? cookie : 'en'
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-mb-lang', lang)
  requestHeaders.set('x-mb-lang-explicit', query === 'it' ? '1' : '0')
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  if (cookie !== lang) {
    response.cookies.set('mb-lang', lang, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon|.*\\..*).*)'],
}
