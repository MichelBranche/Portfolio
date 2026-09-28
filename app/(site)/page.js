import { HomePage } from '@/views/site/HomePage.jsx'
import { metaFor } from '@/lib/seo'

export function generateMetadata() {
  return metaFor('/')
}

export default function Page() {
  return <HomePage />
}
