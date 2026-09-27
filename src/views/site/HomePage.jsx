'use client'

import { memo, useCallback, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { PixelImage, Scramble } from './motion.jsx'
import { EASE, finePointer, magnetic, magneticReset, pixelBurst, pixelClear, reduceMotion } from './motion-fx'
import { useProjects } from './useProjects.js'
import { useSiteUI } from './site-ui.js'

const BOARD_W = 2600
const BOARD_H = 1550

function boardSpan(width, height) {
  return {
    cols: Math.min(3, Math.max(2, Math.ceil(width / BOARD_W) + 1)),
    rows: Math.min(3, Math.max(2, Math.ceil(height / BOARD_H) + 1)),
  }
}

const LOOK_DEAD = 0.16

function look(offset) {
  const mag = Math.abs(offset)
  const parallax = Math.max(-96, Math.min(96, offset * 200))
  if (mag <= LOOK_DEAD) return { push: 0, parallax }
  const t = Math.min(1, (mag - LOOK_DEAD) / (0.5 - LOOK_DEAD))
  const eased = t * t * (3 - 2 * t)
  return { push: -Math.sign(offset) * eased * 20, parallax }
}

function wheelUnit(event, viewport) {
  if (event.deltaMode === 1) return 16
  if (event.deltaMode === 2) return viewport
  return 1
}

const SPOTS = [
  { x: 70, y: 90, w: 280, r: -2 },
  { x: 440, y: 380, w: 240, r: 1.5 },
  { x: 780, y: 60, w: 330, r: 0 },
  { x: 1190, y: 250, w: 260, r: -1 },
  { x: 1570, y: 40, w: 300, r: 2 },
  { x: 1960, y: 300, w: 340, r: -1.5 },
  { x: 100, y: 560, w: 300, r: 1 },
  { x: 520, y: 760, w: 360, r: -1 },
  { x: 980, y: 600, w: 250, r: 2 },
  { x: 1320, y: 700, w: 310, r: 0 },
  { x: 1730, y: 760, w: 280, r: -2 },
  { x: 2120, y: 640, w: 260, r: 1 },
  { x: 320, y: 1060, w: 280, r: -1 },
  { x: 760, y: 1120, w: 320, r: 1.5 },
  { x: 1200, y: 1080, w: 280, r: -1 },
]

const EXTRAS = [
  { from: 0, x: 1580, y: 388, w: 235, r: -1.5 },
  { from: 12, x: 940, y: 928, w: 245, r: 1.4 },
  { from: 7, x: 1375, y: 1068, w: 235, r: -1.2 },
  { from: 6, x: 1785, y: 1100, w: 220, r: 1.1 },
]

function shortName(title) {
  const parts = String(title).split(' - ')
  return (parts[1] || parts[0]).trim()
}

function stamp(iso, lang) {
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(lang, { day: '2-digit', month: '2-digit', year: '2-digit' }).format(date)
}

const Board = memo(function Board({ projects, lang, openLabel, onOpen, onHover, panningRef, cols, rows }) {
  const colIds = Array.from({ length: cols }, (_, index) => index)
  const rowIds = Array.from({ length: rows }, (_, index) => index)
  return rowIds.map((row) =>
    colIds.map((col) => {
      const primary = col === 0 && row === 0
      return (
        <div key={`${col}-${row}`} className="hb-board-cell" data-i={col} data-j={row} aria-hidden={primary ? undefined : true}>
          {[
            ...projects.map((project, index) => ({
              project,
              spot: SPOTS[index % SPOTS.length],
              key: project.slug,
              repeat: false,
            })),
            ...EXTRAS.map((extra, index) => ({
              project: projects[extra.from % projects.length],
              spot: extra,
              key: `extra-${index}`,
              repeat: true,
            })),
          ].map(({ project, spot, key, repeat }) => {
            const name = shortName(project.title)
            return (
              <button
                key={key}
                type="button"
                className="hb-tile"
                tabIndex={primary && !repeat ? 0 : -1}
                style={{ left: spot.x, top: spot.y, width: spot.w, '--r': `${spot.r}deg` }}
                data-cursor={openLabel}
                onPointerEnter={(event) => {
                  if (panningRef.current) return
                  pixelBurst(event.currentTarget)
                  onHover(name)
                }}
                onPointerLeave={(event) => {
                  if (panningRef.current) return
                  pixelClear(event.currentTarget)
                  onHover('')
                }}
                onClick={() => onOpen(project)}
              >
                <span className="hb-tile-in">
                  <PixelImage
                    src={project.thumb}
                    eager={primary && !repeat}
                    priority={primary && !repeat && spot.w >= 330}
                    grid={false}
                    optimized
                  />
                  <span className="hb-tile-meta">
                    <span>{name}</span>
                    <span>{stamp(project.publishedAt, lang)}</span>
                  </span>
                  <span className="hb-tile-meta hb-tile-meta--sub">
                    <span>{project.categoryLabel}</span>
                    <span>{project.featured ? '★' : ''}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      )
    }),
  )
})

export function HomePage() {
  const { t, lang } = useLanguage()
  const { openProject, go, introDone } = useSiteUI()
  const projects = useProjects()
  const gateRef = useRef(null)
  const boardRef = useRef(null)
  const draggedRef = useRef(false)
  const panningRef = useRef(false)
  const [span, setSpan] = useState({ cols: 2, rows: 2 })
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
    const gate = gateRef.current
    const board = boardRef.current
    if (!gate || !board) return undefined

    const fitted = boardSpan(gate.clientWidth, gate.clientHeight)
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
      scrollX = (gate.clientWidth - BOARD_W) / 2
      scrollY = (gate.clientHeight - BOARD_H) / 2
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
      else velX *= Math.pow(0.9, step)
      if (pushY) velY = pushY
      else velY *= Math.pow(0.9, step)
      if (Math.abs(velX) < 0.04) velX = 0
      if (Math.abs(velY) < 0.04) velY = 0
      if (velX || velY) {
        scrollX += velX * step
        scrollY += velY * step
        destX += velX * step
        destY += velY * step
        moved = true
      }
      const follow = 1 - Math.exp(-dt / 0.085)
      const wx = destX - scrollX
      const wy = destY - scrollY
      if (wx || wy) {
        scrollX += Math.abs(wx) < 0.2 ? wx : wx * follow
        scrollY += Math.abs(wy) < 0.2 ? wy : wy * follow
        moved = true
      }
      const nextParX = Math.abs(wantParX - parX) < 0.2 ? wantParX : parX + (wantParX - parX) * 0.12
      const nextParY = Math.abs(wantParY - parY) < 0.2 ? wantParY : parY + (wantParY - parY) * 0.12
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
      }
    }

    const onResize = () => {
      const next = boardSpan(gate.clientWidth, gate.clientHeight)
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
    if (!calm) gsap.ticker.add(tick)
    return () => {
      gate.removeEventListener('pointermove', onMove)
      gate.removeEventListener('pointerleave', onLeave)
      gate.removeEventListener('pointerdown', onDown)
      gate.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointermove', onDrag)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('resize', onResize)
      if (!calm) gsap.ticker.remove(tick)
    }
  }, [span.cols, span.rows])

  useLayoutEffect(() => {
    const gate = gateRef.current
    if (!gate || reduceMotion()) return undefined
    const tiles = gate.querySelectorAll('.hb-tile-in')
    const extras = gate.querySelectorAll('.hb-choose, .hb-skip')
    if (!introDone) {
      gsap.set([...tiles, ...extras], { autoAlpha: 0 })
      return undefined
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        tiles,
        { autoAlpha: 0, scale: 0.6, y: 60 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: EASE,
          stagger: { each: 0.008, from: 'random' },
          delay: 0.1,
        },
      )
      gsap.fromTo(extras, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, delay: 0.7, stagger: 0.1 })
    }, gate)
    return () => ctx.revert()
  }, [introDone])

  return (
    <div
      ref={gateRef}
      className="hb-gate"
      data-cursor={String(t('site.explore'))}
      onPointerLeave={() => setHovered('')}
    >
      <div ref={boardRef} className="hb-board">
        <Board
          projects={projects}
          lang={lang}
          openLabel={String(t('site.open'))}
          onOpen={open}
          onHover={hover}
          panningRef={panningRef}
          cols={span.cols}
          rows={span.rows}
        />
      </div>
      <p className="hb-choose" aria-live="polite">
        <Scramble text={hovered || String(t('site.choose'))} play={labelPlay} />
      </p>
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
    </div>
  )
}
