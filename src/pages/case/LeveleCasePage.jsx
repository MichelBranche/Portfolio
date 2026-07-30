import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { FOOTER_SOCIAL } from '../../config/site.js'
import { markSkipIntro, playPageCover } from '../../lib/pageTransition.js'
import { formatKpiDisplay, LEVELE_CASE as D } from './leveleData.js'
import './LeveleCasePage.css'

gsap.registerPlugin(ScrollTrigger)

function useLocalAsset(src, fallback) {
  const [url, setUrl] = useState(fallback)
  useEffect(() => {
    if (!src) {
      setUrl(fallback)
      return
    }
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (!cancelled) setUrl(src)
    }
    img.onerror = () => {
      if (!cancelled) setUrl(fallback)
    }
    img.src = src
    return () => {
      cancelled = true
    }
  }, [src, fallback])
  return url
}

function CaseMedia({ src, fallback, alt, className }) {
  const url = useLocalAsset(src, fallback)
  return <img src={url} alt={alt} className={className} loading="lazy" decoding="async" />
}

export default function LeveleCasePage() {
  const navigate = useNavigate()
  const rootRef = useRef(null)
  const lenisRef = useRef(null)
  const kpiRefs = useRef([])

  const goBackToWork = (e) => {
    e.preventDefault()
    playPageCover(() => {
      markSkipIntro('work')
      navigate('/')
    })
  }

  useEffect(() => {
    document.title = `${D.brand} — Case study | Michel Branche`
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis
    let ticker

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.case-reveal', { clearProps: 'all' })
        return
      }

      lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        touchMultiplier: 1.5,
      })
      lenisRef.current = lenis
      lenis.on('scroll', ScrollTrigger.update)
      ticker = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(ticker)
      gsap.ticker.lagSmoothing(0)

      gsap.from('.case-hero__load', {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.08,
      })

      gsap.utils.toArray('.case-reveal').forEach((el) => {
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        })
      })

      const mockup = root.querySelector('.case-solution__stage')
      if (mockup) {
        const desktop = mockup.querySelector('.case-device--desktop')
        const mobile = mockup.querySelector('.case-device--mobile')
        if (desktop) {
          gsap.to(desktop, {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: mockup,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }
        if (mobile) {
          gsap.to(mobile, {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: mockup,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }
      }

      kpiRefs.current.forEach((el, i) => {
        if (!el) return
        const kpi = D.kpis[i]
        const obj = { v: 0 }
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              v: kpi.value,
              duration: 1.35,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = formatKpiDisplay(kpi, obj.v)
              },
            })
          },
        })
      })
    }, root)

    return () => {
      ctx.revert()
      if (ticker) gsap.ticker.remove(ticker)
      if (lenis) {
        lenis.destroy()
        lenisRef.current = null
      }
    }
  }, [])

  return (
    <div className="case-page" ref={rootRef}>
      <header className="case-nav">
        <a href="/#work" className="case-nav__back interactable" onClick={goBackToWork}>
          <ArrowLeft size={18} aria-hidden />
          <span>{D.hero.ctaBack}</span>
        </a>
        <a
          href={D.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="case-nav__live interactable"
        >
          <span>{D.hero.ctaLive}</span>
          <ArrowUpRight size={18} aria-hidden />
        </a>
      </header>

      {/* 1. Hero */}
      <section className="case-hero">
        <div className="case-hero__copy">
          <p className="case-eyebrow case-hero__load">{D.hero.eyebrow}</p>
          <p className="case-brand case-hero__load">{D.brand}</p>
          <h1 className="case-hero__headline case-hero__load">{D.hero.headline}</h1>
          <ul className="case-tags case-hero__load">
            {D.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <div className="case-hero__actions case-hero__load">
            <a
              href={D.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="case-btn case-btn--solid interactable"
            >
              {D.hero.ctaLive}
              <ArrowUpRight size={18} aria-hidden />
            </a>
            <a href="/#work" className="case-btn case-btn--ghost interactable" onClick={goBackToWork}>
              {D.hero.ctaBack}
            </a>
          </div>
        </div>
        <div className="case-hero__media case-hero__load">
          <CaseMedia
            src={D.assets.hero}
            fallback={D.previewImg}
            alt={`${D.brand} — anteprima sito`}
            className="case-hero__img"
          />
        </div>
      </section>

      {/* 2. KPI */}
      <section className="case-kpi" aria-label="Risultati chiave">
        <div className="case-kpi__grid">
          {D.kpis.map((kpi, i) => (
            <article key={kpi.label} className="case-kpi__card case-reveal">
              <p
                className="case-kpi__value"
                ref={(el) => {
                  kpiRefs.current[i] = el
                }}
              >
                {formatKpiDisplay(kpi, 0)}
              </p>
              <p className="case-kpi__label">{kpi.label}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Problema */}
      <section className="case-problem">
        <div className="case-problem__inner case-reveal">
          <p className="case-eyebrow">{D.problem.title}</p>
          <h2 className="case-section-title">{D.problem.lead}</h2>
          <ul className="case-problem__list">
            {D.problem.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Soluzione */}
      <section className="case-solution">
        <div className="case-solution__copy case-reveal">
          <p className="case-eyebrow">{D.solution.title}</p>
          <h2 className="case-section-title">{D.solution.lead}</h2>
          <ul className="case-checklist">
            {D.solution.checklist.map((item) => (
              <li key={item}>
                <Check size={18} aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="case-solution__stage case-reveal" aria-hidden>
          <div className="case-device case-device--desktop case-device--mockup">
            <CaseMedia
              src={D.assets.desktop}
              fallback={D.previewImg}
              alt="Mockup desktop Residence Le Vele"
              className="case-device__screen case-device__screen--mockup"
            />
          </div>
          <div className="case-device case-device--mobile case-device--mockup">
            <CaseMedia
              src={D.assets.mobile}
              fallback={D.previewImg}
              alt="Mockup mobile Residence Le Vele"
              className="case-device__screen case-device__screen--mockup"
            />
          </div>
        </div>
      </section>

      {/* 5. Processo */}
      <section className="case-process">
        <p className="case-eyebrow case-reveal">{D.process.title}</p>
        <ol className="case-process__list case-reveal">
          {D.process.steps.map((step, i) => (
            <li key={step} className="case-process__step">
              <span className="case-process__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="case-process__name">{step}</span>
              {i < D.process.steps.length - 1 ? (
                <span className="case-process__arrow" aria-hidden>
                  ↓
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {/* 6. Prima / Dopo */}
      <section className="case-compare">
        <p className="case-eyebrow case-reveal">{D.beforeAfter.title}</p>
        <div className="case-compare__grid case-reveal">
          <figure className="case-compare__frame">
            <CaseMedia
              src={D.assets.before}
              fallback={D.previewImg}
              alt={D.beforeAfter.beforeLabel}
              className="case-compare__img case-compare__img--muted"
            />
            <figcaption>{D.beforeAfter.beforeLabel}</figcaption>
          </figure>
          <span className="case-compare__arrow" aria-hidden>
            →
          </span>
          <figure className="case-compare__frame">
            <CaseMedia
              src={D.assets.after}
              fallback={D.previewImg}
              alt={D.beforeAfter.afterLabel}
              className="case-compare__img"
            />
            <figcaption>{D.beforeAfter.afterLabel}</figcaption>
          </figure>
        </div>
      </section>

      {/* 7. Analytics */}
      <section className="case-analytics">
        <div className="case-analytics__head case-reveal">
          <p className="case-eyebrow">{D.analytics.title}</p>
          <h2 className="case-section-title">{D.analytics.lead}</h2>
        </div>
        <div className="case-analytics__metrics case-reveal">
          {D.analytics.metrics.map((m) => (
            <article key={m.label} className="case-analytics__metric">
              <p className="case-analytics__value">
                {m.value}
                {m.suffix || ''}
              </p>
              <p className="case-analytics__label">{m.label}</p>
            </article>
          ))}
        </div>
        <figure className="case-shot case-reveal">
          <CaseMedia
            src={D.assets.analytics}
            fallback={D.previewImg}
            alt="Screenshot analytics"
            className="case-shot__img"
          />
          <figcaption>{D.analytics.caption}</figcaption>
        </figure>
      </section>

      {/* 8. Risultati economici */}
      <section className="case-results">
        <div className="case-results__inner case-reveal">
          <p className="case-eyebrow case-eyebrow--on-dark">{D.results.title}</p>
          <h2 className="case-results__lead">{D.results.lead}</h2>
          <ul className="case-results__lines">
            {D.results.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="case-results__note">{D.results.note}</p>
        </div>
      </section>

      {/* 9. Slope */}
      <section className="case-slope">
        <p className="case-eyebrow case-reveal">{D.slope.title}</p>
        <figure className="case-shot case-reveal">
          <CaseMedia
            src={D.assets.slope}
            fallback={D.previewImg}
            alt="Report gestionale Slope"
            className="case-shot__img"
          />
          <figcaption>{D.slope.caption}</figcaption>
        </figure>
      </section>

      {/* 10. Deliverable */}
      <section className="case-deliverables">
        <p className="case-eyebrow case-reveal">{D.deliverables.title}</p>
        <ul className="case-deliverables__grid case-reveal">
          {D.deliverables.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* 11. Testimonianza — nascosta finché non c’è quote reale */}
      {D.testimonial ? (
        <section className="case-testimonial">
          <blockquote className="case-reveal">
            <p>“{D.testimonial.quote}”</p>
            <footer>
              <cite>{D.testimonial.author}</cite>
              {D.testimonial.role ? <span>{D.testimonial.role}</span> : null}
            </footer>
          </blockquote>
        </section>
      ) : null}

      {/* 12. CTA */}
      <section className="case-cta">
        <div className="case-cta__bg" aria-hidden>
          <CaseMedia
            src={D.assets.cta}
            fallback={D.previewImg}
            alt=""
            className="case-cta__img"
          />
        </div>
        <div className="case-cta__content case-reveal">
          <h2 className="case-cta__title">{D.cta.title}</h2>
          <p className="case-cta__lead">{D.cta.lead}</p>
          <a
            href={FOOTER_SOCIAL.email || D.contactEmail}
            className="case-btn case-btn--solid case-btn--lg interactable"
          >
            {D.cta.button}
            <ArrowUpRight size={20} aria-hidden />
          </a>
        </div>
      </section>
    </div>
  )
}
