import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import PageTransition from '../components/PageTransition'
import { useLanguage } from '../context/LanguageContext'
import { i18nStrings } from '../data/i18n'
import { useMediaQuery } from '../hooks/useMediaQuery'

export default function Agency() {
  const { lang } = useLanguage()
  const t = i18nStrings[lang]
  const isMobile = useMediaQuery('(max-width: 768px)')
  const pageRef = useRef(null)

  // Simple reveal animation (no SplitText = no crash on lang switch)
  useEffect(() => {
    if (!pageRef.current) return
    const els = pageRef.current.querySelectorAll('.ag-reveal')
    gsap.fromTo(els,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', clearProps: 'transform,opacity' }
    )
  }, [lang])

  // ── Mobile ──────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <PageTransition>
        <div key={lang} ref={pageRef} style={{ paddingBottom: '6rem', paddingTop: '3.5rem' }}>

          {/* Hero photo — full width mobile */}
          <div className="ag-reveal" style={{ margin: '0 -2.5rem 3rem', overflow: 'hidden' }}>
            <img
              src="/assets/michel-portrait.jpg"
              alt="Michel Branche"
              style={{ width: '100%', height: '420px', objectFit: 'cover', objectPosition: 'top center', display: 'block', filter: 'grayscale(100%)' }}
            />
          </div>

          <header className="ag-reveal" style={{ marginBottom: '3rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', opacity: 0.45, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{t.agency_kicker}</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 14vw, 5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.85, marginTop: '0.75rem' }}>
              {t.agency_title_a}<br/>
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--text-primary)' }}>{t.agency_title_b}</span>
            </h1>
            <p style={{ marginTop: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.55 }}>
              Michel Branche // {t.agency_subtitle}
            </p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {t.agency_sections.map((section, i) => (
              <div key={section.num} className="ag-reveal" style={{ borderTop: '1px solid var(--text-primary)', paddingTop: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', opacity: 0.4 }}>{section.num}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, textTransform: 'uppercase', margin: '0.75rem 0' }}>{section.title}</h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.7, opacity: 0.65 }}>{section.content}</p>
              </div>
            ))}
          </div>

          <div className="ag-reveal" style={{ marginTop: '5rem', padding: '1.5rem', border: '1px solid var(--c-border)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.4, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span>{t.agency_footer_version}</span>
            <span>{t.agency_footer_infra}</span>
            <span>{t.agency_footer_location}</span>
          </div>
        </div>
      </PageTransition>
    )
  }

  // ── Desktop ─────────────────────────────────────────────────────────────────
  return (
    <PageTransition>
      <div key={lang} ref={pageRef} style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Editorial Header ── */}
        <div className="ag-reveal" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0',
          background: 'var(--c-border)',
          border: '1px solid var(--c-border)',
          marginBottom: 'clamp(3rem, 8vw, 6rem)'
        }}>
          {/* Title block */}
          <div style={{ background: 'var(--bg-primary)', padding: '4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.2em' }}>
              {t.agency_kicker}
            </span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 0.82,
              marginTop: '1.5rem',
              marginBottom: '3rem'
            }}>
              {t.agency_title_a}<br/>
              <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--text-primary)' }}>{t.agency_title_b}</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Michel Branche<br/>{t.agency_subtitle}
            </p>
          </div>

          {/* Portrait — right column, full height */}
          <div style={{ background: 'var(--bg-primary)', overflow: 'hidden', minHeight: '480px' }}>
            <img
              src="/assets/michel-portrait.jpg"
              alt="Michel Branche"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                display: 'block',
                filter: 'grayscale(100%)',
                mixBlendMode: 'luminosity'
              }}
            />
          </div>
        </div>

        {/* ── Modular Content Sections ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '6rem' }}>
          {t.agency_sections.map((section) => (
            <div key={section.num} className="ag-reveal" style={{ borderTop: '2px solid var(--text-primary)', paddingTop: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)', opacity: 0.5 }}>{section.num}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, textTransform: 'uppercase', margin: '1rem 0 1.25rem' }}>{section.title}</h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{section.content}</p>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="ag-reveal" style={{ border: '1px solid var(--c-border)', padding: '2rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          <span>{t.agency_footer_version}</span>
          <span>{t.agency_footer_infra}</span>
          <span>{t.agency_footer_location}</span>
        </div>

      </div>
    </PageTransition>
  )
}
