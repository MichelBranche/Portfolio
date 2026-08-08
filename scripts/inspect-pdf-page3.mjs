import puppeteer from 'puppeteer'
import path from 'path'
import { pathToFileURL } from 'url'

const html = path.resolve('docs/levele-case-study-print.html')
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 })
await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle0' })
await page.evaluateHandle('document.fonts.ready')
const pages = await page.$$('.page')
await pages[2].screenshot({ path: 'docs/page3-preview.png' })
const overflow = await page.evaluate((el) => {
  const r = el.getBoundingClientRect()
  const body = el.querySelector('.page-body')
  const kids = [...(body?.children || [])].map((c) => {
    const b = c.getBoundingClientRect()
    return {
      cls: c.className || c.tagName,
      h: Math.round(b.height),
      top: Math.round(b.top - r.top),
      bottom: Math.round(b.bottom - r.top),
    }
  })
  return {
    pageH: Math.round(r.height),
    bodyBottom: body ? Math.round(body.getBoundingClientRect().bottom - r.top) : null,
    kids,
  }
}, pages[2])
console.log(JSON.stringify(overflow, null, 2))
await browser.close()
