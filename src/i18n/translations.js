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
    nav: {
      home: 'Home',
      work: 'Lavori',
      services: 'Servizi',
      about: 'Chi sono',
      packages: 'Pacchetti',
      contact: 'Contatto',
      emailLabel: 'E-mail',
      socialLabel: 'Social',
      menuOpen: 'Apri menu',
      menuClose: 'Chiudi menu',
    },
    servicesSummary: {
      line1: 'Architettura',
      line2Left: 'Sviluppo',
      line2Right: 'Deploy',
      line3a: 'API',
      line3b: 'Frontend',
      line3c: 'Performance',
      line4: 'Motion',
    },
    projects: {
      header: 'Lavori Selezionati',
      subTitle: 'Logica e estetica, insieme',
      lead:
        'Progetti selezionati, curati con attenzione\nper risultati concreti e impatto reale.',
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
      bijou: {
        title: 'Hospitality - Hotel Bijou (Saint-Vincent)',
        desc: 'Demo front-end per hotel in Valle d’Aosta: home multi-sezione, routing SPA, intro loader, Tailwind 4, Framer Motion e GSAP con Lenis per lo scroll fluido.',
      },
    },
    services: {
      header: 'Servizi',
      subTitle: 'Dietro le quinte, oltre lo schermo',
      lead: 'Ti aiuto a trasformare un’idea in un sito che funziona davvero.',
      website: {
        title: 'Siti Web Su Misura',
        desc: 'Landing page e siti istituzionali veloci, responsive e orientati ai risultati.',
        bullets: ['Landing e siti vetrina', 'Design responsive su misura', 'Deploy e messa online'],
      },
      ecommerce: {
        title: 'E-commerce',
        desc: 'Store moderni con UX chiara, checkout efficace e attenzione alla conversione.',
        bullets: ['Catalogo e navigazione chiara', 'Checkout ottimizzato', 'Integrazioni pagamento'],
      },
      uiux: {
        title: 'UI/UX Design',
        desc: 'Interfacce pulite e intuitive, progettate per essere belle e facili da usare.',
        bullets: ['Wireframe e gerarchie visive', 'Design system coerente', 'Prototipi interattivi'],
      },
      performance: {
        title: 'Performance & Motion',
        desc: 'Ottimizzazione caricamenti e micro-animazioni per un’esperienza premium.',
        bullets: ['GSAP e scroll curato', 'Core Web Vitals', 'Motion rispettosa del device'],
      },
      maintenance: {
        title: 'Supporto & Aggiornamenti',
        desc: 'Manutenzione continua, miglioramenti iterativi e assistenza post-lancio.',
        bullets: ['Fix e piccoli miglioramenti', 'Aggiornamenti contenuti', 'Monitoraggio base'],
      },
      seo: {
        title: 'SEO Tecnica Base',
        desc: 'Struttura corretta, metadati e basi solide per una migliore visibilita online.',
        bullets: ['Meta e Open Graph', 'Struttura semantica', 'Sitemap e indicizzazione'],
      },
    },
    about: {
      subTitle: 'Codice con intento, costruito per crescere',
      title: 'Chi sono',
      lead:
        'Sviluppatore web indipendente in Italia.\nProgetto interfacce chiare e performanti\ndalla prima bozza al deploy.',
      body:
        'Mi occupo di siti ed esperienze digitali dove estetica e tecnica vanno insieme: React, animazioni GSAP, scroll fluido con Lenis e attenzione alla conversione.\nOgni progetto è pensato per essere veloce, comprensibile e coerente con il brand.\n\nQuando non sono in deploy:\n— Sperimentazione con UI, motion e layout editoriali\n— Demo e side project per hospitality, food e brand locali\n— Caffè, buona musica e debug con calma',
      imageAlt: 'Michel Branche — ritratto',
    },
    packages: {
      header: 'Pacchetti',
      lead: 'Offerte chiare, flessibili e pensate per obiettivi reali.',
      featured: 'Best Value',
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
        ideal: ['Business in espansione', 'Brand che vogliono alzare il livello', 'Best Value'],
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
    visualSection: {
      titleLines: ['FOTOGRAFIA', '& RIPRESE AEREE.'],
      lead: 'Shooting fotografici e riprese drone per brand, location e attività. Dalla preparazione del set alla consegna dei file finali.',
      cta: 'RICHIEDI UN PREVENTIVO →',
      droneAlt: 'Drone',
      statementLines: ['L’estetica attira.', 'La conversione decide il valore.'],
      servicesKicker: '3 professionisti specializzati',
      servicesIntro: 'Questi servizi sono offerti da 3 professionisti, ciascuno specializzato nel proprio settore di appartenenza, che collaborano stabilmente con me. Io coordino il progetto perché tutto resti coerente.',
      services: {
        photo: {
          title: 'FOTOGRAFIA',
          desc: 'Shooting professionali per prodotti, food ed e-commerce. Immagini curate dalla luce alla post-produzione, pensate per migliorare la percezione del brand e la conversione su ogni canale.',
          price: 'da €150 / €300+',
          details: ['Shooting prodotto', 'Food / e-commerce', 'Post produzione inclusa'],
        },
        copy: {
          title: 'COPYWRITING',
          desc: 'Testi che vendono e parlano la lingua del tuo brand. Naming, claim, microcopy e contenuti per landing, email e social, pensati per generare azione.',
          price: 'da €100 / €400+',
          details: ['Naming e claim', 'Testi sito / landing', 'Email & social copy'],
        },
        drone: {
          title: 'DRONE',
          desc: 'Riprese aeree cinematiche per location, hospitality e brand. Inquadrature stabili, traiettorie pulite e autorizzazioni gestite: file pronti al montaggio, in formato verticale o orizzontale.',
          price: 'da €200 / €500+',
          details: ['Riprese aeree cinematiche', 'Location / hospitality', 'Pilota certificato'],
        },
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
      items: [
        'DISPONIBILE PER NUOVI PROGETTI',
        'MICHEL BRANCHE — WEB DEVELOPER',
        'UI/UX · GSAP · LENIS',
        'DISPONIBILE PER NUOVI PROGETTI',
      ],
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
    nav: {
      home: 'Home',
      work: 'Work',
      services: 'Services',
      about: 'About',
      packages: 'Packages',
      contact: 'Contact',
      emailLabel: 'E-mail',
      socialLabel: 'Social',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
    },
    servicesSummary: {
      line1: 'Architecture',
      line2Left: 'Development',
      line2Right: 'Deploy',
      line3a: 'APIs',
      line3b: 'Frontends',
      line3c: 'Performance',
      line4: 'Motion',
    },
    projects: {
      header: 'Selected work',
      subTitle: 'Logic meets aesthetics',
      lead:
        'Featured projects crafted with care\nto drive real results and impact.',
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
      bijou: {
        title: 'Hospitality - Hotel Bijou (Saint-Vincent)',
        desc: 'Front-end demo for an Aosta Valley hotel: multi-section home, SPA routing, intro loader, Tailwind 4, Framer Motion and GSAP with Lenis smooth scrolling.',
      },
    },
    services: {
      header: 'Services',
      subTitle: 'Behind the scene, beyond the screen',
      lead: 'I help turn your idea into a website that delivers real results.',
      website: {
        title: 'Custom Websites',
        desc: 'Fast, responsive landing pages and business websites built to perform.',
        bullets: ['Landing & showcase sites', 'Tailored responsive design', 'Deploy & go-live'],
      },
      ecommerce: {
        title: 'E-commerce',
        desc: 'Modern online stores with clear UX, effective checkout, and conversion focus.',
        bullets: ['Clear catalog UX', 'Optimized checkout', 'Payment integrations'],
      },
      uiux: {
        title: 'UI/UX Design',
        desc: 'Clean, intuitive interfaces designed to look sharp and feel effortless.',
        bullets: ['Wireframes & visual hierarchy', 'Coherent design system', 'Interactive prototypes'],
      },
      performance: {
        title: 'Performance & Motion',
        desc: 'Load-time optimization and refined motion for a premium user experience.',
        bullets: ['GSAP & scroll craft', 'Core Web Vitals', 'Motion that respects the device'],
      },
      maintenance: {
        title: 'Support & Updates',
        desc: 'Ongoing maintenance, iterative improvements, and reliable post-launch support.',
        bullets: ['Fixes & small improvements', 'Content updates', 'Basic monitoring'],
      },
      seo: {
        title: 'Technical SEO Basics',
        desc: 'Solid site structure, metadata, and technical foundations for better visibility.',
        bullets: ['Meta & Open Graph', 'Semantic structure', 'Sitemap & indexing'],
      },
    },
    about: {
      subTitle: 'Code with purpose, built to scale',
      title: 'About',
      lead:
        'Independent web developer based in Italy.\nI craft clear, high-performance interfaces\nfrom first sketch to deploy.',
      body:
        'I build digital experiences where aesthetics and engineering meet: React, GSAP motion, Lenis smooth scroll, and a sharp eye on conversion.\nEvery project aims to be fast, readable, and true to the brand.\n\nWhen I’m not shipping:\n— UI, motion, and editorial layout experiments\n— Demos and side projects for hospitality, food, and local brands\n— Coffee, good music, and calm debugging',
      imageAlt: 'Michel Branche — portrait',
    },
    packages: {
      header: 'Packages',
      lead: 'Clear, flexible offers built around real business goals.',
      featured: 'Best Value',
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
        ideal: ['Growing businesses', 'Brands ready to level up', 'Best Value'],
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
    visualSection: {
      titleLines: ['PHOTOGRAPHY', '& AERIAL VIDEO.'],
      lead: 'Photo shoots and drone footage for brands, locations and businesses. From set prep to final file delivery.',
      cta: 'REQUEST A QUOTE →',
      droneAlt: 'Drone',
      statementLines: ['Aesthetics attract.', 'Conversion decides the value.'],
      servicesKicker: '3 specialists in their field',
      servicesIntro: 'These services are delivered by 3 professionals, each one a specialist in their own field, who collaborate regularly with me. I coordinate the project to keep everything coherent.',
      services: {
        photo: {
          title: 'PHOTOGRAPHY',
          desc: 'Professional shoots for products, food and e-commerce. Imagery crafted from lighting to post-production, designed to elevate brand perception and conversion on every channel.',
          price: 'from €150 / €300+',
          details: ['Product shoots', 'Food / e-commerce', 'Post-production included'],
        },
        copy: {
          title: 'COPYWRITING',
          desc: 'Copy that sells and sounds like your brand. Naming, claims, microcopy and content for landing pages, email and social, designed to drive action.',
          price: 'from €100 / €400+',
          details: ['Naming and claims', 'Website / landing copy', 'Email & social copy'],
        },
        drone: {
          title: 'DRONE',
          desc: 'Cinematic aerial footage for locations, hospitality and brands. Stable framing, clean paths and permits handled: edit-ready files, vertical or horizontal.',
          price: 'from €200 / €500+',
          details: ['Cinematic aerial footage', 'Location / hospitality', 'Certified pilot'],
        },
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
      items: [
        'AVAILABLE FOR NEW PROJECTS',
        'MICHEL BRANCHE — WEB DEVELOPER',
        'UI/UX · GSAP · LENIS',
        'AVAILABLE FOR NEW PROJECTS',
      ],
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
    nav: {
      home: 'Accueil',
      work: 'Projets',
      services: 'Services',
      about: 'À propos',
      packages: 'Offres',
      contact: 'Contact',
      emailLabel: 'E-mail',
      socialLabel: 'Réseaux',
      menuOpen: 'Ouvrir le menu',
      menuClose: 'Fermer le menu',
    },
    servicesSummary: {
      line1: 'Architecture',
      line2Left: 'Développement',
      line2Right: 'Déploiement',
      line3a: 'API',
      line3b: 'Frontends',
      line3c: 'Performance',
      line4: 'Motion',
    },
    projects: {
      header: 'Projets choisis',
      subTitle: 'Logique et esthétique, réunies',
      lead:
        'Projets sélectionnés, travaillés avec soin\npour des résultats concrets et un vrai impact.',
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
      bijou: {
        title: 'Hospitality - Hotel Bijou (Saint-Vincent)',
        desc: "Démo front-end pour un hôtel en Vallée d'Aoste : accueil multi-sections, routing SPA, loader d'intro, Tailwind 4, Framer Motion et GSAP avec Lenis pour le scroll fluide.",
      },
    },
    services: {
      header: 'Services',
      subTitle: 'En coulisses, au-dela de l’ecran',
      lead: 'Je vous aide a transformer une idee en site utile et efficace.',
      website: {
        title: 'Sites Web Sur Mesure',
        desc: 'Landing pages et sites vitrine rapides, responsive et orientes resultats.',
        bullets: ['Landing et sites vitrine', 'Design responsive sur mesure', 'Deploy et mise en ligne'],
      },
      ecommerce: {
        title: 'E-commerce',
        desc: 'Boutiques en ligne modernes avec UX claire et checkout efficace.',
        bullets: ['Catalogue et navigation claire', 'Checkout optimise', 'Integrations paiement'],
      },
      uiux: {
        title: 'UI/UX Design',
        desc: 'Interfaces claires et intuitives, pensees pour etre belles et simples.',
        bullets: ['Wireframes et hierarchie visuelle', 'Design system coherent', 'Prototypes interactifs'],
      },
      performance: {
        title: 'Performance & Motion',
        desc: 'Optimisation des chargements et animations soignes pour une experience premium.',
        bullets: ['GSAP et scroll soigne', 'Core Web Vitals', 'Motion adaptee au device'],
      },
      maintenance: {
        title: 'Support & Mises a Jour',
        desc: 'Maintenance continue, ameliorations iteratives et support post-lancement.',
        bullets: ['Corrections et petites evolutions', 'Mises a jour contenu', 'Suivi de base'],
      },
      seo: {
        title: 'Bases SEO Techniques',
        desc: 'Structure propre, metadonnees et base technique solide pour etre visible.',
        bullets: ['Meta et Open Graph', 'Structure semantique', 'Sitemap et indexation'],
      },
    },
    about: {
      subTitle: 'Du code avec intention, pense pour evoluer',
      title: 'A propos',
      lead:
        'Developpeur web independant en Italie.\nJe concois des interfaces claires et performantes\nde la premiere maquette au deploy.',
      body:
        'Je cree des experiences digitales ou esthetique et technique se rejoignent : React, motion GSAP, scroll Lenis et attention a la conversion.\nChaque projet vise la vitesse, la clarte et la coherence de marque.\n\nQuand je ne ship pas :\n— Experiences UI, motion et layouts editoriaux\n— Demos et side projects hospitality, food et marques locales\n— Cafe, bonne musique et debug tranquille',
      imageAlt: 'Michel Branche — portrait',
    },
    visualSection: {
      titleLines: ['PHOTOGRAPHIE', '& PRISES DE VUE AÉRIENNES.'],
      lead: 'Shootings photo et prises de vue par drone pour marques, lieux et entreprises. De la préparation du set à la livraison des fichiers finaux.',
      cta: 'DEMANDER UN DEVIS →',
      droneAlt: 'Drone',
      statementLines: ['L’esthétique attire.', 'La conversion décide de la valeur.'],
      servicesKicker: '3 spécialistes de leur domaine',
      servicesIntro: 'Ces services sont assurés par 3 professionnels, chacun spécialiste dans son propre domaine, qui collaborent régulièrement avec moi. Je coordonne le projet pour garder une cohérence d’ensemble.',
      services: {
        photo: {
          title: 'PHOTOGRAPHIE',
          desc: 'Shootings professionnels pour produits, food et e-commerce. Des images soignées, de la lumière à la post-production, pensées pour valoriser la marque et la conversion sur chaque canal.',
          price: 'à partir de 150 € / 300 €+',
          details: ['Shooting produit', 'Food / e-commerce', 'Post-production incluse'],
        },
        copy: {
          title: 'COPYWRITING',
          desc: 'Des textes qui vendent et qui parlent la langue de votre marque. Naming, claims, microcopy et contenus pour landing pages, emails et social, pensés pour générer de l’action.',
          price: 'à partir de 100 € / 400 €+',
          details: ['Naming et claims', 'Textes site / landing', 'Email & social copy'],
        },
        drone: {
          title: 'DRONE',
          desc: 'Prises de vue aériennes cinématographiques pour lieux, hôtellerie et marques. Cadres stables, trajectoires propres et autorisations gérées : fichiers prêts au montage, vertical ou horizontal.',
          price: 'à partir de 200 € / 500 €+',
          details: ['Prises de vue cinématographiques', 'Lieu / hôtellerie', 'Pilote certifié'],
        },
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
      items: [
        'DISPONIBLE POUR NOUVEAUX PROJETS',
        'MICHEL BRANCHE — WEB DEVELOPER',
        'UI/UX · GSAP · LENIS',
        'DISPONIBLE POUR NOUVEAUX PROJETS',
      ],
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
    nav: {
      home: 'Start',
      work: 'Arbeiten',
      services: 'Services',
      about: 'Über mich',
      packages: 'Pakete',
      contact: 'Kontakt',
      emailLabel: 'E-Mail',
      socialLabel: 'Social',
      menuOpen: 'Menü öffnen',
      menuClose: 'Menü schließen',
    },
    servicesSummary: {
      line1: 'Architektur',
      line2Left: 'Entwicklung',
      line2Right: 'Deploy',
      line3a: 'APIs',
      line3b: 'Frontends',
      line3c: 'Performance',
      line4: 'Motion',
    },
    projects: {
      header: 'Ausgewählte Arbeiten',
      subTitle: 'Logik trifft Ästhetik',
      lead:
        'Ausgewählte Projekte mit Sorgfalt umgesetzt\nfür messbare Ergebnisse und Wirkung.',
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
      bijou: {
        title: 'Gastgewerbe - Hotel Bijou (Saint-Vincent)',
        desc: 'Front-end-Demo für ein Hotel im Aostatal: mehrteilige Startseite, SPA-Routing, Intro-Loader, Tailwind 4, Framer Motion und GSAP mit Lenis für flüssiges Scrollen.',
      },
    },
    services: {
      header: 'Services',
      subTitle: 'Hinter der Kulisse, jenseits des Screens',
      lead: 'Ich helfe dabei, aus einer Idee eine Website mit echtem Ergebnis zu machen.',
      website: {
        title: 'Individuelle Websites',
        desc: 'Schnelle, responsive Landingpages und Firmenwebsites mit klarem Fokus.',
        bullets: ['Landing & Showcase-Sites', 'Responsive Design nach Mass', 'Deploy & Go-live'],
      },
      ecommerce: {
        title: 'E-Commerce',
        desc: 'Moderne Shops mit klarer UX, sauberem Checkout und Conversion-Fokus.',
        bullets: ['Klarer Katalog & UX', 'Optimierter Checkout', 'Payment-Integrationen'],
      },
      uiux: {
        title: 'UI/UX Design',
        desc: 'Klare, intuitive Interfaces, die gut aussehen und leicht nutzbar sind.',
        bullets: ['Wireframes & visuelle Hierarchie', 'Kohärentes Design System', 'Interaktive Prototypen'],
      },
      performance: {
        title: 'Performance & Motion',
        desc: 'Ladezeit-Optimierung und gezielte Motion fuer ein hochwertiges Erlebnis.',
        bullets: ['GSAP & Scroll-Craft', 'Core Web Vitals', 'Motion mit Device-Respekt'],
      },
      maintenance: {
        title: 'Support & Updates',
        desc: 'Kontinuierliche Pflege, iterative Verbesserungen und Betreuung nach Launch.',
        bullets: ['Fixes & kleine Verbesserungen', 'Content-Updates', 'Basis-Monitoring'],
      },
      seo: {
        title: 'Technische SEO-Basics',
        desc: 'Saubere Struktur, Metadaten und solide technische Basis fuer Sichtbarkeit.',
        bullets: ['Meta & Open Graph', 'Semantische Struktur', 'Sitemap & Indexierung'],
      },
    },
    about: {
      subTitle: 'Code mit Absicht, gebaut zum Skalieren',
      title: 'Über mich',
      lead:
        'Selbständiger Webentwickler in Italien.\nIch gestalte klare, performante Interfaces\nvom ersten Entwurf bis zum Deploy.',
      body:
        'Ich baue digitale Erlebnisse, in denen Ästhetik und Technik zusammenpassen: React, GSAP Motion, Lenis Smooth Scroll und Fokus auf Conversion.\nJedes Projekt soll schnell, verständlich und markentreu sein.\n\nWenn ich nicht deploye:\n— UI-, Motion- und Editorial-Experimente\n— Demos und Side Projects für Hospitality, Food und lokale Brands\n— Kaffee, gute Musik und ruhiges Debugging',
      imageAlt: 'Michel Branche — Porträt',
    },
    visualSection: {
      titleLines: ['FOTOGRAFIE', '& LUFTAUFNAHMEN.'],
      lead: 'Foto-Shootings und Drohnenaufnahmen für Marken, Locations und Unternehmen. Vom Set-Aufbau bis zur Lieferung der finalen Dateien.',
      cta: 'ANGEBOT ANFRAGEN →',
      droneAlt: 'Drohne',
      statementLines: ['Ästhetik zieht an.', 'Conversion entscheidet über den Wert.'],
      servicesKicker: '3 Spezialist:innen im eigenen Fach',
      servicesIntro: 'Diese Leistungen werden von 3 Profis erbracht, jede:r Spezialist:in im eigenen Fachgebiet, die regelmäßig mit mir zusammenarbeiten. Ich koordiniere das Projekt, damit alles stimmig bleibt.',
      services: {
        photo: {
          title: 'FOTOGRAFIE',
          desc: 'Professionelle Shootings für Produkte, Food und E-Commerce. Bilder, vom Licht bis zur Postproduktion gepflegt, um Markenwahrnehmung und Conversion auf jedem Kanal zu steigern.',
          price: 'ab 150 € / 300 €+',
          details: ['Produkt-Shootings', 'Food / E-Commerce', 'Postproduktion inklusive'],
        },
        copy: {
          title: 'COPYWRITING',
          desc: 'Texte, die verkaufen und nach Ihrer Marke klingen. Naming, Claims, Microcopy und Inhalte für Landingpages, E-Mail und Social – auf Wirkung ausgelegt.',
          price: 'ab 100 € / 400 €+',
          details: ['Naming und Claims', 'Website- / Landing-Texte', 'E-Mail & Social Copy'],
        },
        drone: {
          title: 'DROHNE',
          desc: 'Cinematische Luftaufnahmen für Locations, Hospitality und Marken. Stabile Bildausschnitte, saubere Flugbahnen und Genehmigungen geregelt: schnittfertige Dateien, vertikal oder horizontal.',
          price: 'ab 200 € / 500 €+',
          details: ['Cinematische Luftaufnahmen', 'Location / Hospitality', 'Zertifizierter Pilot'],
        },
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
      items: [
        'VERFÜGBAR FÜR NEUE PROJEKTE',
        'MICHEL BRANCHE — WEBENTWICKLER',
        'UI/UX · GSAP · LENIS',
        'VERFÜGBAR FÜR NEUE PROJEKTE',
      ],
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
    nav: {
      home: 'Inicio',
      work: 'Trabajos',
      services: 'Servicios',
      about: 'Sobre mí',
      packages: 'Paquetes',
      contact: 'Contacto',
      emailLabel: 'E-mail',
      socialLabel: 'Social',
      menuOpen: 'Abrir menú',
      menuClose: 'Cerrar menú',
    },
    servicesSummary: {
      line1: 'Arquitectura',
      line2Left: 'Desarrollo',
      line2Right: 'Deploy',
      line3a: 'APIs',
      line3b: 'Frontends',
      line3c: 'Rendimiento',
      line4: 'Motion',
    },
    projects: {
      header: 'Trabajos seleccionados',
      subTitle: 'Lógica y estética, juntas',
      lead:
        'Proyectos seleccionados, cuidados al detalle\npara resultados reales e impacto.',
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
      bijou: {
        title: 'Hostelería - Hotel Bijou (Saint-Vincent)',
        desc: 'Demo front-end para un hotel en el Valle de Aosta: home multipágina, routing SPA, loader de entrada, Tailwind 4, Framer Motion y GSAP con Lenis para scroll suave.',
      },
    },
    services: {
      header: 'Servicios',
      subTitle: 'Detras de escena, mas alla de la pantalla',
      lead: 'Te ayudo a convertir una idea en una web que funcione de verdad.',
      website: {
        title: 'Sitios Web a Medida',
        desc: 'Landing pages y webs corporativas rapidas, responsive y orientadas a resultados.',
        bullets: ['Landing y webs escaparate', 'Diseno responsive a medida', 'Deploy y puesta online'],
      },
      ecommerce: {
        title: 'E-commerce',
        desc: 'Tiendas modernas con UX clara, checkout eficiente y foco en conversion.',
        bullets: ['Catalogo y navegacion clara', 'Checkout optimizado', 'Integraciones de pago'],
      },
      uiux: {
        title: 'Diseno UI/UX',
        desc: 'Interfaces limpias e intuitivas, pensadas para verse bien y usarse facil.',
        bullets: ['Wireframes y jerarquia visual', 'Design system coherente', 'Prototipos interactivos'],
      },
      performance: {
        title: 'Performance & Motion',
        desc: 'Optimizacion de carga y animaciones cuidadas para una experiencia premium.',
        bullets: ['GSAP y scroll cuidado', 'Core Web Vitals', 'Motion respetuosa del device'],
      },
      maintenance: {
        title: 'Soporte & Actualizaciones',
        desc: 'Mantenimiento continuo, mejoras iterativas y soporte post-lanzamiento.',
        bullets: ['Fixes y mejoras pequenas', 'Actualizacion de contenidos', 'Monitorizacion basica'],
      },
      seo: {
        title: 'SEO Tecnico Base',
        desc: 'Estructura correcta, metadatos y base tecnica solida para ganar visibilidad.',
        bullets: ['Meta y Open Graph', 'Estructura semantica', 'Sitemap e indexacion'],
      },
    },
    about: {
      subTitle: 'Codigo con proposito, hecho para crecer',
      title: 'Sobre mi',
      lead:
        'Desarrollador web independiente en Italia.\nDiseno interfaces claras y rapidas\ndel primer boceto al deploy.',
      body:
        'Creo experiencias digitales donde estetica y tecnica van juntas: React, motion con GSAP, scroll Lenis y foco en conversion.\nCada proyecto busca velocidad, claridad y coherencia de marca.\n\nCuando no estoy en deploy:\n— Experimentos de UI, motion y layout editorial\n— Demos y side projects para hospitality, food y marcas locales\n— Cafe, buena musica y debug con calma',
      imageAlt: 'Michel Branche — retrato',
    },
    visualSection: {
      titleLines: ['FOTOGRAFÍA', '& TOMAS AÉREAS.'],
      lead: 'Sesiones de fotos y tomas con dron para marcas, ubicaciones y negocios. De la preparación del set a la entrega de los archivos finales.',
      cta: 'SOLICITA PRESUPUESTO →',
      droneAlt: 'Dron',
      statementLines: ['La estética atrae.', 'La conversión decide el valor.'],
      servicesKicker: '3 especialistas en su sector',
      servicesIntro: 'Estos servicios los ofrecen 3 profesionales, cada uno especialista en su propio sector, que colaboran habitualmente conmigo. Yo coordino el proyecto para que todo mantenga coherencia.',
      services: {
        photo: {
          title: 'FOTOGRAFÍA',
          desc: 'Sesiones profesionales para productos, food y e-commerce. Imágenes cuidadas desde la luz hasta la postproducción, pensadas para elevar la percepción de marca y la conversión en cada canal.',
          price: 'desde 150 € / 300 €+',
          details: ['Sesiones de producto', 'Food / e-commerce', 'Postproducción incluida'],
        },
        copy: {
          title: 'COPYWRITING',
          desc: 'Textos que venden y suenan como tu marca. Naming, claims, microcopy y contenido para landings, email y redes sociales, pensados para activar acción.',
          price: 'desde 100 € / 400 €+',
          details: ['Naming y claims', 'Textos web / landing', 'Email & social copy'],
        },
        drone: {
          title: 'DRON',
          desc: 'Tomas aéreas cinematográficas para localizaciones, hospitality y marcas. Encuadres estables, trayectorias limpias y permisos gestionados: archivos listos para montaje, vertical u horizontal.',
          price: 'desde 200 € / 500 €+',
          details: ['Tomas aéreas cinematográficas', 'Localización / hospitality', 'Piloto certificado'],
        },
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
      items: [
        'DISPONIBLE PARA NUEVOS PROYECTOS',
        'MICHEL BRANCHE — DESARROLLADOR WEB',
        'UI/UX · GSAP · LENIS',
        'DISPONIBLE PARA NUEVOS PROYECTOS',
      ],
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
