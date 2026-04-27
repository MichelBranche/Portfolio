import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useIsDroneLayoutDesktop, useIsMobileLayout, useIsVisualStatementDesktop } from '../hooks/useResponsive.js'
import { VideoPlayer } from './VideoPlayer.jsx'

gsap.registerPlugin(ScrollTrigger)

const DRONE_IMAGE_URL =
  'https://skycrabacademy.net/cdn/shop/files/DJIMini4pro-skycrabacademy_7.png?v=1762525902&width=2048'
const VISUAL_VIDEO_URLS = [
  'https://www.youtube.com/watch?v=S7MJkGaSc5s',
  'https://www.youtube.com/watch?v=8jT9ygmMvMg',
  'https://www.youtube.com/watch?v=278IRQ6HSi4',
]

const SERVICE_KEYS = ['photo', 'copy', 'drone']

function asLines(value, fallback) {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') return [value]
  return fallback
}

function asList(value) {
  if (Array.isArray(value)) return value.map(String)
  return []
}

export function VisualSection() {
  const { t, lang } = useLanguage()
  const isMobileLayout = useIsMobileLayout()
  const isDroneDesktop = useIsDroneLayoutDesktop()
  const isStatementDesktop = useIsVisualStatementDesktop()
  const sectionRef = useRef(null)
  /** Parallasse scroll (solo qui, mai sull'img) — evita conflitto con gsap.from sull'immagine */
  const droneParallaxRef = useRef(null)
  const droneWrapRef = useRef(null)
  const droneRef = useRef(null)
  const statementRef = useRef(null)
  const statementTitleRef = useRef(null)
  const servicesRef = useRef(null)
  const serviceItemsRef = useRef([])
  const textRef = useRef([])
  const videoStackRef = useRef(null)
  const videoItemsRef = useRef([])
  const [activeVideo, setActiveVideo] = useState(1)

  const titleLines = asLines(t('visualSection.titleLines'), ['FOTOGRAFIA', '& RIPRESE AEREE.'])
  const lead = String(t('visualSection.lead'))
  const cta = String(t('visualSection.cta'))
  const droneAlt = String(t('visualSection.droneAlt'))
  const statementLines = asLines(t('visualSection.statementLines'), [
    'L’estetica attira.',
    'La conversione decide il valore.',
  ])
  const servicesKicker = String(t('visualSection.servicesKicker'))
  const servicesIntro = String(t('visualSection.servicesIntro'))

  const services = useMemo(
    () =>
      SERVICE_KEYS.map((key) => ({
        key,
        title: String(t(`visualSection.services.${key}.title`)),
        desc: String(t(`visualSection.services.${key}.desc`)),
        price: String(t(`visualSection.services.${key}.price`)),
        details: asList(t(`visualSection.services.${key}.details`)),
      })),
    [t],
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      const droneWrap = droneWrapRef.current
      const drone = droneRef.current
      const section = sectionRef.current
      const debugMarkers = new URLSearchParams(window.location.search).has('stdebug')

      const droneParallax = droneParallaxRef.current
      if (drone && section && droneWrap && droneParallax) {
        gsap.set(drone, {
          transformOrigin: 'center center',
          force3D: true,
        })

        // Entry solo sull'img: niente gsap.set scroll sullo stesso nodo
        gsap.from(drone, {
          opacity: 0,
          scale: 0.6,
          x: 180,
          y: -100,
          rotation: -25,
          duration: 1.6,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
          },
        })

        // Float sul wrap: il parallax è sul parent (droneParallax), nessun conflitto con l’img
        gsap.to(droneWrap, {
          y: -20,
          duration: 2.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
        gsap.to(droneWrap, {
          x: -10,
          duration: 3.1,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
        gsap.to(droneWrap, {
          rotation: 4,
          duration: 4.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })

        const yAmount = isDroneDesktop ? -150 : -60
        const xAmount = isDroneDesktop ? 80 : 30
        const rotateAmount = isDroneDesktop ? 18 : 8
        const scaleAmount = isDroneDesktop ? 1.2 : 1.08

        gsap.set(droneParallax, { force3D: true, transformOrigin: '50% 50%' })

        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
          markers: debugMarkers,
          onUpdate: (self) => {
            const p = self.progress
            gsap.set(droneParallax, {
              y: yAmount * p,
              x: xAmount * p,
              rotation: rotateAmount * p,
              scale: 1 + (scaleAmount - 1) * p,
            })
          },
        })
      }

      textRef.current.forEach((el, i) => {
        if (i > 2) return
        if (!el) return
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          },
        )
      })

      const statementEl = statementRef.current
      const statementTitleEl = statementTitleRef.current
      const servicesEl = servicesRef.current
      if (statementEl && statementTitleEl && servicesEl) {
        const statementLineEls = statementTitleEl.querySelectorAll('.visual-statement-line')
        const statementWords = statementTitleEl.querySelectorAll('.visual-statement-word')
        const statementLetters = statementTitleEl.querySelectorAll('.visual-statement-letter')
        if (isStatementDesktop) {
          gsap.set(servicesEl, { y: 120, opacity: 0, scale: 0.94 })
          gsap.set(serviceItemsRef.current, { y: 32, opacity: 0 })
          gsap.set(statementLineEls[0], { xPercent: -26, opacity: 0.6 })
          gsap.set(statementLineEls[1], { xPercent: 26, opacity: 0.6 })
          gsap.set(statementWords, { opacity: 0.2 })
          gsap.set(statementLetters, { yPercent: 120, rotate: 7, opacity: 0 })
          const fullTl = gsap.timeline({
            scrollTrigger: {
              trigger: statementEl,
              start: 'top top',
              end: '+=220%',
              scrub: 0.8,
              pin: statementEl,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              markers: debugMarkers,
            },
          })
          fullTl
            .to(statementLineEls, { xPercent: 0, opacity: 1, duration: 0.28, ease: 'none' }, 0)
            .to(statementWords, { opacity: 1, duration: 0.2, ease: 'none', stagger: 0.05 }, 0)
            .to(
              statementLetters,
              { yPercent: 0, rotate: 0, opacity: 1, duration: 0.45, ease: 'none', stagger: 0.013 },
              0.02,
            )
            .to(
              statementTitleEl,
              { scale: 1.06, y: -44, opacity: 0.96, ease: 'none' },
              0.34,
            )
            .to(
              statementLetters,
              {
                x: () => gsap.utils.random(-6, 6),
                y: () => gsap.utils.random(-4, 4),
                duration: 0.06,
                stagger: 0.002,
                yoyo: true,
                repeat: 1,
                ease: 'none',
                overwrite: 'auto',
              },
              0.52,
            )
            .to(
              statementLetters,
              { x: 0, y: 0, duration: 0.08, stagger: 0.002, ease: 'none', overwrite: 'auto' },
              0.58,
            )
            .to(statementLetters, { yPercent: -42, opacity: 0.18, ease: 'none', stagger: 0.01 }, 0.62)
            .to(statementWords, { opacity: 0.22, ease: 'none', stagger: 0.02 }, 0.66)
            .to(servicesEl, { y: 0, opacity: 1, scale: 1, ease: 'none' }, 0.72)
            .to(serviceItemsRef.current, { y: 0, opacity: 1, stagger: 0.1, ease: 'none' }, 0.78)
        } else {
          gsap.fromTo(
            statementTitleEl,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: statementEl,
                start: 'top 82%',
              },
            },
          )
          gsap.fromTo(
            serviceItemsRef.current,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.64,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: servicesEl,
                start: 'top 86%',
              },
            },
          )
        }
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [lang, isDroneDesktop, isStatementDesktop])

  useEffect(() => {
    const items = videoItemsRef.current.filter(Boolean)
    if (!items.length) return

    if (isMobileLayout) {
      items.forEach((item, idx) => {
        const isActive = idx === activeVideo
        gsap.set(item, {
          clearProps: 'all',
          display: isActive ? 'block' : 'none',
          opacity: 1,
          xPercent: 0,
          scale: 1,
          zIndex: isActive ? 2 : 1,
          filter: 'none',
        })
      })
      return
    }

    const targets = items.map((_, idx) => {
      const rel = (idx - activeVideo + 3) % 3
      if (rel === 0) {
        return {
          xPercent: 0,
          scale: 1,
          opacity: 1,
          zIndex: 3,
          filter: 'saturate(1)',
        }
      }
      if (rel === 1) {
        return {
          xPercent: 34,
          scale: 0.9,
          opacity: 0.86,
          zIndex: 1,
          filter: 'saturate(0.86)',
        }
      }
      return {
        xPercent: -34,
        scale: 0.9,
        opacity: 0.86,
        zIndex: 1,
        filter: 'saturate(0.86)',
      }
    })

    items.forEach((item, idx) => {
      const t = targets[idx]
      gsap.to(item, {
        display: 'block',
        xPercent: t.xPercent,
        scale: t.scale,
        opacity: t.opacity,
        zIndex: t.zIndex,
        filter: t.filter,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    })
  }, [activeVideo, isMobileLayout])

  const goNextVideo = () => {
    setActiveVideo((prev) => (prev + 1) % VISUAL_VIDEO_URLS.length)
  }

  const goPrevVideo = () => {
    setActiveVideo((prev) => (prev - 1 + VISUAL_VIDEO_URLS.length) % VISUAL_VIDEO_URLS.length)
  }

  return (
    <section ref={sectionRef} className="visual-section">
      <div className="visual-section-hero">
        <div className="visual-section-copy">
          <h2 ref={(el) => (textRef.current[0] = el)} className="visual-section-title">
            {titleLines.map((line, idx) => (
              <span key={`${lang}-title-${idx}`}>
                {line}
                {idx < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <p ref={(el) => (textRef.current[1] = el)} className="visual-section-lead">
            {lead}
          </p>

          <a
            href="mailto:michel.lavoro@gmail.com"
            ref={(el) => (textRef.current[2] = el)}
            className="visual-section-cta interactable"
          >
            {cta}
          </a>
        </div>

        <div className="visual-section-drone-stage">
          <div className="visual-section-drone-parallax" ref={droneParallaxRef}>
            <div className="visual-section-drone-wrap" ref={droneWrapRef}>
              <img ref={droneRef} src={DRONE_IMAGE_URL} alt={droneAlt} className="visual-section-drone" />
            </div>
          </div>
        </div>
      </div>

      <div className="visual-section-video-wrap">
        <div className="visual-video-stack" aria-label="Video showcase" ref={videoStackRef}>
          {VISUAL_VIDEO_URLS.map((url, idx) => (
            <article
              key={url}
              ref={(el) => {
                videoItemsRef.current[idx] = el
              }}
              className={`visual-video-stack-item${idx === activeVideo ? ' is-active' : ' is-side'}`}
              onClick={() => setActiveVideo(idx)}
            >
              <VideoPlayer src={url} />
              {idx !== activeVideo && (
                <button
                  type="button"
                  className="visual-video-side-hit"
                  onClick={() => setActiveVideo(idx)}
                  aria-label="Porta questo video al centro"
                />
              )}
            </article>
          ))}
          <div className="visual-video-stack-controls" aria-hidden>
            <button type="button" className="visual-video-stack-nav" onClick={goPrevVideo} aria-label="Video precedente">
              <svg viewBox="0 0 24 24" className="visual-video-stack-nav-icon" aria-hidden>
                <path d="M14.5 5 8 12l6.5 7" />
              </svg>
            </button>
            <button type="button" className="visual-video-stack-nav" onClick={goNextVideo} aria-label="Video successivo">
              <svg viewBox="0 0 24 24" className="visual-video-stack-nav-icon" aria-hidden>
                <path d="M9.5 5 16 12l-6.5 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="visual-section-statement" ref={statementRef}>
        <h3 ref={statementTitleRef} className="visual-section-statement-title">
          {statementLines.map((line, lineIdx) => (
            <span className="visual-statement-line" key={`${lang}-line-${lineIdx}`}>
              {line.split(' ').map((word, wordIdx) => (
                <span className="visual-statement-word" key={`word-${lineIdx}-${wordIdx}`}>
                  {word.split('').map((ch, letterIdx) => (
                    <span className="visual-statement-letter" key={`letter-${lineIdx}-${wordIdx}-${letterIdx}`}>
                      {ch}
                    </span>
                  ))}
                  <span className="visual-statement-gap" aria-hidden>
                    &nbsp;
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h3>
      </div>

      <div className="visual-section-services" ref={servicesRef}>
        <header className="visual-section-services-intro">
          <span className="visual-section-services-kicker">
            <span className="visual-section-services-kicker-num" aria-hidden>
              03
            </span>
            <span className="visual-section-services-kicker-label">{servicesKicker}</span>
          </span>
          <p className="visual-section-services-intro-text">{servicesIntro}</p>
        </header>
        <div className="visual-section-services-list">
          {services.map((service, i) => (
            <article
              key={service.key}
              ref={(el) => {
                serviceItemsRef.current[i] = el
              }}
              className="visual-section-service"
            >
              <div className="visual-section-service-head">
                <h4 className="visual-section-service-title">{service.title}</h4>
                <span className="visual-section-service-price">{service.price}</span>
              </div>
              <p className="visual-section-service-desc">{service.desc}</p>
              <ul className="visual-section-service-details">
                {service.details.map((item) => (
                  <li key={`${service.key}-${item}`}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
