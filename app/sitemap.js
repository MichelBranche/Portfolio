const SITE = 'https://www.michelbranche.it'

const PATHS = ['', '/portfolio', '/studio', '/servizi', '/contatti', '/work/levele']

export default function sitemap() {
  const lastModified = new Date()
  return PATHS.map((path) => {
    const url = path ? `${SITE}${path}` : SITE
    const italian = path ? `${url}?lang=it` : `${SITE}/?lang=it`
    return {
      url,
      lastModified,
      alternates: {
        languages: {
          en: url,
          it: italian,
          'x-default': url,
        },
      },
    }
  })
}
