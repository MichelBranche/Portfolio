import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles } from 'lucide-react'
import { gsapHorizontalLoop } from '../../lib/gsapHorizontalLoop.js'
import { usePrefersReducedMotion } from '../../hooks/useResponsive.js'

gsap.registerPlugin(Observer, ScrollTrigger)

export function GsapMarquee({ items, reverse = false, className = '' }) {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const itemsRef = useRef([])
  const prefersReducedMotion = usePrefersReducedMotion()
  const list = items?.length ? items : ['']

  useGSAP(
    () => {
      if (!rootRef.current || prefersReducedMotion) return
      gsap.from(rootRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 95%',
          once: true,
        },
      })
    },
    { scope: rootRef, dependencies: [prefersReducedMotion] },
  )

  useGSAP(
    () => {
      if (prefersReducedMotion) return undefined

      const els = itemsRef.current.filter(Boolean)
      if (!els.length) return undefined

      const tl = gsapHorizontalLoop(els, {
        repeat: -1,
        paddingRight: 48,
        reversed: reverse,
        speed: 0.85,
      })
      if (!tl) return undefined

      const obs = Observer.create({
        onChangeY(self) {
          let factor = 2.5
          if ((!reverse && self.deltaY < 0) || (reverse && self.deltaY > 0)) {
            factor *= -1
          }
          gsap
            .timeline({ defaults: { ease: 'none' } })
            .to(tl, { timeScale: factor * 2.2, duration: 0.2, overwrite: true })
            .to(tl, { timeScale: factor / 2.2, duration: 1 }, '+=0.3')
        },
      })

      return () => {
        obs.kill()
        tl.kill()
      }
    },
    { scope: rootRef, dependencies: [list.join('|'), reverse, prefersReducedMotion] },
  )

  if (prefersReducedMotion) {
    return (
      <div
        ref={rootRef}
        className={['gsap-marquee', 'gsap-marquee--static', className].filter(Boolean).join(' ')}
        aria-hidden
      >
        <p className="gsap-marquee-static-text">{list[0]}</p>
      </div>
    )
  }

  return (
    <div ref={rootRef} className={['gsap-marquee', className].filter(Boolean).join(' ')} aria-hidden>
      <div ref={trackRef} className="gsap-marquee-track">
        {list.map((text, index) => (
          <span
            key={`${text}-${index}`}
            ref={(el) => {
              itemsRef.current[index] = el
            }}
            className="gsap-marquee-item"
          >
            {text}
            <Sparkles className="gsap-marquee-icon" aria-hidden strokeWidth={1.25} />
          </span>
        ))}
      </div>
    </div>
  )
}
