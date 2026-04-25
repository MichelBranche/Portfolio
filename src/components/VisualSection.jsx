import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DRONE_IMAGE_URL =
  'https://skycrabacademy.net/cdn/shop/files/DJIMini4pro-skycrabacademy_7.png?v=1762525902&width=2048'
const STATEMENT_LINES = ['L’estetica attira.', 'La conversione decide il valore.']
const SERVICE_ITEMS = [
  {
    key: 'photo',
    title: 'FOTOGRAFIA',
    desc:
      'Shooting professionali per prodotti, food ed e-commerce. Immagini curate dalla luce alla post-produzione, pensate per migliorare la percezione del brand e la conversione su ogni canale.',
    price: 'da €150 / €300+',
    details: ['Shooting prodotto', 'Food / e-commerce', 'Post produzione inclusa'],
  },
  {
    key: 'drone',
    title: 'DRONE',
    desc:
      'Riprese aeree cinematiche per location, hospitality e brand. Inquadrature stabili, traiettorie pulite e autorizzazioni gestite: file pronti al montaggio, in formato verticale o orizzontale.',
    price: 'da €200 / €500+',
    details: ['Riprese aeree cinematiche', 'Location / hospitality', 'Pilota certificato'],
  },
]

export function VisualSection() {
  const sectionRef = useRef(null)
  const droneWrapRef = useRef(null)
  const droneRef = useRef(null)
  const statementRef = useRef(null)
  const statementTitleRef = useRef(null)
  const servicesRef = useRef(null)
  const serviceItemsRef = useRef([])
  const textRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const droneWrap = droneWrapRef.current
      const drone = droneRef.current
      const section = sectionRef.current
      const debugMarkers = new URLSearchParams(window.location.search).has('stdebug')

      if (drone && section && droneWrap) {
        const isDesktop = window.innerWidth > 768
        const yAmount = isDesktop ? -80 : -34
        const xAmount = isDesktop ? 36 : 14
        const rotateAmount = isDesktop ? 10 : 5
        const scaleAmount = isDesktop ? 1.08 : 1.03
        gsap.set(drone, {
          x: 0,
          y: 0,
          rotate: 3,
          scale: 1,
          transformOrigin: '50% 50%',
          force3D: true,
        })
        gsap.from(drone, {
          opacity: 0,
          scale: 0.95,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            once: true,
          },
        })
        gsap.to(droneWrap, {
          y: -10,
          duration: 1.8,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })

        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
          markers: debugMarkers,
          onUpdate: (self) => {
            const p = self.progress
            gsap.set(drone, {
              y: yAmount * p,
              x: xAmount * p,
              rotate: 3 + rotateAmount * p,
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
        const statementLines = statementTitleEl.querySelectorAll('.visual-statement-line')
        const statementWords = statementTitleEl.querySelectorAll('.visual-statement-word')
        const statementLetters = statementTitleEl.querySelectorAll('.visual-statement-letter')
        const isDesktop = window.innerWidth > 900
        if (isDesktop) {
          gsap.set(servicesEl, { y: 120, opacity: 0, scale: 0.94 })
          gsap.set(serviceItemsRef.current, { y: 32, opacity: 0 })
          gsap.set(statementLines[0], { xPercent: -26, opacity: 0.6 })
          gsap.set(statementLines[1], { xPercent: 26, opacity: 0.6 })
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
            .to(statementLines, { xPercent: 0, opacity: 1, duration: 0.28, ease: 'none' }, 0)
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
  }, [])

  return (
    <section ref={sectionRef} className="visual-section">
      <div className="visual-section-hero">
        <div className="visual-section-copy">
          <h2 ref={(el) => (textRef.current[0] = el)} className="visual-section-title">
            FOTOGRAFIA
            <br />
            & RIPRESE AEREE.
          </h2>

          <p ref={(el) => (textRef.current[1] = el)} className="visual-section-lead">
            Shooting fotografici e riprese drone per brand, location e attività. Dalla
            preparazione del set alla consegna dei file finali.
          </p>

          <a
            href="mailto:michel.lavoro@gmail.com"
            ref={(el) => (textRef.current[2] = el)}
            className="visual-section-cta interactable"
          >
            RICHIEDI UN PREVENTIVO →
          </a>
        </div>

        <div className="visual-section-drone-wrap" ref={droneWrapRef}>
          <img ref={droneRef} src={DRONE_IMAGE_URL} alt="Drone" className="visual-section-drone" />
        </div>
      </div>

      <div className="visual-section-statement" ref={statementRef}>
        <h3 ref={statementTitleRef} className="visual-section-statement-title">
          {STATEMENT_LINES.map((line, lineIdx) => (
            <span className="visual-statement-line" key={`line-${lineIdx}`}>
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
        <div className="visual-section-services-list">
          {SERVICE_ITEMS.map((service, i) => (
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
