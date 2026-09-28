'use client'

import { useState } from 'react'
import { FOOTER_SOCIAL } from '../../config/site.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { asArray } from '../../utils/document.js'
import { Chars, Scramble } from './motion.jsx'
import { magnetic, magneticReset } from './magnetic'

const WEB_KEYS = ['website', 'ecommerce', 'uiux', 'performance', 'maintenance', 'seo']
const VISUAL_KEYS = ['photo', 'copy', 'drone']
const PACKAGE_KEYS = ['launch', 'growth', 'authority']

export function ServiziPage() {
  const { t } = useLanguage()

  const groups = [
    {
      key: 'web',
      label: String(t('site.webChapter')),
      rows: WEB_KEYS.map((key) => ({
        key,
        title: String(t(`services.${key}.title`)),
        desc: String(t(`services.${key}.desc`)),
        tags: asArray(t(`services.${key}.bullets`)),
      })),
    },
    {
      key: 'visual',
      label: String(t('site.visualChapter')),
      rows: VISUAL_KEYS.map((key) => ({
        key,
        title: String(t(`visualSection.services.${key}.title`)),
        desc: String(t(`visualSection.services.${key}.desc`)),
        tags: [String(t(`visualSection.services.${key}.price`))],
      })),
    },
  ]

  const featuredLabel = String(t('packages.featured'))
  const packages = PACKAGE_KEYS.map((key) => ({
    key,
    featured: key === 'growth',
    name: String(t(`packages.${key}.name`)),
    range: String(t(`packages.${key}.range`)),
    ideal: asArray(t(`packages.${key}.ideal`)).filter((item) => item !== featuredLabel),
    includes: asArray(t(`packages.${key}.includes`)),
  }))

  return (
    <article className="hb-page hb-services">
      <header className="hb-chapter">
        <h1>
          <Chars text={String(t('services.header'))} />
        </h1>
        <p data-reveal>{String(t('services.lead'))}</p>
      </header>
      {groups.map((group) => (
        <section key={group.key} className="hb-service-group">
          <p className="hb-label" data-reveal>
            \ {group.label} \
          </p>
          <ul className="hb-rows">
            {group.rows.map((row, index) => (
              <ServiceRow key={row.key} row={row} index={index} />
            ))}
          </ul>
        </section>
      ))}
      <section className="hb-packages" aria-labelledby="hb-packages-title">
        <header className="hb-packages-head">
          <p className="hb-label" data-reveal>
            \ {String(t('packages.header'))} \
          </p>
          <h2 id="hb-packages-title" data-reveal>
            {String(t('packages.lead'))}
          </h2>
        </header>
        <ul className="hb-package-grid">
          {packages.map((pack, index) => (
            <li key={pack.key} className={pack.featured ? 'hb-package is-featured' : 'hb-package'} data-reveal>
              <div className="hb-package-top">
                <span className="hb-package-index">{String(index + 1).padStart(2, '0')}</span>
                {pack.featured ? <span className="hb-package-badge">{featuredLabel}</span> : null}
              </div>
              <h3>{pack.name}</h3>
              <p className="hb-package-price">{pack.range}</p>
              <p className="hb-package-ideal">
                <span>{String(t('packages.idealLabel'))}</span>
                {pack.ideal.join(' · ')}
              </p>
              <p className="hb-package-includes">{String(t('packages.includesLabel'))}</p>
              <ul>
                {pack.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href={FOOTER_SOCIAL.email} onPointerMove={magnetic} onPointerLeave={magneticReset}>
                {String(t('site.writeMe'))} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
      <p className="hb-services-mail">
        <a className="hb-mail-link" href={FOOTER_SOCIAL.email} onPointerMove={magnetic} onPointerLeave={magneticReset}>
          {String(t('site.writeMe'))} ↗
        </a>
      </p>
    </article>
  )
}

function ServiceRow({ row, index }) {
  const [play, setPlay] = useState(0)
  return (
    <li className="hb-row" data-reveal onPointerEnter={() => setPlay((n) => n + 1)}>
      <span className="hb-rule" data-line />
      <span className="hb-row-index">{String(index + 1).padStart(2, '0')}</span>
      <h2>
        <Scramble text={row.title} play={play} />
      </h2>
      <div className="hb-row-body">
        <p>{row.desc}</p>
        <p className="hb-tags">{`\\ ${row.tags.join(' \\ ')} \\`}</p>
      </div>
      <span className="hb-row-arrow" aria-hidden>
        ↗
      </span>
    </li>
  )
}
