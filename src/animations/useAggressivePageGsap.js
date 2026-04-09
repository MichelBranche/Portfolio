import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Stesso linguaggio animativo della Home: expo, skew, scroll reveal, parallax.
 * Attacca ref al wrapper della pagina e usa le classi:
 * - .gsap-page-header — ingresso iniziale (senza scroll)
 * - .gsap-reveal — blocchi che entrano con scroll
 * - .gsap-card — card più “pesanti” (skew + perspective)
 * - .gsap-parallax — immagini con scrub
 * - .gsap-page-footer — fascia finale
 */
export function useAggressivePageGsap(dependencies = []) {
  const containerRef = useRef(null)

  useGSAP(() => {
    const root = containerRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray(root.querySelectorAll('.gsap-page-header')).forEach((node, i) => {
        gsap.from(node, {
          y: 64,
          opacity: 0,
          skewY: 5,
          duration: 1.05,
          delay: i * 0.08,
          ease: 'expo.out'
        })
      })

      gsap.utils.toArray(root.querySelectorAll('.gsap-reveal')).forEach((node, i) => {
        gsap.from(node, {
          y: 110,
          opacity: 0,
          skewY: 6,
          duration: 1.05,
          ease: 'power4.out',
          delay: i * 0.04,
          scrollTrigger: {
            trigger: node,
            start: 'top 89%',
            toggleActions: 'play none none none'
          }
        })
      })

      gsap.utils.toArray(root.querySelectorAll('.gsap-card')).forEach((node, i) => {
        gsap.from(node, {
          y: 130,
          opacity: 0,
          skewY: 7,
          rotateX: -5,
          transformPerspective: 900,
          duration: 1.12,
          ease: 'power4.out',
          delay: i * 0.07,
          scrollTrigger: {
            trigger: node,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        })
      })

      gsap.utils.toArray(root.querySelectorAll('.gsap-parallax')).forEach((img) => {
        gsap.to(img, {
          yPercent: -34,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.85
          }
        })
      })

      gsap.utils.toArray(root.querySelectorAll('.gsap-page-footer')).forEach((node) => {
        gsap.from(node, {
          y: 52,
          opacity: 0,
          skewY: 3,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 91%',
            toggleActions: 'play none none none'
          }
        })
      })
    }, root)

    return () => ctx.revert()
  }, { scope: containerRef, dependencies })

  return containerRef
}
