import { alternatesFor } from '@/lib/seo-shared'

const PATHS = ['/', '/portfolio', '/studio', '/servizi', '/contatti', '/work/levele', '/work/volt']

export default function sitemap() {
  const lastModified = new Date()
  return PATHS.flatMap((path) => {
    const { urls, languages } = alternatesFor(path)
    return Object.values(urls).map((url) => ({ url, lastModified, alternates: { languages } }))
  })
}
