import { HomePage } from '@/views/site/HomePage.jsx'
import { metaFor } from '@/lib/seo'

export function generateMetadata() {
  return metaFor('/')
}

export default function Page() {
  return (
    <>
      <link rel="preload" as="image" href="/projects/lcp/museo.avif" type="image/avif" fetchpriority="high" />
      <HomePage />
    </>
  )
}
