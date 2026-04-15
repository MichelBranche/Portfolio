import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/PageTransition'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function EpicodeJourney() {
  const { lang } = useLanguage()
  const rootRef = useRef(null)

  const modules = [
    {
      id: 'm1',
      title: 'Module 01',
      href: '/assets/certificates/m1.pdf',
      descriptionIt:
        'Fondamenti di sviluppo web: struttura HTML semantica, CSS responsive, principi di accessibilita e prime basi JavaScript per componenti UI puliti e coerenti.',
      descriptionEn:
        'Core web development fundamentals: semantic HTML structure, responsive CSS, accessibility principles, and early JavaScript basics for clean and consistent UI components.',
    },
    {
      id: 'm2',
      title: 'Module 02',
      href: '/assets/certificates/m2.pdf',
      descriptionIt:
        'Approfondimento su JavaScript moderno, gestione dello stato e logica applicativa. Focus su componenti riusabili, organizzazione del codice e workflow con Git/GitHub.',
      descriptionEn:
        'Deep dive into modern JavaScript, state handling, and application logic. Focus on reusable components, code organization, and Git/GitHub workflow.',
    },
    {
      id: 'm3',
      title: 'Module 03',
      href: '/assets/certificates/m3.pdf',
      descriptionIt:
        'Interazione con dati esterni tramite REST API e JSON, debugging pratico, attenzione al problem solving e alle performance in scenari reali di progetto.',
      descriptionEn:
        'Working with external data through REST APIs and JSON, practical debugging, and strong focus on problem solving and performance in real project scenarios.',
    },
    {
      id: 'm4',
      title: 'Module 04',
      href: '/assets/certificates/m4.pdf',
      descriptionIt:
        'Modulo orientato alla produzione: consolidamento del processo end-to-end, comunicazione tecnica, adattabilita e gestione del lavoro in contesti orientati al cliente.',
      descriptionEn:
        'Production-oriented module: consolidating the end-to-end process, technical communication, adaptability, and work management in client-oriented contexts.',
    },
  ]

  useEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.epi-reveal',
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity' }
      )

      gsap.fromTo(
        '.epi-module-card',
        { y: 44, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.epi-module-list',
            start: 'top 82%',
            once: true,
          },
          clearProps: 'transform,opacity',
        }
      )

      gsap.fromTo(
        '.epi-logo',
        { y: 18, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.epi-logo-wrap',
            start: 'top 88%',
            once: true,
          },
          clearProps: 'transform,opacity',
        }
      )

      const moduleCards = gsap.utils.toArray('.epi-module-card')
      moduleCards.forEach((card) => {
        const onEnter = () => {
          gsap.to(card, {
            y: -5,
            scale: 1.01,
            borderColor: 'rgba(26,25,23,0.34)',
            boxShadow: '0 14px 24px rgba(0,0,0,0.08)',
            duration: 0.25,
            ease: 'power2.out',
          })
        }
        const onLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            borderColor: 'var(--c-border)',
            boxShadow: '0 0 0 rgba(0,0,0,0)',
            duration: 0.25,
            ease: 'power2.out',
          })
        }
        card.addEventListener('mouseenter', onEnter)
        card.addEventListener('mouseleave', onLeave)
        card.addEventListener('focusin', onEnter)
        card.addEventListener('focusout', onLeave)
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <PageTransition>
      <section ref={rootRef} style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '6rem' }}>
        <header className="epi-reveal" style={{ marginBottom: '2.4rem' }}>
          <div className="epi-reveal epi-logo-wrap" style={{ marginBottom: '1.4rem' }}>
            <img
              src="/assets/epicode-logo.png"
              alt="Epicode logo"
              className="epi-logo"
              style={{ width: 'min(560px, 100%)', height: 'auto', display: 'block' }}
            />
          </div>
          <p style={{ margin: 0, maxWidth: '70ch', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
            {lang === 'it'
              ? 'Durante il percorso Epicode ho consolidato le basi di sviluppo front-end e project workflow: HTML, CSS, JavaScript, React, responsive architecture, component design e pubblicazione di progetti reali. Qui trovi i certificati dei moduli completati.'
              : 'During the Epicode path I strengthened core front-end and project workflow skills: HTML, CSS, JavaScript, React, responsive architecture, component design, and real project delivery. Here you can find the completed module certificates.'}
          </p>
        </header>

        <div className="epi-module-list" style={{ display: 'grid', gap: '1rem' }}>
          {modules.map((module) => (
            <article
              key={module.id}
              className="epi-module-card"
              style={{
                display: 'grid',
                gap: '0.95rem',
                padding: '1.1rem 1.2rem',
                border: '1px solid var(--c-border)',
                background: 'color-mix(in srgb, var(--bg-surface) 18%, transparent)',
              }}
            >
              <a
                href={module.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.8rem',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                <span>{module.title}</span>
                <span>{lang === 'it' ? 'Apri certificato PDF ↗' : 'Open certificate PDF ↗'}</span>
              </a>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.83rem',
                  lineHeight: 1.72,
                  color: 'var(--text-secondary)',
                  textTransform: 'none',
                  letterSpacing: 'normal',
                }}
              >
                {lang === 'it' ? module.descriptionIt : module.descriptionEn}
              </p>
            </article>
          ))}
        </div>

        <div className="epi-reveal" style={{ marginTop: '2rem' }}>
          <Link
            to="/agency"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}
          >
            ← {lang === 'it' ? 'Torna alla pagina About' : 'Back to About page'}
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}
