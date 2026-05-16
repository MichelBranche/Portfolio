import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackVisit } from '../lib/trackVisit.js'

export function useVisitTracking() {
  const { pathname } = useLocation()

  useEffect(() => {
    trackVisit(pathname)
  }, [pathname])
}
