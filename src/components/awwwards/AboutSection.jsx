import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatedSectionHeader } from './AnimatedSectionHeader.jsx'
import { AnimatedTextLines } from './AnimatedTextLines.jsx'

gsap.registerPlugin(ScrollTrigger)

const ABOUT_IMAGE = '/images/michel-about.png?v=2'

export function AboutSection({ subTitle, title, lead, body, imageAlt }) {
  const sectionRef = useRef(null)
  const visualRef = useRef(null)
  const frameRef = useRef(null)
  const imgRef = useRef(null)
  const copyRef = useRef(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const visual = visualRef.current
      const frame = frameRef.current
      const img = imgRef.current
      const copy = copyRef.current
      if (!section) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (frame) gsap.set(frame, { clearProps: 'clipPath' })
        if (img) gsap.set(img, { clearProps: 'transform' })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
          if (!frame || !img || !visual) return
            gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' })
            gsap.set(img, { scale: 1.03, yPercent: 4 })

            const enterTl = gsap.timeline({
              scrollTrigger: {
                trigger: visual,
                start: 'top 84%',
                once: true,
              },
            })

            enterTl
              .to(
                frame,
                {
                  clipPath: 'inset(0% 0% 0% 0%)',
                  duration: 1.35,
                  ease: 'power4.out',
                },
                0,
              )
              .to(
                img,
                {
                  scale: 1,
                  yPercent: 0,
                  duration: 1.5,
                  ease: 'power3.out',
                },
                0.05,
              )

            gsap.to(img, {
              yPercent: -4,
              ease: 'none',
              scrollTrigger: {
                trigger: visual,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.4,
              },
            })

          if (copy) {
            gsap.from(copy, {
              y: 48,
              opacity: 0,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: copy,
                start: 'top 88%',
                once: true,
              },
            })
          }
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <AnimatedSectionHeader
        subTitle={subTitle}
        title={title}
        lead={lead}
        withScrollTrigger
      />
      <div className="about-section-stage">
        <div className="about-section-visual" ref={visualRef}>
          <div className="about-section-visual-frame" ref={frameRef}>
            <div className="about-section-photo-mirror">
              <img
                ref={imgRef}
                src={ABOUT_IMAGE}
                alt={imageAlt}
                className="about-section-photo interactable"
                width={1200}
                height={1500}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
        <div className="about-section-copy-wrap" ref={copyRef}>
          <AnimatedTextLines text={body} className="about-section-copy" />
        </div>
      </div>
    </section>
  )
}
