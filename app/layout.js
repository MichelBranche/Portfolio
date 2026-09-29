import { Archivo, Chakra_Petch, EB_Garamond } from 'next/font/google'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import { VisitTracker } from '@/components/VisitTracker.jsx'
import { LanguageProvider } from '@/context/LanguageContext.jsx'
import 'lenis/dist/lenis.css'
import '@/index.css'
import '@/views/site/site.css'
import '@/views/AdminPage.css'
import '@/components/LanguageSwitch.css'
import '@/components/FlagIcon.css'

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-archivo',
  preload: true,
})

const chakra = Chakra_Petch({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-chakra',
  preload: false,
})

const garamond = EB_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: '500',
  display: 'swap',
  variable: '--font-garamond',
  preload: false,
})

export const metadata = {
  metadataBase: new URL('https://www.michelbranche.it'),
  title: {
    default: 'Michel Branche | Custom websites',
    absolute: 'Michel Branche | Custom websites',
  },
  description:
    'Independent web developer in Italy. Custom websites, designed and built from scratch for businesses, brands and projects of any kind, including hospitality.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    siteName: 'Michel Branche',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
  themeColor: '#f47856',
  colorScheme: 'light',
}

export default async function RootLayout({ children }) {
  const h = await headers()
  const lang = h.get('x-mb-lang') || 'it'

  return (
    <html lang={lang} className={`${archivo.variable} ${chakra.variable} ${garamond.variable}`}>
      <body className={archivo.className}>
        <div id="root">
          <LanguageProvider initialLang={lang}>
            <div id="page-transition" className="page-transition" aria-hidden="true" />
            <Suspense fallback={null}>
              <VisitTracker />
            </Suspense>
            {children}
            <Analytics />
          </LanguageProvider>
        </div>
      </body>
    </html>
  )
}
