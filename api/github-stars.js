/**
 * GET /api/github-stars?repos=owner/repo,owner/repo2
 * Restituisce { "owner/repo": number, ... } con gli stargazers_count da GitHub.
 * Opzionale: GITHUB_TOKEN in Vercel per limite rate più alto.
 */

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

module.exports = async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  var raw = req.query && req.query.repos
  if (!raw || typeof raw !== 'string') {
    return res.status(400).json({ error: 'Missing repos (comma-separated owner/repo)' })
  }

  var repos = raw
    .split(',')
    .map(function (s) {
      return s.trim()
    })
    .filter(Boolean)
    .slice(0, 24)

  if (!repos.length) return res.status(200).json({})

  var token = process.env.GITHUB_TOKEN || ''
  var headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-michelbranche',
  }
  if (token) headers.Authorization = 'Bearer ' + token

  var out = {}

  await Promise.all(
    repos.map(function (full) {
      var parts = full.split('/')
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        out[full] = null
        return Promise.resolve()
      }
      var owner = parts[0]
      var repo = parts[1]
      var url =
        'https://api.github.com/repos/' +
        encodeURIComponent(owner) +
        '/' +
        encodeURIComponent(repo)
      return fetch(url, { headers: headers })
        .then(function (r) {
          if (!r.ok) {
            out[full] = null
            return
          }
          return r.json().then(function (j) {
            out[full] = typeof j.stargazers_count === 'number' ? j.stargazers_count : null
          })
        })
        .catch(function () {
          out[full] = null
        })
    })
  )

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  return res.status(200).json(out)
}
