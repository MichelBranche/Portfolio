const SITE = 'https://www.michelbranche.it'

const PATHS = ['', '/portfolio', '/studio', '/servizi', '/contatti', '/work/levele']

export default function sitemap() {
  const lastModified = new Date()
  return PATHS.map((path) => {
    const url = `${SITE}${path}`
    return {
      url,
      lastModified,
      alternates: {
        languages: {
          en: url,
          it: `${url}?lang=it`,
          'x-default': url,
        },
      },
    }
  })
}
