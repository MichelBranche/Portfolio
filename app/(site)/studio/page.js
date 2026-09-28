import { StudioPage } from '@/views/site/StudioPage.jsx'
import { metaFor } from '@/lib/seo'

export function generateMetadata() {
  return metaFor('/studio')
}

export default function Page() {
  return <StudioPage />
}
