import { ContattiPage } from '@/views/site/ContattiPage.jsx'
import { metaFor } from '@/lib/seo'

export function generateMetadata() {
  return metaFor('/contatti')
}

export default function Page() {
  return <ContattiPage />
}
