import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const EASE = 'expo.out'
export const PX_GRID = 5

export function reduceMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function finePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

/** Reveal su scroll per [data-reveal], [data-chars], [data-line], [data-clip] dentro scope. */
export function useReveal(scopeRef, deps, delay = 0) {
  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope || reduceMotion()) return undefined

    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray(scope.querySelectorAll('[data-reveal]'))
      if (blocks.length) {
        gsap.set(blocks, { autoAlpha: 0, y: 34 })
        ScrollTrigger.batch(blocks, {
          start: 'top 94%',
          once: true,
          onEnter: (els) =>
            gsap.to(els, { autoAlpha: 1, y: 0, duration: 1, ease: EASE, stagger: 0.07, delay, overwrite: true, clearProps: 'transform' }),
        })
      }

      scope.querySelectorAll('[data-chars]').forEach((el) => {
        const chars = el.querySelectorAll('.hb-char')
        gsap.set(chars, { yPercent: 115 })
        gsap.to(chars, {
          yPercent: 0,
          duration: 1.05,
          ease: EASE,
          stagger: 0.035,
          delay,
          scrollTrigger: { trigger: el.closest('[data-reveal-scope]') || el, start: 'top 96%', once: true },
        })
      })

      scope.querySelectorAll('[data-line]').forEach((el) => {
        gsap.set(el, { scaleX: 0, transformOrigin: 'left center' })
        gsap.to(el, {
          scaleX: 1,
          duration: 1.2,
          ease: 'expo.inOut',
          delay,
          scrollTrigger: { trigger: el, start: 'top 98%', once: true },
        })
      })

      scope.querySelectorAll('[data-clip]').forEach((el) => {
        const img = el.querySelector('img')
        gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' })
        if (img) gsap.set(img, { scale: 1.18 })
        const tl = gsap.timeline({
          delay,
          scrollTrigger: { trigger: el, start: 'top 94%', once: true },
        })
        tl.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'expo.inOut' })
        if (img) tl.to(img, { scale: 1, duration: 1.6, ease: EASE, clearProps: 'transform' }, 0.1)
      })

      ScrollTrigger.refresh()
    }, scope)

    let alive = true
    const refresh = () => alive && ScrollTrigger.refresh()
    const raf = requestAnimationFrame(refresh)
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh, { once: true })

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

const pixelTweens = new WeakMap()

export function pixelClear(root) {
  if (!root) return
  pixelTweens.get(root)?.kill()
  pixelTweens.delete(root)
  const cells = root.querySelectorAll('.hb-px')
  if (!cells.length) return
  gsap.killTweensOf(cells)
  gsap.set(cells, { opacity: 0 })
}

export function pixelBurst(root) {
  if (!root || reduceMotion()) return
  const cells = root.querySelectorAll('.hb-px')
  if (!cells.length) return
  pixelClear(root)
  const tween = gsap
    .timeline({ onComplete: () => pixelTweens.delete(root) })
    .set(cells, { opacity: 0 })
    .to(cells, { opacity: 1, duration: 0.001, stagger: { each: 0.012, from: 'random' } })
    .to(cells, { opacity: 0, duration: 0.001, stagger: { each: 0.012, from: 'random' } })
  pixelTweens.set(root, tween)
}

/** Piccolo effetto magnetico sul bottone. */
export function magnetic(event, strength = 0.28) {
  if (!finePointer() || reduceMotion()) return
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  const x = (event.clientX - rect.left - rect.width / 2) * strength
  const y = (event.clientY - rect.top - rect.height / 2) * strength
  gsap.to(el, { x, y, duration: 0.5, ease: 'power3.out' })
}

export function magneticReset(event) {
  gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
}
