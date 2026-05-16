const localModules = import.meta.glob('./admin.local.js', { eager: true })
const localConfig = Object.values(localModules)[0]

/** Password da `src/config/admin.local.js` (copia da admin.local.example.js). */
export const ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD || localConfig?.ADMIN_PASSWORD || ''

export const isAdminConfigured = () => Boolean(ADMIN_PASSWORD)
