/**
 * Dati portfolio – versione vanilla.
 * Modifica questo file per aggiornare contenuti.
 */

const personal = {
  name: 'Michel Branche',
  title: 'Front-End Developer',
  tagline: 'Crafting modern, responsive interfaces with attention to detail',
  bio: 'Front-End Developer con solide basi in HTML, CSS e JavaScript, orientato allo sviluppo di interfacce moderne e responsive. Forte attenzione a UI/UX, con focus su design coerente, leggibilità e identità visiva. Approccio performance-first: sviluppo leggero, senza dipendenze inutili e ottimizzato per mobile. Esperienza su progetti reali, con attenzione a conversione e utilizzo concreto.',
  email: 'michel.lavoro@gmail.com',
  github: 'https://github.com/MichelBranche',
  linkedin: 'https://www.linkedin.com/in/michel-branche-328501301/',
  discord: 'https://discord.com',
  discordUsername: 'cloroalclero',
  instagram: 'https://www.instagram.com/80_sete_/',
  facebook: 'https://www.facebook.com/michel.branche.56/',
  cvPdfUrl: './assets/Michel-Branche-CV.pdf',
  cvHtmlUrl: './assets/cv.html',
}

const projects = [
  {
    id: 1,
    title: 'Il Gusto',
    description: 'Modern Italian restaurant website featuring elegant design, menu showcase, and reservation system. Built with focus on visual appeal and user experience.',
    image: './assets/gustomok1.png',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
    github: 'https://github.com/MichelBranche/Demo-IlGusto',
    demo: 'https://michelbranche.github.io/ilgusto-demo-diner/',
  },
  {
    id: 2,
    title: 'Osteria La Vache Folle',
    description: 'Authentic French bistro website with rich visual storytelling, menu display, and location information. Emphasizes brand identity and atmosphere.',
    image: 'https://raw.githubusercontent.com/MichelBranche/demosite-osteria-la-vache-folle/main/mockup-1.png',
    tags: ['HTML', 'CSS', 'JavaScript', 'UI/UX'],
    github: 'https://github.com/MichelBranche/demosite-osteria-la-vache-folle',
    demo: 'https://michelbranche.github.io/demosite-osteria-la-vache-folle/',
  },
  {
    id: 3,
    title: 'Netflix Mockup',
    description: 'High-fidelity Netflix interface recreation showcasing streaming service UI patterns, responsive grid layouts, and interactive components.',
    image: './assets/netflixmok1.png',
    tags: ['HTML', 'CSS', 'JavaScript', 'UI Clone'],
    github: 'https://github.com/MichelBranche/Netflix-Mockup',
    demo: 'https://michelbranche.github.io/Netflix-Mockup/',
  },
  {
    id: 4,
    title: 'Taco Star',
    description: 'Vibrant Mexican restaurant website with bold colors, appetizing food imagery, and streamlined ordering interface. Focus on conversion and engagement.',
    image: './assets/tacomok1.png',
    tags: ['HTML', 'CSS', 'JavaScript', 'Performance'],
    github: 'https://github.com/MichelBranche/demo-tacostar',
    demo: null,
  },
  {
    id: 5,
    title: 'polterTV',
    description: 'Interactive retro analog TV experience with channel surfing, progressive glitches, secret channels, and immersive audiovisual effects.',
    image: './assets/poltermok1.png',
    tags: ['JavaScript', 'CSS', 'HTML', 'Creative Coding'],
    github: 'https://github.com/MichelBranche/polterTV',
    demo: 'https://michelbranche.github.io/polterTV/',
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

const contactFormApiUrl = 'https://portfolio-three-ruby-wf4uz6dmu1.vercel.app/api/send-message'
const statsApiUrl = (contactFormApiUrl || '').replace(/\/api\/send-message\/?$/, '') + '/api/stats'

window.PORTFOLIO_DATA = { 
  personal, 
  projects, 
  skills, 
  highlights, 
  contactLinks, 
  categoryGradients, 
  contactFormApiUrl,
  statsApiUrl
}
