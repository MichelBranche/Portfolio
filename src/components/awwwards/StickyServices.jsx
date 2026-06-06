import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatedSectionHeader } from './AnimatedSectionHeader.jsx'

gsap.registerPlugin(ScrollTrigger)

export function StickyServices({ subTitle, title, lead, services }) {
  const sectionRef = useRef(null)
  const count = services.length

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const cards = section.querySelectorAll('.services-sticky-card')
      cards.forEach((card) => {
        const inner = card.querySelector('.services-sticky-card-inner')
        if (!inner) return

        gsap.from(inner, {
          y: 200,
          duration: 1,
          ease: 'circ.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            once: true,
            invalidateOnRefresh: true,
          },
        })
      })

      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh())
      })
    },
    { dependencies: [count], scope: sectionRef, revertOnUpdate: true },
  )

  return (
    <section
      id="services"
      ref={sectionRef}
      className="services services--sticky"
      style={{ '--sticky-count': count }}
    >
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
          style={{ '--i': index }}
        >
          <div className="services-sticky-card-inner">
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
      <div className="services-sticky-runway" aria-hidden="true" />
    </section>
  )
}
