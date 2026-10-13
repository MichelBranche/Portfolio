import { alternatesFor } from '@/lib/seo-shared'

const PATHS = ['/', '/portfolio', '/studio', '/servizi', '/contatti', '/work/levele']

export default function sitemap() {
  const lastModified = new Date()
  return PATHS.flatMap((path) => {
    const { it, en, languages } = alternatesFor(path)
    return [
      { url: it, lastModified, alternates: { languages } },
      { url: en, lastModified, alternates: { languages } },
    ]
  })
}
