import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(root, 'public/case/levele/before.png')
const out = path.join(root, 'public/case/levele/before-crop.jpg')

const buf = fs.readFileSync(src)
const dataUri = `data:image/jpeg;base64,${buf.toString('base64')}`

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
// Crop landscape denso: nav rotta + copy + foto camera
await page.setViewport({ width: 960, height: 420, deviceScaleFactor: 2 })
await page.setContent(`<!DOCTYPE html>
<html><head><style>
  html,body{margin:0;background:#f0f0ec;overflow:hidden}
  img{
    width:1024px;height:452px;display:block;
    transform:scale(1.35);
    transform-origin:8% 5%;
    filter:grayscale(0.25) contrast(1.05);
  }
</style></head>
<body><img src="${dataUri}" alt="" /></body></html>`)
await page.waitForSelector('img')
await page.evaluate(async () => {
  const img = document.querySelector('img')
  if (!img.complete) await new Promise((r) => { img.onload = r; img.onerror = r })
})
await page.screenshot({
  path: out,
  type: 'jpeg',
  quality: 92,
  clip: { x: 0, y: 0, width: 960, height: 420 },
})
console.log('written', out, fs.statSync(out).size)
await browser.close()
