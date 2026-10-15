import { Archivo, Chakra_Petch, EB_Garamond, Space_Grotesk } from 'next/font/google'
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

// Used by the Le Vele case study and the admin area. Self-hosted so it no longer
// blocks rendering through a Google Fonts @import, and only downloaded where used.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space',
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

// Paints the black welcome cover from the very first frame, before React hydrates.
// Mirrors SiteFrame: skipped when the welcome was already seen this session,
// with reduced motion, or outside the public site. No JS means no class, so nothing is hidden.
const PRE_WELCOME_SCRIPT = `(function(){try{var d=document.documentElement;var th=sessionStorage.getItem('mb:theme');if(th&&/^#[0-9a-f]{6}$/i.test(th)){d.style.setProperty('--theme',th);d.dataset.theme='art'}if(location.pathname.indexOf('/admin')===0)return;if(sessionStorage.getItem('hb:welcome')==='1')return;if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('hb-pre');setTimeout(function(){d.classList.remove('hb-pre')},8000)}catch(e){}})()`
const PRE_WELCOME_CSS = 'html.hb-pre,html.hb-pre body{background:#111111}html.hb-pre body::before{content:"";position:fixed;inset:0;z-index:94;background:#111111;pointer-events:none}'

export default async function RootLayout({ children }) {
  const h = await headers()
  const lang = h.get('x-mb-lang') || 'en'

  return (
    <html
      lang={lang}
      className={`${archivo.variable} ${chakra.variable} ${garamond.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_WELCOME_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: PRE_WELCOME_CSS }} />
      </head>
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
