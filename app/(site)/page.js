import { preload } from 'react-dom'
import { getImageProps } from 'next/image'
import { HomePage } from '@/views/site/HomePage.jsx'
import { PROJECT_META } from '@/config/site.js'
import { metaFor } from '@/lib/seo'

export function generateMetadata() {
  return metaFor('/')
}

// First tile of the mobile grid (newest project, board-tail entries go last), the LCP on phones.
function mobileLcpThumb() {
  const sorted = [...PROJECT_META].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
  const first = sorted.find((project) => !project.boardTail) || sorted[0]
  return first?.thumb
}

export default function Page() {
  // Desktop board LCP (Museo Egizio tile closest to the centre).
  preload('/projects/lcp/museo.avif', {
    as: 'image',
    type: 'image/avif',
    fetchPriority: 'high',
    media: '(min-width: 761px)',
  })
  const thumb = mobileLcpThumb()
  if (thumb) {
    // Must match the props PixelImage passes to next/image for the priority tile.
    const { props } = getImageProps({ src: thumb, alt: '', width: 640, height: 589, sizes: '50vw', quality: 50 })
    preload(props.src, {
      as: 'image',
      imageSrcSet: props.srcSet,
      imageSizes: props.sizes,
      fetchPriority: 'high',
      media: '(max-width: 760px)',
    })
  }
  return <HomePage />
}
