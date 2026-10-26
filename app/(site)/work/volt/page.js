import VoltPage from '@/views/case/VoltPage.jsx'
import { metaFor } from '@/lib/seo'

export function generateMetadata() {
  return metaFor('/work/volt')
}

export default function Page() {
  return <VoltPage />
}
