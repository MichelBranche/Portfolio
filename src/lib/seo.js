import { headers } from 'next/headers'
import { SITE, resolveMeta } from './seo-shared'

export async function metaFor(pathname) {
  const h = await headers()
  const lang = h.get('x-mb-lang') || 'it'
  const explicit = h.get('x-mb-lang-explicit') === '1'
  const locale = lang === 'it' ? 'it' : 'en'
  const { title, description } = resolveMeta(locale, pathname)
  const clean = `${SITE}${pathname === '/' ? '' : pathname}`
  const italian = pathname === '/' ? `${SITE}/?lang=it` : `${clean}?lang=it`
  const canonical = explicit && lang === 'it' ? italian : clean

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        en: clean,
        it: italian,
        'x-default': clean,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Michel Branche',
      locale: locale === 'it' ? 'it_IT' : 'en_US',
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
