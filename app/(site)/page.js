import { preload } from 'react-dom'
import { HomePage } from '@/views/site/HomePage.jsx'
import { metaFor } from '@/lib/seo'

export function generateMetadata() {
  return metaFor('/')
}

export default function Page() {
  preload('/projects/lcp/museo.avif', { as: 'image', type: 'image/avif', fetchPriority: 'high' })
  return <HomePage />
}
