import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { PX_GRID, finePointer, reduceMotion } from './motion-utils'

const GLYPHS = '\\/_-|#*+<>=%'

function Letter({ char }) {
  return (
    <span className="hb-char-wrap" aria-hidden>
      <span className="hb-char">{char === ' ' ? '\u00a0' : char}</span>
    </span>
  )
}

/** Parole spezzate in lettere, animate da useReveal tramite data-chars. */
export function Chars({ text, className = '', reveal = true, wrap = false }) {
  const value = String(text)
  const parts = wrap ? value.split(/(\s+)/) : null
  return (
    <span className={`hb-chars${wrap ? ' is-wrap' : ''}${className ? ` ${className}` : ''}`} data-chars={reveal ? '' : undefined}>
      <span className="hb-sr">{value}</span>
      {wrap
        ? parts.map((part, index) =>
            /\s/.test(part) ? (
              <span key={`gap-${index}`} className="hb-word-gap" aria-hidden>
                {' '}
              </span>
            ) : (
              <span key={`word-${index}`} className="hb-word" aria-hidden>
                {[...part].map((char, charIndex) => (
                  <Letter key={`${charIndex}-${char}`} char={char} />
                ))}
              </span>
            ),
          )
        : [...value].map((char, index) => <Letter key={`${index}-${char}`} char={char} />)}
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
export function PixelImage({
  src,
  alt = '',
  className = '',
  eager = false,
  priority = false,
  grid = true,
  optimized = false,
  sizes = '360px',
  late = false,
  quality,
  natural = false,
}) {
  const [ready, setReady] = useState(!late)

  useEffect(() => {
    if (!late) return undefined
    let cancelled = false
    const show = () => {
      if (!cancelled) setReady(true)
    }
    const ric = window.requestIdleCallback
    const id = ric ? ric(show, { timeout: 2200 }) : window.setTimeout(show, 1400)
    return () => {
      cancelled = true
      if (ric) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
    }
  }, [late])

  const image = !ready ? null : optimized ? (
    <Image
      src={src}
      alt={alt}
      width={natural ? 1254 : 640}
      height={natural ? 1254 : 589}
      sizes={sizes}
      draggable={false}
      priority={priority}
      fetchPriority={priority ? 'high' : 'low'}
      quality={quality ?? (priority ? 50 : 55)}
      loading={priority ? undefined : eager ? 'eager' : 'lazy'}
      decoding={priority ? 'auto' : 'async'}
      style={natural ? { width: '100%', height: 'auto', display: 'block' } : { width: '100%', height: '100%', objectFit: 'cover' }}
    />
  ) : priority ? (
    <img
      src={src}
      alt={alt}
      width={640}
      height={640}
      draggable={false}
      fetchpriority="high"
      decoding="auto"
    />
  ) : (
    <img
      src={src}
      alt={alt}
      draggable={false}
      fetchPriority={priority ? 'high' : 'auto'}
      loading={priority ? 'eager' : eager ? 'eager' : 'lazy'}
      decoding={priority ? 'auto' : 'async'}
    />
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

/**
 * Custom cursor: an 80 px translucent blurred disc that trails the pointer.
 * - On surfaces marked [data-cursor-empty] (home board, intro) it shows a pixel
 *   "shuffle" icon with a spaced label underneath (e.g. S K I P).
 * - On [data-cursor] items (covers, case links) it grows to 1.5x, shows a pixel
 *   arrow and hides the label.
 * - Everywhere else it shrinks away and the native cursor does the work.
 * Disabled on touch / coarse pointers and with prefers-reduced-motion.
 */
function cursorEnabled() {
  return finePointer() && !reduceMotion()
}

// Pixel icons drawn on a 2 px grid (own artwork).
function PixelShuffle() {
  const px = [
    [0, 2], [2, 2], [4, 2], [6, 4], [8, 6], [10, 8], [12, 8], [14, 8], [16, 8], [14, 6], [14, 10],
    [0, 10], [2, 10], [4, 10], [6, 8], [10, 4], [12, 2], [14, 2], [16, 2], [14, 0], [14, 4],
  ]
  return (
    <svg className="hb-cursor-icon" viewBox="0 0 18 12" width="27" height="18" shapeRendering="crispEdges" aria-hidden>
      {px.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" fill="currentColor" />
      ))}
    </svg>
  )
}

function PixelArrow() {
  const px = [
    [0, 6], [2, 6], [4, 6], [6, 6], [8, 6], [10, 6], [12, 6], [14, 6],
    [12, 4], [10, 2], [8, 0], [12, 8], [10, 10], [8, 12],
  ]
  return (
    <svg className="hb-cursor-icon" viewBox="0 0 16 14" width="24" height="21" shapeRendering="crispEdges" aria-hidden>
      {px.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" fill="currentColor" />
      ))}
    </svg>
  )
}

export function HbCursor() {
  const enabled = useSyncExternalStore(() => () => {}, cursorEnabled, () => false)
  const dotRef = useRef(null)
  const labelRef = useRef(null)
  const pillRef = useRef(null)
  const [mode, setMode] = useState('off')

  useEffect(() => {
    if (!enabled) return undefined
    const dot = dotRef.current
    const root = document.documentElement
    root.classList.add('hb-cursor-live')
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let last = null
    let raf = 0
    let prev = performance.now()
    let current = 'off'
    // Exponential follow, time constant ~130 ms (measured on the reference).
    const loop = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      const k = 1 - Math.exp(-dt / 0.115)
      x += (tx - x) * k
      y += (ty - y) * k
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(loop)
      else raf = 0
    }
    const kick = () => {
      if (!raf) {
        prev = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }
    const paint = (target) => {
      const el = target instanceof Element ? target : null
      const pill = el?.closest('[data-cursor-pill]')
      const item = pill ? null : el?.closest('[data-cursor]')
      const empty = item || pill ? null : el?.closest('[data-cursor-empty]')
      const interactive = !item && el?.closest('a, button, input, textarea, select, label, [role="button"]')
      let next = 'off'
      if (pill) {
        next = 'pill'
        pillRef.current.textContent = pill.getAttribute('data-cursor-pill') || ''
      } else if (item) next = 'item'
      const tint = item?.getAttribute('data-tint')
      if (tint) dot.style.setProperty('--cursor-tint', tint)
      else dot.style.removeProperty('--cursor-tint')
      if (tint) dot.dataset.tinted = ''
      else delete dot.dataset.tinted
      if (item) labelRef.current.textContent = item.getAttribute('data-cursor-label') || ''
      else if (empty && !interactive) next = 'empty'
      dot.classList.toggle('on-dark', Boolean(el?.closest('.hb-welcome, .hb-menu, .hb-modal-copy, .hb-cs-results')))
      if (empty) labelRef.current.textContent = empty.getAttribute('data-cursor-empty') || ''
      if (next !== current) {
        current = next
        setMode(next)
      }
    }
    // Content can move under a still pointer (the home board pans on its own).
    const probe = window.setInterval(() => {
      if (!last) return
      const el = document.elementFromPoint(last.x, last.y)
      if (el) paint(el)
    }, 160)
    const onMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      if (!last) {
        x = event.clientX
        y = event.clientY
      }
      last = { x: event.clientX, y: event.clientY }
      tx = event.clientX
      ty = event.clientY
      dot.classList.remove('is-away')
      paint(event.target)
      kick()
    }
    const onDown = () => dot.classList.add('is-down')
    const onUp = () => dot.classList.remove('is-down')
    const onLeave = () => dot.classList.add('is-away')
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    root.addEventListener('pointerleave', onLeave)
    return () => {
      window.clearInterval(probe)
      if (raf) cancelAnimationFrame(raf)
      root.classList.remove('hb-cursor-live')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={dotRef} className={`hb-cursor is-${mode}`} aria-hidden>
      <div className="hb-cursor-disc">{mode === 'item' ? <PixelArrow /> : <PixelShuffle />}</div>
      <div ref={labelRef} className="hb-cursor-label" />
      <div ref={pillRef} className="hb-cursor-pill" />
    </div>
  )
}
