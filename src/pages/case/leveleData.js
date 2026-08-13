/** Dati case study Residence Le Vele — primo mese risultati. */
export const LEVELE_CASE = {
  brand: 'Residence Le Vele',
  location: 'Stintino, Sardegna',
  liveUrl: 'https://demoleveleresidence.vercel.app/',
  contactEmail: 'mailto:michel.lavoro@gmail.com',
  previewImg:
    'https://raw.githubusercontent.com/MichelBranche/Demo-LeVeleResidence/main/preview.png',
  assets: {
    hero: '/case/levele/hero.jpg',
    desktop: '/case/levele/desktop.png',
    mobile: '/case/levele/mobile.png',
    before: '/case/levele/before.png',
    after: '/case/levele/after.png',
    analytics: '/case/levele/analytics.png',
    slope: '/case/levele/slope.png',
    cta: '/case/levele/cta.jpg',
  },
  tags: ['Hospitality', 'Web Design', 'SEO', 'UX', 'Performance'],
  hero: {
    eyebrow: 'Case study · 1° mese online',
    headline:
      'Come un nuovo sito ha generato 11.947 € di prenotazioni dirette nel primo mese di messa online, senza Google Ads.',
    ctaLive: 'Vedi il sito',
    ctaBack: 'Torna ai lavori',
  },
  kpis: [
    { value: 11947, prefix: '', suffix: ' €', label: 'Ricavi nel 1° mese', format: 'currency' },
    { value: 14, prefix: '', suffix: '', label: 'Prenotazioni (3–30 lug)', format: 'int' },
    { value: 77, prefix: '', suffix: '', label: 'Notti vendute', format: 'int' },
    { value: 0, prefix: '', suffix: ' €', label: 'Google Ads', format: 'currency' },
  ],
  /** Contesto temporale sul canale “sito”. */
  bookingContext:
    'Dal 01/01/2026 a oggi le prenotazioni dirette totali dal canale “sito” sono 17: 14 di queste sono state ottenute tra il 3 e il 30 luglio, nel primo mese di messa online.',
  problem: {
    title: 'Il problema',
    lead: 'Il vecchio sito presentava diversi limiti:',
    items: [
      'design datato',
      'poca fiducia',
      'esperienza mobile poco curata',
      'scarsa valorizzazione delle camere',
      'nessuna ottimizzazione SEO',
    ],
  },
  solution: {
    title: 'La soluzione',
    lead: 'Un sito pensato per convertire: design, fiducia, performance e prenotazione diretta.',
    checklist: [
      'Design',
      'SEO',
      'Performance',
      'Responsive',
      'Booking Engine',
      'Multilingua',
    ],
  },
  process: {
    title: 'Il processo',
    steps: ['Discovery', 'UX', 'UI', 'Development', 'SEO', 'Launch'],
  },
  beforeAfter: {
    title: 'Prima / Dopo',
    beforeLabel: 'Old website',
    afterLabel: 'New website',
  },
  analytics: {
    title: 'Analytics',
    lead: 'Traffico organico e comportamento nel primo mese di messa online.',
    caption:
      'Vercel Analytics (primo mese) — 267 visitatori (+493%), 752 page views, bounce rate 34%. Top referrer: Google (135). /prenota ha ricevuto 100 visitatori.',
    metrics: [
      { value: 267, label: 'Visitatori' },
      { value: 752, label: 'Page Views' },
      { value: 34, suffix: '%', label: 'Bounce Rate' },
      { value: 135, label: 'Visitatori da Google' },
    ],
  },
  results: {
    title: 'Risultati economici',
    lead: 'Nel primo mese di messa online (3–30 luglio) il sito ha generato:',
    lines: ['14 prenotazioni dirette', '77 notti', '11.947 €'],
    note: 'Senza alcuna campagna Google Ads.',
    context:
      'Dal 01/01/2026 a oggi: 17 prenotazioni dirette totali dal canale “sito”. Di queste, 14 sono state ottenute tra il 3 e il 30 luglio.',
  },
  slope: {
    title: 'Report del gestionale',
    caption:
      'Estratto Slope (3–30 luglio) — canale “sito”: 14 prenotazioni, 77 notti, 11.947 €, 0% commissioni e 0% cancellazioni. YTD 2026: 17 prenotazioni dirette totali dal sito.',
  },
  deliverables: {
    title: 'Cosa ho realizzato',
    items: [
      'UX Design',
      'UI Design',
      'Frontend',
      'SEO',
      'Performance',
      'Hosting',
      'Analytics',
      'Responsive',
      'Schema.org',
      'Cookie Consent',
      'Booking Integration',
    ],
  },
  /** Imposta quote + author per mostrare la sezione testimonianza. */
  testimonial: null,
  // testimonial: { quote: '…', author: '…', role: 'Residence Le Vele' },
  cta: {
    title: 'Il tuo sito porta davvero clienti?',
    lead: 'Costruiamo insieme un sito pensato per generare risultati, non solo per essere bello.',
    button: 'Parliamone',
  },
}

export function formatKpiDisplay(kpi, animatedValue) {
  const n = animatedValue ?? kpi.value
  if (kpi.format === 'currency') {
    return `${new Intl.NumberFormat('it-IT').format(Math.round(n))}${kpi.suffix || ''}`
  }
  return `${Math.round(n)}${kpi.suffix || ''}`
}
