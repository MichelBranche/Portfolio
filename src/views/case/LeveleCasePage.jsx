'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FOOTER_SOCIAL } from '../../config/site.js'
import { Chars, PixelImage, Scramble } from '../site/motion.jsx'
import { magnetic, magneticReset, pixelBurst, pixelClear, reduceMotion } from '../site/motion-fx'
import { useSiteUI } from '../site/site-ui.js'
import { formatKpiDisplay, LEVELE_CASE as D } from './leveleData.js'

gsap.registerPlugin(ScrollTrigger)

export default function LeveleCasePage() {
  const { go } = useSiteUI()
  const kpiRef = useRef(null)

  useEffect(() => {
    const previous = document.title
    document.title = `${D.brand} — Case study | Michel Branche`
    return () => {
      document.title = previous
    }
  }, [])

  useLayoutEffect(() => {
    const root = kpiRef.current
    if (!root || reduceMotion()) return undefined
    const ctx = gsap.context(() => {
      root.querySelectorAll('[data-count]').forEach((el) => {
        const kpi = D.kpis[Number(el.dataset.count)]
        const counter = { v: 0 }
        el.textContent = formatKpiDisplay(kpi, 0)
        gsap.to(counter, {
          v: kpi.value,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate: () => {
            el.textContent = formatKpiDisplay(kpi, counter.v)
          },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const back = (event) => {
    event.preventDefault()
    go('/portfolio?vista=case')
  }

  const compare =
    D.assets.before && D.assets.after
      ? [
          { src: D.assets.before, caption: D.beforeAfter.beforeLabel },
          { src: D.assets.after, caption: D.beforeAfter.afterLabel },
        ]
      : null

  return (
    <article className="hb-page hb-cs">
      <div className="hb-switch" data-reveal>
        <a className="hb-cs-back" href="/portfolio?vista=case" onClick={back}>
          ← {D.hero.ctaBack}
        </a>
        <span className="hb-label">\ {D.hero.eyebrow} \</span>
      </div>

      <header className="hb-cs-hero">
        <p className="hb-label" data-reveal>
          \ {D.location} \
        </p>
        <h1 className="hb-cs-title">
          <Chars text="Le Vele" />
        </h1>
        <p className="hb-cs-lead" data-reveal>
          {D.hero.headline}
        </p>
        <p className="hb-tags hb-cs-tags" data-reveal>{`\\ ${D.tags.join(' \\ ')} \\`}</p>
        <a
          className="hb-mail-link"
          href={D.liveUrl}
          target="_blank"
          rel="noreferrer"
          data-reveal
          onPointerMove={magnetic}
          onPointerLeave={magneticReset}
        >
          {D.hero.ctaLive} ↗
        </a>
      </header>

      <div className="hb-cs-media">
        <Media src={D.assets.cover} className="is-cover" />
        <Media src={D.previewImg} href={D.liveUrl} cursor={D.hero.ctaLive} className="is-site" />
      </div>

      <section className="hb-cs-kpis" ref={kpiRef} aria-label="Risultati chiave">
        {D.kpis.map((kpi, index) => (
          <div key={kpi.label} className="hb-cs-kpi" data-reveal>
            <span className="hb-rule" data-line />
            <p className="hb-cs-num" data-count={index}>
              {formatKpiDisplay(kpi)}
            </p>
            <p className="hb-label">\ {kpi.label} \</p>
          </div>
        ))}
      </section>
      {D.bookingContext ? (
        <p className="hb-cs-note" data-reveal>
          {D.bookingContext}
        </p>
      ) : null}

      <ul className="hb-rows hb-cs-rows">
        <Row index={0} title={D.problem.title} lead={D.problem.lead} tags={D.problem.items} />
        <Row index={1} title={D.solution.title} lead={D.solution.lead} tags={D.solution.checklist} />
        <Row index={2} title={D.process.title} steps={D.process.steps} />
      </ul>

      {compare ? (
        <section className="hb-cs-block">
          <p className="hb-label" data-reveal>
            \ {D.beforeAfter.title} \
          </p>
          <div className="hb-cs-compare">
            {compare.map((item) => (
              <figure key={item.caption}>
                <Media src={item.src} />
                <figcaption className="hb-label">\ {item.caption} \</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="hb-cs-block">
        <p className="hb-label" data-reveal>
          \ {D.analytics.title} \
        </p>
        <h2 className="hb-cs-h2" data-reveal>
          {D.analytics.lead}
        </h2>
        <div className="hb-cs-metrics">
          {D.analytics.metrics.map((metric) => (
            <div key={metric.label} className="hb-cs-metric" data-reveal>
              <span className="hb-rule" data-line />
              <p className="hb-cs-num is-small">
                {metric.value}
                {metric.suffix || ''}
              </p>
              <p className="hb-label">\ {metric.label} \</p>
            </div>
          ))}
        </div>
        {D.assets.analytics ? <Media src={D.assets.analytics} className="is-shot" /> : null}
        <p className="hb-cs-note" data-reveal>
          {D.analytics.caption}
        </p>
      </section>

      <section className="hb-cs-results" data-reveal-scope>
        <p className="hb-label" data-reveal>
          \ {D.results.title} \
        </p>
        <p className="hb-cs-results-lead" data-reveal>
          {D.results.lead}
        </p>
        <ul>
          {D.results.lines.map((line) => (
            <li key={line}>
              <Words text={line} />
            </li>
          ))}
        </ul>
        <p className="hb-cs-results-note" data-reveal>
          {D.results.note}
        </p>
      </section>

      <section className="hb-cs-block">
        <p className="hb-label" data-reveal>
          \ {D.slope.title} \
        </p>
        {D.assets.slope ? <Media src={D.assets.slope} className="is-shot" /> : null}
        <p className="hb-cs-note" data-reveal>
          {D.slope.caption}
        </p>
      </section>

      <section className="hb-cs-block">
        <p className="hb-label" data-reveal>
          \ {D.deliverables.title} \
        </p>
        <ul className="hb-cs-chips">
          {D.deliverables.items.map((item) => (
            <li key={item} data-reveal>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {D.testimonial ? (
        <blockquote className="hb-cs-quote" data-reveal>
          <p>“{D.testimonial.quote}”</p>
          <footer className="hb-label">
            \ {D.testimonial.author}
            {D.testimonial.role ? ` · ${D.testimonial.role}` : ''} \
          </footer>
        </blockquote>
      ) : null}

      <section className="hb-cs-cta" data-reveal-scope>
        <h2 className="hb-cs-cta-title">
          <Words text={D.cta.title} />
        </h2>
        <p data-reveal>{D.cta.lead}</p>
        <a
          className="hb-mail-link"
          href={FOOTER_SOCIAL.email || D.contactEmail}
          data-reveal
          onPointerMove={magnetic}
          onPointerLeave={magneticReset}
        >
          {D.cta.button} ↗
        </a>
      </section>
    </article>
  )
}

function Words({ text }) {
  return String(text)
    .split(' ')
    .map((word, index) => (
      <span key={`${index}-${word}`}>
        {index ? ' ' : null}
        <Chars text={word} />
      </span>
    ))
}

function Media({ src, href, cursor, className = '' }) {
  const hover = {
    onPointerEnter: (event) => pixelBurst(event.currentTarget),
    onPointerLeave: (event) => pixelClear(event.currentTarget),
  }
  const media = (
    <span className="hb-shot-media" data-clip>
      <PixelImage src={src} />
    </span>
  )
  if (href) {
    return (
      <a className={`hb-cs-frame ${className}`} href={href} target="_blank" rel="noreferrer" data-cursor={cursor} {...hover}>
        {media}
      </a>
    )
  }
  return (
    <div className={`hb-cs-frame ${className}`} {...hover}>
      {media}
    </div>
  )
}

function Row({ index, title, lead, tags, steps }) {
  const [play, setPlay] = useState(0)
  return (
    <li className="hb-row" data-reveal onPointerEnter={() => setPlay((n) => n + 1)}>
      <span className="hb-rule" data-line />
      <span className="hb-row-index">{String(index + 1).padStart(2, '0')}</span>
      <h2>
        <Scramble text={title} play={play} />
      </h2>
      <div className="hb-row-body">
        {lead ? <p>{lead}</p> : null}
        {tags ? <p className="hb-tags">{`\\ ${tags.join(' \\ ')} \\`}</p> : null}
        {steps ? (
          <ol className="hb-cs-steps">
            {steps.map((step, stepIndex) => (
              <li key={step}>
                <span>{String(stepIndex + 1).padStart(2, '0')}</span>
                {step}
              </li>
            ))}
          </ol>
        ) : null}
      </div>
      <span className="hb-row-arrow" aria-hidden>
        ↗
      </span>
    </li>
  )
}
