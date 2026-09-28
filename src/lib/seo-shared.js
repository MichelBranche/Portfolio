export const SITE = 'https://www.michelbranche.it'

const PAGE_META = {
  it: {
    '/': {
      title: 'Michel Branche | Siti per strutture ricettive',
      description:
        'Sviluppatore web indipendente in Italia. Siti per hotel, B&B, residence, case vacanza e attività locali.',
    },
    '/portfolio': {
      title: 'Lavori | Michel Branche',
      description:
        'Selezione di siti e demo. Residence Le Vele, a Stintino, è il progetto realizzato per un cliente.',
    },
    '/studio': {
      title: 'Studio | Michel Branche',
      description:
        'Michel Branche, sviluppatore web indipendente. Interfacce chiare, motion e siti pensati per chi accoglie ospiti.',
    },
    '/servizi': {
      title: 'Servizi | Michel Branche',
      description:
        'Siti su misura, e-commerce, UI/UX e pacchetti per hotel, B&B, residence, case vacanza e attività locali.',
    },
    '/contatti': {
      title: 'Contatti | Michel Branche',
      description:
        'Scrivi a michel.lavoro@gmail.com, chiama +39 388 166 0117 o manda un WhatsApp. Disponibile per nuovi progetti.',
    },
    '/work/levele': {
      title: 'Residence Le Vele, case study | Michel Branche',
      description:
        'Case study del sito di Residence Le Vele a Stintino. Primo mese online: 14 prenotazioni dirette, 77 notti, 11.947 €, zero Google Ads.',
    },
    '/shop': {
      title: 'Shop | Michel Branche',
      description: 'Il mercato è in preparazione. Nessun prodotto in vendita per ora.',
    },
  },
  en: {
    '/': {
      title: 'Michel Branche | Websites for hospitality',
      description:
        'Independent web developer in Italy. Websites for hotels, B&Bs, residences, holiday homes and local businesses.',
    },
    '/portfolio': {
      title: 'Work | Michel Branche',
      description: 'Selected sites and demos. Residence Le Vele, in Stintino, is the paid client project.',
    },
    '/studio': {
      title: 'Studio | Michel Branche',
      description:
        'Michel Branche, independent web developer. Clear interfaces, motion, and sites for people who host guests.',
    },
    '/servizi': {
      title: 'Services | Michel Branche',
      description:
        'Custom websites, e-commerce, UI/UX and packages for hotels, B&Bs, residences, holiday homes and local businesses.',
    },
    '/contatti': {
      title: 'Contact | Michel Branche',
      description:
        'Email michel.lavoro@gmail.com, call +39 388 166 0117 or send a WhatsApp. Available for new projects.',
    },
    '/work/levele': {
      title: 'Residence Le Vele case study | Michel Branche',
      description:
        'Case study for Residence Le Vele in Stintino. First month online: 14 direct bookings, 77 nights, €11,947, zero Google Ads.',
    },
    '/shop': {
      title: 'Shop | Michel Branche',
      description: 'The market is still being packed. Nothing is for sale yet.',
    },
  },
}

export function resolveMeta(lang, pathname) {
  const pack = lang === 'it' ? PAGE_META.it : PAGE_META.en
  return pack[pathname] || PAGE_META.en[pathname] || PAGE_META.en['/']
}

export function applyClientMeta(lang, pathname) {
  if (typeof document === 'undefined') return
  if (pathname.startsWith('/admin')) return
  const { title, description } = resolveMeta(lang, pathname)
  document.title = title
  upsertMeta('description', description)
  upsertMeta('og:title', title, 'property')
  upsertMeta('og:description', description, 'property')
  upsertMeta('twitter:title', title)
  upsertMeta('twitter:description', description)
}

function upsertMeta(name, content, attr = 'name') {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
