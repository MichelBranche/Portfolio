/** URL, asset e elenco progetti (single source of truth per App). */
export const FOOTER_SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/michel-branche-328501301/',
  instagram: 'https://www.instagram.com/80_sete_/',
  email: 'mailto:michel.lavoro@gmail.com',
  phone: 'tel:+393881660117',
  phoneDisplay: '+39 388 166 0117',
  whatsapp: 'https://wa.me/393881660117',
}

export const FOOTER_SOUNDS = {
  linkedin: '/sounds/linkedin.mp3',
  instagram: '/sounds/instagram.mp3',
  email: '/sounds/vine-boom.mp3',
  scrivimi: '/sounds/scrivimi.mp3',
  anvilDrop: '/sounds/anvil-drop.mp3',
  michel: '/sounds/michelexd.mp3',
  branche: '/sounds/mariah-carey-vive-la-france.mp3',
  rizz: '/sounds/rizz-sound-effect.mp3',
}

export const FAVICON_DEFAULT = '/favicon.png'
export const DOC_TITLE_INTERVAL_MS = 3200
export const PRELOADER_AMBIENT = '/sounds/preloader-ambient.mp3'

export const HERO_MP3_TRACKS = [
  { url: 'https://soundcloud.com/deneroofficial/kesha-tik-tok-denero-remix-free-download-1' },
  { url: 'https://soundcloud.com/e1oovdghddfw/crazy-in-love-ft-jay' },
  { url: 'https://soundcloud.com/kemosaberecords/die-young-ke-ha' },
]

export const HERO_MP3_ART = '/favicon.png'

export const FLAIR_CDN = 'https://assets.codepen.io/16327/'

export const HERO_FLAIR_PRELOAD_3D = [
  ['combo', '3D-combo.png'],
  ['cone', '3D-cone.png'],
  ['hoop', '3D-hoop.png'],
  ['keyframe', '3D-keyframe.png'],
  ['semi', '3D-semi.png'],
  ['spiral', '3D-spiral.png'],
  ['squish', '3D-squish.png'],
  ['triangle', '3D-triangle.png'],
  ['tunnel', '3D-tunnel.png'],
  ['wat', '3D-poly.png'],
]

export const HERO_FLAIR_PRELOAD_XP = [
  ['blue-circle', '2D-circles.png'],
  ['green-keyframe', '2D-keyframe.png'],
  ['orange-lightning', '2D-lightning.png'],
  ['orange-star', '2D-star.png'],
  ['purple-flower', '2D-flower.png'],
  ['cone', '3D-cone.png'],
  ['keyframe', '3D-spiral.png'],
  ['spiral', '3D-spiral.png'],
  ['tunnel', '3D-tunnel.png'],
  ['hoop', '3D-hoop.png'],
  ['semi', '3D-semi.png'],
]

/** Ordine di visualizzazione dei gruppi in #work */
export const PROJECT_CATEGORY_ORDER = [
  'hospitality',
  'ecommerce',
  'food',
  'institutional',
  'portfolio',
  'ui',
]

export const PROJECT_META = [
  {
    slug: 'rubina',
    category: 'portfolio',
    tech: 'JavaScript / GSAP / CSS',
    link: 'https://rubinastradella.vercel.app/',
    img: '/projects/rubina-mockup-hero.png',
    imgs: ['/projects/rubina-mockup-hero.png', '/projects/rubina-mockup-sections.png'],
    thumb: '/projects/rubina-cover.png',
    publishedAt: '2026-03-21',
  },
  {
    slug: 'streetwear',
    category: 'ecommerce',
    featured: true,
    tech: 'React / Router / GSAP / Lenis',
    link: 'https://sys-0ff.vercel.app/',
    img: '/projects/streetwear-mockup-hero.png',
    imgs: ['/projects/streetwear-mockup-hero.png', '/projects/streetwear-mockup-sections.png'],
    thumb: '/projects/streetwear-cover.png',
    publishedAt: '2026-03-29',
  },
  {
    slug: 'museo',
    category: 'institutional',
    featured: true,
    tech: 'React / Vite / GSAP / Lenis',
    link: 'https://museoegiziotorino.vercel.app/',
    img: '/projects/museo-mockup-hero.png',
    imgs: ['/projects/museo-mockup-hero.png', '/projects/museo-mockup-sections.png'],
    thumb: '/projects/museo-cover.png',
    publishedAt: '2026-04-06',
  },
  {
    slug: 'spotify',
    category: 'ui',
    tech: 'HTML / CSS / JavaScript',
    link: 'https://spotify-clone-mbdev-umber.vercel.app/',
    img: '/projects/spotify-mockup-hero.png',
    imgs: ['/projects/spotify-mockup-hero.png', '/projects/spotify-mockup-sections.png'],
    thumb: '/projects/spotify-cover.png',
    publishedAt: '2026-04-13',
  },
  {
    slug: 'levele',
    category: 'hospitality',
    featured: true,
    client: true,
    tech: 'React / Vite / API / Redis',
    link: 'https://demoleveleresidence.vercel.app/',
    caseHref: '/work/levele',
    img: '/projects/levele-mockup-hero.png',
    imgs: ['/projects/levele-mockup-hero.png', '/projects/levele-mockup-sections.png'],
    thumb: '/projects/levele-cover.png',
    publishedAt: '2026-04-18',
  },
  {
    slug: 'caffestella',
    category: 'food',
    featured: true,
    tech: 'React Router / GSAP / Framer Motion',
    link: 'https://demo-paologriffa.vercel.app/',
    img: '/projects/caffestella-mockup-hero.png',
    imgs: ['/projects/caffestella-mockup-hero.png', '/projects/caffestella-mockup-sections.png'],
    thumb: '/projects/caffestella-cover.png',
    publishedAt: '2026-04-20',
  },
  {
    slug: 'ilgusto',
    category: 'food',
    tech: 'HTML / CSS / JavaScript',
    link: 'https://demo-il-gusto.vercel.app/',
    img: '/projects/ilgusto-mockup-hero.png',
    imgs: ['/projects/ilgusto-mockup-hero.png', '/projects/ilgusto-mockup-sections.png'],
    thumb: '/projects/ilgusto-cover.png',
    publishedAt: '2025-12-01',
  },
  {
    slug: 'kiosk',
    category: 'food',
    tech: 'React 19 / Router / Framer Motion / Lenis',
    link: 'https://demo-kiosk-two.vercel.app/',
    img: '/projects/kiosk-mockup-hero.png',
    imgs: ['/projects/kiosk-mockup-hero.png', '/projects/kiosk-mockup-sections.png'],
    thumb: '/projects/kiosk-cover.png',
    publishedAt: '2026-05-18',
  },
  {
    slug: 'villamatilde',
    category: 'hospitality',
    featured: true,
    tech: 'React / Vite / GSAP / Lenis / Tailwind',
    link: 'https://demo-sina-villa-matilde.vercel.app/',
    img: '/projects/villamatilde-mockup-hero.png',
    imgs: ['/projects/villamatilde-mockup-hero.png', '/projects/villamatilde-mockup-sections.png'],
    thumb: '/projects/villamatilde-cover.png',
    publishedAt: '2026-07-19',
  },
  {
    slug: 'altura',
    category: 'food',
    featured: true,
    tech: 'React / Vite / GSAP / Lenis / Tailwind',
    link: 'https://demo-vini.vercel.app/',
    img: '/projects/altura-mockup-hero.png',
    imgs: ['/projects/altura-mockup-hero.png', '/projects/altura-mockup-sections.png'],
    thumb: '/projects/altura-cover.png',
    publishedAt: '2026-08-08',
  },
  {
    slug: 'omama',
    category: 'hospitality',
    featured: true,
    tech: 'Next.js / GSAP / Lenis / Tailwind',
    link: 'https://demo-omama.vercel.app/',
    img: '/projects/omama-mockup-hero.png',
    imgs: ['/projects/omama-mockup-hero.png', '/projects/omama-mockup-sections.png'],
    thumb: '/projects/omama-cover.png',
    publishedAt: '2026-08-21',
  },
  {
    slug: 'grauson',
    category: 'hospitality',
    featured: true,
    tech: 'Next.js / GSAP / Lenis / Tailwind',
    link: 'https://hotel-grauson.vercel.app/',
    img: '/projects/grauson-mockup-hero.png',
    imgs: ['/projects/grauson-mockup-hero.png', '/projects/grauson-mockup-sections.png'],
    thumb: '/projects/grauson-cover.png',
    publishedAt: '2026-09-21',
  },
  {
    slug: 'orma',
    category: 'food',
    featured: true,
    tech: 'React / Vite / GSAP / Lenis / Tailwind',
    link: 'https://demo-caff.vercel.app/',
    img: '/projects/orma-mockup-hero.png',
    thumb: '/projects/orma-cover.png',
    imgs: ['/projects/orma-mockup-hero.png', '/projects/orma-mockup-sections.png'],
    publishedAt: '2026-09-27',
  },
]
