import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const SKIP_INTRO_KEY = 'portfolio:skipIntro'
export const SCROLL_TO_KEY = 'portfolio:scrollTo'

const COVER_DUR = 0.55
const REVEAL_DUR = 0.65
const HOLD_AFTER_READY = 0.12

export function getPageTransitionEl() {
  return document.getElementById('page-transition')
}

export function isPageTransitionCovering() {
  const el = getPageTransitionEl()
  if (!el) return false
  return Number(gsap.getProperty(el, 'autoAlpha')) > 0.5
}

/** Copre lo schermo, poi esegue `onCovered` (es. navigate). */
export function playPageCover(onCovered) {
  const el = getPageTransitionEl()
  if (!el) {
    onCovered?.()
    return
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  gsap.killTweensOf(el)

  if (reduced) {
    gsap.set(el, { autoAlpha: 1, yPercent: 0 })
    onCovered?.()
    return
  }

  gsap
    .timeline({ defaults: { force3D: true } })
    .set(el, { autoAlpha: 1, yPercent: 100 })
    .to(el, {
      yPercent: 0,
      duration: COVER_DUR,
      ease: 'power3.inOut',
    })
    .add(() => {
      onCovered?.()
    })
}

/**
 * Prepara la home sotto la copertura nera (preloader off + scroll a #work),
 * poi rivela con timing stabile.
 */
export function landHomeUnderCover({ scrollTo = 'work', lenis } = {}, onRevealed) {
  const el = getPageTransitionEl()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const preloader = document.querySelector('.preloader')
  if (preloader) {
    gsap.set(preloader, { yPercent: -100, pointerEvents: 'none' })
  }

  if (lenis?.start) lenis.start()

  const target = document.getElementById(scrollTo)
  if (target && lenis?.scrollTo) {
    lenis.scrollTo(target, { immediate: true, force: true })
  } else if (target) {
    target.scrollIntoView({ block: 'start' })
  }

  ScrollTrigger.refresh()

  if (!el) {
    clearSkipIntro()
    onRevealed?.()
    return
  }

  gsap.killTweensOf(el)

  if (reduced) {
    gsap.set(el, { autoAlpha: 0, yPercent: 100 })
    clearSkipIntro()
    onRevealed?.()
    return
  }

  // Copertura piena e ferma, hold breve, poi uscita verso l’alto
  gsap
    .timeline({
      defaults: { force3D: true },
      onComplete: () => {
        clearSkipIntro()
        onRevealed?.()
      },
    })
    .set(el, { autoAlpha: 1, yPercent: 0 })
    .to({}, { duration: HOLD_AFTER_READY })
    .to(el, {
      yPercent: -100,
      duration: REVEAL_DUR,
      ease: 'power3.inOut',
    })
    .set(el, { autoAlpha: 0, yPercent: 100 })
}

export function markSkipIntro(scrollToId = 'work') {
  try {
    sessionStorage.setItem(SKIP_INTRO_KEY, '1')
    sessionStorage.setItem(SCROLL_TO_KEY, scrollToId)
  } catch {
    /* ignore */
  }
}

export function readSkipIntro() {
  try {
    const skip =
      sessionStorage.getItem(SKIP_INTRO_KEY) === '1' || isPageTransitionCovering()
    const scrollTo = sessionStorage.getItem(SCROLL_TO_KEY) || 'work'
    return { skip, scrollTo }
  } catch {
    return { skip: isPageTransitionCovering(), scrollTo: 'work' }
  }
}

export function clearSkipIntro() {
  try {
    sessionStorage.removeItem(SKIP_INTRO_KEY)
    sessionStorage.removeItem(SCROLL_TO_KEY)
  } catch {
    /* ignore */
  }
}

export function peekSkipIntro() {
  return readSkipIntro().skip
}
