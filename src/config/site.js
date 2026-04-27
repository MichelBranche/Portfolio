/** URL, asset e elenco progetti (single source of truth per App). */
export const FOOTER_SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/michel-branche-328501301/',
  instagram: 'https://www.instagram.com/80_sete_/',
  email: 'mailto:michel.lavoro@gmail.com',
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

const GH = (repo, file) => `https://raw.githubusercontent.com/MichelBranche/${repo}/main/${file}`

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

export const PROJECT_META = [
  {
    slug: 'rubina',
    tech: 'JavaScript / GSAP / CSS',
    link: 'https://rubinastradella.vercel.app/',
    img: GH('photo-portfolio-demo', 'preview.jpg'),
    thumb: GH('photo-portfolio-demo', 'preview.jpg'),
    publishedAt: '2026-03-21',
  },
  {
    slug: 'streetwear',
    tech: 'React / Router / GSAP / Lenis',
    link: 'https://sys-0ff.vercel.app/',
    img: GH('ecommerce-demo1', 'public/assets/mockup.png'),
    thumb: GH('ecommerce-demo1', 'public/assets/mockup.png'),
    publishedAt: '2026-03-29',
  },
  {
    slug: 'museo',
    tech: 'React / Vite / GSAP / Lenis',
    link: 'https://museoegiziotorino.vercel.app/',
    img: GH('Museo-Egizio-Torino-Demo', 'preview.png'),
    thumb: GH('Museo-Egizio-Torino-Demo', 'preview.png'),
    publishedAt: '2026-04-06',
  },
  {
    slug: 'spotify',
    tech: 'HTML / CSS / JavaScript',
    link: 'https://spotify-clone-mbdev-umber.vercel.app/',
    img: GH('Spotify-Clone', 'preview.png'),
    thumb: GH('Spotify-Clone', 'preview.png'),
    publishedAt: '2026-04-13',
  },
  {
    slug: 'levele',
    tech: 'React / Vite / API / Redis',
    link: 'https://demoleveleresidence.vercel.app/',
    img: GH('Demo-LeVeleResidence', 'preview.png'),
    thumb: GH('Demo-LeVeleResidence', 'preview.png'),
    publishedAt: '2026-04-18',
  },
  {
    slug: 'caffestella',
    tech: 'React Router / GSAP / Framer Motion',
    link: 'https://demo-paologriffa.vercel.app/',
    img: GH('demo-paologriffa', 'preview.png'),
    thumb: GH('demo-paologriffa', 'preview.png'),
    publishedAt: '2026-04-20',
  },
  {
    slug: 'ilgusto',
    tech: 'HTML / CSS / JavaScript',
    link: 'https://demo-il-gusto.vercel.app/',
    img: GH('Demo-IlGusto', 'preview-hero.png'),
    thumb: GH('Demo-IlGusto', 'preview-hero.png'),
    publishedAt: '2026-04-22',
  },
]
