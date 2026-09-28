import { finePointer, reduceMotion } from './motion-utils'

function withGsap(run) {
  import('gsap').then(({ default: gsap }) => run(gsap))
}

export function magnetic(event, strength = 0.28) {
  if (!finePointer() || reduceMotion()) return
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  const x = (event.clientX - rect.left - rect.width / 2) * strength
  const y = (event.clientY - rect.top - rect.height / 2) * strength
  withGsap((gsap) => gsap.to(el, { x, y, duration: 0.5, ease: 'power3.out' }))
}

export function magneticReset(event) {
  const el = event.currentTarget
  withGsap((gsap) => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }))
}
