import { chromium } from 'playwright'

async function testConfig(label, cssExtra) {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 120000 })
  await page.locator('button').filter({ hasText: /entra|enter/i }).first().click().catch(() => {})
  await page.waitForTimeout(8000)
  if (cssExtra) await page.addStyleTag({ content: cssExtra })
  const r = await page.evaluate(async () => {
    const cards = [...document.querySelectorAll('.services-sticky-card')]
    const section = document.querySelector('#services')
    const maxY = document.documentElement.scrollHeight - window.innerHeight
    let best = { n: 0, y: 0, h: section.offsetHeight }
    for (let y = section.offsetTop; y <= maxY; y += 15) {
      window.scrollTo(0, y)
      await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)))
      const n = cards.filter(
        (c) => Math.abs(c.getBoundingClientRect().top - parseFloat(getComputedStyle(c).top)) < 30,
      ).length
      if (n > best.n) best = { n, y, h: section.offsetHeight }
    }
    return { ...best, mb0: getComputedService(cards[0]) }
    function getComputedService(c) {
      return getComputedStyle(c).marginBottom
    }
  })
  await browser.close()
  console.log(label, r)
}

const ref5 = `
@media (min-width: 48rem) {
  section.services.services--sticky {
    --sticky-offset: 2.5em;
    --sticky-scroll: 5rem;
    padding-bottom: calc(25vh + var(--sticky-count) * var(--sticky-scroll)) !important;
  }
  .services-sticky-card {
    top: calc(var(--sticky-top-base) + var(--i) * var(--sticky-offset)) !important;
    margin-bottom: calc((var(--sticky-count) - var(--i) - 1) * var(--sticky-scroll)) !important;
  }
}`

const hybrid = `
@media (min-width: 48rem) {
  section.services.services--sticky {
    --sticky-offset: 2.25em;
    --sticky-scroll: 3.75rem;
    padding-bottom: calc(35vh + var(--sticky-count) * var(--sticky-scroll)) !important;
  }
  .services-sticky-card {
    top: calc(var(--sticky-top-base) + var(--i) * var(--sticky-offset)) !important;
    margin-bottom: calc((var(--sticky-count) - var(--i) - 1) * var(--sticky-scroll)) !important;
  }
}`

await testConfig('current', '')
await testConfig('ref5', ref5)
await testConfig('hybrid', hybrid)
