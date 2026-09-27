'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackVisit } from '../lib/trackVisit.js'

export function useVisitTracking() {
  const pathname = usePathname()

  useEffect(() => {
    trackVisit(pathname)
  }, [pathname])
}
