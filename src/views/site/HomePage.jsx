'use client'

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { Scramble } from './motion.jsx'
import { magnetic, magneticReset } from './magnetic'
import { finePointer, reduceMotion } from './motion-utils'
import { HOME_ART } from '../../config/site.js'
import { useSiteUI } from './site-ui.js'

// Infinite board of illustrations (transparent cut-outs), modelled on the reference at
// 1440x900: cells of ~690 x 720 px (median gap between neighbours ~385 px), one piece per
// cell, longest side between ~240 and ~470 px, loosely offset inside its cell. An 8 x 4
// module holds each of the 16 illustrations twice (the second pass shifted by 3 so the
// same piece never sits next to itself) and repeats seamlessly in both directions.
const COLS = 8
const ROWS = 4
const CELL_W = 690
const CELL_H = 720
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
const PAN_PER_FRAME = 0.00254

export function boardScale(width, compact) {
  if (compact) return 0.62
  return Math.round(Math.min(1.6, Math.max(0.8, width / 1440)) * 20) / 20
}

function boardGeometry(scale) {
  const rand = seeded(7)
  const slots = []
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const index = r * COLS + c
      const art = HOME_ART[(index + (r >= 2 ? 3 : 0)) % HOME_ART.length]
      const side = SIZES[index % SIZES.length]
      const ratio = art.width / art.height
      const w = ratio >= 1 ? side : side * ratio
      const h = ratio >= 1 ? side / ratio : side
      const dx = 30 + rand() * Math.max(0, CELL_W - w - 60)
      const dy = 30 + rand() * Math.max(0, CELL_H - h - CAPTION_H - 60)
      slots.push({
        index,
        art,
        x: Math.round((c * CELL_W + dx) * scale),
        y: Math.round((r * CELL_H + dy) * scale),
        w: Math.round(w * scale),
        h: Math.round(h * scale),
      })
    }
  }
  return { scale, width: Math.round(COLS * CELL_W * scale), height: Math.round(ROWS * CELL_H * scale), slots }
}

function boardSpan(width, height, geo) {
  return {
    cols: Math.min(4, Math.max(2, Math.ceil(width / geo.width) + 1)),
    rows: Math.min(4, Math.max(2, Math.ceil(height / geo.height) + 1)),
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
    const tick = () => setNow(new Date())
    tick()
    const id = window.setInterval(tick, 20000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

function clock(now, timeZone) {
  if (!now) return ['', '']
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  )
  return [`${parts.day}.${parts.month}.${parts.year}`, `H. ${parts.hour}.${parts.minute}`]
}

function ArtTile({ spot, lang, now, label, eager, tabIndex, onHover }) {
  const { art } = spot
  const [place, region] = art.caption[lang] || art.caption.en
  const [day, time] = clock(now, art.timeZone)
  return (
    <a
      href="/portfolio"
      className="hb-art"
      tabIndex={tabIndex}
      style={{ left: spot.x, top: spot.y, width: spot.w }}
      data-cursor={label}
      data-name={place}
      data-tint={art.tint}
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

const Board = memo(function Board({ geo, lang, now, label, onHover, cols, rows }) {
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
  const hover = useCallback((name, tint) => {
    setHovered(name)
    // Hovering a cover tints the whole stage with that cover's colour; leaving restores it.
    if (tint) document.documentElement.style.setProperty('--stage', tint)
    else document.documentElement.style.removeProperty('--stage')
    setLabelPlay((n) => n + 1)
  }, [])
  const hoverRef = useRef(hover)
  useEffect(() => {
    hoverRef.current = hover
  }, [hover])
  useEffect(() => () => document.documentElement.style.removeProperty('--stage'), [])

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
    let last = performance.now()

    const place = () => {
      const shiftX = Math.round(scrollX / BOARD_W) * BOARD_W
      const shiftY = Math.round(scrollY / BOARD_H) * BOARD_H
      if (shiftX || shiftY) {
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
          cell.style.left = `${(baseCol + i) * BOARD_W}px`
          cell.style.top = `${(baseRow + j) * BOARD_H}px`
        })
        placed = { col: baseCol, row: baseRow }
      }
      board.style.transform = `translate3d(${x}px,${y}px,0)`
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
        if (hitFrame % 4 === 0) hitTest()
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

    const onLeave = () => {
      pushX = 0
      pushY = 0
      wantParX = 0
      wantParY = 0
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
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
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
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
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
        const tiles = gate.querySelectorAll('.hb-art')
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
        go('/portfolio')
      }}
      className={compact == null ? 'hb-gate is-pending' : compact ? 'hb-gate is-board-compact' : 'hb-gate'}
      onPointerLeave={() => setHovered('')}
    >
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
