#!/usr/bin/env node
/**
 * Sincronizza data.js con quanto salvato in Redis tramite l’admin (GET /api/admin-projects).
 * Uso:
 *   node scripts/sync-from-production.js https://tuodominio.vercel.app
 *   set PORTFOLIO_SITE_URL=https://... && node scripts/sync-from-production.js
 *
 * Poi: git add data.js && git commit ...
 * L’endpoint GET è pubblico (stesso dato del sito); per dati sensibili valuta auth sul GET in futuro.
 */

const fs = require('fs')
const path = require('path')

const DEFAULT_CATEGORY_GRADIENTS = {
  core: 'from-orange-500 to-red-500',
  frameworks: 'from-blue-500 to-cyan-500',
  design: 'from-purple-500 to-pink-500',
  optimization: 'from-green-500 to-teal-500',
  tools: 'from-yellow-500 to-orange-500',
}

const CONTACT_FORM_API = '/api/send-message'
const STATS_API = '/api/stats'

function githubUser(u) {
  if (!u) return 'GitHub'
  const m = String(u).match(/github\.com\/([^/?#]+)/)
  return m ? m[1] : 'GitHub'
}

function buildContactLinks(p) {
  if (!p) return []
  return [
    { label: 'Email', value: p.email || '', href: 'mailto:' + (p.email || ''), gradient: 'from-orange-500 to-red-500', icon: 'mail' },
    {
      label: 'GitHub',
      value: githubUser(p.github),
      href: p.github || '#',
      gradient: 'from-gray-700 to-gray-900',
      icon: 'github',
    },
    { label: 'LinkedIn', value: 'Connect', href: p.linkedin || '#', gradient: 'from-blue-600 to-blue-800', icon: 'linkedin' },
    {
      label: p.discordUsername ? 'Discord (' + p.discordUsername + ')' : 'Discord',
      value: p.discordUsername || '',
      href: p.discord || '#',
      gradient: 'from-indigo-500 to-purple-600',
      icon: 'discord',
    },
    { label: 'Instagram', value: 'Instagram', href: p.instagram || '#', gradient: 'from-purple-500 to-pink-500', icon: 'instagram' },
    { label: 'Facebook', value: 'Facebook', href: p.facebook || '#', gradient: 'from-blue-600 to-blue-800', icon: 'facebook' },
  ]
}

function block(name, value) {
  return 'const ' + name + ' = ' + JSON.stringify(value, null, 2) + '\n\n'
}

function buildDataJs(json) {
  const personal = json.personal && typeof json.personal === 'object' ? json.personal : {}
  const projects = Array.isArray(json.projects) ? json.projects : []
  const skills = Array.isArray(json.skills) ? json.skills : []
  const aboutHighlights = Array.isArray(json.aboutHighlights) ? json.aboutHighlights : []
  const bottomFeaturedProjectId =
    json.bottomFeaturedProjectId != null && json.bottomFeaturedProjectId !== ''
      ? Number(json.bottomFeaturedProjectId)
      : 6

  if (!projects.length) {
    console.warn('Attenzione: nessun progetto nella risposta API; data.js potrebbe non essere valido per il sito.')
  }

  const contactLinks = buildContactLinks(personal)

  let out = ''
  out += '/**\n'
  out += ' * Dati portfolio – versione vanilla.\n'
  out += ' * Contenuti testuali bilingue: usa oggetti { en, it } per titoli e descrizioni.\n'
  out += ' * Generato da: scripts/sync-from-production.js\n'
  out += ' */\n\n'
  out += block('personal', personal)
  out += block('projects', projects)
  out += block('skills', skills)
  out += block('aboutHighlights', aboutHighlights)
  out +=
    '/** Fallback legacy (About usa `aboutHighlights` se presente; altrimenti i18n). */\n' +
    'const highlights = []\n\n'
  out += block('contactLinks', contactLinks)
  out += block('categoryGradients', DEFAULT_CATEGORY_GRADIENTS)
  out += "const contactFormApiUrl = '" + CONTACT_FORM_API + "'\n"
  out += "const statsApiUrl = '" + STATS_API + "'\n\n"
  out += '/** Id progetto mostrato come card larga in basso (sezione “Creative Lab”). Deve essere tra i progetti dopo il primo. */\n'
  out += 'const bottomFeaturedProjectId = ' + JSON.stringify(Number.isFinite(bottomFeaturedProjectId) ? bottomFeaturedProjectId : 6) + '\n\n'
  out += 'window.PORTFOLIO_DATA = {\n'
  out += '  personal,\n'
  out += '  projects,\n'
  out += '  skills,\n'
  out += '  highlights,\n'
  out += '  aboutHighlights,\n'
  out += '  contactLinks,\n'
  out += '  categoryGradients,\n'
  out += '  contactFormApiUrl,\n'
  out += '  statsApiUrl,\n'
  out += '  bottomFeaturedProjectId,\n'
  out += '}\n'
  return out
}

function resolveSiteBase() {
  if (process.argv[2]) return process.argv[2]
  if (process.env.PORTFOLIO_SITE_URL) return process.env.PORTFOLIO_SITE_URL
  if (process.env.VERCEL_URL) return 'https://' + process.env.VERCEL_URL
  return ''
}

async function main() {
  const base = resolveSiteBase()
  if (!base) {
    console.error('Uso: node scripts/sync-from-production.js <URL base del sito>')
    console.error('Esempio: node scripts/sync-from-production.js https://portfolio-michelbranche.vercel.app')
    console.error('Oppure: set PORTFOLIO_SITE_URL=https://...')
    process.exit(1)
  }
  const url = new URL('/api/admin-projects', base.replace(/\/$/, ''))
  if (typeof fetch !== 'function') {
    console.error('Serve Node.js 18+ (fetch). Altrimenti usa: npx node@20 scripts/sync-from-production.js ...')
    process.exit(1)
  }
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    console.error('Errore HTTP', res.status, url.href)
    process.exit(1)
  }
  const json = await res.json()
  const outPath = path.join(__dirname, '..', 'data.js')
  fs.writeFileSync(outPath, buildDataJs(json), 'utf8')
  console.log('OK →', outPath)
}

main().catch(function (err) {
  console.error(err)
  process.exit(1)
})
