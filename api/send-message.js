const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

module.exports = async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch (_) {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  const { name = '', email = '', message = '' } = body
  const nameTrim = String(name).trim()
  const emailTrim = String(email).trim()
  const messageTrim = String(message).trim()

  if (!nameTrim || !emailTrim || !messageTrim) {
    return res.status(400).json({ error: 'Name, email and message are required' })
  }

  const errors = []

  // Ora usiamo SOLO Telegram: se non è configurato, return 500 subito
  if (!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID)) {
    return res.status(500).json({
      error: 'Server not configured (telegram)',
      details: [
        'Set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID on Vercel',
      ],
    })
  }

  // Invia messaggio su Telegram
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    const telegramText = [
      '📩 Nuovo messaggio portfolio',
      '',
      `👤 ${nameTrim}`,
      `📧 ${emailTrim}`,
      '',
      messageTrim,
    ].join('\n')

    try {
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
      const resTg = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramText,
          disable_web_page_preview: true,
        }),
      })
      const tgData = await resTg.json()
      if (!tgData.ok) {
        errors.push('Telegram: ' + (tgData.description || resTg.statusText))
      }
    } catch (e) {
      errors.push('Telegram: ' + (e.message || 'send failed'))
    }
  }

  if (errors.length > 0) {
    return res.status(502).json({ error: 'Send failed (telegram)', details: errors })
  }

  return res.status(200).json({ ok: true })
}
