'use client'

import { useEffect, useRef } from 'react'
import { FOOTER_SOCIAL, PROJECT_META } from '../../config/site.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { Chars, PixelImage } from '../site/motion.jsx'
import { magnetic, magneticReset, pixelBurst, pixelClear } from '../site/motion-fx'
import { useSiteUI } from '../site/site-ui.js'
import { voltPage } from './voltData.js'

const VOLT = PROJECT_META.find((project) => project.slug === 'volt')
const COVER = VOLT.thumb
const VIDEO = '/projects/volt.mp4'
const TECH_TAGS = `\\ ${VOLT.tech.split(/\s*\/\s*/).join(' \\ ')} \\`

export default function VoltPage() {
  const { go } = useSiteUI()
  const { t, lang } = useLanguage()
  const D = voltPage(lang)
  const betaHref = `${FOOTER_SOCIAL.email}?subject=${encodeURIComponent('VOLT beta')}`

  const back = (event) => {
    event.preventDefault()
    go('/portfolio?vista=case')
  }

  return (
    <article className="hb-page hb-cs">
      <div className="hb-switch" data-reveal>
        <a className="hb-cs-back" href="/portfolio?vista=case" onClick={back}>
          ← {D.back}
        </a>
        <span className="hb-label">\ {D.eyebrow} \</span>
      </div>

      <header className="hb-cs-hero">
        <p className="hb-kind" data-reveal>
          {String(t('site.productKind'))}
        </p>
        <h1 className="hb-cs-title">
          <Chars text="VOLT" wrap />
        </h1>
        <p className="hb-cs-lead" data-reveal>
          {D.headline}
        </p>
        <p className="hb-cs-note" data-reveal>
          {String(t('projects.volt.desc'))}
        </p>
        <p className="hb-tags hb-cs-tags" data-reveal>
          {TECH_TAGS}
        </p>
        <a
          className="hb-mail-link"
          href={betaHref}
          data-reveal
          onPointerMove={magnetic}
          onPointerLeave={magneticReset}
        >
          {D.beta} ↗
        </a>
      </header>

      <div className="hb-cs-media is-single">
        <div
          className="hb-cs-frame is-poster"
          onPointerEnter={(event) => pixelBurst(event.currentTarget)}
          onPointerLeave={(event) => pixelClear(event.currentTarget)}
        >
          <span className="hb-shot-media" data-clip>
            <PixelImage src={COVER} alt={String(t('projects.volt.title'))} />
          </span>
        </div>
      </div>

      <section className="hb-cs-block" aria-label={D.videoTitle}>
        <p className="hb-label" data-reveal>
          \ {D.videoTitle} \
        </p>
        <LazyVideo src={VIDEO} poster={COVER} label={D.videoLabel} />
      </section>

      <section className="hb-cs-block">
        <p className="hb-label" data-reveal>
          \ {D.featuresTitle} \
        </p>
        <ul className="hb-cs-chips">
          {D.features.map((item) => (
            <li key={item} data-reveal>
              {item}
            </li>
          ))}
        </ul>
        <p className="hb-cs-note" data-reveal>
          {D.note}
        </p>
      </section>
    </article>
  )
}

/** Poster stays visible. The file itself waits until the player is near the viewport. */
function LazyVideo({ src, poster, label }) {
  const ref = useRef(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return undefined
    const arm = () => {
      if (video.getAttribute('src')) return
      video.preload = 'none'
      video.src = src
    }
    if (typeof IntersectionObserver !== 'function') {
      arm()
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        arm()
        io.disconnect()
      },
      { rootMargin: '240px 0px' },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [src])

  return (
    <video
      ref={ref}
      className="hb-cs-video"
      controls
      playsInline
      width={1280}
      height={720}
      preload="none"
      poster={poster}
      loading="lazy"
      aria-label={label}
    />
  )
}
