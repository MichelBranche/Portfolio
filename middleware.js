import { NextResponse } from 'next/server'

const LANGS = new Set(['it', 'en', 'fr', 'de', 'es'])
const YEAR = 60 * 60 * 24 * 365

/** Map an Accept-Language list onto a supported locale. `it*` is Italian; anything else we cannot serve falls back to Italian. */
export function languageFromAccept(header) {
  if (!header) return 'it'
  const ranked = []
  for (const part of header.split(',')) {
    const [rawTag, ...params] = part.trim().split(';')
    const tag = rawTag.toLowerCase()
    if (!tag || tag === '*') continue
    let quality = 1
    for (const param of params) {
      const [key, value] = param.trim().split('=')
      if (key === 'q') {
        const parsed = Number(value)
        if (!Number.isNaN(parsed)) quality = parsed
      }
    }
    if (quality > 0) ranked.push({ tag, quality })
  }
  ranked.sort((a, b) => b.quality - a.quality)
  for (const { tag } of ranked) {
    const primary = tag.split('-')[0]
    if (primary === 'it') return 'it'
    if (LANGS.has(primary)) return primary
  }
  return 'it'
}

export function middleware(request) {
  const query = request.nextUrl.searchParams.get('lang')
  const queryLang = LANGS.has(query) ? query : ''
  const explicit = request.cookies.get('mb-lang-explicit')?.value === '1'
  const saved = request.cookies.get('mb-lang')?.value
  const savedLang = explicit && LANGS.has(saved) ? saved : ''
  const lang = queryLang || savedLang || languageFromAccept(request.headers.get('accept-language'))
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-mb-lang', lang)
  requestHeaders.set('x-mb-lang-explicit', query === 'it' ? '1' : '0')
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  if (queryLang) {
    response.cookies.set('mb-lang', queryLang, { path: '/', maxAge: YEAR, sameSite: 'lax' })
    response.cookies.set('mb-lang-explicit', '1', { path: '/', maxAge: YEAR, sameSite: 'lax' })
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon|.*\\..*).*)'],
}
