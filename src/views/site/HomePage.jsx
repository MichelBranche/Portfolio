'use client'

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { Scramble } from './motion.jsx'
import { magnetic, magneticReset } from './magnetic'
import { finePointer, reduceMotion } from './motion-utils'
import { HOME_ART } from '../../config/site.js'
import { applyTheme, wipe } from './theme.js'
import { startMusic } from './music.jsx'
import { useSiteUI } from './site-ui.js'

// Infinite board of illustrations (transparent cut-outs), modelled on the reference at
// 1440x900: cells of ~690 x 720 px (median gap between neighbours ~385 px), one piece per
// cell, longest side between ~240 and ~470 px, loosely offset inside its cell. An 11 x 4
// module holds each of the 22 illustrations twice (rows 0-1 in board order, rows 2-3 the
// same order shifted by 5, so a piece never meets itself or its look-alikes) and repeats
// seamlessly in both directions.
const COLS = 11
const ROWS = 4
const CELL_W = 640
const CELL_H = 650
const CAPTION_H = 56
const SIZES = [
  330, 270, 410, 300, 250, 370, 440, 290, 345, 260, 400, 315, 470, 280, 355, 240,
  385, 305, 335, 265, 420, 295, 360, 275, 310, 450, 255, 380, 290, 425, 245, 350,
]

// Small deterministic generator so the layout is loose but identical on every visit.
function seeded(seed) {
  let v = seed >>> 0
  return () => {
    v = (v * 1664525 + 1013904223) >>> 0
    return v / 4294967296
  }
}

// Cursor offset from the centre (normalised to -1..1 per axis, against the viewport)
// drives a constant pan speed, measured frame by frame on the reference: 3.48 px per
// 60 fps frame at the edge on a 1440 px wide window (4.55 at 1920), i.e. ~0.0024 x
// viewport width per frame, linear, same on both axes, no ramp-up, no inertia.
const PAN_PER_FRAME = 0.00777

export function boardScale(width, compact) {
  if (compact) return 0.5
  return Math.round(Math.min(1.6, Math.max(0.8, width / 1440)) * 20) / 20
}

function boardGeometry(scale) {
  const rand = seeded(7)
  const slots = []
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const index = r * COLS + c
      const art = HOME_ART[(r >= 2 ? index - 2 * COLS + 5 : index) % HOME_ART.length]
      // Depth like the reference's 3D scene: each piece sits at its own z (camera at 700,
      // z within about -45..+50), so it looks slightly bigger and pans slightly faster
      // the closer it is. f is the on-screen speed and size factor (0.94..1.07).
      const z = -45 + rand() * 95
      const f = 700 / (700 - z) / 1.0045
      // Sized by area rather than by the long side, so wide pieces are not thin strips.
      const side = (0.8 * SIZES[index % SIZES.length] + 95) * f
      const ratio = art.width / art.height
      let w = side * Math.sqrt(ratio)
      let h = side / Math.sqrt(ratio)
      const fit = Math.min(1, (CELL_W - 70) / w, (CELL_H - CAPTION_H - 50) / h)
      w *= fit
      h *= fit
      // Even spacing: each piece sits near the middle of its own cell with a modest jitter
      // (a quarter of the free room each way), and odd rows are shifted by half a cell
      // (brick pattern), so gaps stay similar everywhere instead of clustering.
      const freeX = Math.max(0, CELL_W - w)
      const freeY = Math.max(0, CELL_H - h - CAPTION_H)
      const dx = freeX / 2 + (rand() - 0.5) * freeX * 0.5 + (r % 2) * (CELL_W / 2)
      const dy = freeY / 2 + (rand() - 0.5) * freeY * 0.5
      slots.push({
        index,
        art,
        x: Math.round((c * CELL_W + dx) * scale),
        y: Math.round((r * CELL_H + dy) * scale),
        w: Math.round(w * scale),
        h: Math.round(h * scale),
        k: f - 1,
        zi: Math.round(z + 50),
      })
    }
  }
  return { scale, width: Math.round(COLS * CELL_W * scale), height: Math.round(ROWS * CELL_H * scale), slots }
}

function boardSpan(width, height, geo) {
  return {
    // One extra copy on each side: depth drift can carry a piece up to half a module away.
    cols: Math.min(5, Math.ceil(width / geo.width) + 2),
    rows: Math.min(5, Math.ceil(height / geo.height) + 2),
  }
}

function look(offset) {
  // offset is -0.5..0.5 across the viewport; returns px per 60 fps frame.
  const n = Math.max(-1, Math.min(1, offset * 2))
  return { push: -n * PAN_PER_FRAME * window.innerWidth, parallax: 0 }
}

function wheelUnit(event, viewport) {
  if (event.deltaMode === 1) return 16
  if (event.deltaMode === 2) return viewport
  return 1
}

const COMPACT_QUERY = '(max-width: 760px)'

// Live clock per place (date + time on the right of each caption, like the reference).
function useNow() {
  const [now, setNow] = useState(null)
  useEffect(() => {
    // Re-render the captions only when the minute changes.
    const tick = () => setNow((prev) => {
      const next = new Date()
      return prev && Math.floor(prev.getTime() / 60000) === Math.floor(next.getTime() / 60000) ? prev : next
    })
    tick()
    const id = window.setInterval(tick, 20000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

const FORMATTERS = new Map()

function clock(now, timeZone) {
  if (!now) return ['', '']
  let fmt = FORMATTERS.get(timeZone)
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    FORMATTERS.set(timeZone, fmt)
  }
  const parts = Object.fromEntries(
    fmt
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  )
  return [`${parts.day}.${parts.month}.${parts.year}`, `H. ${parts.hour}.${parts.minute}`]
}

function ArtTile({ spot, lang, now, label, cursorLabel, eager, tabIndex, onHover }) {
  const { art } = spot
  const [place, region] = art.caption[lang] || art.caption.en
  const [day, time] = clock(now, art.timeZone)
  return (
    <a
      href="/portfolio"
      className="hb-art"
      tabIndex={tabIndex}
      style={{ left: spot.x, top: spot.y, width: spot.w, zIndex: spot.zi }}
      data-cursor={label}
      data-name={place}
      data-tint={art.tint}
      data-cursor-label={cursorLabel}
      draggable={false}
      onPointerEnter={() => onHover(place, art.tint)}
      onPointerLeave={() => onHover('', '')}
    >
      <span
        className="hb-art-fig"
        data-hover={art.hover || undefined}
        style={art.hover === 'glint' ? { '--mask': `url(${art.src})` } : undefined}
      >
      <img
        src={art.src}
        alt={`${place}, ${region}`}
        width={art.width}
        height={art.height}
        style={{ width: spot.w, height: spot.h }}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
      />
      </span>
      <span className="hb-art-cap">
        <span>
          {place}
          <br />
          {region}
        </span>
        <span className="hb-art-time">
          {day}
          <br />
          {time}
        </span>
      </span>
    </a>
  )
}

const Board = memo(function Board({ geo, lang, now, label, cursorLabel, onHover, cols, rows }) {
  const colIds = Array.from({ length: cols }, (_, index) => index)
  const rowIds = Array.from({ length: rows }, (_, index) => index)
  return rowIds.map((row) =>
    colIds.map((col) => {
      const primary = col === 0 && row === 0
      return (
        <div
          key={`${col}-${row}`}
          className="hb-board-cell"
          style={{ width: geo.width, height: geo.height, containIntrinsicSize: `${geo.width}px ${geo.height}px` }}
          data-i={col}
          data-j={row}
          data-primary={primary ? '' : undefined}
          aria-hidden={primary ? undefined : true}
        >
          {geo.slots.map((spot) => (
            <ArtTile
              key={spot.index}
              spot={spot}
              lang={lang}
              now={now}
              label={label}
              cursorLabel={cursorLabel}
              eager={primary && spot.index < 4}
              tabIndex={primary && spot.index < HOME_ART.length ? 0 : -1}
              onHover={onHover}
            />
          ))}
        </div>
      )
    }),
  )
})

export function HomePage() {
  const { t, lang } = useLanguage()
  const { go, introDone, showSkip } = useSiteUI()
  const now = useNow()
  const gateRef = useRef(null)
  const boardRef = useRef(null)
  const draggedRef = useRef(false)
  const panningRef = useRef(false)
  const [span, setSpan] = useState({ cols: 1, rows: 1 })
  const [fullBoard, setFullBoard] = useState(false)
  const [compact, setCompact] = useState(null)
  const [scale, setScale] = useState(1)
  const geo = useMemo(() => boardGeometry(scale), [scale])
  const [hovered, setHovered] = useState('')
  const [labelPlay, setLabelPlay] = useState(0)
  const stageA = useRef(null)
  const stageB = useRef(null)
  const stageFlip = useRef(0)
  const hover = useCallback((name, tint) => {
    setHovered(name)
    // Hovering a cover tints the whole stage with that cover's colour; leaving restores it.
    // Cross-fade two fixed overlays (opacity only, composited) instead of animating the
    // page background, which repainted the whole screen for 0.6 s.
    const layers = [stageA.current, stageB.current]
    if (layers[0] && layers[1]) {
      if (tint) {
        const next = layers[stageFlip.current]
        const prev = layers[1 - stageFlip.current]
        stageFlip.current = 1 - stageFlip.current
        next.style.backgroundColor = tint
        next.style.opacity = '1'
        prev.style.opacity = '0'
      } else {
        layers[0].style.opacity = '0'
        layers[1].style.opacity = '0'
      }
    }
    setLabelPlay((n) => n + 1)
  }, [])
  const hoverRef = useRef(hover)
  useEffect(() => {
    hoverRef.current = hover
  }, [hover])

  useLayoutEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY)
    const apply = () => {
      setCompact(mq.matches)
      setScale(boardScale(window.innerWidth, mq.matches))
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useLayoutEffect(() => {
    if (compact == null) return undefined
    const geo = boardGeometry(scale)
    const BOARD_W = geo.width
    const BOARD_H = geo.height
    const gate = gateRef.current
    const board = boardRef.current
    if (!gate || !board) return undefined

    const fitted = fullBoard ? boardSpan(gate.clientWidth, gate.clientHeight, geo) : { cols: 1, rows: 1 }
    if (fitted.cols !== span.cols || fitted.rows !== span.rows) {
      setSpan(fitted)
      return undefined
    }

    const cells = [...board.querySelectorAll('.hb-board-cell')]
    const slots = geo.slots
    const tilesOf = cells.map((cell) => [...cell.querySelectorAll(':scope > .hb-art')])
    const shown = cells.map((cell, c) => tilesOf[c].map(() => true))
    const dxs = new Float64Array(slots.length)
    const dys = new Float64Array(slots.length)
    const DRIFT_R = 420 * geo.scale
    const decoded = new WeakSet()
    let viewW = window.innerWidth
    let viewH = window.innerHeight
    const fine = finePointer()
    const calm = reduceMotion()
    let scrollX = 0
    let scrollY = 0
    let destX = 0
    let destY = 0
    let parX = 0
    let parY = 0
    let wantParX = 0
    let wantParY = 0
    let velX = 0
    let velY = 0
    let pushX = 0
    let pushY = 0
    let moved = false
    let drag = null
    let placed = { col: null, row: null }
    let absX = 0
    let absY = 0
    let last = performance.now()

    const place = () => {
      const shiftX = Math.round(scrollX / BOARD_W) * BOARD_W
      const shiftY = Math.round(scrollY / BOARD_H) * BOARD_H
      if (shiftX || shiftY) {
        absX += shiftX
        absY += shiftY
        scrollX -= shiftX
        scrollY -= shiftY
        destX -= shiftX
        destY -= shiftY
        if (drag) {
          drag.ox -= shiftX
          drag.oy -= shiftY
        }
        placed = { col: null, row: null }
      }
      const x = scrollX + parX
      const y = scrollY + parY
      const baseCol = Math.floor(-x / BOARD_W)
      const baseRow = Math.floor(-y / BOARD_H)
      if (baseCol !== placed.col || baseRow !== placed.row) {
        cells.forEach((cell) => {
          const i = Number(cell.dataset.i)
          const j = Number(cell.dataset.j)
          cell.style.left = `${(baseCol - 1 + i) * BOARD_W}px`
          cell.style.top = `${(baseRow - 1 + j) * BOARD_H}px`
        })
        placed = { col: baseCol, row: baseRow }
      }
      board.style.transform = `translate3d(${x}px,${y}px,0)`
      // Per-piece depth drift, wrapped to +-half a module. Every copy moves the same way,
      // so a wrap lands a piece exactly on its twin and is invisible. Positions are worked
      // out arithmetically (no layout reads); only pieces near the viewport are shown and
      // get a transform write, the rest are display:none (no paint, no image decoding).
      const vw = viewW
      const vh = viewH
      // A quarter screen of buffer around the viewport so images are decoded before they show.
      const margin = Math.max(vw, vh) * 0.25
      for (let s = 0; s < slots.length; s += 1) {
        const spot = slots[s]
        // Bounded depth drift: speed is (1 + k cos phase), so nearer pieces still move a
        // little faster or slower than the board, but they only sway around their home
        // spot (at most ~30 px) and can never drift into each other.
        dxs[s] = spot.k * DRIFT_R * Math.sin((x + absX) / DRIFT_R)
        dys[s] = spot.k * DRIFT_R * Math.sin((y + absY) / DRIFT_R)
      }
      for (let c = 0; c < cells.length; c += 1) {
        const cell = cells[c]
        const ox = x + (baseCol - 1 + Number(cell.dataset.i)) * BOARD_W
        const oy = y + (baseRow - 1 + Number(cell.dataset.j)) * BOARD_H
        const list = tilesOf[c]
        for (let s = 0; s < list.length; s += 1) {
          const el = list[s]
          const spot = slots[s]
          const sx = ox + spot.x + dxs[s]
          const sy = oy + spot.y + dys[s]
          const show = sx < vw + margin && sx + spot.w > -margin && sy < vh + margin && sy + spot.h + 60 > -margin
          if (show !== shown[c][s]) {
            shown[c][s] = show
            el.style.display = show ? '' : 'none'
            if (show && !decoded.has(el)) {
              decoded.add(el)
              el.querySelector('img')?.decode?.().catch(() => {})
            }
          }
          if (show) el.style.transform = `translate3d(${dxs[s].toFixed(1)}px,${dys[s].toFixed(1)}px,0)`
        }
      }
    }

    const center = () => {
      // Start with the newest project (slot 0) in the top-left corner; the board loops from there.
      // Newest project (cell 0) starts near the top-left; the board loops from there.
      scrollX = Math.round(-60 * geo.scale)
      scrollY = Math.round(-20 * geo.scale)
      destX = scrollX
      destY = scrollY
      parX = 0
      parY = 0
      wantParX = 0
      wantParY = 0
      velX = 0
      velY = 0
      pushX = 0
      pushY = 0
      placed = { col: null, row: null }
      place()
    }

    const tick = () => {
      if (drag) return
      const now = performance.now()
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const step = dt * 60
      // Constant speed while the cursor is off-centre, immediate stop otherwise (no inertia).
      velX = pushX
      velY = pushY
      if (Math.abs(velX) < 0.04) velX = 0
      if (Math.abs(velY) < 0.04) velY = 0
      if (velX || velY) {
        scrollX += velX * step
        scrollY += velY * step
        destX += velX * step
        destY += velY * step
        moved = true
      }
      const follow = 1 - Math.exp(-dt / 0.05)
      const wx = destX - scrollX
      const wy = destY - scrollY
      if (wx || wy) {
        scrollX += Math.abs(wx) < 0.2 ? wx : wx * follow
        scrollY += Math.abs(wy) < 0.2 ? wy : wy * follow
        moved = true
      }
      const nextParX = Math.abs(wantParX - parX) < 0.2 ? wantParX : parX + (wantParX - parX) * 0.22
      const nextParY = Math.abs(wantParY - parY) < 0.2 ? wantParY : parY + (wantParY - parY) * 0.22
      const gliding = false
      panningRef.current = gliding
      gate.classList.toggle('is-gliding', gliding)
      const idle = !velX && !velY && !wx && !wy && nextParX === parX && nextParY === parY
      parX = nextParX
      parY = nextParY
      if (!idle) {
        place()
        hitFrame += 1
        if (hitFrame % 8 === 0) hitTest()
      }
    }

    // Tracked on the window: the navbar and overlays sit on top of the board but never
    // interrupt the pan. The whole viewport is the control surface, like the reference.
    let pointer = null
    let hitTile = null
    let hitFrame = 0
    const hitTest = () => {
      if (!pointer || drag) return
      const el = document.elementFromPoint(pointer.x, pointer.y)
      const tile = el instanceof Element ? el.closest('.hb-art') : null
      if (tile === hitTile) return
      hitTile = tile
      hoverRef.current(tile ? tile.dataset.name || '' : '', tile ? tile.dataset.tint || '' : '')
    }
    const onMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      pointer = { x: event.clientX, y: event.clientY }
      if (!fine || drag || calm) return
      if (document.querySelector('.hb-welcome')) {
        pushX = 0
        pushY = 0
        return
      }
      wake()
      const w = window.innerWidth
      const h = window.innerHeight
      if (!w || !h) return
      const lookX = look(event.clientX / w - 0.5)
      const lookY = look(event.clientY / h - 0.5)
      wantParX = lookX.parallax
      wantParY = lookY.parallax
      pushX = lookX.push
      pushY = lookY.push
    }


    const onDown = (event) => {
      if (event.button !== 0) return
      if (event.target instanceof Element && event.target.closest('.hb-skip')) return
      draggedRef.current = false
      panningRef.current = true
      gate.classList.add('is-dragging')
      scrollX += parX
      scrollY += parY
      destX = scrollX
      destY = scrollY
      parX = 0
      parY = 0
      wantParX = 0
      wantParY = 0
      pushX = 0
      pushY = 0
      velX = 0
      velY = 0
      drag = {
        sx: event.clientX,
        sy: event.clientY,
        ox: scrollX,
        oy: scrollY,
        lx: event.clientX,
        ly: event.clientY,
        vx: 0,
        vy: 0,
      }
    }

    const onDrag = (event) => {
      if (!drag) return
      const dx = event.clientX - drag.sx
      const dy = event.clientY - drag.sy
      if (Math.abs(dx) + Math.abs(dy) > 6) draggedRef.current = true
      drag.vx = event.clientX - drag.lx
      drag.vy = event.clientY - drag.ly
      drag.lx = event.clientX
      drag.ly = event.clientY
      scrollX = drag.ox + dx
      scrollY = drag.oy + dy
      destX = scrollX
      destY = scrollY
      moved = true
      place()
    }

    const onUp = () => {
      if (!drag) return
      panningRef.current = false
      gate.classList.remove('is-dragging')
      if (!calm) {
        const vx = Math.max(-42, Math.min(42, drag.vx))
        const vy = Math.max(-42, Math.min(42, drag.vy))
        // No fling: the board stays where it is released, like the mouse pan.
        destX = scrollX + vx * 0
        destY = scrollY + vy * 0
        wake()
      }
      drag = null
    }

    const onWheel = (event) => {
      event.preventDefault()
      const unitX = wheelUnit(event, gate.clientWidth)
      const unitY = wheelUnit(event, gate.clientHeight)
      destX -= event.deltaX * unitX
      destY -= event.deltaY * unitY
      moved = true
      if (calm) {
        scrollX = destX
        scrollY = destY
        place()
      } else wake()
    }

    const onResize = () => {
      viewW = window.innerWidth
      viewH = window.innerHeight
      const nextScale = boardScale(window.innerWidth, compact)
      if (nextScale !== scale) {
        setScale(nextScale)
        return
      }
      const next = fullBoard ? boardSpan(gate.clientWidth, gate.clientHeight, geo) : { cols: 1, rows: 1 }
      if (next.cols !== span.cols || next.rows !== span.rows) {
        setSpan(next)
        return
      }
      if (!moved) center()
      else {
        placed = { col: null, row: null }
        place()
      }
    }

    center()
    window.addEventListener('pointermove', onMove)
    gate.addEventListener('pointerdown', onDown)
    gate.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('pointermove', onDrag)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    window.addEventListener('resize', onResize)
    let raf = 0
    let awake = false
    const loop = () => {
      tick()
      const still =
        !drag &&
        !velX &&
        !velY &&
        Math.abs(destX - scrollX) < 0.2 &&
        Math.abs(destY - scrollY) < 0.2 &&
        Math.abs(wantParX - parX) < 0.2 &&
        Math.abs(wantParY - parY) < 0.2
      if (!awake || still) {
        awake = false
        raf = 0
        return
      }
      raf = requestAnimationFrame(loop)
    }
    const wake = () => {
      if (calm) return
      awake = true
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const stopLoop = () => {
      awake = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }
    return () => {
      stopLoop()
      window.removeEventListener('pointermove', onMove)
      gate.removeEventListener('pointerdown', onDown)
      gate.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointermove', onDrag)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('resize', onResize)
    }
  }, [span.cols, span.rows, fullBoard, compact, scale])

  useEffect(() => {
    const ric = window.requestIdleCallback
    const id = ric ? ric(() => setFullBoard(true), { timeout: 1800 }) : window.setTimeout(() => setFullBoard(true), 1200)
    return () => {
      if (ric) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
    }
  }, [])

  useEffect(() => {
    if (!introDone || reduceMotion()) return undefined
    const gate = gateRef.current
    if (!gate) return undefined
    let dead = false
    let tween
    const run = () => {
      import('gsap').then(({ default: gsap }) => {
        if (dead) return
        // Only the pieces actually on screen (culled ones are display:none).
        const tiles = [...gate.querySelectorAll('.hb-art')]
          .filter((el) => el.style.display !== 'none')
          .flatMap((el) => [...el.children])
        tween = gsap.fromTo(
          tiles,
          { y: 22 },
          { y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.01, clearProps: 'transform' },
        )
      })
    }
    const ric = window.requestIdleCallback
    const id = ric ? ric(run, { timeout: 2000 }) : window.setTimeout(run, 600)
    return () => {
      dead = true
      if (ric) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
      tween?.kill()
    }
  }, [introDone, span.cols, span.rows])

  return (
    <div
      ref={gateRef}
      data-cursor-empty={String(t('site.skip'))}
      onClick={(event) => {
        // Any illustration or empty space leads to the projects page (unless it was a drag).
        const el = event.target instanceof Element ? event.target : null
        if (el?.closest('button:not(.hb-art)')) return
        event.preventDefault()
        if (draggedRef.current) return
        const art = el?.closest('.hb-art')
        const tint = art?.dataset.tint
        if (!tint) {
          // Empty space: default theme.
          applyTheme(null)
          go('/portfolio')
          return
        }
        startMusic()
        wipe(tint, event.clientX, event.clientY, () => {
          applyTheme(tint)
          go('/portfolio')
        })
      }}
      className={compact == null ? 'hb-gate is-pending' : compact ? 'hb-gate is-board-compact' : 'hb-gate'}
      onPointerLeave={() => setHovered('')}
    >
      <div ref={stageA} className="hb-stage" aria-hidden />
      <div ref={stageB} className="hb-stage" aria-hidden />
      <h1 className="hb-sr-only">{String(t('site.h1Home'))}</h1>
      <p className="hb-audience">{String(t('site.audience'))}</p>
      <p className="hb-choose" aria-live="polite">
        <Scramble text={hovered || String(t('site.choosePlace'))} play={labelPlay} />
      </p>
      {compact == null ? null : (
        <div key="board" ref={boardRef} className="hb-board">
          <Board
            geo={geo}
            lang={lang}
            now={now}
            label={String(t('site.open'))}
            cursorLabel={String(t('site.seeWork'))}
            onHover={hover}
            cols={span.cols}
            rows={span.rows}
          />
        </div>
      )}
      {showSkip ? (
        <button
          type="button"
          className="hb-skip"
          onClick={() => go('/portfolio')}
          onPointerMove={(event) => magnetic(event, 0.4)}
          onPointerLeave={magneticReset}
        >
          <span className="hb-skip-x" aria-hidden>
            <span />
            <span />
          </span>
          {String(t('site.skip'))}
        </button>
      ) : null}
    </div>
  )
}
