import { Suspense } from 'react'
import { SiteFrame } from '@/views/site/SiteFrame.jsx'

export default function SiteLayout({ children }) {
  return (
    <Suspense fallback={null}>
      <SiteFrame>{children}</SiteFrame>
    </Suspense>
  )
}
