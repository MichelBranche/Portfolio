'use client'

import { FOOTER_SOCIAL, PROJECT_META } from '../../config/site.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { Chars, PixelImage } from '../site/motion.jsx'
import { magnetic, magneticReset, pixelBurst, pixelClear } from '../site/motion-fx'
import { ProjectVideo } from '../site/ProjectVideo.jsx'
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
    <article className="hb-page hb-cs hb-volt">
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
        <ProjectVideo src={VIDEO} poster={COVER} label={D.videoLabel} className="hb-cs-video" />
      </section>

      <section className="hb-cs-block" aria-label={D.galleryTitle}>
        <p className="hb-label" data-reveal>
          \ {D.galleryTitle} \
        </p>
        <ul className="hb-volt-shots">
          {D.shots.map((shot) => (
            <li key={shot.id}>
              <figure>
                <img
                  src={shot.src}
                  alt={shot.caption}
                  width={shot.w}
                  height={shot.h}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{shot.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
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

