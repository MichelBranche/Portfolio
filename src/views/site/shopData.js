/**
 * Mercato. Ogni voce resta `packing` finché non c'è un pezzo vero.
 * Per pubblicarlo: status 'ready', name, price, label, note.
 * L'acquisto resta spento finché non esiste un checkout.
 */
export const SHOP_PRODUCTS = [
  { id: '01', status: 'packing', tilt: -11, tape: 18 },
  { id: '02', status: 'packing', tilt: 8, tape: 48 },
  { id: '03', status: 'packing', tilt: -4, tape: 30 },
  { id: '04', status: 'packing', tilt: 14, tape: 62 },
  { id: '05', status: 'packing', tilt: -16, tape: 22 },
  { id: '06', status: 'packing', tilt: 5, tape: 40 },
]
