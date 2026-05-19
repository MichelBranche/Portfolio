import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatedTextLines } from './AnimatedTextLines.jsx'

gsap.registerPlugin(ScrollTrigger)

export function AnimatedSectionHeader({
  subTitle,
  title,
  lead,
  withScrollTrigger = false,
}) {
  const contextRef = useRef(null)
  const headerRef = useRef(null)
  const titleParts = String(title).includes(' ') ? String(title).split(' ') : [title]

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: withScrollTrigger
          ? {
              trigger: contextRef.current,
              start: 'top 90%',
              once: true,
            }
          : undefined,
      })
      tl.from(contextRef.current, {
        y: '18vh',
        duration: 1,
        ease: 'circ.out',
      })
      tl.from(
        headerRef.current,
        {
          opacity: 0,
          y: 120,
          duration: 1,
          ease: 'circ.out',
        },
        '<+0.15',
      )
    },
    { dependencies: [title, withScrollTrigger], scope: contextRef },
  )

  return (
    <div className="aw-header-wrap" ref={contextRef}>
      <div className="aw-header-clip">
        <div className="aw-header-inner" ref={headerRef}>
          {subTitle ? <p className="aw-kicker">{subTitle}</p> : null}
          <h2 className="aw-banner-title">
            {titleParts.map((part, index) => (
              <span key={`${part}-${index}`}>{part}</span>
            ))}
          </h2>
        </div>
      </div>
      {lead ? (
        <div className="aw-header-rule">
          <AnimatedTextLines text={lead} className="aw-header-lead" />
        </div>
      ) : null}
    </div>
  )
}


