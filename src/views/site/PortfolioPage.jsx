'use client'

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { PROJECT_CATEGORY_ORDER } from '../../config/site.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { Chars, PixelImage, Scramble } from './motion.jsx'
import { EASE, pixelBurst, pixelClear, reduceMotion } from './motion-fx'
import { useProjects } from './useProjects.js'
import { useSiteUI } from './site-ui.js'

gsap.registerPlugin(Flip)

export function PortfolioPage() {
  const { t, lang } = useLanguage()
  const { openProject, go } = useSiteUI()
  const projects = useProjects()
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const view = params.get('vista') === 'case' ? 'case' : 'calendar'
  const setParams = (next) => {
    const query = new URLSearchParams()
    Object.entries(next).forEach(([key, value]) => {
      if (value != null && value !== '') query.set(key, String(value))
    })
    const search = query.toString()
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false })
  }
  const [filterOpen, setFilterOpen] = useState(false)
  const [category, setCategory] = useState('all')
  const calRef = useRef(null)
  const filtersRef = useRef(null)
  const flipState = useRef(null)

  const visible = useMemo(
    () => (category === 'all' ? projects : projects.filter((project) => project.category === category)),
    [projects, category],
  )
  const flow = useMemo(() => buildCalendar(visible, lang), [visible, lang])

  const categories = PROJECT_CATEGORY_ORDER.filter((key) => projects.some((project) => project.category === key)).map(
    (key) => ({ key, label: String(t(`projects.categories.${key}`)) }),
  )

  const pickCategory = (key) => {
    if (key === category) return
    if (calRef.current && !reduceMotion()) {
      flipState.current = Flip.getState(calRef.current.querySelectorAll('.hb-shot, .hb-month'))
    }
    setCategory(key)
  }

  useLayoutEffect(() => {
    const state = flipState.current
    if (!state || !calRef.current) return
    flipState.current = null
    const cal = calRef.current
    gsap.set(cal.querySelectorAll('.hb-char'), { yPercent: 0 })
    gsap.set(cal.querySelectorAll('[data-line]'), { scaleX: 1 })
    gsap.set(cal.querySelectorAll('[data-clip]'), { clipPath: 'inset(0% 0% 0% 0%)' })
    gsap.set(cal.querySelectorAll('[data-clip] img'), { clearProps: 'transform' })
    Flip.from(state, {
      targets: calRef.current.querySelectorAll('.hb-shot, .hb-month'),
      duration: 0.75,
      ease: 'expo.inOut',
      absolute: true,
      stagger: 0.02,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: EASE }),
    })
  }, [category])

  useLayoutEffect(() => {
    const el = filtersRef.current
    if (!el || reduceMotion()) return
    if (filterOpen) {
      gsap.fromTo(el, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: 0.6, ease: 'expo.out' })
      gsap.fromTo(el.children, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.035, ease: EASE })
    } else {
      gsap.to(el, { height: 0, autoAlpha: 0, duration: 0.4, ease: 'expo.in' })
    }
  }, [filterOpen])

  return (
    <article className="hb-page">
      <h1 className="hb-sr-only">{String(t('site.h1Portfolio'))}</h1>
      <div className="hb-switch" data-reveal>
        <div className="hb-switch-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'calendar'}
            className={view === 'calendar' ? 'is-on' : undefined}
            onClick={() => setParams({})}
          >
            {String(t('site.calendar'))}
          </button>
          <span aria-hidden>\</span>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'case'}
            className={view === 'case' ? 'is-on' : undefined}
            onClick={() => setParams({ vista: 'case' })}
          >
            {String(t('site.caseHistory'))}
          </button>
        </div>
        {view === 'calendar' ? (
          <button
            type="button"
            className={`hb-filter-btn${filterOpen ? ' is-open' : ''}`}
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((open) => !open)}
          >
            {String(t('site.filter'))}
            <span className="hb-filter-icon" aria-hidden />
          </button>
        ) : (
          <p className="hb-case-intro">{String(t('site.caseIntro'))}</p>
        )}
      </div>

      {view === 'calendar' ? (
        <div ref={filtersRef} className="hb-filters" style={{ height: 0, opacity: 0 }}>
          <button type="button" className={category === 'all' ? 'is-on' : undefined} onClick={() => pickCategory('all')}>
            {String(t('site.all'))}
          </button>
          {categories.map((item) => (
            <button
              key={item.key}
              type="button"
              className={category === item.key ? 'is-on' : undefined}
              onClick={() => pickCategory(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      {view === 'calendar' ? (
        <div className="hb-cal" ref={calRef}>
          {flow.map((item) =>
            item.type === 'month' ? (
              <div key={item.key} className="hb-month" data-flip-id={item.key} aria-hidden>
                <Chars text={item.month} />
                <Chars text={item.year} />
              </div>
            ) : (
              <Shot
                key={item.project.slug}
                project={item.project}
                rank={item.rank}
                cursor={String(t('site.open'))}
                onOpen={() => openProject(item.project)}
              />
            ),
          )}
        </div>
      ) : (
        <CaseList
          projects={projects}
          cursor={String(t('site.open'))}
          onOpen={(project) => (project.caseHref ? go(project.caseHref) : openProject(project))}
        />
      )}
    </article>
  )
}

const SHOT_SIZES = '(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1100px) 33vw, 25vw'

function Shot({ project, rank, cursor, onOpen }) {
  const [play, setPlay] = useState(0)
  return (
    <button
      type="button"
      className="hb-shot"
      data-flip-id={project.slug}
      data-cursor={cursor}
      onPointerEnter={(event) => {
        pixelBurst(event.currentTarget)
        setPlay((n) => n + 1)
      }}
      onPointerLeave={(event) => pixelClear(event.currentTarget)}
      onClick={onOpen}
    >
      <span className="hb-rule" data-line />
      <span className="hb-shot-name">
        <Scramble text={shortName(project.title)} play={play} />
      </span>
      <span className="hb-kind">{project.kindLabel}</span>
      <span className="hb-tags">
        <Scramble text={techTags(project.tech)} play={play} />
      </span>
      <span className="hb-shot-media" data-clip>
        <PixelImage
          src={project.thumb}
          alt={project.alt}
          optimized
          sizes={SHOT_SIZES}
          priority={rank === 0}
          eager={rank > 0 && rank < 4}
        />
        {project.featured ? <span className="hb-badge">★ Top pick</span> : null}
      </span>
    </button>
  )
}

// Case list: one project per row, thin rules, title left and category right. On a mouse a
// square preview follows the pointer (lagged), grows in on enter and slides to the next
// project's image when moving between rows. Touch screens get a pixel chevron instead.
function CaseList({ projects, cursor, onOpen }) {
  const boxRef = useRef(null)
  const stripRef = useRef(null)
  const state = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0, on: false, last: 0 })

  const follow = (now) => {
    const st = state.current
    const box = boxRef.current
    if (!box) return
    const dt = Math.min(0.05, (now - st.last) / 1000 || 0.016)
    st.last = now
    const k = 1 - Math.exp(-dt / 0.09)
    st.x += (st.tx - st.x) * k
    st.y += (st.ty - st.y) * k
    box.style.transform = `translate3d(${st.x}px, ${st.y}px, 0)`
    if (Math.abs(st.tx - st.x) > 0.2 || Math.abs(st.ty - st.y) > 0.2) st.raf = requestAnimationFrame(follow)
    else st.raf = 0
  }
  const onMove = (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return
    const st = state.current
    // Positioned inside the list (an ancestor transform would break position: fixed).
    const rect = event.currentTarget.closest('.hb-caselist').getBoundingClientRect()
    st.tx = event.clientX - rect.left
    st.ty = event.clientY - rect.top
    if (!st.on) {
      st.x = st.tx
      st.y = st.ty
    }
    if (!st.raf) {
      st.last = event.timeStamp
      st.raf = requestAnimationFrame(follow)
    }
  }
  const enterRow = (index, event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return
    onMove(event)
    state.current.on = true
    boxRef.current?.classList.add('is-on')
    if (stripRef.current) stripRef.current.style.transform = `translate3d(0, ${(-index * 100) / projects.length}%, 0)`
  }
  const leaveList = () => {
    state.current.on = false
    boxRef.current?.classList.remove('is-on')
  }

  return (
    <div className="hb-caselist" onPointerMove={onMove} onPointerLeave={leaveList}>
      <ul className="hb-cases">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <button
              type="button"
              className="hb-case-row"
              data-cursor={cursor}
              onPointerEnter={(event) => enterRow(index, event)}
              onClick={() => onOpen(project)}
            >
              <span className="hb-case-title">{shortName(project.title)}</span>
              <span className="hb-case-client">{project.categoryLabel}</span>
              <svg className="hb-case-chev" viewBox="0 0 5 9" width="10" height="18" aria-hidden>
                <path d="M0 0h2v1h1v1h1v1h1v3h-1v1h-1v1h-1v1h-2v-2h1v-1h1v-3h-1v-1h-1z" fill="currentColor" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <div ref={boxRef} className="hb-case-peek" aria-hidden>
        <div className="hb-case-peek-frame">
          <div ref={stripRef} className="hb-case-peek-strip">
            {projects.map((project, index) => (
              <img key={project.slug} src={project.thumb} alt="" width="1254" height="1254" loading={index < 4 ? 'eager' : 'lazy'} decoding="async" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function shortName(title) {
  const parts = String(title).split(' - ')
  return (parts[1] || parts[0] || title).trim()
}

function techTags(tech) {
  const tags = String(tech || '')
    .split(/\s*\/\s*/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 3)
  if (!tags.length) return ''
  return `\\ ${tags.join(' \\ ')} \\`
}

function buildCalendar(projects, lang) {
  const items = []
  let lastKey = ''
  for (const project of projects) {
    const date = new Date(`${project.publishedAt}T12:00:00`)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    if (key !== lastKey) {
      lastKey = key
      const month = new Intl.DateTimeFormat(lang, { month: 'short' })
        .format(date)
        .replace('.', '')
        .slice(0, 3)
        .toUpperCase()
      items.push({ type: 'month', key, month, year: String(date.getFullYear()) })
    }
    items.push({ type: 'project', project, rank: items.filter((item) => item.type === 'project').length })
  }
  return items
}
