/**
 * API statistiche portfolio: visite, download CV, messaggi contatto, visite per progetto.
 *
 * GET  /api/stats                        → { visits, cvDownloads, contacts, projectVisits }
 * GET  /api/stats?inc=visit              → incrementa visite sito
 * GET  /api/stats?inc=cv                 → incrementa download CV
 * GET  /api/stats?inc=contact            → incrementa contatti
 * GET  /api/stats?inc=project&projectId=3 → incrementa visite progetto 3 (il client conta al click “Live”, non allo scroll)
 *
 * Supporta 2 configurazioni (a seconda dell'opzione scelta in Vercel Storage):
 * 1) Upstash Redis (tipico): UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 * 2) Redis “connection string”: REDIS_URL (es. RedisLabs)
 */

const KEY_VISITS = 'portfolio_stats:visits'
const KEY_CV = 'portfolio_stats:cvDownloads'
const KEY_CONTACTS = 'portfolio_stats:contacts'
const KEY_PROJECT_VISITS = 'portfolio_stats:project_visits'

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

/** Vercel/CDN e browser non devono cacheare GET: altrimenti ?inc=visit non riesegue e il conteggio resta bloccato. */
function noStore(res) {
  res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Surrogate-Control', 'no-store')
  res.setHeader('Vary', '*')
}

let upstashRedisClient = null
let nodeRedisClient = null

function toInt(v) {
  var n = parseInt(v, 10)
  return Number.isFinite(n) && n > 0 ? n : (n === 0 ? 0 : 0)
}

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

async function hgetallProjectVisits(redis) {
  var raw
  if (typeof redis.hgetall === 'function') raw = await redis.hgetall(KEY_PROJECT_VISITS)
  else if (typeof redis.hGetAll === 'function') raw = await redis.hGetAll(KEY_PROJECT_VISITS)
  else return {}
  var out = {}
  if (raw && typeof raw === 'object') {
    Object.keys(raw).forEach(function (k) {
      out[String(k)] = Math.max(0, toInt(raw[k]))
    })
  }
  return out
}

async function hincrProjectVisit(redis, projectId) {
  var field = String(projectId)
  if (typeof redis.hincrby === 'function') await redis.hincrby(KEY_PROJECT_VISITS, field, 1)
  else if (typeof redis.hIncrBy === 'function') await redis.hIncrBy(KEY_PROJECT_VISITS, field, 1)
}

async function getAll(redis) {
  var res = await Promise.all([
    redis.get(KEY_VISITS),
    redis.get(KEY_CV),
    redis.get(KEY_CONTACTS),
    hgetallProjectVisits(redis),
  ])
  return {
    visits: Math.max(0, toInt(res[0])),
    cvDownloads: Math.max(0, toInt(res[1])),
    contacts: Math.max(0, toInt(res[2])),
    projectVisits: res[3] || {},
  }
}

async function increment(redis, inc, projectId) {
  if (inc === 'visit') await redis.incr(KEY_VISITS)
  else if (inc === 'cv') await redis.incr(KEY_CV)
  else if (inc === 'contact') await redis.incr(KEY_CONTACTS)
  else if (inc === 'project' && projectId != null) await hincrProjectVisit(redis, projectId)
}

module.exports = async function handler(req, res) {
  cors(res)
  noStore(res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  var inc = typeof req.query?.inc === 'string' ? req.query.inc.toLowerCase() : ''
  var rawPid = req.query?.projectId
  var projectId = rawPid != null && rawPid !== '' ? parseInt(String(rawPid), 10) : NaN
  var validProjectId = Number.isFinite(projectId) && projectId > 0 && projectId < 100000

  try {
    var redis = await getUpstashRedis()
    if (!redis) redis = await getNodeRedis()
    if (!redis) {
      return res.status(200).json({
        visits: 0,
        cvDownloads: 0,
        contacts: 0,
        projectVisits: {},
        _message: 'Redis not configured. Set either UPSTASH_REDIS_REST_URL+UPSTASH_REDIS_REST_TOKEN or REDIS_URL.',
      })
    }

    if (inc === 'visit' || inc === 'cv' || inc === 'contact') {
      await increment(redis, inc, null)
    } else if (inc === 'project' && validProjectId) {
      await increment(redis, 'project', projectId)
    }
    var stats = await getAll(redis)
    return res.status(200).json(stats)
  } catch (e) {
    console.error('stats error', e)
    // reset only node client; upstash is stateless
    nodeRedisClient = null
    return res.status(500).json({
      error: 'Stats error',
      visits: 0,
      cvDownloads: 0,
      contacts: 0,
      projectVisits: {},
    })
  }
}
