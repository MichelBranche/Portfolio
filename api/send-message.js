/**
 * Vercel serverless: riceve il form di contatto, invia email (Resend) e messaggio su Telegram.
 *
 * Variabili d'ambiente (in Vercel → Project → Settings → Environment Variables):
 * - RESEND_API_KEY   (da https://resend.com)
 * - TO_EMAIL         (es. michel.lavoro@gmail.com)
 * - FROM_EMAIL       (es. onboarding@resend.dev per test, o tua email verificata su Resend)
 * - TELEGRAM_BOT_TOKEN (da @BotFather su Telegram)
 * - TELEGRAM_CHAT_ID    (il tuo chat_id, es. ottenuto da @userinfobot)
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const TO_EMAIL = process.env.TO_EMAIL
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
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

  // 1) Invia email con Resend
  if (RESEND_API_KEY && TO_EMAIL) {
    try {
      const resResend = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + RESEND_API_KEY,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [TO_EMAIL],
          reply_to: emailTrim,
          subject: `Portfolio: messaggio da ${nameTrim}`,
          text: `Da: ${nameTrim} <${emailTrim}>\n\n${messageTrim}`,
        }),
      })
      if (!resResend.ok) {
        const errData = await resResend.text()
        errors.push('Email: ' + (errData || resResend.statusText))
      }
    } catch (e) {
      errors.push('Email: ' + (e.message || 'send failed'))
    }
  }

  // 2) Invia messaggio su Telegram
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

  if (errors.length > 0 && !(RESEND_API_KEY && TO_EMAIL) && !(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID)) {
    return res.status(500).json({ error: 'Server not configured', details: errors })
  }

  return res.status(200).json({ ok: true })
}
