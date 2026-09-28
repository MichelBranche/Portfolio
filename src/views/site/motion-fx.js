import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EASE, PX_GRID, reduceMotion } from './motion-utils'

gsap.registerPlugin(ScrollTrigger)

export { EASE, PX_GRID, reduceMotion }
export { magnetic, magneticReset } from './magnetic'

function inView(el, ratio = 0.96) {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight || 1
  return rect.top < vh * ratio && rect.bottom > -40
}

/** Reveal su scroll. Il contenuto resta visibile se l'animazione non parte. */
export function bindReveal(scope, delay = 0) {
  if (!scope || reduceMotion()) return () => {}

  let alive = true
  const timers = []
  const plays = []

  const ctx = gsap.context(() => {
    const blocks = gsap.utils.toArray(scope.querySelectorAll('[data-reveal]'))
    blocks.forEach((el) => {
      delete el.dataset.revealed
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const already = rect.top < vh * 0.96
      if (!already) gsap.set(el, { autoAlpha: 0, y: 28 })
      const play = () => {
        if (!alive || el.dataset.revealed === '1') return
        el.dataset.revealed = '1'
        if (already) {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: EASE,
              delay,
              overwrite: 'auto',
              onComplete: () => gsap.set(el, { clearProps: 'transform' }),
            },
          )
          return
        }
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: EASE,
          delay,
          overwrite: 'auto',
          onComplete: () => gsap.set(el, { clearProps: 'transform' }),
        })
      }
      plays.push({ el, play, kind: 'block' })
      if (already) play()
      else {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 94%',
          once: true,
          onEnter: play,
        })
      }
    })

    scope.querySelectorAll('[data-chars]').forEach((el) => {
      delete el.dataset.revealed
      const chars = el.querySelectorAll('.hb-char')
      if (!chars.length) return
      const already = inView(el, 0.98)
      if (!already) gsap.set(chars, { yPercent: 115 })
      const play = () => {
        if (!alive || el.dataset.revealed === '1') return
        el.dataset.revealed = '1'
        gsap.fromTo(
          chars,
          { yPercent: 115 },
          { yPercent: 0, duration: 1.05, ease: EASE, stagger: 0.035, delay, overwrite: 'auto' },
        )
      }
      plays.push({ el, play, kind: 'chars' })
      if (already) play()
      else {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 96%',
          once: true,
          onEnter: play,
        })
      }
    })

    scope.querySelectorAll('[data-line]').forEach((el) => {
      delete el.dataset.revealed
      const already = inView(el, 0.98)
      if (!already) gsap.set(el, { scaleX: 0, transformOrigin: 'left center' })
      const play = () => {
        if (!alive || el.dataset.revealed === '1') return
        el.dataset.revealed = '1'
        gsap.to(el, { scaleX: 1, duration: 1.2, ease: 'expo.inOut', delay, overwrite: 'auto' })
      }
      plays.push({ el, play, kind: 'line' })
      if (already) play()
      else {
        ScrollTrigger.create({ trigger: el, start: 'top 98%', once: true, onEnter: play })
      }
    })

    scope.querySelectorAll('[data-clip]').forEach((el) => {
      delete el.dataset.revealed
      const img = el.querySelector('img')
      const already = inView(el, 0.94)
      if (!already) {
        gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' })
        if (img) gsap.set(img, { scale: 1.18 })
      }
      const play = () => {
        if (!alive || el.dataset.revealed === '1') return
        el.dataset.revealed = '1'
        const tl = gsap.timeline({ delay })
        tl.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'expo.inOut' })
        if (img) tl.to(img, { scale: 1, duration: 1.6, ease: EASE, clearProps: 'transform' }, 0.1)
      }
      plays.push({ el, play, kind: 'clip' })
      if (already) play()
      else {
        ScrollTrigger.create({ trigger: el, start: 'top 94%', once: true, onEnter: play })
      }
    })
  }, scope)

  const force = () => {
    if (!alive || !scope.isConnected) return
    const vh = window.innerHeight || 1
    scope.querySelectorAll('[data-reveal]').forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top > vh * 0.98) return
      const opacity = Number(gsap.getProperty(el, 'opacity'))
      if (opacity < 0.95) gsap.set(el, { autoAlpha: 1, y: 0, clearProps: 'transform' })
    })
    scope.querySelectorAll('[data-chars]').forEach((el) => {
      if (el.getBoundingClientRect().top > vh) return
      const chars = el.querySelectorAll('.hb-char')
      const hidden = [...chars].some((char) => Number(gsap.getProperty(char, 'yPercent')) > 8)
      if (hidden) gsap.set(chars, { yPercent: 0 })
    })
    scope.querySelectorAll('[data-line]').forEach((el) => {
      if (el.getBoundingClientRect().top > vh) return
      if (Number(gsap.getProperty(el, 'scaleX')) < 0.98) gsap.set(el, { scaleX: 1 })
    })
    scope.querySelectorAll('[data-clip]').forEach((el) => {
      if (el.getBoundingClientRect().top > vh) return
      gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)' })
      const img = el.querySelector('img')
      if (img) gsap.set(img, { clearProps: 'transform' })
    })
  }

  const nudge = () => {
    if (!alive) return
    plays.forEach(({ el, play }) => {
      if (el.dataset.revealed === '1') return
      const rect = el.getBoundingClientRect()
      if (rect.top < (window.innerHeight || 1) * 0.98) play()
    })
  }
  const raf = requestAnimationFrame(() => {
    ScrollTrigger.refresh()
    nudge()
  })
  document.fonts?.ready.then(() => {
    if (!alive) return
    ScrollTrigger.refresh()
    nudge()
  })
  window.addEventListener('load', nudge, { once: true })
  window.addEventListener('scroll', nudge, { passive: true })
  window.addEventListener('hb:refresh', nudge)
  timers.push(window.setTimeout(nudge, 400))
  timers.push(window.setTimeout(force, 2200))
  timers.push(window.setTimeout(force, 3600))

  return () => {
    alive = false
    cancelAnimationFrame(raf)
    timers.forEach((id) => window.clearTimeout(id))
    window.removeEventListener('load', nudge)
    window.removeEventListener('scroll', nudge)
    window.removeEventListener('hb:refresh', nudge)
    ctx.revert()
  }
}

export function useReveal(scopeRef, deps, delay = 0) {
  useLayoutEffect(() => {
    const scope = scopeRef.current
    return bindReveal(scope, delay)
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

function ensurePixelGrid(root) {
  if (root.querySelector('.hb-px')) return
  const pix = root.querySelector('.hb-pix')
  if (!pix) return
  const grid = document.createElement('span')
  grid.className = 'hb-px-grid'
  grid.setAttribute('aria-hidden', 'true')
  const count = PX_GRID * PX_GRID
  for (let index = 0; index < count; index += 1) {
    const cell = document.createElement('span')
    cell.className = 'hb-px'
    grid.appendChild(cell)
  }
  pix.appendChild(grid)
}

export function pixelBurst(root) {
  if (!root || reduceMotion()) return
  ensurePixelGrid(root)
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
