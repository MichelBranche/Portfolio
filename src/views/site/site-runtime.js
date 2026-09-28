import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { bindReveal, reduceMotion, EASE } from './motion-fx'

gsap.registerPlugin(ScrollTrigger)

export function createRuntime(apiRef) {
  const lenis = new Lenis({
    duration: 1.1,
    easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
    autoRaf: false,
  })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  const api = () => apiRef.current
  if (api()?.lenisRef) api().lenisRef.current = lenis

  let revealCleanup = () => {}
  let lastRoute = null
  let lastRevealKey = null
  let prevWelcome
  let lastModal = ''
  let headerTween

  const onFonts = () => {
    ScrollTrigger.refresh()
    window.dispatchEvent(new Event('hb:refresh'))
  }
  document.fonts?.ready.then(onFonts)
  window.addEventListener('load', onFonts)

  const sync = () => {
    const s = api()
    if (!s) return
    const menuLock = Boolean(s.menuOpen || s.modalOpen)
    const hold = menuLock || s.isHome || s.welcome || s.overlayLock
    if (document.body.style.position === 'fixed' || hold) lenis.stop()
    else lenis.start()

    const route = `${s.pathname}|${s.search}`
    if (lastRoute !== null && route !== lastRoute) {
      const y = document.body.style.position === 'fixed' ? null : 0
      if (y === 0) {
        lenis.scrollTo(0, { immediate: true, force: true })
        window.scrollTo(0, 0)
      }
    }
    lastRoute = route

    const revealKey = `${route}|${s.welcome ? 1 : 0}`
    if (!s.welcome && s.mainRef?.current && revealKey !== lastRevealKey) {
      lastRevealKey = revealKey
      revealCleanup()
      revealCleanup = bindReveal(s.mainRef.current, 0.06)
    }
    if (s.welcome) lastRevealKey = revealKey

    const welcomeEnded = prevWelcome === true && s.welcome === false
    prevWelcome = s.welcome
    if (welcomeEnded && s.welcomeKnown && !reduceMotion()) {
      headerTween?.kill()
      headerTween = gsap.fromTo(
        '.hb-header > *, .hb-subline > *',
        { y: -16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: EASE, stagger: 0.07, clearProps: 'transform' },
      )
    }

    const modalKey = s.modalKey || ''
    if (modalKey && modalKey !== lastModal && s.modalRef?.current && !reduceMotion()) {
      lastModal = modalKey
      const root = s.modalRef.current
      const tl = gsap.timeline()
      tl.fromTo(root.querySelector('.hb-modal-backdrop'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 })
        .fromTo(
          root.querySelector('.hb-modal-panel'),
          { clipPath: 'inset(50% 0% 50% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'expo.inOut' },
          0,
        )
        .fromTo(
          root.querySelectorAll('.hb-modal-copy > *'),
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: EASE, stagger: 0.06 },
          0.45,
        )
      const singleImage = root.querySelector('.hb-modal-images:not(.is-stack) img')
      if (singleImage) {
        tl.fromTo(singleImage, { scale: 1.08 }, { scale: 1, duration: 1.15, ease: EASE, clearProps: 'transform' }, 0.2)
      }
    }
    if (!modalKey) lastModal = ''
  }

  return {
    sync,
    destroy() {
      revealCleanup()
      headerTween?.kill()
      window.removeEventListener('load', onFonts)
      gsap.ticker.remove(tick)
      lenis.destroy()
      if (api()?.lenisRef) api().lenisRef.current = null
    },
  }
}
