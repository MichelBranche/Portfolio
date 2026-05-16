import { Redis as UpstashRedis } from '@upstash/redis'
import { createClient } from 'redis'
import fs from 'node:fs'
import path from 'node:path'

const VISITS_KEY = 'portfolio:visits'
const MAX_VISITS = 10_000
const DATA_FILE = path.join(process.cwd(), 'data', 'analytics.json')

function getUpstash() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return new UpstashRedis({ url, token })
}

const globalForRedis = globalThis

async function getTcpRedis() {
  const url = process.env.REDIS_URL
  if (!url) return null

  if (!globalForRedis.__portfolioRedis?.isOpen) {
    const client = createClient({ url })
    client.on('error', (err) => console.error('Redis TCP', err))
    await client.connect()
    globalForRedis.__portfolioRedis = client
  }

  return globalForRedis.__portfolioRedis
}

function parseVisitPayload(raw) {
  if (!raw) return null
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
  return typeof raw === 'object' ? raw : null
}

async function readFileVisits() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeFileVisits(visits) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(visits.slice(0, MAX_VISITS), null, 2))
}

export function hasRemoteStore() {
  return Boolean(
    getUpstash() ||
      process.env.REDIS_URL ||
      process.env.UPSTASH_REDIS_REST_URL ||
      process.env.KV_REST_API_URL,
  )
}

export function getStoreKind() {
  if (getUpstash()) return 'upstash'
  if (process.env.REDIS_URL) return 'redis'
  return 'file'
}

export async function getVisits() {
  const upstash = getUpstash()
  if (upstash) {
    const visits = await upstash.lrange(VISITS_KEY, 0, MAX_VISITS - 1)
    return Array.isArray(visits) ? visits.map(parseVisitPayload).filter(Boolean) : []
  }

  const tcp = await getTcpRedis().catch(() => null)
  if (tcp) {
    const raw = await tcp.lRange(VISITS_KEY, 0, MAX_VISITS - 1)
    return raw.map(parseVisitPayload).filter(Boolean)
  }

  return readFileVisits()
}

export async function addVisit(visit) {
  const upstash = getUpstash()
  if (upstash) {
    await upstash.lpush(VISITS_KEY, visit)
    await upstash.ltrim(VISITS_KEY, 0, MAX_VISITS - 1)
    return
  }

  const tcp = await getTcpRedis().catch(() => null)
  if (tcp) {
    await tcp.lPush(VISITS_KEY, JSON.stringify(visit))
    await tcp.lTrim(VISITS_KEY, 0, MAX_VISITS - 1)
    return
  }

  const visits = await readFileVisits()
  visits.unshift(visit)
  await writeFileVisits(visits)
}
