'use client'

import { useEffect, useState } from 'react'
import { FOOTER_SOCIAL } from '../../config/site.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { Chars } from './motion.jsx'
import { magnetic, magneticReset } from './motion-fx'

const EMAIL = 'michel.lavoro@gmail.com'

export function ContattiPage() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return undefined
    const id = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(id)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
    } catch {
      window.location.href = FOOTER_SOCIAL.email
    }
  }

  return (
    <article className="hb-page hb-contact">
      <p className="hb-label" data-reveal>
        \ {String(t('site.contatti'))} \
      </p>
      <h1 className="hb-contact-title">
        <Chars text={String(t('footer.cta'))} />
      </h1>
      <a className="hb-contact-mail" href={FOOTER_SOCIAL.email} data-reveal data-cursor={String(t('site.writeMe'))}>
        {[...EMAIL].map((char, index) => (
          <span key={index} style={{ '--i': index }}>
            {char}
          </span>
        ))}
      </a>
      <div className="hb-contact-actions" data-reveal>
        <button
          type="button"
          className={copied ? 'is-done' : undefined}
          onClick={copy}
          onPointerMove={magnetic}
          onPointerLeave={magneticReset}
        >
          {copied ? `✓ ${String(t('site.copied'))}` : String(t('site.copy'))}
        </button>
        <a href={FOOTER_SOCIAL.instagram} target="_blank" rel="noreferrer" onPointerMove={magnetic} onPointerLeave={magneticReset}>
          Instagram ↗
        </a>
        <a href={FOOTER_SOCIAL.linkedin} target="_blank" rel="noreferrer" onPointerMove={magnetic} onPointerLeave={magneticReset}>
          LinkedIn ↗
        </a>
      </div>
      <p className="hb-contact-note" data-reveal>
        {String(t('marquee.line')).replace(/\s*-\s*$/, '')}
      </p>
    </article>
  )
}
