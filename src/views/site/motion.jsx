import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { PX_GRID, finePointer, reduceMotion } from './motion-fx'

const GLYPHS = '\\/_-|#*+<>=%'

/** Parole spezzate in lettere, animate da useReveal tramite data-chars. */
export function Chars({ text, className = '', reveal = true }) {
  const value = String(text)
  return (
    <span className={`hb-chars ${className}`} data-chars={reveal ? '' : undefined}>
      <span className="hb-sr">{value}</span>
      {[...value].map((char, index) => (
        <span key={`${index}-${char}`} className="hb-char-wrap" aria-hidden>
          <span className="hb-char">{char === ' ' ? '\u00a0' : char}</span>
        </span>
      ))}
    </span>
  )
}

/** Testo che si rimescola ogni volta che `play` cambia. */
export function Scramble({ text, play = 0, className }) {
  const [out, setOut] = useState(null)
  const timer = useRef(0)

  useEffect(() => {
    if (!play || reduceMotion()) return undefined
    const chars = [...String(text)]
    const total = 13
    let frame = 0
    window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      frame += 1
      if (frame >= total) {
        window.clearInterval(timer.current)
        setOut(null)
        return
      }
      setOut(
        chars
          .map((char, index) =>
            /\s|\\/.test(char) || index < (frame / total) * chars.length
              ? char
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(''),
      )
    }, 32)
    return () => window.clearInterval(timer.current)
  }, [play, text])

  return <span className={className}>{out ?? text}</span>
}

/** Griglia di pixel neri sopra un'immagine. Sulla home i pixel nascono al primo hover. */
export function PixelImage({ src, alt = '', className = '', eager = false, priority = false, grid = true, optimized = false }) {
  const image = optimized ? (
    <Image
      src={src}
      alt={alt}
      width={640}
      height={589}
      sizes="360px"
      draggable={false}
      priority={priority}
      loading={priority ? undefined : eager ? 'eager' : 'lazy'}
      decoding="async"
      style={{ width: '100%', height: '100%' }}
    />
  ) : (
    <img src={src} alt={alt} draggable="false" loading={eager || priority ? 'eager' : 'lazy'} decoding="async" />
  )

  return (
    <span className={`hb-pix ${className}`}>
      {image}
      {grid ? (
        <span className="hb-px-grid" aria-hidden>
          {Array.from({ length: PX_GRID * PX_GRID }, (_, index) => (
            <span key={index} className="hb-px" />
          ))}
        </span>
      ) : null}
    </span>
  )
}

/** Cursore custom: punto, anello su link, pillola con etichetta su [data-cursor]. */
export function HbCursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    setEnabled(finePointer() && !reduceMotion())
  }, [])

  useEffect(() => {
    if (!enabled) return undefined
    const dot = dotRef.current
    const root = document.documentElement
    root.classList.add('hb-cursor-on')
    gsap.set(dot, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const xTo = gsap.quickTo(dot, 'x', { duration: 0.42, ease: 'power3.out' })
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.42, ease: 'power3.out' })

    const paint = (event) => {
      const target = event.target instanceof Element ? event.target : null
      const labelled = target?.closest('[data-cursor]')
      const label = labelled?.getAttribute('data-cursor') || ''
      labelRef.current.textContent = label
      dot.classList.toggle('is-label', Boolean(label))
      dot.classList.toggle('is-link', !label && Boolean(target?.closest('a, button, label')))
      dot.classList.toggle('is-on-dark', Boolean(target?.closest('.hb-menu, .hb-modal-copy, .hb-cs-results')))
    }
    const onMove = (event) => {
      xTo(event.clientX)
      yTo(event.clientY)
      dot.classList.remove('is-away')
      paint(event)
    }
    const onOver = (event) => {
      paint(event)
    }
    const onDown = () => dot.classList.add('is-down')
    const onUp = () => dot.classList.remove('is-down')
    const onLeave = () => dot.classList.add('is-away')

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      root.classList.remove('hb-cursor-on')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={dotRef} className="hb-cursor" aria-hidden>
      <span ref={labelRef} className="hb-cursor-label" />
    </div>
  )
}
