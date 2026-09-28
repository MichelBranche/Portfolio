import LeveleCasePage from '@/views/case/LeveleCasePage.jsx'
import { metaFor } from '@/lib/seo'

export function generateMetadata() {
  return metaFor('/work/levele')
}

export default function Page() {
  return <LeveleCasePage />
}
