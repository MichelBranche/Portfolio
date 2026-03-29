/**
 * API amministrazione: progetti + contenuti sito (Redis).
 * GET: progetti + personal, skills, highlights About, bottomFeaturedProjectId
 * POST: salva (login invia solo projects: [] senza toccare il sito)
 */

const KEY_PROJECTS = 'portfolio_data:projects'
const KEY_SITE = 'portfolio_data:site'

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

function noStore(res) {
  res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Surrogate-Control', 'no-store')
  res.setHeader('Vary', '*')
}

let upstashRedisClient = null
let nodeRedisClient = null

async function getUpstashRedis() {
  if (upstashRedisClient) return upstashRedisClient
  if (!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)) return null

  const { Redis } = require('@upstash/redis')
  upstashRedisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
  return upstashRedisClient
}

async function getNodeRedis() {
  if (nodeRedisClient) return nodeRedisClient
  var url = process.env.REDIS_URL || process.env.KV_URL
  if (!url) return null

  var { createClient } = require('redis')
  nodeRedisClient = createClient({ url: url })
  await nodeRedisClient.connect()
  return nodeRedisClient
}

async function loadSite(redis) {
  const raw = await redis.get(KEY_SITE)
  if (!raw) return null
  return typeof raw === 'string' ? JSON.parse(raw) : raw
}

function parseProjects(raw) {
  if (!raw) return null
  const p = typeof raw === 'string' ? JSON.parse(raw) : raw
  if (Array.isArray(p)) return p
  if (p && Array.isArray(p.projects)) return p.projects
  return null
}

module.exports = async function handler(req, res) {
  cors(res)
  noStore(res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  try {
    var redis = await getUpstashRedis()
    if (!redis) redis = await getNodeRedis()

    if (!redis) {
      return res.status(503).json({ error: 'Database non configurato.' })
    }

    if (req.method === 'GET') {
      const rawP = await redis.get(KEY_PROJECTS)
      const site = await loadSite(redis)
      const projects = parseProjects(rawP)
      return res.status(200).json({
        projects: projects,
        personal: site && site.personal ? site.personal : null,
        skills: site && site.skills ? site.skills : null,
        aboutHighlights: site && site.aboutHighlights ? site.aboutHighlights : null,
        bottomFeaturedProjectId:
          site && site.bottomFeaturedProjectId != null ? site.bottomFeaturedProjectId : null,
      })
    }

    if (req.method === 'POST') {
      const authHeader = req.headers.authorization || ''
      const token = authHeader.replace(/^Bearer\s/i, '').trim()
      const adminSecret = process.env.ADMIN_PASSWORD

      if (!adminSecret) {
        return res.status(500).json({ error: 'ADMIN_PASSWORD non configurata nel server.' })
      }

      if (token !== adminSecret) {
        return res.status(401).json({ error: 'Password errata o assente.' })
      }

      const body = req.body || {}
      if (!body.projects || !Array.isArray(body.projects)) {
        return res.status(400).json({ error: 'Payload non valido. Atteso array di projects.' })
      }

      await redis.set(KEY_PROJECTS, JSON.stringify(body.projects))

      const hasSitePayload =
        body.personal !== undefined ||
        body.skills !== undefined ||
        body.aboutHighlights !== undefined ||
        body.bottomFeaturedProjectId !== undefined

      if (hasSitePayload) {
        const existingSite = (await loadSite(redis)) || {}
        const newSite = Object.assign({}, existingSite)
        if (body.personal !== undefined) newSite.personal = body.personal
        if (body.skills !== undefined) newSite.skills = body.skills
        if (body.aboutHighlights !== undefined) newSite.aboutHighlights = body.aboutHighlights
        if (body.bottomFeaturedProjectId !== undefined) newSite.bottomFeaturedProjectId = body.bottomFeaturedProjectId
        await redis.set(KEY_SITE, JSON.stringify(newSite))
      }

      return res.status(200).json({ success: true, message: 'Salvato.' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Admin API error:', error)
    nodeRedisClient = null
    return res.status(500).json({ error: 'Errore API del server.', details: error.message })
  }
}
