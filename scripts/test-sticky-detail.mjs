import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 120000 })
await page.locator('button').filter({ hasText: /entra|enter/i }).first().click().catch(() => {})
await page.waitForTimeout(8000)

const detail = await page.evaluate(async () => {
  const cards = [...document.querySelectorAll('.services-sticky-card')]
  const section = document.querySelector('#services')
  const maxY = document.documentElement.scrollHeight - window.innerHeight
  const rows = []

  for (let y = section.offsetTop; y <= maxY; y += 40) {
    window.scrollTo(0, y)
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    const states = cards.map((c, i) => {
      const top = c.getBoundingClientRect().top
      const want = parseFloat(getComputedStyle(c).top)
      const stuck = Math.abs(top - want) < 25
      return stuck ? i + 1 : null
    })
    const stuck = states.filter(Boolean)
    if (stuck.length >= 4) {
      rows.push({ y, stuck: stuck.join(','), tops: cards.map((c) => Math.round(c.getBoundingClientRect().top)) })
    }
  }
  return {
    sectionH: section.offsetHeight,
    cardHeights: cards.map((c) => c.offsetHeight),
    cardTops: cards.map((c) => parseFloat(getComputedStyle(c).top)),
    cardMb: cards.map((c) => getComputedStyle(c).marginBottom),
    rows: rows.slice(0, 15).concat(rows.slice(-5)),
  }
})

console.log(JSON.stringify(detail, null, 2))
await browser.close()
