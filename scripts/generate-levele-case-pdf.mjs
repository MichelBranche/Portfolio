/**
 * Genera un PDF della case study Residence Le Vele (layout editoriale, A4 fissi).
 * Uso: node scripts/generate-levele-case-pdf.mjs
 */
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'docs')
const outPdf = path.join(outDir, 'Residence-Le-Vele-Case-Study.pdf')
const outPdfAlt = path.join(outDir, 'Residence-Le-Vele-Case-Study-aggiornato.pdf')
const outHtml = path.join(outDir, 'levele-case-study-print.html')
const assetsDir = path.join(root, 'public', 'case', 'levele')

function fileAsDataUri(filePath) {
  if (!fs.existsSync(filePath)) return null
  const buf = fs.readFileSync(filePath)
  const ext = path.extname(filePath).slice(1).toLowerCase()
  let mime =
    ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream'
  // Alcuni asset sono JPEG con estensione .png
  if (buf[0] === 0xff && buf[1] === 0xd8) mime = 'image/jpeg'
  else if (buf[0] === 0x89 && buf[1] === 0x50) mime = 'image/png'
  return `data:${mime};base64,${buf.toString('base64')}`
}

function asset(name) {
  return fileAsDataUri(path.join(assetsDir, name))
}

const img = {
  after: asset('after.png'),
  before: asset('before-crop.jpg') || asset('before.png'),
  analytics: asset('analytics.png'),
  slope: asset('slope.png'),
  desktop: asset('desktop.png'),
  mobile: asset('mobile.png'),
}

const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <title>Case study — Residence Le Vele</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4; margin: 0; }

    :root {
      --ink: #0a0a0a;
      --muted: #5c5c5c;
      --line: #e4e4e0;
      --paper: #f4f4f1;
      --white: #ffffff;
      --accent: #ff3300;
      --pad-x: 14mm;
      --pad-y: 12mm;
      --footer-h: 10mm;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      color: var(--ink);
      background: #fff;
      font-family: "DM Sans", "Segoe UI", sans-serif;
      font-size: 9pt;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    img { max-width: 100%; height: auto; display: block; }

    .page {
      width: 210mm;
      height: 297mm;
      padding: var(--pad-y) var(--pad-x) calc(var(--pad-y) + var(--footer-h));
      position: relative;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      display: flex;
      flex-direction: column;
    }
    .page:last-child { page-break-after: auto; break-after: auto; }

    .page-body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 5.5mm; }
    .grow { flex: 1 1 auto; min-height: 0; }

    .foot {
      position: absolute;
      left: var(--pad-x);
      right: var(--pad-x);
      bottom: 7mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7pt;
      color: var(--muted);
      border-top: 1px solid var(--line);
      padding-top: 2.5mm;
    }

    .page-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: 3mm;
      border-bottom: 1px solid var(--line);
      flex: 0 0 auto;
    }
    .page-head strong {
      font-size: 7.5pt;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .page-head span { font-size: 7.5pt; color: var(--muted); }

    .sec__label {
      margin: 0 0 2px;
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--accent);
    }
    .sec__title {
      margin: 0 0 4px;
      font-family: "Instrument Serif", Georgia, serif;
      font-size: 16pt;
      font-weight: 400;
      line-height: 1.12;
      letter-spacing: -0.01em;
    }
    .sec__body { margin: 0; color: var(--muted); }

    /* —— Cover —— */
    .page--cover {
      background:
        radial-gradient(120% 80% at 100% 0%, rgba(255,51,0,0.08), transparent 55%),
        linear-gradient(180deg, #f7f7f4 0%, #fff 45%, #fff 100%);
      justify-content: space-between;
      padding-bottom: var(--pad-y);
    }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: 5mm;
      border-bottom: 1px solid var(--line);
    }
    .topbar__brand {
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    .topbar__meta { font-size: 7.5pt; color: var(--muted); }

    .cover-main { padding-top: 10mm; max-width: 155mm; }
    .eyebrow {
      margin: 0 0 5px;
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--accent);
    }
    .brand {
      margin: 0 0 5px;
      font-family: "Instrument Serif", Georgia, serif;
      font-size: 36pt;
      line-height: 0.95;
      letter-spacing: -0.02em;
    }
    .location {
      margin: 0 0 8px;
      font-size: 9.5pt;
      color: var(--muted);
      font-weight: 500;
    }
    .headline {
      margin: 0;
      font-family: "Instrument Serif", Georgia, serif;
      font-size: 15pt;
      line-height: 1.28;
      max-width: 30ch;
    }
    .context {
      margin: 6px 0 0;
      max-width: 50ch;
      font-size: 8.5pt;
      line-height: 1.4;
      color: var(--muted);
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin: 8px 0 0;
      padding: 0;
      list-style: none;
    }
    .tags li {
      padding: 3px 8px;
      border: 1px solid var(--ink);
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .cover-hero {
      margin-top: 8mm;
      border: 1px solid var(--ink);
      overflow: hidden;
      height: 72mm;
      background: #111;
      flex: 0 0 auto;
    }
    .cover-hero img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
    }

    .cover-foot {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 1rem;
      padding-top: 5mm;
      border-top: 1px solid var(--line);
      margin-top: 6mm;
    }
    .cover-foot a {
      color: var(--ink);
      font-weight: 700;
      text-decoration: none;
      border-bottom: 1.5px solid var(--accent);
      padding-bottom: 1px;
      font-size: 9pt;
    }
    .cover-foot span { color: var(--muted); font-size: 8pt; }

    /* —— KPI —— */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border: 1px solid var(--ink);
      flex: 0 0 auto;
    }
    .kpi {
      padding: 5mm 4mm 4.5mm;
      border-right: 1px solid var(--ink);
      background: var(--paper);
      min-height: 22mm;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 3px;
    }
    .kpi:last-child { border-right: 0; }
    .kpi__value {
      font-family: "Instrument Serif", Georgia, serif;
      font-size: 18pt;
      line-height: 1;
      letter-spacing: -0.02em;
    }
    .kpi__label {
      font-size: 6.5pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .note-box {
      padding: 3.5mm 4mm;
      background: var(--paper);
      border-left: 2.5px solid var(--accent);
      font-size: 8.5pt;
      color: var(--muted);
      line-height: 1.4;
    }

    .split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6mm;
      align-items: start;
    }

    .list { margin: 4px 0 0; padding: 0; list-style: none; }
    .list li {
      position: relative;
      padding: 3.5px 0 3.5px 12px;
      border-bottom: 1px solid var(--line);
      font-size: 9pt;
    }
    .list li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 9px;
      width: 5px;
      height: 5px;
      background: var(--accent);
    }

    .checks {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px 8px;
      margin: 5px 0 0;
      padding: 0;
      list-style: none;
    }
    .checks li { font-size: 9pt; font-weight: 600; padding: 2px 0; }
    .checks li::before { content: "✓ "; color: var(--accent); font-weight: 700; }

    .devices {
      display: grid;
      grid-template-columns: 1.45fr 0.7fr;
      gap: 2mm;
      align-items: end;
      justify-items: center;
      padding: 3mm 8mm 0;
      background: var(--paper);
      border: 1px solid var(--line);
      flex: 0 0 auto;
      height: 52mm;
      overflow: hidden;
      position: relative;
      z-index: 0;
    }
    .devices--page2 {
      flex: 1 1 auto;
      height: auto;
      min-height: 58mm;
      max-height: none;
      margin-top: 2mm;
      align-items: stretch;
    }
    .devices--page2 img {
      width: 100%;
      height: 100%;
      max-height: none;
      object-fit: contain;
      object-position: bottom center;
    }
    .devices img {
      width: auto;
      max-width: 100%;
      height: 49mm;
      max-height: 49mm;
      object-fit: contain;
      object-position: bottom center;
    }

    .process {
      margin: 3px 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 2mm;
    }
    .process li {
      border: 1px solid var(--ink);
      padding: 2.5mm 2mm;
      min-height: 0;
      background: #fff;
    }
    .process .n {
      display: block;
      font-size: 6.5pt;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--muted);
      margin-bottom: 2px;
    }
    .process .name {
      font-family: "Instrument Serif", Georgia, serif;
      font-size: 10pt;
      line-height: 1.1;
    }

    .block-compare {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .compare {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 4mm;
      margin-top: 3mm;
      flex: 1 1 auto;
      min-height: 0;
    }
    .frame {
      margin: 0;
      border: 1px solid var(--ink);
      overflow: hidden;
      background: #ecece8;
      min-height: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .frame__media {
      flex: 1 1 auto;
      min-height: 0;
      overflow: hidden;
      position: relative;
      background: #111;
    }
    .frame__media img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      max-width: none;
      object-fit: cover;
      object-position: top center;
    }
    .frame--muted .frame__media {
      background: #f3f3f0;
    }
    .frame--muted .frame__media img {
      object-fit: cover;
      object-position: top left;
      filter: grayscale(0.2) contrast(1.03);
    }
    .frame figcaption {
      flex: 0 0 auto;
      padding: 2mm 3mm;
      border-top: 1px solid var(--line);
      background: #fff;
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .compare-note {
      margin-top: 4mm;
      flex: 0 0 auto;
      max-width: 52ch;
      font-size: 8.5pt;
      line-height: 1.45;
      color: var(--muted);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2.5mm;
    }
    .metric {
      padding: 3.5mm 3mm;
      background: var(--paper);
      border-top: 2px solid var(--ink);
    }
    .metric strong {
      display: block;
      font-family: "Instrument Serif", Georgia, serif;
      font-size: 16pt;
      line-height: 1;
      margin-bottom: 2px;
    }
    .metric span {
      font-size: 6.5pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .shot {
      margin: 0;
      border: 1px solid var(--ink);
      overflow: hidden;
      background: var(--paper);
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .shot img {
      width: 100%;
      flex: 1 1 auto;
      min-height: 0;
      object-fit: contain;
      object-position: top center;
      background: #f0f0ec;
    }
    .shot figcaption {
      flex: 0 0 auto;
      padding: 2.5mm 3mm;
      font-size: 7.5pt;
      color: var(--muted);
      border-top: 1px solid var(--line);
      line-height: 1.35;
    }
    .shot--md { height: 62mm; }
    .shot--lg { height: 78mm; }

    .results {
      background: var(--ink);
      color: #f3f3f0;
      padding: 7mm 6mm;
    }
    .results .sec__label { color: rgba(255,255,255,0.5); }
    .results .sec__title { color: #f3f3f0; margin-bottom: 5mm; }
    .results__line {
      margin: 0;
      font-family: "Instrument Serif", Georgia, serif;
      font-size: 22pt;
      line-height: 1.05;
      letter-spacing: -0.02em;
    }
    .results__note {
      margin: 5mm 0 0;
      color: var(--accent);
      font-size: 10pt;
      font-weight: 700;
    }
    .results__context {
      margin: 3mm 0 0;
      color: rgba(255,255,255,0.68);
      font-size: 8.5pt;
      line-height: 1.4;
      max-width: 48ch;
    }

    .deliverables {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      border-top: 1px solid var(--ink);
      border-left: 1px solid var(--ink);
    }
    .deliverables div {
      padding: 3.2mm 3mm;
      border-right: 1px solid var(--ink);
      border-bottom: 1px solid var(--ink);
      font-size: 8.5pt;
      font-weight: 600;
    }

  </style>
</head>
<body>

  <!-- 1 Cover -->
  <section class="page page--cover">
    <div>
      <div class="topbar">
        <div class="topbar__brand">Michel Branche</div>
        <div class="topbar__meta">Case study · Hospitality</div>
      </div>
      <div class="cover-main">
        <p class="eyebrow">1° mese online · 3–30 luglio</p>
        <h1 class="brand">Residence<br/>Le Vele</h1>
        <p class="location">Stintino, Sardegna</p>
        <p class="headline">Come un nuovo sito ha generato 11.947&nbsp;€ di prenotazioni dirette nel primo mese di messa online, senza Google Ads.</p>
        <p class="context">Dal 01/01/2026 a oggi: 17 prenotazioni dirette totali dal canale “sito”. Di queste, 14 tra il 3 e il 30 luglio.</p>
        <ul class="tags">
          <li>Hospitality</li>
          <li>Web Design</li>
          <li>SEO</li>
          <li>UX</li>
          <li>Performance</li>
        </ul>
      </div>
      ${img.after ? `<div class="cover-hero"><img src="${img.after}" alt="Nuovo sito" /></div>` : ''}
    </div>
    <div class="cover-foot">
      <a href="https://demoleveleresidence.vercel.app/">demoleveleresidence.vercel.app</a>
      <span>Report risultati · canale sito</span>
    </div>
  </section>

  <!-- 2 KPI + Problem/Solution -->
  <section class="page">
    <div class="page-head">
      <strong>Residence Le Vele</strong>
      <span>02 / Risultati &amp; approccio</span>
    </div>
    <div class="page-body">
      <div class="kpi-grid">
        <div class="kpi"><div class="kpi__value">11.947 €</div><div class="kpi__label">Ricavi 3–30 lug</div></div>
        <div class="kpi"><div class="kpi__value">14</div><div class="kpi__label">Prenotazioni 3–30 lug</div></div>
        <div class="kpi"><div class="kpi__value">77</div><div class="kpi__label">Notti vendute</div></div>
        <div class="kpi"><div class="kpi__value">0 €</div><div class="kpi__label">Google Ads</div></div>
      </div>
      <div class="note-box">
        Dal 01/01/2026 a oggi le prenotazioni dirette totali dal canale “sito” sono <strong style="color:var(--ink)">17</strong>:
        <strong style="color:var(--ink)">14</strong> di queste tra il 3 e il 30 luglio, nel primo mese di messa online.
      </div>
      <div class="split">
        <div>
          <p class="sec__label">Il problema</p>
          <h2 class="sec__title">Il vecchio sito non convertiva fiducia.</h2>
          <ul class="list">
            <li>design datato</li>
            <li>poca fiducia</li>
            <li>esperienza mobile poco curata</li>
            <li>scarsa valorizzazione delle camere</li>
            <li>nessuna ottimizzazione SEO</li>
          </ul>
        </div>
        <div>
          <p class="sec__label">La soluzione</p>
          <h2 class="sec__title">Un sito pensato per prenotare.</h2>
          <p class="sec__body">Design, performance e booking diretto nello stesso flusso.</p>
          <ul class="checks">
            <li>Design</li>
            <li>SEO</li>
            <li>Performance</li>
            <li>Responsive</li>
            <li>Booking Engine</li>
            <li>Multilingua</li>
          </ul>
        </div>
      </div>
      ${
        img.desktop || img.mobile
          ? `<div class="devices devices--page2">
              ${img.desktop ? `<img src="${img.desktop}" alt="Desktop" />` : ''}
              ${img.mobile ? `<img src="${img.mobile}" alt="Mobile" />` : ''}
            </div>`
          : ''
      }
    </div>
    <div class="foot"><span>Michel Branche · Web &amp; digital</span><span>2 / 5</span></div>
  </section>

  <!-- 3 Process + Mockup + Before/After -->
  <section class="page">
    <div class="page-head">
      <strong>Residence Le Vele</strong>
      <span>03 / Design &amp; processo</span>
    </div>
    <div class="page-body">
      <div>
        <p class="sec__label">Il processo</p>
        <h2 class="sec__title">Dal discovery al launch.</h2>
        <ol class="process">
          <li><span class="n">01</span><span class="name">Discovery</span></li>
          <li><span class="n">02</span><span class="name">UX</span></li>
          <li><span class="n">03</span><span class="name">UI</span></li>
          <li><span class="n">04</span><span class="name">Dev</span></li>
          <li><span class="n">05</span><span class="name">SEO</span></li>
          <li><span class="n">06</span><span class="name">Launch</span></li>
        </ol>
      </div>
      <div class="block-compare">
        <p class="sec__label">Prima / Dopo</p>
        <h2 class="sec__title">Dal sito datato all’esperienza immersiva.</h2>
        <div class="compare">
          <figure class="frame frame--muted">
            <div class="frame__media">
              ${img.before ? `<img src="${img.before}" alt="Old" />` : ''}
            </div>
            <figcaption>Old · layout rotto</figcaption>
          </figure>
          <figure class="frame">
            <div class="frame__media">
              ${img.after ? `<img src="${img.after}" alt="New" />` : ''}
            </div>
            <figcaption>New website</figcaption>
          </figure>
        </div>
        <p class="compare-note">Il sito precedente non comunicava fiducia né valorizzava le camere. Il redesign parte da un’esperienza immersiva pensata per convertire in prenotazione diretta.</p>
      </div>
    </div>
    <div class="foot"><span>Michel Branche · Web &amp; digital</span><span>3 / 5</span></div>
  </section>

  <!-- 4 Analytics + Results -->
  <section class="page">
    <div class="page-head">
      <strong>Residence Le Vele</strong>
      <span>04 / Traffico &amp; impatto</span>
    </div>
    <div class="page-body">
      <div>
        <p class="sec__label">Analytics</p>
        <h2 class="sec__title">Traffico organico nel primo mese.</h2>
        <div class="metrics" style="margin-top:3mm;">
          <div class="metric"><strong>267</strong><span>Visitatori</span></div>
          <div class="metric"><strong>752</strong><span>Page Views</span></div>
          <div class="metric"><strong>34%</strong><span>Bounce Rate</span></div>
          <div class="metric"><strong>135</strong><span>Da Google</span></div>
        </div>
      </div>
      ${
        img.analytics
          ? `<figure class="shot shot--md"><img src="${img.analytics}" alt="Analytics" /><figcaption>Vercel Analytics — +493% visitatori. Top referrer: Google. /prenota: 100 visitatori.</figcaption></figure>`
          : ''
      }
      <div class="results grow">
        <p class="sec__label">Risultati economici</p>
        <h2 class="sec__title">Nel primo mese (3–30 luglio):</h2>
        <p class="results__line">14 prenotazioni dirette</p>
        <p class="results__line">77 notti</p>
        <p class="results__line">11.947 €</p>
        <p class="results__note">Senza alcuna campagna Google Ads.</p>
        <p class="results__context">Dal 01/01/2026 a oggi: 17 prenotazioni dirette totali dal canale “sito”. Di queste, 14 tra il 3 e il 30 luglio.</p>
      </div>
    </div>
    <div class="foot"><span>Michel Branche · Web &amp; digital</span><span>4 / 5</span></div>
  </section>

  <!-- 5 Slope + Deliverables -->
  <section class="page">
    <div class="page-head">
      <strong>Residence Le Vele</strong>
      <span>05 / Report &amp; deliverable</span>
    </div>
    <div class="page-body">
      <div>
        <p class="sec__label">Report del gestionale</p>
        <h2 class="sec__title">Canale “sito” su Slope.</h2>
      </div>
      ${
        img.slope
          ? `<figure class="shot shot--lg grow"><img src="${img.slope}" alt="Slope" /><figcaption>3–30 luglio: 14 prenotazioni · 77 notti · 11.947 € · 0% commissioni · 0% cancellazioni. YTD 2026: 17 prenotazioni dirette totali dal sito.</figcaption></figure>`
          : ''
      }
      <div>
        <p class="sec__label">Cosa ho realizzato</p>
        <div class="deliverables" style="margin-top:3mm;">
          <div>UX Design</div><div>UI Design</div><div>Frontend</div>
          <div>SEO</div><div>Performance</div><div>Hosting</div>
          <div>Analytics</div><div>Responsive</div><div>Schema.org</div>
          <div>Cookie Consent</div><div>Booking Integration</div><div>Multilingua</div>
        </div>
      </div>
    </div>
    <div class="foot"><span>Michel Branche · Web &amp; digital</span><span>5 / 5</span></div>
  </section>

</body>
</html>`

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(outHtml, html, 'utf8')
console.log('HTML scritto:', outHtml)

const require = createRequire(import.meta.url)

async function loadPuppeteer() {
  try {
    return require('puppeteer')
  } catch {
    console.log('Installazione puppeteer (one-shot)...')
    const { execSync } = await import('node:child_process')
    execSync('npm install --no-save puppeteer', { cwd: root, stdio: 'inherit' })
    return require('puppeteer')
  }
}

async function writePdf(page, target) {
  await page.pdf({
    path: target,
    width: '210mm',
    height: '297mm',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  })
}

const puppeteer = await loadPuppeteer()
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 })
  await page.goto(pathToFileURL(outHtml).href, { waitUntil: 'networkidle0' })
  await page.evaluateHandle('document.fonts.ready')

  let target = outPdf
  try {
    await writePdf(page, target)
  } catch (err) {
    if (err && (err.code === 'EBUSY' || String(err.message).includes('EBUSY'))) {
      target = outPdfAlt
      await writePdf(page, target)
      console.warn('PDF originale bloccato (file aperto). Scritto come:', target)
    } else {
      throw err
    }
  }
  console.log('PDF generato:', target)
} finally {
  await browser.close()
}
