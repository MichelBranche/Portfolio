'use client'

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { PixelImage, Scramble } from './motion.jsx'
import { magnetic, magneticReset } from './magnetic'
import { finePointer, reduceMotion } from './motion-utils'
import { useProjects } from './useProjects.js'
import { useSiteUI } from './site-ui.js'

// Infinite board: one repeating module of COLS columns x PAIRS (portrait + landscape) rows.
// Even columns start portrait, odd columns landscape, so every column has the same height
// and the module tiles seamlessly in both directions with equal gaps everywhere.
const COLS = 8
const PAIRS = 2
const GEOMETRY = {
  wide: { w: 280, gap: 120, meta: 44 },
  compact: { w: 140, gap: 40, meta: 34 },
}

function boardGeometry(compact) {
  const { w, gap, meta } = compact ? GEOMETRY.compact : GEOMETRY.wide
  const tall = Math.round(w * 1.25)
  const flat = Math.round(w * 0.75)
  const pitch = w + gap
  const pairH = tall + flat + meta * 2 + gap * 2
  const slots = []
  for (let p = 0; p < PAIRS; p += 1) {
    for (let c = 0; c < COLS; c += 1) {
      let y = p * pairH + gap / 2
      for (let t = 0; t < 2; t += 1) {
        const portrait = (c + t) % 2 === 0
        const h = portrait ? tall : flat
        slots.push({ index: (p * 2 + t) * COLS + c, x: c * pitch + gap / 2, y, w, h, portrait })
        y += h + meta + gap
      }
    }
  }
  slots.sort((left, right) => left.index - right.index)
  return { w, gap, width: COLS * pitch, height: PAIRS * pairH, slots }
}

function boardSpan(width, height, geo) {
  return {
    cols: Math.min(4, Math.max(2, Math.ceil(width / geo.width) + 1)),
    rows: Math.min(4, Math.max(2, Math.ceil(height / geo.height) + 1)),
  }
}

const LOOK_DEAD = 0.05

function look(offset) {
  const mag = Math.abs(offset)
  const parallax = Math.max(-160, Math.min(160, offset * 340))
  if (mag <= LOOK_DEAD) return { push: 0, parallax }
  const t = Math.min(1, (mag - LOOK_DEAD) / (0.34 - LOOK_DEAD))
  const eased = t * (2 - t)
  return { push: -Math.sign(offset) * eased * 52, parallax }
}

function wheelUnit(event, viewport) {
  if (event.deltaMode === 1) return 16
  if (event.deltaMode === 2) return viewport
  return 1
}

function shortName(title) {
  const parts = String(title).split(' - ')
  return (parts[1] || parts[0]).trim()
}

const COMPACT_QUERY = '(max-width: 760px)'

function ProjectTile({ project, lang, openLabel, onOpen, onHover, panningRef, lcp, lead = false, early = false, held = false, style, tabIndex = 0 }) {
  const name = shortName(project.title)
  return (
    <button
      type="button"
      className="hb-tile"
      tabIndex={tabIndex}
      style={style}
      data-cursor={openLabel}
      data-lcp={lcp ? '' : undefined}
      onPointerEnter={(event) => {
        if (panningRef.current) return
        const node = event.currentTarget
        import('./motion-fx.js').then(({ pixelBurst }) => pixelBurst(node))
        onHover(name)
      }}
      onPointerLeave={(event) => {
        if (panningRef.current) return
        const node = event.currentTarget
        import('./motion-fx.js').then(({ pixelClear }) => pixelClear(node))
        onHover('')
      }}
      onClick={() => onOpen(project)}
    >
      <span className="hb-tile-in">
        <PixelImage
          src={lcp && project.slug === 'museo' ? '/projects/lcp/museo.avif' : project.thumb}
          alt={project.alt}
          priority={lcp}
          eager={early && !held}
          quality={lcp || lead ? 50 : undefined}
          late={!lcp && !early}
          sizes={style?.width ? `${Math.round(style.width)}px` : '50vw'}
          grid={false}
          optimized={!(lcp && project.slug === 'museo')}
        />
        <span className="hb-tile-meta">
          <span>{name}</span>
          <span>{stamp(project.publishedAt, lang)}</span>
        </span>
        <span className="hb-tile-meta hb-tile-meta--sub">
          <span>{project.kindLabel}</span>
          <span>{project.featured ? '★' : ''}</span>
        </span>
      </span>
    </button>
  )
}

function stamp(iso, lang) {
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(lang, { day: '2-digit', month: '2-digit', year: '2-digit' }).format(date)
}

const Board = memo(function Board({ projects, geo, lang, openLabel, onOpen, onHover, panningRef, cols, rows }) {
  const colIds = Array.from({ length: cols }, (_, index) => index)
  const rowIds = Array.from({ length: rows }, (_, index) => index)
  // Same order as the project list (newest first), continued cyclically to fill the module.
  const items = projects.length
    ? geo.slots.map((spot) => ({
        project: projects[spot.index % projects.length],
        spot,
        key: spot.index < projects.length ? projects[spot.index].slug : `loop-${spot.index}`,
        repeat: spot.index >= projects.length,
      }))
    : []
  const lcpKey = items[0]?.key
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
          {items.map(({ project, spot, key, repeat }) => {
            const lcp = primary && key === lcpKey
            return (
              <ProjectTile
                key={key}
                project={project}
                lang={lang}
                openLabel={openLabel}
                onOpen={onOpen}
                onHover={onHover}
                panningRef={panningRef}
                lcp={lcp}
                tabIndex={primary && !repeat ? 0 : -1}
                style={{ left: spot.x, top: spot.y, width: spot.w, '--ar': `${spot.w} / ${spot.h}` }}
              />
            )
          })}
        </div>
      )
    }),
  )
})

export function HomePage() {
  const { t, lang } = useLanguage()
  const { openProject, go, introDone, showSkip } = useSiteUI()
  const sorted = useProjects()
  // Board follows the list order exactly: newest first.
  const projects = sorted
  const gateRef = useRef(null)
  const boardRef = useRef(null)
  const draggedRef = useRef(false)
  const panningRef = useRef(false)
  const [span, setSpan] = useState({ cols: 1, rows: 1 })
  const [fullBoard, setFullBoard] = useState(false)
  const [compact, setCompact] = useState(null)
  const geo = useMemo(() => boardGeometry(Boolean(compact)), [compact])
  const [hovered, setHovered] = useState('')
  const [labelPlay, setLabelPlay] = useState(0)
  const hover = useCallback((name) => {
    setHovered(name)
    setLabelPlay((n) => n + 1)
  }, [])
  const open = useCallback(
    (project) => {
      if (draggedRef.current) return
      openProject(project)
    },
    [openProject],
  )

  useLayoutEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY)
    const apply = () => setCompact(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useLayoutEffect(() => {
    if (compact == null) return undefined
    const geo = boardGeometry(compact)
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
      scrollX = geo.gap / 2
      scrollY = geo.gap / 2 + (compact ? 36 : 44)
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
      if (pushX) velX = pushX
      else velX *= Math.pow(0.86, step)
      if (pushY) velY = pushY
      else velY *= Math.pow(0.86, step)
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
      const gliding = Math.abs(velX) + Math.abs(velY) > 0.6
      panningRef.current = gliding
      gate.classList.toggle('is-gliding', gliding)
      const idle = !velX && !velY && !wx && !wy && nextParX === parX && nextParY === parY
      parX = nextParX
      parY = nextParY
      if (!idle) place()
    }

    const onMove = (event) => {
      if (!fine || drag || calm) return
      wake()
      const rect = gate.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const lookX = look((event.clientX - rect.left) / rect.width - 0.5)
      const lookY = look((event.clientY - rect.top) / rect.height - 0.5)
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
        destX = scrollX + vx * 11
        destY = scrollY + vy * 11
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
    gate.addEventListener('pointermove', onMove)
    gate.addEventListener('pointerleave', onLeave)
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
      gate.removeEventListener('pointermove', onMove)
      gate.removeEventListener('pointerleave', onLeave)
      gate.removeEventListener('pointerdown', onDown)
      gate.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointermove', onDrag)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('resize', onResize)
    }
  }, [span.cols, span.rows, fullBoard, compact])

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
        const tiles = gate.querySelectorAll('.hb-tile:not([data-lcp]) .hb-tile-in')
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
      className={compact == null ? 'hb-gate is-pending' : compact ? 'hb-gate is-board-compact' : 'hb-gate'}
      data-cursor={String(t('site.explore'))}
      onPointerLeave={() => setHovered('')}
    >
      <h1 className="hb-sr-only">{String(t('site.h1Home'))}</h1>
      <p className="hb-audience">{String(t('site.audience'))}</p>
      <p className="hb-choose" aria-live="polite">
        <Scramble text={hovered || String(t('site.choose'))} play={labelPlay} />
      </p>
      {compact == null ? (
        <div key="mobile" className="hb-mobile-grid">
          {projects.map((project, index) => (
            <ProjectTile
              key={project.slug}
              project={project}
              lang={lang}
              openLabel={String(t('site.open'))}
              onOpen={open}
              onHover={hover}
              panningRef={panningRef}
              lcp={false}
              lead={index === 0}
              early={index < 4}
              held={compact == null}
            />
          ))}
        </div>
      ) : (
        <div key="desktop" ref={boardRef} className="hb-board">
          <Board
            projects={projects}
            geo={geo}
            lang={lang}
            openLabel={String(t('site.open'))}
            onOpen={open}
            onHover={hover}
            panningRef={panningRef}
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
