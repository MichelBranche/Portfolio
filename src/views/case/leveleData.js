const EURO = '\u00A0€'

/** Dati case study Residence Le Vele, primo mese di risultati. */
export const LEVELE_CASE = {
  brand: 'Residence Le Vele',
  location: 'Stintino, Sardegna',
  liveUrl: 'https://demoleveleresidence.vercel.app/',
  contactEmail: 'mailto:michel.lavoro@gmail.com',
  previewImg:
    'https://raw.githubusercontent.com/MichelBranche/Demo-LeVeleResidence/main/preview.png',
  /** Screenshot opzionali: impostare il path (es. /case/levele/analytics.png) per mostrarli. */
  assets: {
    cover: '/projects/levele-cover.png',
    before: null,
    after: null,
    analytics: null,
    slope: null,
  },
  tags: ['Hospitality', 'Web Design', 'SEO', 'UX', 'Performance'],
  hero: {
    eyebrow: 'Case study · 1° mese online',
    headline:
      `Come un nuovo sito ha generato 11.947${EURO} di prenotazioni dirette nel primo mese di messa online, senza Google Ads.`,
    ctaLive: 'Vedi il sito',
    ctaBack: 'Torna ai lavori',
  },
  kpis: [
    { value: 11947, prefix: '', suffix: EURO, label: 'Ricavi nel 1° mese', format: 'currency' },
    { value: 14, prefix: '', suffix: '', label: 'Prenotazioni (3-30 lug)', format: 'int' },
    { value: 77, prefix: '', suffix: '', label: 'Notti vendute', format: 'int' },
    { value: 0, prefix: '', suffix: EURO, label: 'Google Ads', format: 'currency' },
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
      'Vercel Analytics (primo mese): 267 visitatori (+493%), 752 page views, bounce rate 34%. Top referrer: Google (135). /prenota ha ricevuto 100 visitatori.',
    metrics: [
      { value: 267, label: 'Visitatori' },
      { value: 752, label: 'Page Views' },
      { value: 34, suffix: '%', label: 'Bounce Rate' },
      { value: 135, label: 'Visitatori da Google' },
    ],
  },
  results: {
    title: 'Risultati economici',
    lead: 'Nel primo mese di messa online (3-30 luglio) il sito ha generato:',
    lines: ['14 prenotazioni dirette', '77 notti', `11.947${EURO}`],
    note: 'Senza alcuna campagna Google Ads.',
    context:
      'Dal 01/01/2026 a oggi: 17 prenotazioni dirette totali dal canale “sito”. Di queste, 14 sono state ottenute tra il 3 e il 30 luglio.',
  },
  slope: {
    title: 'Report del gestionale',
    caption:
      `Estratto Slope (3-30 luglio), canale “sito”: 14 prenotazioni, 77 notti, 11.947${EURO}, 0% commissioni e 0% cancellazioni. YTD 2026: 17 prenotazioni dirette totali dal sito.`,
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
  cta: {
    title: 'Il tuo sito porta davvero clienti?',
    lead: 'Costruiamo insieme un sito pensato per generare risultati, non solo per essere bello.',
    button: 'Parliamone',
  },
}

/** English body. Numbers stay identical to the Italian case. */
export const LEVELE_CASE_EN = {
  ...LEVELE_CASE,
  location: 'Stintino, Sardinia',
  hero: {
    eyebrow: 'Case study · first month online',
    headline:
      'How a new site brought in €11,947 of direct bookings in its first month online, with no Google Ads.',
    ctaLive: 'See the site',
    ctaBack: 'Back to the work',
  },
  kpis: [
    { value: 11947, prefix: '', suffix: '', label: 'Revenue in month 1', format: 'currency' },
    { value: 14, prefix: '', suffix: '', label: 'Bookings (3-30 Jul)', format: 'int' },
    { value: 77, prefix: '', suffix: '', label: 'Nights sold', format: 'int' },
    { value: 0, prefix: '', suffix: '', label: 'Google Ads', format: 'currency' },
  ],
  bookingContext:
    'From 1 Jan 2026 to today, direct bookings on the "site" channel total 17. 14 of them came in between 3 and 30 July, in the first month online.',
  problem: {
    title: 'The problem',
    lead: 'The previous site had a few clear limits:',
    items: [
      'dated design',
      'low trust',
      'a weak mobile experience',
      'rooms that were hard to appreciate',
      'no SEO work',
    ],
  },
  solution: {
    title: 'The solution',
    lead: 'A site built to convert: design, trust, performance and direct booking.',
    checklist: ['Design', 'SEO', 'Performance', 'Responsive', 'Booking Engine', 'Multilingual'],
  },
  process: {
    title: 'The process',
    steps: ['Discovery', 'UX', 'UI', 'Development', 'SEO', 'Launch'],
  },
  beforeAfter: {
    title: 'Before / After',
    beforeLabel: 'Old website',
    afterLabel: 'New website',
  },
  analytics: {
    title: 'Analytics',
    lead: 'Organic traffic and behaviour in the first month online.',
    caption:
      'Vercel Analytics (first month): 267 visitors (+493%), 752 page views, bounce rate 34%. Top referrer: Google (135). /prenota received 100 visitors.',
    metrics: [
      { value: 267, label: 'Visitors' },
      { value: 752, label: 'Page views' },
      { value: 34, suffix: '%', label: 'Bounce rate' },
      { value: 135, label: 'Visitors from Google' },
    ],
  },
  results: {
    title: 'Business results',
    lead: 'In the first month online (3-30 July) the site brought in:',
    lines: ['14 direct bookings', '77 nights', '€11,947'],
    note: 'With no Google Ads campaign.',
    context:
      'From 1 Jan 2026 to today: 17 direct bookings on the "site" channel. 14 of them came in between 3 and 30 July.',
  },
  slope: {
    title: 'Property system report',
    caption:
      'Slope extract (3-30 July), "site" channel: 14 bookings, 77 nights, €11,947, 0% commission and 0% cancellations. YTD 2026: 17 direct bookings from the site.',
  },
  deliverables: {
    title: 'What I built',
    items: LEVELE_CASE.deliverables.items,
  },
  cta: {
    title: 'Does your site actually bring guests?',
    lead: "Let's build a site meant to bring results, not only to look good.",
    button: "Let's talk",
  },
}

export function leveleCase(lang) {
  return lang === 'it' ? LEVELE_CASE : LEVELE_CASE_EN
}

export function formatKpiDisplay(kpi, animatedValue, lang = 'it') {
  const n = animatedValue ?? kpi.value
  if (kpi.format === 'currency') {
    if (lang === 'it') {
      return `${new Intl.NumberFormat('it-IT').format(Math.round(n))}${kpi.suffix || EURO}`
    }
    return `€${new Intl.NumberFormat('en-US').format(Math.round(n))}`
  }
  return `${Math.round(n)}${kpi.suffix || ''}`
}
