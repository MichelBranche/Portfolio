import { Suspense } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { VisitTracker } from '@/components/VisitTracker.jsx'
import { LanguageProvider } from '@/context/LanguageContext.jsx'
import 'lenis/dist/lenis.css'
import '@/index.css'
import '@/views/site/site.css'
import '@/views/AdminPage.css'
import '@/components/LanguageSwitch.css'
import '@/components/FlagIcon.css'

export const metadata = {
  title: 'MICHEL BRANCHE | Web developer',
  description: 'Michel Branche, web developer.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://w.soundcloud.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="" />
        <link rel="preconnect" href="https://assets.codepen.io" crossOrigin="" />
        <link rel="preconnect" href="https://raw.githubusercontent.com" crossOrigin="" />
        <link rel="preconnect" href="https://skycrabacademy.net" crossOrigin="" />
      </head>
      <body>
        <div id="root">
          <LanguageProvider>
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
