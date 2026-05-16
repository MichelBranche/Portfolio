import { ADMIN_PASSWORD as localAdminPassword } from './admin.local.js'

/** Password admin (file locale + opzionale VITE_ADMIN_PASSWORD in .env.local). */
export const ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD || localAdminPassword || ''

export const isAdminConfigured = () => Boolean(ADMIN_PASSWORD)
