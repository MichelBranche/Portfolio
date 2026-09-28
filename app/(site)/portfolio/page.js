import { PortfolioPage } from '@/views/site/PortfolioPage.jsx'
import { metaFor } from '@/lib/seo'

export function generateMetadata() {
  return metaFor('/portfolio')
}

export default function Page() {
  return <PortfolioPage />
}
