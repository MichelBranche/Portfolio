export const SITE = 'https://www.michelbranche.it'

export const OG_LOCALES = { it: 'it_IT', en: 'en_US', fr: 'fr_FR', de: 'de_DE', es: 'es_ES' }

export const SEO_LANGS = ['it', 'en', 'fr', 'de', 'es']

/**
 * Every language has its own explicit URL (?lang=xx). The clean URL negotiates the
 * visitor's language (fallback English) and is the x-default.
 */
export function alternatesFor(pathname) {
  const clean = pathname === '/' ? SITE : `${SITE}${pathname}`
  const base = pathname === '/' ? `${SITE}/` : clean
  const urls = Object.fromEntries(SEO_LANGS.map((lang) => [lang, `${base}?lang=${lang}`]))
  return { clean, urls, languages: { ...urls, 'x-default': clean } }
}

const PAGE_META = {
  it: {
    '/': {
      title: 'Michel Branche | Siti web su misura',
      description:
        'Sviluppatore web indipendente in Italia. Siti web su misura, progettati e sviluppati da zero per aziende, brand e progetti di ogni tipo, compresa l’hospitality.',
    },
    '/portfolio': {
      title: 'Lavori | Michel Branche',
      description:
        'Selezione di siti e demo. Residence Le Vele, a Stintino, è il progetto realizzato per un cliente.',
    },
    '/studio': {
      title: 'Studio | Michel Branche',
      description:
        'Michel Branche, sviluppatore web indipendente. Interfacce chiare, motion e siti su misura per aziende, brand e progetti di ogni tipo.',
    },
    '/servizi': {
      title: 'Servizi | Michel Branche',
      description:
        'Siti su misura, e-commerce, UI/UX e pacchetti per aziende, brand e progetti di ogni tipo.',
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
      title: 'Michel Branche | Custom websites',
      description:
        'Independent web developer in Italy. Custom websites, designed and built from scratch for businesses, brands and projects of any kind, including hospitality.',
    },
    '/portfolio': {
      title: 'Work | Michel Branche',
      description: 'Selected sites and demos. Residence Le Vele, in Stintino, is the client project.',
    },
    '/studio': {
      title: 'Studio | Michel Branche',
      description:
        'Michel Branche, independent web developer. Clear interfaces, motion, and custom sites for businesses, brands and projects of any kind.',
    },
    '/servizi': {
      title: 'Services | Michel Branche',
      description:
        'Custom websites, e-commerce, UI/UX and packages for businesses, brands and projects of any kind.',
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
  fr: {
    '/': {
      title: 'Michel Branche | Sites web sur mesure',
      description:
        'Développeur web indépendant en Italie. Sites web sur mesure, conçus et développés de zéro pour entreprises, marques et projets de tout type, hôtellerie comprise.',
    },
    '/portfolio': {
      title: 'Réalisations | Michel Branche',
      description:
        'Sélection de sites et de démos. Residence Le Vele, à Stintino, est le projet client.',
    },
    '/studio': {
      title: 'Studio | Michel Branche',
      description:
        'Michel Branche, développeur web indépendant. Interfaces claires, motion et sites sur mesure pour entreprises, marques et projets de tout type.',
    },
    '/servizi': {
      title: 'Services | Michel Branche',
      description:
        'Sites sur mesure, e-commerce, UI/UX et forfaits pour entreprises, marques et projets de tout type.',
    },
    '/contatti': {
      title: 'Contact | Michel Branche',
      description:
        'Écrivez à michel.lavoro@gmail.com, appelez le +39 388 166 0117 ou envoyez un WhatsApp. Disponible pour de nouveaux projets.',
    },
    '/work/levele': {
      title: 'Residence Le Vele, étude de cas | Michel Branche',
      description:
        'Étude de cas du site de Residence Le Vele à Stintino. Premier mois en ligne : 14 réservations directes, 77 nuits, 11 947 €, zéro Google Ads.',
    },
    '/shop': {
      title: 'Shop | Michel Branche',
      description:
        'La boutique est en préparation. Rien n\'est encore en vente.',
    },
  },
  de: {
    '/': {
      title: 'Michel Branche | Maßgeschneiderte Websites',
      description:
        'Unabhängiger Webentwickler in Italien. Maßgeschneiderte Websites, von Grund auf gestaltet und entwickelt für Unternehmen, Marken und Projekte jeder Art, auch im Gastgewerbe.',
    },
    '/portfolio': {
      title: 'Arbeiten | Michel Branche',
      description:
        'Ausgewählte Websites und Demos. Residence Le Vele in Stintino ist das Kundenprojekt.',
    },
    '/studio': {
      title: 'Studio | Michel Branche',
      description:
        'Michel Branche, unabhängiger Webentwickler. Klare Interfaces, Motion und maßgeschneiderte Websites für Unternehmen, Marken und Projekte jeder Art.',
    },
    '/servizi': {
      title: 'Leistungen | Michel Branche',
      description:
        'Maßgeschneiderte Websites, E-Commerce, UI/UX und Pakete für Unternehmen, Marken und Projekte jeder Art.',
    },
    '/contatti': {
      title: 'Kontakt | Michel Branche',
      description:
        'Schreib an michel.lavoro@gmail.com, ruf +39 388 166 0117 an oder schick eine WhatsApp. Verfügbar für neue Projekte.',
    },
    '/work/levele': {
      title: 'Residence Le Vele, Fallstudie | Michel Branche',
      description:
        'Fallstudie zur Website von Residence Le Vele in Stintino. Erster Monat online: 14 Direktbuchungen, 77 Nächte, 11.947 €, null Google Ads.',
    },
    '/shop': {
      title: 'Shop | Michel Branche',
      description:
        'Der Shop wird noch vorbereitet. Noch ist nichts zu kaufen.',
    },
  },
  es: {
    '/': {
      title: 'Michel Branche | Sitios web a medida',
      description:
        'Desarrollador web independiente en Italia. Sitios web a medida, diseñados y desarrollados desde cero para empresas, marcas y proyectos de todo tipo, también de hostelería.',
    },
    '/portfolio': {
      title: 'Trabajos | Michel Branche',
      description:
        'Selección de sitios y demos. Residence Le Vele, en Stintino, es el proyecto de cliente.',
    },
    '/studio': {
      title: 'Estudio | Michel Branche',
      description:
        'Michel Branche, desarrollador web independiente. Interfaces claras, motion y sitios a medida para empresas, marcas y proyectos de todo tipo.',
    },
    '/servizi': {
      title: 'Servicios | Michel Branche',
      description:
        'Sitios a medida, e-commerce, UI/UX y paquetes para empresas, marcas y proyectos de todo tipo.',
    },
    '/contatti': {
      title: 'Contacto | Michel Branche',
      description:
        'Escribe a michel.lavoro@gmail.com, llama al +39 388 166 0117 o envía un WhatsApp. Disponible para nuevos proyectos.',
    },
    '/work/levele': {
      title: 'Residence Le Vele, caso de estudio | Michel Branche',
      description:
        'Caso de estudio del sitio de Residence Le Vele en Stintino. Primer mes online: 14 reservas directas, 77 noches, 11.947 €, cero Google Ads.',
    },
    '/shop': {
      title: 'Shop | Michel Branche',
      description:
        'La tienda está en preparación. Todavía no hay nada a la venta.',
    },
  },
}

export function resolveMeta(lang, pathname) {
  const pack = PAGE_META[lang] || PAGE_META.en
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
  upsertMeta('og:locale', OG_LOCALES[lang] || OG_LOCALES.en, 'property')
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
