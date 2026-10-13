import { headers } from 'next/headers'
import { OG_LOCALES, alternatesFor, resolveMeta } from './seo-shared'

export async function metaFor(pathname) {
  const h = await headers()
  const lang = h.get('x-mb-lang') || 'en'
  const { title, description } = resolveMeta(lang, pathname)
  const { urls, languages } = alternatesFor(pathname)
  // Canonical is the explicit URL of the language actually served (clean URL included).
  const canonical = urls[lang] || urls.en
  const ogLocale = OG_LOCALES[lang] || OG_LOCALES.en

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
      alternateLocale: Object.values(OG_LOCALES).filter((value) => value !== ogLocale),
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
