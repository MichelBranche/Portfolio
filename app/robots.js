export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: 'https://www.michelbranche.it/sitemap.xml',
    host: 'https://www.michelbranche.it',
  }
}
