/**
 * In produzione su Vercel: stesso dominio → `/api/send-message`.
 * In locale (`vite`): imposta `VITE_CONTACT_API_URL` verso il deploy Vercel
 * (es. https://tuo-progetto.vercel.app/api/send-message).
 */
export const CONTACT_FORM_API_URL =
  import.meta.env.VITE_CONTACT_API_URL || '/api/send-message'
