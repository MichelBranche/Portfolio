import { createContext, useContext } from 'react'

export const SiteUIContext = createContext(null)

export function useSiteUI() {
  const value = useContext(SiteUIContext)
  if (!value) {
    throw new Error('useSiteUI must be used inside SiteFrame')
  }
  return value
}
