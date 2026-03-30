/**
 * Dati portfolio – versione vanilla.
 * Contenuti testuali bilingue: usa oggetti { en, it } per titoli e descrizioni.
 */

const personal = {
  name: 'Michel Branche',
  email: 'michel.lavoro@gmail.com',
  github: 'https://github.com/MichelBranche',
  linkedin: 'https://www.linkedin.com/in/michel-branche-328501301/',
  discord: 'https://discord.com',
  discordUsername: 'cloroalclero',
  instagram: 'https://www.instagram.com/80_sete_/',
  facebook: 'https://www.facebook.com/michel.branche.56/',
  cvPdfUrl: './assets/Michel-Branche-CV.pdf',
  cvHtmlUrl: './assets/cv.html',
  i18n: {
    en: {
      title: 'Front-End Developer',
      tagline: 'Crafting modern, responsive interfaces with attention to detail',
      bio:
        'Front-End Developer with strong foundations in HTML, CSS and JavaScript, focused on modern, responsive interfaces. Strong UI/UX sensibility: coherent design, readability and visual identity. Performance-first: lean builds, no unnecessary dependencies, mobile-optimized. Real-world projects with attention to conversion and concrete use.',
    },
    it: {
      title: 'Front-End Developer',
      tagline: 'Interfacce moderne e responsive, cura al dettaglio',
      bio:
        'Front-End Developer con solide basi in HTML, CSS e JavaScript, orientato allo sviluppo di interfacce moderne e responsive. Forte attenzione a UI/UX, con focus su design coerente, leggibilità e identità visiva. Approccio performance-first: sviluppo leggero, senza dipendenze inutili e ottimizzato per mobile. Esperienza su progetti reali, con attenzione a conversione e utilizzo concreto.',
    },
  },
}

const projects = [
  {
    id: 7,
    title: {
      en: '(E-commerce) Sys-0ff // District Store',
      it: '(E-commerce) Sys-0ff // District Store',
    },
    description: {
      en:
        'Brutalist streetwear & underground archives e-commerce platform. High-impact design, GSAP animations, and dynamic routing.',
      it:
        'Piattaforma e-commerce per streetwear underground con design brutalista. Impatto visivo elevato, animazioni GSAP e routing dinamico.',
    },
    image: 'https://raw.githubusercontent.com/MichelBranche/ecommerce-demo1/main/public/assets/mockup.png',
    tags: ['React', 'GSAP', 'E-commerce', 'Brutalism', 'UI/UX'],
    github: 'https://github.com/MichelBranche/ecommerce-demo1',
    demo: 'https://sys-0ff.vercel.app/',
  },
  {
    id: 1,
    title: {
      en: 'Personal portfolio for photographer',
      it: 'Portfolio fotografico personale',
    },
    description: {
      en:
        'Brutalist/editorial photography portfolio: strong visual identity, multi-project galleries, GSAP animations and a performance-first approach without frameworks.',
      it:
        'Portfolio fotografico brutalist/editoriale: identità visiva forte, gallerie multi-progetto, animazioni GSAP e approccio performance-first senza framework.',
    },
    image: 'https://raw.githubusercontent.com/MichelBranche/photo-portfolio-demo/main/preview.jpg',
    tags: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Photography'],
    github: 'https://github.com/MichelBranche/photo-portfolio-demo',
    demo: 'https://rubinastradella.vercel.app/',
  },
  {
    id: 2,
    title: { en: '(Demo) Il Gusto', it: '(Demo) Il Gusto' },
    description: {
      en:
        'Italian restaurant site with brutalist-inspired design, menu showcase and reservation flow. Built for visual impact and a smooth user experience.',
      it:
        'Sito per ristorante italiano con design ispirato al brutalism, menu in evidenza e flusso prenotazioni. Pensato per impatto visivo e buona esperienza utente.',
    },
    image: './assets/gustomok1.png',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
    github: 'https://github.com/MichelBranche/Demo-IlGusto',
    demo: 'https://demo-il-gusto.vercel.app/',
  },
  {
    id: 3,
    title: { en: '(Old) Osteria La Vache Folle', it: '(Old) Osteria La Vache Folle' },
    description: {
      en:
        'French bistro website with visual storytelling, menu and location info. Emphasizes brand identity and atmosphere.',
      it:
        'Sito per bistro francese con storytelling visivo, menu e informazioni sulla location. Enfatizza identità di brand e atmosfera.',
    },
    image: 'https://raw.githubusercontent.com/MichelBranche/demosite-osteria-la-vache-folle/main/mockup-1.png',
    tags: ['HTML', 'CSS', 'JavaScript', 'UI/UX'],
    github: 'https://github.com/MichelBranche/demosite-osteria-la-vache-folle',
    demo: 'https://demosite-osteria-la-vache-folle.vercel.app/',
  },
  {
    id: 4,
    title: { en: '(Test) Netflix Mockup', it: '(Test) Netflix Mockup' },
    description: {
      en:
        'High-fidelity Netflix UI recreation: streaming patterns, responsive grid and interactive components.',
      it:
        'Ricostruzione fedele dell’interfaccia Netflix: pattern da streaming, griglia responsive e componenti interattivi.',
    },
    image: './assets/netflixmok1.png',
    tags: ['HTML', 'CSS', 'JavaScript', 'UI Clone'],
    github: 'https://github.com/MichelBranche/Netflix-Mockup',
    demo: 'https://netflix-mockup-sigma.vercel.app/',
  },
  {
    id: 5,
    title: { en: '(Unfinished) Taco Star', it: '(Unfinished) Taco Star' },
    description: {
      en:
        'Mexican restaurant site with bold colours, appetizing imagery and a streamlined ordering flow. Focus on conversion and engagement.',
      it:
        'Sito per ristorante messicano con colori decisi, immagini appetitose e flusso d’ordine snello. Focus su conversione e coinvolgimento.',
    },
    image: './assets/tacomok1.png',
    tags: ['HTML', 'CSS', 'JavaScript', 'Performance'],
    github: 'https://github.com/MichelBranche/demo-tacostar',
    demo: 'https://demo-tacostar.vercel.app/',
  },
  {
    id: 6,
    title: { en: 'polterTV', it: 'polterTV' },
    description: {
      en:
        'Interactive retro TV: channel surfing, progressive glitches, secret channels and immersive audio-visual effects.',
      it:
        'TV analogica retro interattiva: zapping, glitch progressivi, canali segreti ed effetti audiovisivi immersivi.',
    },
    image: './assets/poltermok1.png',
    tags: ['JavaScript', 'CSS', 'HTML', 'Creative Coding'],
    github: 'https://github.com/MichelBranche/polterTV',
    demo: 'https://polter-tv.vercel.app/',
  },
]

const skills = [
  { name: 'HTML5', category: 'core' },
  { name: 'CSS3', category: 'core' },
  { name: 'JavaScript', category: 'core' },
  { name: 'React', category: 'frameworks' },
  { name: 'Responsive Design', category: 'design' },
  { name: 'UI/UX', category: 'design' },
  { name: 'Performance Optimization', category: 'optimization' },
  { name: 'Git', category: 'tools' },
  { name: 'Canva', category: 'design', cardMod: 'lavender' },
]

const highlights = [
  { title: 'Modern Development', description: 'HTML, CSS, JavaScript expertise', color: 'from-orange-500 to-red-500' },
  { title: 'UI/UX Focus', description: 'Design coerente e identità visiva', color: 'from-teal-500 to-cyan-500' },
  { title: 'Performance-First', description: 'Ottimizzato per mobile', color: 'from-yellow-500 to-orange-500' },
  { title: 'Real Projects', description: 'Attenzione a conversione e utilizzo', color: 'from-purple-500 to-pink-500' },
]

const contactLinks = [
  { label: 'Email', value: personal.email, href: 'mailto:' + personal.email, gradient: 'from-orange-500 to-red-500', icon: 'mail' },
  { label: 'GitHub', value: 'MichelBranche', href: personal.github, gradient: 'from-gray-700 to-gray-900', icon: 'github' },
  { label: 'LinkedIn', value: 'Connect', href: personal.linkedin, gradient: 'from-blue-600 to-blue-800', icon: 'linkedin' },
  { label: 'Discord (cloroalclero)', value: personal.discordUsername, href: personal.discord, gradient: 'from-indigo-500 to-purple-600', icon: 'discord' },
  { label: 'Instagram', value: 'Instagram', href: personal.instagram, gradient: 'from-purple-500 to-pink-500', icon: 'instagram' },
  { label: 'Facebook', value: 'Facebook', href: personal.facebook, gradient: 'from-blue-600 to-blue-800', icon: 'facebook' },
]

const categoryGradients = {
  core: 'from-orange-500 to-red-500',
  frameworks: 'from-blue-500 to-cyan-500',
  design: 'from-purple-500 to-pink-500',
  optimization: 'from-green-500 to-teal-500',
  tools: 'from-yellow-500 to-orange-500',
}

const contactFormApiUrl = '/api/send-message'
const statsApiUrl = '/api/stats'

/** Id progetto mostrato come card larga in basso (sezione “Creative Lab”). Deve essere tra i progetti dopo il primo. */
const bottomFeaturedProjectId = 6

window.PORTFOLIO_DATA = {
  personal,
  projects,
  skills,
  highlights,
  contactLinks,
  categoryGradients,
  contactFormApiUrl,
  statsApiUrl,
  bottomFeaturedProjectId,
}
