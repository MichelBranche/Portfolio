/** Stesso dominio su Vercel; in locale: `VITE_STATS_API_URL=https://….vercel.app/api/stats` */
export const STATS_API_URL =
  import.meta.env.VITE_STATS_API_URL || '/api/stats'
