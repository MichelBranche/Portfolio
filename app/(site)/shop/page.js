import { ShopPage } from '@/views/site/ShopPage.jsx'
import { metaFor } from '@/lib/seo'

export function generateMetadata() {
  return metaFor('/shop')
}

export default function Page() {
  return <ShopPage />
}
