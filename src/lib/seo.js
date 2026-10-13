import { headers } from 'next/headers'
import { OG_LOCALES, alternatesFor, resolveMeta } from './seo-shared'

export async function metaFor(pathname) {
  const h = await headers()
  const lang = h.get('x-mb-lang') || 'it'
  const { title, description } = resolveMeta(lang === 'it' ? 'it' : 'en', pathname)
  const { it, en, languages } = alternatesFor(pathname)
  // Italian lives on the clean URL, English on ?lang=en. Other languages are served
  // by negotiation only, so they point their canonical at the Italian default.
  const canonical = lang === 'en' ? en : it
  const ogLocale = OG_LOCALES[lang] || OG_LOCALES.it

  return {
    title: { absolute: title },
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Michel Branche',
      locale: ogLocale,
      alternateLocale: [ogLocale === OG_LOCALES.it ? OG_LOCALES.en : OG_LOCALES.it],
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Michel Branche' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
    robots: pathname === '/shop' ? { index: false, follow: false } : { index: true, follow: true },
  }
}
