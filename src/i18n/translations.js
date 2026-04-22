/** @typedef {'it'|'en'|'fr'|'de'|'es'} Lang */

/** @type {Record<Lang, { code: string; label: string }>} */
export const LANGUAGES = {
  it: { code: 'it', label: 'Italiano' },
  en: { code: 'en', label: 'English' },
  fr: { code: 'fr', label: 'Français' },
  de: { code: 'de', label: 'Deutsch' },
  es: { code: 'es', label: 'Español' },
}

const ORDER = ['it', 'en', 'fr', 'de', 'es']

export const LANGUAGE_LIST = ORDER.map((k) => LANGUAGES[k])

const STRINGS = {
  it: {
    doc: {
      cycle: [
        'MICHEL BRANCHE | Sviluppatore Web',
        'Sviluppatore web · dritto al punto',
        'Disponibile per nuovi progetti',
      ],
      away: 'No dai ti prego torna qui...',
    },
    preloader: {
      enter: 'ENTER',
      iframeTitle: 'Animazione di caricamento',
      enterAria: 'Entra nel sito',
    },
    hero: {
      lines: [
        'Sviluppatore Web Indipendente.',
        'Designer e UI/UX specialist.',
        'Creo siti web veloci, dritti al punto e che convertono.',
      ],
      italy: 'ITALY',
      italyTagAria: "Italia. Tocca o passa sopra per l'interazione",
      socialAria: 'Contatti social',
    },
    language: {
      switchLabel: 'Lingua / Language',
      chooseAria: 'Scegli la lingua',
      hintNudge: 'Pssst: nel tondino trovi altre lingue',
    },
    projects: {
      header: 'Lavori Selezionati',
      rubina: {
        title: 'Fotografia - Rubina',
        desc: 'Portfolio fotografico brutal/editoriale con layout dinamici, animazioni GSAP e approccio performance-first senza framework.',
      },
      streetwear: {
        title: 'E-commerce - Streetwear',
        desc: 'E-commerce sperimentale in stile brutalist con routing client-side, transizioni custom, carrello e checkout dimostrativo.',
      },
      museo: {
        title: 'Istituzionale - Museo Egizio',
        desc: 'Demo front-end immersiva con pagine istituzionali, biglietteria e shop in anteprima, i18n multi-lingua e animazioni avanzate.',
      },
      spotify: {
        title: 'Clone interfaccia - Spotify',
        desc: 'Clone UI di Spotify realizzato con stack web classico, focalizzato su struttura frontend e resa visuale.',
      },
      levele: {
        title: 'Hospitality - Le Vele',
        desc: 'Web app full stack per residence con landing animata, flusso prenotazioni, area admin e API serverless.',
      },
      caffestella: {
        title: 'Gastronomia - Paolo Griffa, Caffè Nazionale',
        desc: 'Sito vetrina/editoriale multi-pagina per il Caffè Nazionale di Paolo Griffa (Stella) con routing SPA, animazioni GSAP, smooth scroll Lenis e layout responsive.',
      },
      ilgusto: {
        title: 'Gastronomia - Il Gusto',
        desc: 'Sito statico per pizzeria al taglio: layout diner-style, mobile-first, CTA verso Deliveroo e WhatsApp, zero framework.',
      },
    },
    modal: {
      close: 'CHIUDI [X]',
      visit: 'VAI AL SITO WEB ↗',
      imgAlt: 'Anteprima progetto',
      titlePlaceholder: 'TITOLO',
      descPlaceholder: 'Descrizione.',
    },
    marquee: {
      line: 'DISPONIBILE PER NUOVI PROGETTI -',
    },
    footer: {
      scrivimi: 'SCRIVIMI',
      cta: 'Lavoriamo insieme.',
      hintCoarse: 'p.s. tocca o tieni premuto',
      hintFine: 'p.s. passaci sopra col cursore',
      selfDestruct: 'TANTO CI PENSA AMMIOCUGGINO',
      selfDestructDone: 'OK, CHIARO.',
      selfDestructAria: 'Scherzo: tutto cade in basso (demo)',
      motto: 'Fatto con una quantità assurda di caffè.',
    },
    easter: {
      imageAlt: 'Ritratto',
    },
  },
  en: {
    doc: {
      cycle: [
        'MICHEL BRANCHE | Web developer',
        'Web dev · straight to the point',
        'Available for new projects',
      ],
      away: 'Please come back…',
    },
    preloader: {
      enter: 'ENTER',
      iframeTitle: 'Loading animation',
      enterAria: 'Enter the site',
    },
    hero: {
      lines: [
        'Independent web developer.',
        'Designer & UI/UX specialist.',
        'I build fast, no-nonsense sites that convert.',
      ],
      italy: 'ITALY',
      italyTagAria: 'Italy. Tap or hover to interact',
      socialAria: 'Social links',
    },
    language: {
      switchLabel: 'Language',
      chooseAria: 'Choose language',
      hintNudge: 'Psst — the dot hides extra dialects for your brain.',
    },
    projects: {
      header: 'Selected work',
      rubina: {
        title: 'Photography - Rubina',
        desc: 'Brutal/editorial photo portfolio with dynamic layouts, GSAP motion and a performance-first, framework-free approach.',
      },
      streetwear: {
        title: 'E-commerce - Streetwear',
        desc: 'Experimental brutalist e-commerce with client-side routing, custom transitions, cart and a demo checkout.',
      },
      museo: {
        title: 'Institutional - Egyptian Museum',
        desc: 'Immersive front-end demo with institutional pages, ticketing, shop preview, multi-language i18n and advanced motion.',
      },
      spotify: {
        title: 'Spotify interface clone',
        desc: 'Spotify-style UI built with a classic web stack, focused on front-end structure and visual polish.',
      },
      levele: {
        title: 'Hospitality - Le Vele',
        desc: 'Full-stack web app for a residence: animated landing, booking flow, admin area and serverless API.',
      },
      caffestella: {
        title: 'Gastronomy - Paolo Griffa, Caffè Nazionale',
        desc: 'Showcase/editorial multi-page site for Paolo Griffa’s Caffè Nazionale (Stella) with SPA routing, GSAP, Lenis smooth scroll and responsive layout.',
      },
      ilgusto: {
        title: 'Gastronomy - Il Gusto',
        desc: 'Static slice-pizzeria site: diner-style layout, mobile-first, Deliveroo and WhatsApp CTAs, no heavy frameworks.',
      },
    },
    modal: {
      close: 'CLOSE [X]',
      visit: 'GO TO THE SITE ↗',
      imgAlt: 'Project preview',
      titlePlaceholder: 'TITLE',
      descPlaceholder: 'Description.',
    },
    marquee: {
      line: 'AVAILABLE FOR NEW PROJECTS -',
    },
    footer: {
      scrivimi: 'MESSAGE ME',
      cta: "Let's work together.",
      hintCoarse: 'p.s. touch or hold',
      hintFine: 'p.s. hover with your cursor',
      selfDestruct: "ANYWAY, MY BUDDY'S GOT IT",
      selfDestructDone: 'OK, FAIR.',
      selfDestructAria: 'Joke: everything falls to the bottom (demo)',
      motto: 'Made with a crazy amount of coffee.',
    },
    easter: {
      imageAlt: 'Portrait',
    },
  },
  fr: {
    doc: {
      cycle: [
        'MICHEL BRANCHE | Développeur web',
        'Développeur web · aller droit au but',
        'Disponible pour de nouveaux projets',
      ],
      away: 'Reviens, s’il te plaît…',
    },
    preloader: {
      enter: 'ENTRER',
      iframeTitle: 'Animation de chargement',
      enterAria: 'Entrer sur le site',
    },
    hero: {
      lines: [
        'Développeur web indépendant.',
        'Designer et spécialiste UI/UX.',
        'Je crée des sites rapides, clairs et orientés conversion.',
      ],
      italy: 'ITALIE',
      italyTagAria: 'Italie. Touchez ou survolez pour interagir',
      socialAria: 'Réseaux sociaux',
    },
    language: {
      switchLabel: 'Langue',
      chooseAria: 'Choisir la langue',
      hintNudge: 'Psst : d’autres langues se cachent dans le rond — promis, elles ne mordent pas.',
    },
    projects: {
      header: 'Projets choisis',
      rubina: {
        title: 'Photo - Rubina',
        desc: 'Portfolio photo brutal/éditorial, layouts dynamiques, animations GSAP et approche performante sans framework.',
      },
      streetwear: {
        title: 'E-commerce - Streetwear',
        desc: 'E-commerce brutaliste expérimental, routing côté client, transitions, panier et checkout démo.',
      },
      museo: {
        title: 'Institutionnel - Musée Égyptien',
        desc: 'Démo front-end immersive, pages institutionnelles, billetterie, aperçu boutique, i18n et motion avancée.',
      },
      spotify: {
        title: 'Clone interface - Spotify',
        desc: "Clone d'UI Spotify avec stack web classique, structuration front et rendu visuel.",
      },
      levele: {
        title: 'Hospitality - Le Vele',
        desc: "App web full stack pour une résidence : landing animée, réservations, admin et API serverless.",
      },
      caffestella: {
        title: 'Gastronomie - Paolo Griffa, Caffè Nazionale',
        desc: "Site vitrine/éditorial multi-pages pour le Caffè Nazionale de Paolo Griffa (Stella) : SPA, GSAP, Lenis, responsive.",
      },
      ilgusto: {
        title: 'Gastronomie - Il Gusto',
        desc: 'Site statique pour pizzeria al taglio : style diner, mobile-first, CTA Deliveroo et WhatsApp, sans framework lourd.',
      },
    },
    modal: {
      close: 'FERMER [X]',
      visit: 'ALLER AU SITE ↗',
      imgAlt: 'Aperçu du projet',
      titlePlaceholder: 'TITRE',
      descPlaceholder: 'Description.',
    },
    marquee: {
      line: 'DISPONIBLE POUR NOUVEAUX PROJETS -',
    },
    footer: {
      scrivimi: 'ÉCRIVEZ-MOI',
      cta: 'Travaillons ensemble.',
      hintCoarse: 'p.s. touche ou maintiens',
      hintFine: 'p.s. passe le curseur dessus',
      selfDestruct: 'MON POTE S’EN OCCUPE, NON ?',
      selfDestructDone: 'OK, COMPRIS.',
      selfDestructAria: 'Blague : tout tombe (démo)',
      motto: 'Fait avec une quantité démente de café.',
    },
    easter: {
      imageAlt: 'Portrait',
    },
  },
  de: {
    doc: {
      cycle: [
        'MICHEL BRANCHE | Webentwickler',
        'Webentwickler · schnurstracks',
        'Verfügbar für neue Projekte',
      ],
      away: 'Bitte komm zurück…',
    },
    preloader: {
      enter: 'ENTER',
      iframeTitle: 'Lade-Animation',
      enterAria: 'Zur Seite eintreten',
    },
    hero: {
      lines: [
        'Selbständiger Webentwickler.',
        'Designer und UI/UX-Spezialist.',
        'Ich baue schnelle, klare Websites mit Fokus auf Conversion.',
      ],
      italy: 'ITALIEN',
      italyTagAria: 'Italien. Tippen oder mit der Maus darüber, um zu interagieren',
      socialAria: 'Soziale Netzwerke',
    },
    language: {
      switchLabel: 'Sprache',
      chooseAria: 'Sprache wählen',
      hintNudge: 'Pssst — im Kreis warten frechere Wörter auf dich.',
    },
    projects: {
      header: 'Ausgewählte Arbeiten',
      rubina: {
        title: 'Fotografie - Rubina',
        desc: 'Brutales/Editorial-Fotoportfolio, dynamische Layouts, GSAP, performance-orientiert, ohne großes Framework.',
      },
      streetwear: {
        title: 'E-Commerce - Streetwear',
        desc: 'Experimenteller Brutalist-Shop mit Client-Routing, Transitions, Warenkorb und Demo-Checkout.',
      },
      museo: {
        title: 'Institutionell - Ägyptisches Museum',
        desc: 'Immersives Front-end mit Institutionalseiten, Tickets, Shop-Vorschau, i18n und fortgeschrittenen Animationen.',
      },
      spotify: {
        title: 'Spotify-Interface-Klon',
        desc: 'Spotify-ähnliches UI mit klassischem Web-Stack, Fokus auf Struktur und Look.',
      },
      levele: {
        title: 'Gastgewerbe - Le Vele',
        desc: 'Full-Stack-Web-App mit animiertem Auftritt, Buchung, Admin und Serverless-API.',
      },
      caffestella: {
        title: 'Gastronomie - Paolo Griffa, Caffè Nazionale',
        desc: 'Mehrseitiger Showcase/Editorial für Paolo Griffas Caffè Nazionale (Stella), SPA, GSAP, Lenis, responsive.',
      },
      ilgusto: {
        title: 'Gastronomie - Il Gusto',
        desc: 'Statische Pizza-al-Taglio-Website: Diner-Look, mobile-first, CTAs zu Deliveroo und WhatsApp, ohne schwere Frameworks.',
      },
    },
    modal: {
      close: 'SCHLIESSEN [X]',
      visit: 'ZUR WEBSITE ↗',
      imgAlt: 'Projektvorschau',
      titlePlaceholder: 'TITEL',
      descPlaceholder: 'Beschreibung.',
    },
    marquee: {
      line: 'VERFÜGBAR FÜR NEUE PROJEKTE -',
    },
    footer: {
      scrivimi: 'SCHREIB MIR',
      cta: 'Lass uns zusammenarbeiten.',
      hintCoarse: 'p.s. tippen oder halten',
      hintFine: 'p.s. mit dem Cursor darüber',
      selfDestruct: 'REGELT DOCH MEIN KUMPEL',
      selfDestructDone: 'OK, ALLES KLAR.',
      selfDestructAria: 'Scherz: alles fällt (Demo)',
      motto: 'Gemacht mit einer irren Menge Kaffee.',
    },
    easter: {
      imageAlt: 'Porträt',
    },
  },
  es: {
    doc: {
      cycle: [
        'MICHEL BRANCHE | Desarrollador web',
        'Desarrollo web · al grano',
        'Disponible para nuevos proyectos',
      ],
      away: 'Vuelve, por favor…',
    },
    preloader: {
      enter: 'ENTRAR',
      iframeTitle: 'Animación de carga',
      enterAria: 'Entrar al sitio',
    },
    hero: {
      lines: [
        'Desarrollador web independiente.',
        'Diseñador y especialista en UI/UX.',
        'Creo sitios rápidos, claros y orientados a convertir.',
      ],
      italy: 'ITALIA',
      italyTagAria: 'Italia. Toca o pasa el cursor para interactuar',
      socialAria: 'Redes sociales',
    },
    language: {
      switchLabel: 'Idioma',
      chooseAria: 'Elegir idioma',
      hintNudge: 'Psst: en el círculo hay más idiomas con picardía.',
    },
    projects: {
      header: 'Trabajos seleccionados',
      rubina: {
        title: 'Fotografía - Rubina',
        desc: 'Portafolio brutal/editorial con maquetas dinámicas, animaciones GSAP y enfoque performance sin framework.',
      },
      streetwear: {
        title: 'E-commerce - Streetwear',
        desc: 'E-commerce brutalista con routing en cliente, transiciones, carrito y checkout demo.',
      },
      museo: {
        title: 'Institucional - Museo Egipcio',
        desc: 'Demo inmersiva con páginas institucionales, entradas, tienda, i18n y animación avanzada.',
      },
      spotify: {
        title: 'Clon de interfaz - Spotify',
        desc: 'Clon de la UI de Spotify con stack clásico, estructura front y look.',
      },
      levele: {
        title: 'Hostelería - Le Vele',
        desc: 'App full stack con landing animada, reservas, admin y API serverless.',
      },
      caffestella: {
        title: 'Gastronomía - Paolo Griffa, Caffè Nazionale',
        desc: 'Sitio multipágina para el Caffè Nazionale de Paolo Griffa (Stella) con SPA, GSAP, Lenis y diseño responsive.',
      },
      ilgusto: {
        title: 'Gastronomía - Il Gusto',
        desc: 'Sitio estático para pizzería al corte: estilo diner, mobile-first, CTAs a Deliveroo y WhatsApp, sin frameworks pesados.',
      },
    },
    modal: {
      close: 'CERRAR [X]',
      visit: 'IR AL SITIO ↗',
      imgAlt: 'Vista del proyecto',
      titlePlaceholder: 'TÍTULO',
      descPlaceholder: 'Descripción.',
    },
    marquee: {
      line: 'DISPONIBLE PARA NUEVOS PROYECTOS -',
    },
    footer: {
      scrivimi: 'ESCRÍBEME',
      cta: 'Trabajemos juntos.',
      hintCoarse: 'p.s. toca o mantén pulsado',
      hintFine: 'p.s. pasa el cursor',
      selfDestruct: 'ESO LO ARREGLA UN COLEGA, ¿NO?',
      selfDestructDone: 'VALE, ENTENDIDO.',
      selfDestructAria: 'Broma: todo cae (demo)',
      motto: 'Hecho con una cantidad absurda de café.',
    },
    easter: {
      imageAlt: 'Retrato',
    },
  },
}

/**
 * @param {Lang} lang
 * @param {string} path dot path e.g. "hero.lines"
 */
export function translate(lang, path) {
  const parts = path.split('.')
  const fallback = STRINGS.it
  let v = /** @type {any} */ (STRINGS[lang] || fallback)
  for (const p of parts) {
    v = v?.[p]
  }
  if (v === undefined) {
    v = fallback
    for (const p of parts) {
      v = v?.[p]
    }
  }
  if (v === undefined) {
    return path
  }
  if (Array.isArray(v) && v.length) {
    return v.map(String)
  }
  return String(v)
}

/**
 * @param {Lang} lang
 * @param {string} path
 * @returns {string[]|string}
 */
export function translateLines(lang, path) {
  const parts = path.split('.')
  const fallback = STRINGS.it
  let v = /** @type {any} */ (STRINGS[lang] || fallback)
  for (const p of parts) {
    v = v?.[p]
  }
  if (v === undefined) {
    v = fallback
    for (const p of parts) {
      v = v?.[p]
    }
  }
  if (Array.isArray(v)) {
    return v
  }
  if (v !== undefined) {
    return [String(v)]
  }
  return []
}

export { STRINGS, ORDER as LANGUAGE_ORDER }
