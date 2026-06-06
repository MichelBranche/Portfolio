import { chromium } from 'playwright'

const configs = [
  {
    name: 'runway6x',
    css: `
@media (min-width: 48rem) {
  section.services.services--sticky {
    --sticky-offset: 2.25em;
    --sticky-scroll: 3rem;
    padding-bottom: clamp(4rem, 8vh, 5rem) !important;
  }
  .services-sticky-card {
    top: calc(var(--sticky-top-base) + var(--i) * var(--sticky-offset)) !important;
    margin-bottom: calc((var(--sticky-count) - var(--i) - 1) * var(--sticky-scroll)) !important;
  }
  .services-sticky-runway { height: calc(var(--sticky-count) * var(--sticky-scroll)); }
}`,
    injectRunway: true,
  },
  {
    name: 'lastMb',
    css: `
@media (min-width: 48rem) {
  section.services.services--sticky {
    --sticky-offset: 2.25em;
    --sticky-scroll: 3rem;
    padding-bottom: clamp(4rem, 10vh, 6rem) !important;
  }
  .services-sticky-card {
    top: calc(var(--sticky-top-base) + var(--i) * var(--sticky-offset)) !important;
    margin-bottom: calc((var(--sticky-count) - var(--i)) * var(--sticky-scroll)) !important;
  }
}`,
  },
  {
    name: 'runway3x',
    css: `
@media (min-width: 48rem) {
  section.services.services--sticky {
    --sticky-offset: 2.25em;
    --sticky-scroll: 3rem;
    padding-bottom: clamp(4rem, 8vh, 5rem) !important;
  }
  .services-sticky-card {
    top: calc(var(--sticky-top-base) + var(--i) * var(--sticky-offset)) !important;
    margin-bottom: calc((var(--sticky-count) - var(--i) - 1) * var(--sticky-scroll)) !important;
  }
  .services-sticky-runway { height: calc(3 * var(--sticky-scroll)); }
}`,
    injectRunway: true,
  },
]

async function measure(page, label) {
  const r = await page.evaluate(async () => {
    const cards = [...document.querySelectorAll('.services-sticky-card')]
    const section = document.querySelector('#services')
    const maxY = document.documentElement.scrollHeight - window.innerHeight
    let best = { n: 0, y: 0 }
    let card6 = null
    for (let y = section.offsetTop; y <= maxY; y += 12) {
      window.scrollTo(0, y)
      await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)))
      const stuckIdx = cards
        .map((c, i) => {
          const top = c.getBoundingClientRect().top
          const want = parseFloat(getComputedStyle(c).top)
          return Math.abs(top - want) < 25 ? i : -1
        })
        .filter((i) => i >= 0)
      if (stuckIdx.length > best.n) best = { n: stuckIdx.length, y, stuck: stuckIdx }
      if (stuckIdx.length === 6) {
        card6 = { y, tops: cards.map((c) => Math.round(c.getBoundingClientRect().top)) }
        break
      }
    }
    const mb0 = getComputedStyle(cards[0]).marginBottom
    return { ...best, card6, sectionH: section.offsetHeight, mb0, maxY }
  })
  console.log(label, r)
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 120000 })
await page.locator('button').filter({ hasText: /entra|enter/i }).first().click().catch(() => {})
await page.waitForTimeout(8000)

await measure(page, 'current')

for (const cfg of configs) {
  await page.evaluate(() => {
    document.querySelector('.services-sticky-runway')?.remove()
    document.getElementById('sticky-test')?.remove()
  })
  if (cfg.injectRunway) {
    await page.evaluate(() => {
      const section = document.querySelector('#services')
      const div = document.createElement('div')
      div.className = 'services-sticky-runway'
      div.setAttribute('aria-hidden', 'true')
      section.appendChild(div)
    })
  }
  await page.addStyleTag({ content: cfg.css, id: 'sticky-test' })
  await page.evaluate(() => window.scrollTo(0, 0))
  await measure(page, cfg.name)
}

await browser.close()
