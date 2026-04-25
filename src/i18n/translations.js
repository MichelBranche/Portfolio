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
      hintNudge: 'Scegli la lingua che preferisci.',
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
    services: {
      header: 'Servizi',
      lead: 'Ti aiuto a trasformare un’idea in un sito che funziona davvero.',
      website: {
        title: 'Siti Web Su Misura',
        desc: 'Landing page e siti istituzionali veloci, responsive e orientati ai risultati.',
      },
      ecommerce: {
        title: 'E-commerce',
        desc: 'Store moderni con UX chiara, checkout efficace e attenzione alla conversione.',
      },
      uiux: {
        title: 'UI/UX Design',
        desc: 'Interfacce pulite e intuitive, progettate per essere belle e facili da usare.',
      },
      performance: {
        title: 'Performance & Motion',
        desc: 'Ottimizzazione caricamenti e micro-animazioni per un’esperienza premium.',
      },
      maintenance: {
        title: 'Supporto & Aggiornamenti',
        desc: 'Manutenzione continua, miglioramenti iterativi e assistenza post-lancio.',
      },
      seo: {
        title: 'SEO Tecnica Base',
        desc: 'Struttura corretta, metadati e basi solide per una migliore visibilita online.',
      },
    },
    packages: {
      header: 'Pacchetti',
      lead: 'Offerte chiare, flessibili e pensate per obiettivi reali.',
      featured: 'Core offer',
      selected: 'Selezionato',
      idealLabel: 'Ideale per',
      includesLabel: 'Include',
      launch: {
        name: 'Launch',
        range: '500€ - 900€',
        ideal: ['Piccoli business locali', 'Landing page', 'Chi parte da zero'],
        includes: [
          '1 pagina landing',
          'Design moderno su misura',
          'Responsive',
          'SEO base (meta + struttura)',
          'Deploy (es. Vercel)',
        ],
      },
      growth: {
        name: 'Growth',
        range: '1200€ - 2500€',
        ideal: ['Business in espansione', 'Brand che vogliono alzare il livello', 'Core offer'],
        includes: [
          '3-5 pagine',
          'UI premium',
          'Motion base (micro animazioni)',
          'SEO strutturato',
          'Performance optimization',
          'Setup analytics base',
          'Mini strategia (target + contenuti)',
        ],
      },
      authority: {
        name: 'Authority',
        range: '3000€ - 6000€+',
        ideal: ['Ristoranti high-end', 'Brand personali forti', 'Progetti wow'],
        includes: [
          'Design completamente custom',
          'Motion avanzata (GSAP)',
          'UX strategica',
          'Architettura completa',
          'SEO avanzato',
          'Performance top',
          'CMS / integrazioni su richiesta',
        ],
      },
      extras: {
        title: 'Extra (upsell)',
        items: [
          'Manutenzione mensile: 50€ - 150€/mese',
          'SEO avanzato: 300€ - 800€',
          'Copywriting: su richiesta',
          'Landing aggiuntive: 150€ - 400€',
          'Analytics avanzato: 200€ - 500€',
        ],
      },
      positioning: {
        title: 'Posizionamento',
        lines: [
          'Non solo siti web: miglioro percezione e performance online del business.',
          'Approccio orientato a risultato, non al semplice “fare il sito”.',
        ],
      },
      flow: {
        title: 'Come lavoro',
        steps: ['Call gratuita', 'Analisi obiettivi e contesto', 'Proposta personalizzata basata sui pacchetti'],
      },
    },
    visualProduction: {
      kicker: 'Visual production',
      header: 'Contenuti che fanno la differenza.',
      lead: 'Fotografia, video e riprese aeree progettate per valorizzare il tuo brand.',
      heroCaption: 'Immagini che raccontano. Prospettive che valorizzano.',
      heroImageAlt: 'Drone professionale per produzione foto e video',
      services: {
        food: {
          title: 'Fotografia',
          desc: 'Contenuti che fanno percepire qualità.',
          items: ['Food & restaurant', 'E-commerce & product', 'Lifestyle & branding'],
        },
        fashion: {
          title: 'Video',
          desc: 'Video che catturano e convincono.',
          items: ['Video aziendali', 'Promo e social ads', 'Cinematic & storytelling'],
        },
        drone: {
          title: 'Drone',
          desc: 'Prospettive che fanno la differenza.',
          items: ['Riprese aeree', 'Immobili & hospitality', 'Ispezioni e monitoraggi'],
        },
      },
      bundles: {
        kicker: 'Bundle',
        title: 'Sito + contenuti',
        lead: 'Pacchetti pensati per offrirti un risultato completo e coerente.',
        secondaryCta: 'Scopri tutti i pacchetti',
        launchVisual: {
          name: 'Launch + Visual Pack',
          lead: 'A partire da',
          items: ['Sito 3-5 pagine', 'Shooting foto base', '5-10 foto editate', '1 mini video'],
          range: '1.500€',
        },
        premiumExperience: {
          name: 'Premium Brand Experience',
          lead: 'A partire da',
          items: [
            'Sito completo',
            'Direzione artistica',
            'Shooting avanzato',
            'Drone e video cinematico',
          ],
          range: '4.000€',
        },
      },
      cta: 'Richiedi consulenza gratuita',
      values: ['Strategia visiva', 'Qualità premium', 'Impatto reale', 'Processo semplice'],
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
        'Independent full-stack web developer.',
        'Designer & UI/UX specialist.',
        'I build fast, effective websites that convert.',
      ],
      italy: 'ITALY',
      italyTagAria: 'Italy. Tap or hover to interact',
      socialAria: 'Social links',
    },
    language: {
      switchLabel: 'Language',
      chooseAria: 'Choose language',
      hintNudge: 'Choose your preferred language.',
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
    services: {
      header: 'Services',
      lead: 'I help turn your idea into a website that delivers real results.',
      website: {
        title: 'Custom Websites',
        desc: 'Fast, responsive landing pages and business websites built to perform.',
      },
      ecommerce: {
        title: 'E-commerce',
        desc: 'Modern online stores with clear UX, effective checkout, and conversion focus.',
      },
      uiux: {
        title: 'UI/UX Design',
        desc: 'Clean, intuitive interfaces designed to look sharp and feel effortless.',
      },
      performance: {
        title: 'Performance & Motion',
        desc: 'Load-time optimization and refined motion for a premium user experience.',
      },
      maintenance: {
        title: 'Support & Updates',
        desc: 'Ongoing maintenance, iterative improvements, and reliable post-launch support.',
      },
      seo: {
        title: 'Technical SEO Basics',
        desc: 'Solid site structure, metadata, and technical foundations for better visibility.',
      },
    },
    packages: {
      header: 'Packages',
      lead: 'Clear, flexible offers built around real business goals.',
      featured: 'Core offer',
      selected: 'Selected',
      idealLabel: 'Ideal for',
      includesLabel: 'Includes',
      launch: {
        name: 'Launch',
        range: '500€ - 900€',
        ideal: ['Small local businesses', 'Landing pages', 'Starting from scratch'],
        includes: [
          '1 landing page',
          'Modern custom design',
          'Responsive layout',
          'Basic SEO (meta + structure)',
          'Deploy (e.g. Vercel)',
        ],
      },
      growth: {
        name: 'Growth',
        range: '1200€ - 2500€',
        ideal: ['Growing businesses', 'Brands ready to level up', 'Core offer'],
        includes: [
          '3-5 pages',
          'Premium UI',
          'Base motion (micro interactions)',
          'Structured SEO',
          'Performance optimization',
          'Basic analytics setup',
          'Mini strategy (target + content structure)',
        ],
      },
      authority: {
        name: 'Authority',
        range: '3000€ - 6000€+',
        ideal: ['High-end restaurants', 'Strong personal brands', 'Wow projects'],
        includes: [
          'Fully custom design',
          'Advanced motion (GSAP)',
          'Strategic UX',
          'Complete architecture',
          'Advanced SEO',
          'Top-tier performance',
          'CMS / integrations on request',
        ],
      },
      extras: {
        title: 'Extras (upsell)',
        items: [
          'Monthly maintenance: 50€ - 150€/month',
          'Advanced SEO: 300€ - 800€',
          'Copywriting: on request',
          'Additional landing pages: 150€ - 400€',
          'Advanced analytics: 200€ - 500€',
        ],
      },
      positioning: {
        title: 'Positioning',
        lines: [
          'Not just websites: I improve how a business is perceived and performs online.',
          'Outcome-driven approach, not just “building a site”.',
        ],
      },
      flow: {
        title: 'How I work',
        steps: ['Free discovery call', 'Understand goals and context', 'Tailored proposal based on packages'],
      },
    },
    visualProduction: {
      kicker: 'Visual Production',
      header: 'Content that makes the difference.',
      lead: 'Photo, video and aerial production designed to elevate your brand.',
      heroCaption: 'Images that tell stories. Perspectives that add value.',
      heroImageAlt: 'Professional drone for photo and video production',
      services: {
        food: {
          title: 'Photography',
          desc: 'Visuals that communicate premium quality.',
          items: ['Food & restaurant', 'E-commerce & product', 'Lifestyle & branding'],
        },
        fashion: {
          title: 'Video',
          desc: 'Motion content that captures and converts.',
          items: ['Corporate videos', 'Promo & social ads', 'Cinematic storytelling'],
        },
        drone: {
          title: 'Drone',
          desc: 'Aerial perspectives that stand out.',
          items: ['Aerial footage', 'Real estate & hospitality', 'Inspections & monitoring'],
        },
      },
      bundles: {
        kicker: 'Bundle',
        title: 'Website + Content',
        lead: 'Packages designed to deliver a full and consistent result.',
        secondaryCta: 'Explore all packages',
        launchVisual: {
          name: 'Launch + Visual Pack',
          lead: 'Starting from',
          items: ['3-5 page website', 'Base photo shoot', '5-10 edited photos', '1 mini video'],
          range: '1,500€',
        },
        premiumExperience: {
          name: 'Premium Brand Experience',
          lead: 'Starting from',
          items: ['Full website', 'Art direction', 'Advanced shooting', 'Drone and cinematic video'],
          range: '4,000€',
        },
      },
      cta: 'Request a free consultation',
      values: ['Visual strategy', 'Premium quality', 'Real impact', 'Simple process'],
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
      hintNudge: 'Choisissez votre langue préférée.',
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
    services: {
      header: 'Services',
      lead: 'Je vous aide a transformer une idee en site utile et efficace.',
      website: {
        title: 'Sites Web Sur Mesure',
        desc: 'Landing pages et sites vitrine rapides, responsive et orientes resultats.',
      },
      ecommerce: {
        title: 'E-commerce',
        desc: 'Boutiques en ligne modernes avec UX claire et checkout efficace.',
      },
      uiux: {
        title: 'UI/UX Design',
        desc: 'Interfaces claires et intuitives, pensees pour etre belles et simples.',
      },
      performance: {
        title: 'Performance & Motion',
        desc: 'Optimisation des chargements et animations soignes pour une experience premium.',
      },
      maintenance: {
        title: 'Support & Mises a Jour',
        desc: 'Maintenance continue, ameliorations iteratives et support post-lancement.',
      },
      seo: {
        title: 'Bases SEO Techniques',
        desc: 'Structure propre, metadonnees et base technique solide pour etre visible.',
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
      hintNudge: 'Wählen Sie Ihre bevorzugte Sprache.',
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
    services: {
      header: 'Services',
      lead: 'Ich helfe dabei, aus einer Idee eine Website mit echtem Ergebnis zu machen.',
      website: {
        title: 'Individuelle Websites',
        desc: 'Schnelle, responsive Landingpages und Firmenwebsites mit klarem Fokus.',
      },
      ecommerce: {
        title: 'E-Commerce',
        desc: 'Moderne Shops mit klarer UX, sauberem Checkout und Conversion-Fokus.',
      },
      uiux: {
        title: 'UI/UX Design',
        desc: 'Klare, intuitive Interfaces, die gut aussehen und leicht nutzbar sind.',
      },
      performance: {
        title: 'Performance & Motion',
        desc: 'Ladezeit-Optimierung und gezielte Motion fuer ein hochwertiges Erlebnis.',
      },
      maintenance: {
        title: 'Support & Updates',
        desc: 'Kontinuierliche Pflege, iterative Verbesserungen und Betreuung nach Launch.',
      },
      seo: {
        title: 'Technische SEO-Basics',
        desc: 'Saubere Struktur, Metadaten und solide technische Basis fuer Sichtbarkeit.',
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
      hintNudge: 'Elige tu idioma preferido.',
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
    services: {
      header: 'Servicios',
      lead: 'Te ayudo a convertir una idea en una web que funcione de verdad.',
      website: {
        title: 'Sitios Web a Medida',
        desc: 'Landing pages y webs corporativas rapidas, responsive y orientadas a resultados.',
      },
      ecommerce: {
        title: 'E-commerce',
        desc: 'Tiendas modernas con UX clara, checkout eficiente y foco en conversion.',
      },
      uiux: {
        title: 'Diseno UI/UX',
        desc: 'Interfaces limpias e intuitivas, pensadas para verse bien y usarse facil.',
      },
      performance: {
        title: 'Performance & Motion',
        desc: 'Optimizacion de carga y animaciones cuidadas para una experiencia premium.',
      },
      maintenance: {
        title: 'Soporte & Actualizaciones',
        desc: 'Mantenimiento continuo, mejoras iterativas y soporte post-lanzamiento.',
      },
      seo: {
        title: 'SEO Tecnico Base',
        desc: 'Estructura correcta, metadatos y base tecnica solida para ganar visibilidad.',
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
