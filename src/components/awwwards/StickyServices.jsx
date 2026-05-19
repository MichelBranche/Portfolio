import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMediaQuery } from 'react-responsive'
import { AnimatedSectionHeader } from './AnimatedSectionHeader.jsx'

gsap.registerPlugin(ScrollTrigger)

/** Offset tra card sticky su desktop (era 4.5 — troppo aria in scroll) */
const STICKY_CARD_GAP_EM = 2.75
const STICKY_CARD_GAP_REM = 2.75
const STICKY_TOP_BASE = '6vh'

export function StickyServices({ subTitle, title, lead, services }) {
  const stackRef = useRef(null)
  const cardRefs = useRef([])
  const isDesktop = useMediaQuery({ minWidth: '48rem' })
  const count = services.length

  useGSAP(
    () => {
      cardRefs.current.forEach((el) => {
        if (!el) return
        gsap.from(el, {
          y: 120,
          opacity: 0,
          duration: 0.9,
          ease: 'circ.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        })
      })
    },
    { dependencies: [count], scope: stackRef },
  )

  return (
    <section id="services" className="services services--sticky">
      <AnimatedSectionHeader
        subTitle={subTitle}
        title={title}
        lead={lead}
        withScrollTrigger
      />
      <div className="services-sticky-stack">
        {services.map((service, index) => (
          <article
            key={service.title}
            ref={(el) => {
              cardRefs.current[index] = el
            }}
            className="services-sticky-card"
            style={
              isDesktop
                ? {
                    top: `calc(${STICKY_TOP_BASE} + ${index * STICKY_CARD_GAP_EM}em)`,
                    marginBottom: `${(count - index - 1) * STICKY_CARD_GAP_REM}rem`,
                  }
                : { top: 0 }
            }
          >
            <p className="services-sticky-index">0{index + 1}</p>
            <h3 className="services-sticky-title">{service.title}</h3>
            <p className="services-sticky-desc">{service.desc}</p>
            {service.bullets?.length > 0 && (
              <ul className="services-sticky-bullets">
                {service.bullets.map((item) => (
                  <li key={`${service.title}-${item}`}>{item}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
