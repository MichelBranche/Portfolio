import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function AnimatedTextLines({ text, className = '' }) {
  const containerRef = useRef(null)
  const lineRefs = useRef([])
  const lines = String(text)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  useGSAP(
    () => {
      if (!lineRefs.current.length) return
      gsap.from(lineRefs.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.22,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 88%',
          once: true,
        },
      })
    },
    { dependencies: [text], scope: containerRef },
  )

  return (
    <div className={className} ref={containerRef}>
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          ref={(el) => {
            lineRefs.current[index] = el
          }}
          className="aw-text-line"
        >
          {line}
        </span>
      ))}
    </div>
  )
}
