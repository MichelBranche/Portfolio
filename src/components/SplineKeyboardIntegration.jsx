import { useEffect, useRef } from 'react'
import { Application } from '@splinetool/runtime'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMediaQuery } from '../hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

export default function SplineKeyboardIntegration() {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const app = new Application(canvas)
    const triggers = []
    let masterTl = null
    let keyInterval = null

    app
      .load("https://prod.spline.design/ZZOWNi4tS7p8xxOs/scene.splinecode")
      .then(() => {
        const keyboard = app.findObjectByName("keyboard")
        if (!keyboard) return

        // Stable section targets (manual art direction).
        const xWord = 230
        const xPart1 = -320
        const xPart2 = 360

        // ── INITIAL STATE: Hidden + Parked ──
        gsap.set(wrap, { opacity: 0 })
        gsap.set(wrap, { filter: 'blur(0px) brightness(1)' })
        gsap.set(keyboard.scale, { x: 1, y: 1, z: 1 })
        gsap.set(keyboard.position, { x: 800, y: 150 }) // Off right
        gsap.set(keyboard.rotation, { x: 0, y: 0, z: 0 })

        // Single choreography timeline: avoids conflicting transforms across sections.
        masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#wordscroll-section',
            start: 'top 82%',
            endTrigger: '#part2b-video',
            end: 'top 70%',
            scrub: 1.8,
            invalidateOnRefresh: true,
          },
        })

        // WordScroll anchor (right, visible but not invasive)
        masterTl
          .to(wrap, { opacity: 1, duration: 0.5, ease: 'none' }, 0)
          // Keep words readable while keyboard overlaps the WordScroll text.
          .to(wrap, { filter: 'blur(6px) brightness(0.92)', duration: 0.85, ease: 'none' }, 0)
          .to(keyboard.position, { x: xWord, y: 22, duration: 1, ease: 'none' }, 0)
          .to(keyboard.scale, { x: 1.04, y: 1.04, z: 1.04, duration: 1, ease: 'none' }, 0)
          .to(keyboard.rotation, { x: 0, y: -0.2, z: 0, duration: 1, ease: 'none' }, 0)

          // Part 1 pose (left occupancy)
          .to(wrap, { filter: 'blur(1.5px) brightness(0.98)', duration: 0.5, ease: 'none' }, 0.92)
          // Accent rotation while crossing right -> left
          .to(keyboard.rotation, { y: 0.72, duration: 0.62, ease: 'none' }, 0.94)
          .to(keyboard.position, { x: xPart1, y: -70, duration: 1.18, ease: 'none' }, 1.35)
          .to(keyboard.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 1.18, ease: 'none' }, 1.35)
          .to(keyboard.rotation, { x: -Math.PI / 13, y: 0.05, z: Math.PI / 40, duration: 1.18, ease: 'none' }, 1.35)

          // Part 2 pose (right occupancy)
          .to(wrap, { filter: 'blur(0px) brightness(1)', duration: 0.55, ease: 'none' }, 2.3)
          // Accent rotation while crossing left -> right
          .to(keyboard.rotation, { y: -0.68, duration: 0.62, ease: 'none' }, 2.3)
          .to(keyboard.position, { x: xPart2, y: -55, duration: 1.18, ease: 'none' }, 2.95)
          .to(keyboard.scale, { x: 0.9, y: 0.9, z: 0.9, duration: 1.18, ease: 'none' }, 2.95)
          .to(keyboard.rotation, { x: Math.PI / 38, y: -0.18, z: 0, duration: 1.18, ease: 'none' }, 2.95)

          // Part 3 exit
          .to(keyboard.position, { x: 0, y: -115, duration: 1, ease: 'none' }, 3.8)
          .to(keyboard.scale, { x: 0.82, y: 0.82, z: 0.82, duration: 1, ease: 'none' }, 3.8)
          .to(keyboard.rotation, { x: 0, y: 0, z: 0, duration: 1, ease: 'none' }, 3.8)
          .to(wrap, { opacity: 0, duration: 0.65, ease: 'none' }, 4.1)

        // Section-bound interactions only (no transform ownership here)
        triggers.push(
          ScrollTrigger.create({
            trigger: '#part1',
            start: 'top 85%',
            end: 'bottom 45%',
            onEnter: () => {
              if (!keyInterval) keyInterval = setInterval(() => app.emitEvent('keyDown', 'keyboard'), 1500)
            },
            onEnterBack: () => {
              if (!keyInterval) keyInterval = setInterval(() => app.emitEvent('keyDown', 'keyboard'), 1500)
            },
            onLeave: () => {
              if (keyInterval) {
                clearInterval(keyInterval)
                keyInterval = null
              }
            },
            onLeaveBack: () => {
              if (keyInterval) {
                clearInterval(keyInterval)
                keyInterval = null
              }
            },
          })
        )

        triggers.push(
          ScrollTrigger.create({
            trigger: '#part2',
            start: 'top 85%',
            onEnter: () => app.emitEvent('mouseDown', 'keyboard'),
            onEnterBack: () => app.emitEvent('mouseDown', 'keyboard'),
          })
        )

      })

    return () => {
      if (masterTl) masterTl.kill()
      triggers.forEach((t) => t?.kill?.())
      if (keyInterval) clearInterval(keyInterval)
      app.dispose()
    }
  }, [isMobile])

  return (
    <div
      ref={wrapRef}
      className="spline-bg-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
