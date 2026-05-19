import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ServiceSummaryStrip({ copy }) {
  const rootRef = useRef(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef)
      const pairs = [
        ['#svc-line-1', 18],
        ['#svc-line-2', -26],
        ['#svc-line-3', 42],
        ['#svc-line-4', -36],
      ]
      pairs.forEach(([sel, xPercent]) => {
        const el = q(sel)[0]
        if (!el) return
        gsap.to(el, {
          xPercent,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    },
    { scope: rootRef },
  )

  return (
    <section className="service-summary-strip" ref={rootRef}>
      <div id="svc-line-1" className="service-summary-line">
        <p>{copy.line1}</p>
      </div>
      <div id="svc-line-2" className="service-summary-line service-summary-mid">
        <p>{copy.line2Left}</p>
        <span className="service-summary-bar" />
        <p>{copy.line2Right}</p>
      </div>
      <div id="svc-line-3" className="service-summary-line service-summary-mid">
        <p>{copy.line3a}</p>
        <span className="service-summary-bar" />
        <p className="service-summary-italic">{copy.line3b}</p>
        <span className="service-summary-bar" />
        <p>{copy.line3c}</p>
      </div>
      <div id="svc-line-4" className="service-summary-line">
        <p>{copy.line4}</p>
      </div>
    </section>
  )
}
