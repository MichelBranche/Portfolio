import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const VisualSection = lazy(() => import('./VisualSection.jsx').then((m) => ({ default: m.VisualSection })))

function VisualSectionFallback() {
  return (
    <section
      className="visual-section visual-section--lazy-placeholder"
      style={{ minHeight: 'min(100vh, 1400px)' }}
      aria-hidden
    />
  )
}

/**
 * Defers the heavy visual section (Framer, YouTube API, extra GSAP) until
 * the block is near the viewport.
 */
export function VisualSectionLazy() {
  const wrapRef = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || show) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
        }
      },
      { root: null, rootMargin: '480px 0px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [show])

  return (
    <div ref={wrapRef} className="visual-section-lazy-wrap">
      {show ? (
        <Suspense fallback={<VisualSectionFallback />}>
          <VisualSection />
        </Suspense>
      ) : (
        <VisualSectionFallback />
      )}
    </div>
  )
}
