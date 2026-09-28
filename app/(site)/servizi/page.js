import { metaFor } from '@/lib/seo'
import { ServiziPage } from '@/views/site/ServiziPage.jsx'

export function generateMetadata() {
  return metaFor('/servizi')
}

export default function Page() {
  return <ServiziPage />
}
