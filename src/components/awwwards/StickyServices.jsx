import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMediaQuery } from 'react-responsive'
import { AnimatedSectionHeader } from './AnimatedSectionHeader.jsx'

gsap.registerPlugin(ScrollTrigger)

/** Sticky stack — offset tra card (più stretti del demo 5em/5rem) */
const STICKY_TOP_BASE_VH = 10
const STICKY_CARD_GAP_EM = 3
const STICKY_CARD_GAP_REM = 3

export function StickyServices({ subTitle, title, lead, services }) {
  const sectionRef = useRef(null)
  const innerRefs = useRef([])
  const isDesktop = useMediaQuery({ minWidth: '48rem' })
  const count = services.length

  useGSAP(
    () => {
      innerRefs.current.forEach((el) => {
        if (!el) return
        gsap.from(el, {
          y: 200,
          duration: 1,
          ease: 'circ.out',
          scrollTrigger: {
            trigger: el.closest('.services-sticky-card'),
            start: 'top 80%',
          },
        })
      })
      ScrollTrigger.refresh()
    },
    { dependencies: [count], scope: sectionRef },
  )

  return (
    <section id="services" ref={sectionRef} className="services services--sticky">
      <AnimatedSectionHeader
        subTitle={subTitle}
        title={title}
        lead={lead}
        withScrollTrigger
      />
      {services.map((service, index) => (
        <article
          key={service.title}
          className="services-sticky-card"
          style={
            isDesktop
              ? {
                  top: `calc(${STICKY_TOP_BASE_VH}vh + ${index * STICKY_CARD_GAP_EM}em)`,
                  marginBottom: `${(count - index - 1) * STICKY_CARD_GAP_REM}rem`,
                  zIndex: 10 + index,
                }
              : { top: 0, zIndex: 10 + index }
          }
        >
          <div
            className="services-sticky-card-inner"
            ref={(el) => {
              innerRefs.current[index] = el
            }}
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
          </div>
        </article>
      ))}
    </section>
  )
}
