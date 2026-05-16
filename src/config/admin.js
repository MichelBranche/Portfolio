/**
 * Password admin lato client.
 * - Locale: `.env.local` → VITE_ADMIN_PASSWORD
 * - Vercel: Environment Variables → VITE_ADMIN_PASSWORD
 * Opzionale in locale: `admin.local.js` (solo dev, vedi vite.config.js).
 */
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? ''

export const isAdminConfigured = () => Boolean(ADMIN_PASSWORD)
