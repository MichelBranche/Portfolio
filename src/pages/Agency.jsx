import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/PageTransition'
import { useLanguage } from '../context/LanguageContext'
import { i18nStrings } from '../data/i18n'
import { useMediaQuery } from '../hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

export default function Agency() {
  const { lang } = useLanguage()
  const t = i18nStrings[lang]
  const isMobile = useMediaQuery('(max-width: 768px)')
  const pageRef = useRef(null)
  const cvDocs = [
    { id: 'en', label: 'CV English 2026', href: '/assets/cv-eng-2026.pdf' },
    { id: 'it', label: 'CV Italiano 2026', href: '/assets/cv-ita-2026.pdf' },
  ]

  // Simple reveal animation (no SplitText = no crash on lang switch)
  useEffect(() => {
    if (!pageRef.current) return

    const ctx = gsap.context(() => {
      const els = pageRef.current.querySelectorAll('.ag-reveal')
      gsap.fromTo(
        els,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', clearProps: 'transform,opacity' }
      )

      gsap.fromTo(
        '.ag-epicode-card',
        { y: 44, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.ag-epicode-card-wrap',
            start: 'top 84%',
            once: true,
          },
          clearProps: 'transform,opacity',
        }
      )

      // Interactive hover motion for Epicode card.
      const epicodeCards = gsap.utils.toArray('.ag-epicode-card')
      epicodeCards.forEach((card) => {
        const logo = card.querySelector('.ag-epicode-logo')
        const onEnter = () => {
          gsap.to(card, {
            y: -6,
            scale: 1.01,
            borderColor: 'rgba(26,25,23,0.35)',
            boxShadow: '0 14px 28px rgba(0,0,0,0.08)',
            duration: 0.28,
            ease: 'power2.out',
          })
          if (logo) {
            gsap.to(logo, { x: 10, duration: 0.32, ease: 'power2.out' })
          }
        }
        const onLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            borderColor: 'var(--c-border)',
            boxShadow: '0 0 0 rgba(0,0,0,0)',
            duration: 0.28,
            ease: 'power2.out',
          })
          if (logo) {
            gsap.to(logo, { x: 0, duration: 0.32, ease: 'power2.out' })
          }
        }

        card.addEventListener('mouseenter', onEnter)
        card.addEventListener('mouseleave', onLeave)
        card.addEventListener('focusin', onEnter)
        card.addEventListener('focusout', onLeave)
      })
    }, pageRef)

    return () => ctx.revert()
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
            <p
              style={{
                marginTop: '1rem',
                maxWidth: '42ch',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                lineHeight: 1.65,
                opacity: 0.72,
              }}
            >
              {lang === 'it'
                ? 'Front-end developer freelance (2025-oggi), con esperienza nel settore turismo/reception (2019-2023). Background in Art High School e formazione in corso in Epicode (M1-M3). Focus su UI design, componenti riusabili, basi REST/JSON e uso pratico di AI tools nei workflow di sviluppo.'
                : 'Freelance front-end developer (2025-present), with prior experience in tourism and reception (2019-2023). Background in Art High School and current Epicode training (M1-M3). Focused on UI design, reusable components, REST/JSON fundamentals, and practical AI-tool integration in development workflows.'}
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

          <section className="ag-reveal" style={{ marginTop: '4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', opacity: 0.45, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {lang === 'it' ? '004 // Certificati' : '004 // Certificates'}
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 9vw, 2.6rem)', margin: '0.75rem 0 1.6rem', textTransform: 'uppercase' }}>
              {lang === 'it' ? 'Formazione e certificazioni' : 'Training & certifications'}
            </h3>
            <div className="ag-epicode-card-wrap">
              <Link
                to="/agency/epicode"
                className="ag-epicode-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1.1rem',
                  border: '1px solid var(--c-border)',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  background: 'color-mix(in srgb, var(--bg-surface) 22%, transparent)',
                }}
              >
                <img
                  src="/assets/epicode-logo.png"
                  alt="Epicode"
                  className="ag-epicode-logo"
                  style={{ width: '100%', maxWidth: '340px', height: 'auto', display: 'block' }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.75 }}>
                  {lang === 'it' ? 'Apri percorso Epicode ↗' : 'Open Epicode journey ↗'}
                </span>
              </Link>
            </div>
          </section>

          <section className="ag-reveal" style={{ marginTop: '2.2rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', opacity: 0.45, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {lang === 'it' ? '005 // Curriculum Vitae' : '005 // Curriculum Vitae'}
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 8vw, 2.3rem)', margin: '0.75rem 0 1.2rem', textTransform: 'uppercase' }}>
              {lang === 'it' ? 'Visualizza o scarica il CV' : 'View or download my CV'}
            </h3>
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {cvDocs.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    gap: '0.6rem',
                    alignItems: 'center',
                    border: '1px solid var(--c-border)',
                    padding: '0.85rem 0.95rem',
                    background: 'color-mix(in srgb, var(--bg-surface) 18%, transparent)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {doc.label}
                  </span>
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.64rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)' }}
                  >
                    {lang === 'it' ? 'Vedi ↗' : 'View ↗'}
                  </a>
                  <a
                    href={doc.href}
                    download
                    style={{ textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.64rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)' }}
                  >
                    {lang === 'it' ? 'Scarica ↓' : 'Download ↓'}
                  </a>
                </div>
              ))}
            </div>
          </section>

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
            <p
              style={{
                marginTop: '1.1rem',
                maxWidth: '50ch',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.84rem',
                lineHeight: 1.72,
                color: 'var(--text-secondary)',
                textTransform: 'none',
              }}
            >
              {lang === 'it'
                ? 'Sviluppatore front-end freelance dal 2025, con precedente esperienza nel settore turismo/reception (2019-2023). Formazione artistica e percorso Epicode in corso (M1-M3), con focus su UI design, componenti riusabili, basi REST/JSON e integrazione di strumenti AI nei processi di sviluppo.'
                : 'Freelance front-end developer since 2025, with previous tourism/reception experience (2019-2023). Art-school background and current Epicode path (M1-M3), focused on UI design, reusable components, REST/JSON basics, and AI-tool integration across development processes.'}
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

        <section className="ag-reveal" style={{ marginBottom: '6rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {lang === 'it' ? '004 // Certificati' : '004 // Certificates'}
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.1rem, 5vw, 4rem)', margin: '1rem 0 2rem', textTransform: 'uppercase' }}>
            {lang === 'it' ? 'Formazione e certificazioni' : 'Training & certifications'}
          </h2>
          <div className="ag-epicode-card-wrap">
            <Link
              to="/agency/epicode"
              className="ag-epicode-card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(220px, 360px) 1fr',
                gap: '1.75rem',
                alignItems: 'center',
                padding: '1.4rem',
                border: '1px solid var(--c-border)',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                background: 'color-mix(in srgb, var(--bg-surface) 22%, transparent)',
              }}
            >
              <img
                src="/assets/epicode-logo.png"
                alt="Epicode"
                className="ag-epicode-logo"
                style={{ width: '100%', maxWidth: '420px', height: 'auto', display: 'block' }}
              />
              <div>
                <p style={{ margin: '0 0 0.55rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Epicode
                </p>
                <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {lang === 'it' ? 'Vai alla scheda percorso e certificati ↗' : 'Open dedicated journey & certificates page ↗'}
                </p>
              </div>
            </Link>
          </div>
        </section>

        <section className="ag-reveal" style={{ marginBottom: '6rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {lang === 'it' ? '005 // Curriculum Vitae' : '005 // Curriculum Vitae'}
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: '1rem 0 1.6rem', textTransform: 'uppercase' }}>
            {lang === 'it' ? 'Visualizza o scarica il CV' : 'View or download my CV'}
          </h2>
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {cvDocs.map((doc) => (
              <div
                key={doc.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.95rem 1.1rem',
                  border: '1px solid var(--c-border)',
                  background: 'color-mix(in srgb, var(--bg-surface) 16%, transparent)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {doc.label}
                </span>
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)' }}
                >
                  {lang === 'it' ? 'Vedi ↗' : 'View ↗'}
                </a>
                <a
                  href={doc.href}
                  download
                  style={{ textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)' }}
                >
                  {lang === 'it' ? 'Scarica ↓' : 'Download ↓'}
                </a>
              </div>
            ))}
          </div>
        </section>

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
