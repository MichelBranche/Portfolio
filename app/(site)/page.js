import { preload } from 'react-dom'
import { HomePage } from '@/views/site/HomePage.jsx'
import { HOME_ART } from '@/config/site.js'
import { metaFor } from '@/lib/seo'

export function generateMetadata() {
  return metaFor('/')
}

export default function Page() {
  // The first illustrations of the board are visible from the top-left start position.
  HOME_ART.slice(0, 3).forEach((art) => {
    preload(art.src, { as: 'image', type: 'image/webp', fetchPriority: 'high' })
  })
  return <HomePage />
}
