/**
 * API amministrazione progetti: GET per leggere da Redis, POST per salvare.
 * Autenticazione basata sulla variabile d'ambiente ADMIN_PASSWORD
 */

const KEY_PROJECTS = 'portfolio_data:projects'

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
      const data = await redis.get(KEY_PROJECTS)
      if (!data) {
         // Database è vuoto, il frontend saprà di dover caricare data.js come fallback
         return res.status(200).json({ projects: null })
      }
      return res.status(200).json({ projects: typeof data === 'string' ? JSON.parse(data) : data })
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

      // Salva l'array aggiornato dei progetti su Redis
      const jsonStr = JSON.stringify(body.projects)
      await redis.set(KEY_PROJECTS, jsonStr)

      return res.status(200).json({ success: true, message: 'Progetti salvati con successo in Redis.' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Admin API error:', error)
    nodeRedisClient = null
    return res.status(500).json({ error: 'Errore API del server.', details: error.message })
  }
}
