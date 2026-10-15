'use client'

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { PixelImage, Scramble } from './motion.jsx'
import { magnetic, magneticReset } from './magnetic'
import { finePointer, reduceMotion } from './motion-utils'
import { useProjects } from './useProjects.js'
import { useSiteUI } from './site-ui.js'

// Infinite board, measured against the reference interaction at 1440x900:
// a 6 x 3 module of cells (520 x 560 px), one cover per cell, sizes between 200 and
// 420 px (median neighbour gap ~200 px) with an irregular but fixed offset inside each cell. Covers keep their natural
// ratio. Everything scales with the viewport width (unit = vw / 1440); the module repeats
// seamlessly in both directions.
const COLS = 6
const ROWS = 3
const CELL_W = 520
const CELL_H = 560
// [size, dx, dy] per cell at 1440 px wide, dx/dy are offsets of the cover from the cell origin.
const PATTERN = [
  [260, 13, 122], [235, 28, 211], [290, 107, 203], [200, 11, 304], [215, 189, 64], [350, 85, 102],
  [395, 16, 92], [300, 159, 47], [330, 138, 126], [370, 52, 74], [280, 16, 20], [245, 137, 48],
  [230, 45, 88], [275, 213, 202], [420, 67, 44], [310, 83, 42], [250, 100, 221], [320, 121, 168],
]
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
  const slots = []
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const index = r * COLS + c
      const [size, dx, dy] = PATTERN[index]
      const w = Math.round(size * scale)
      slots.push({
        index,
        x: Math.round((c * CELL_W + dx) * scale),
        y: Math.round((r * CELL_H + dy) * scale),
        w,
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

function shortName(title) {
  const parts = String(title).split(' - ')
  return (parts[1] || parts[0]).trim()
}

const COMPACT_QUERY = '(max-width: 760px)'

function ProjectTile({ project, lang, openLabel, onOpen, onHover, panningRef, lcp, early = false, held = false, style, tabIndex = 0 }) {
  const name = shortName(project.title)
  return (
    <button
      type="button"
      className="hb-tile"
      tabIndex={tabIndex}
      style={style}
      data-cursor={openLabel}
      data-name={name}
      data-tint={project.tint || ''}
      data-lcp={lcp ? '' : undefined}
      onPointerEnter={() => {
        if (panningRef.current) return
        onHover(name, project.tint)
      }}
      onPointerLeave={() => {
        if (panningRef.current) return
        onHover('', '')
      }}
      onClick={() => onOpen(project)}
    >
      <span className="hb-tile-in">
        <PixelImage
          src={lcp && project.slug === 'museo' ? '/projects/lcp/museo.avif' : project.thumb}
          alt={project.alt}
          priority={lcp}
          eager={early && !held}
          quality={90}
          natural
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
                style={{ left: spot.x, top: spot.y, width: spot.w }}
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
  const open = useCallback(
    (project) => {
      if (draggedRef.current) return
      openProject(project)
    },
    [openProject],
  )

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
      const tile = el instanceof Element ? el.closest('.hb-tile') : null
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
      data-cursor-empty={String(t('site.skip'))}
      onClick={(event) => {
        // Like the reference, a click on empty board space skips to the full list.
        if (draggedRef.current || compact) return
        if (event.target instanceof Element && event.target.closest('.hb-tile, a, button')) return
        go('/portfolio')
      }}
      className={compact == null ? 'hb-gate is-pending' : compact ? 'hb-gate is-board-compact' : 'hb-gate'}
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
