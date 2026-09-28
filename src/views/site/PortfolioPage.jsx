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

  const cases = projects.filter((project) => project.caseHref)
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
        ) : null}
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
                cursor={String(t('site.open'))}
                onOpen={() => openProject(item.project)}
              />
            ),
          )}
        </div>
      ) : (
        <ul className="hb-cases">
          {cases.map((project) => (
            <li key={project.slug}>
              <CaseCard project={project} cursor={String(t('modal.caseStudy'))} onOpen={() => go(project.caseHref)} />
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function Shot({ project, cursor, onOpen }) {
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
        <PixelImage src={project.thumb} />
        {project.featured ? <span className="hb-badge">★ Top pick</span> : null}
      </span>
    </button>
  )
}

function CaseCard({ project, cursor, onOpen }) {
  const [play, setPlay] = useState(0)
  return (
    <button
      type="button"
      className="hb-case"
      data-cursor={cursor}
      onPointerEnter={(event) => {
        pixelBurst(event.currentTarget)
        setPlay((n) => n + 1)
      }}
      onPointerLeave={(event) => pixelClear(event.currentTarget)}
      onClick={onOpen}
    >
      <span className="hb-shot-media" data-clip>
        <PixelImage src={project.thumb} />
      </span>
      <span className="hb-case-copy">
        <span className="hb-case-title" data-reveal>
          <Scramble text={shortName(project.title)} play={play} />
        </span>
        <span className="hb-kind" data-reveal>
          {project.kindLabel}
        </span>
        <span className="hb-tags" data-reveal>{`\\ ${project.categoryLabel} \\`}</span>
        <span className="hb-case-desc" data-reveal>
          {project.desc}
        </span>
      </span>
    </button>
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
    items.push({ type: 'project', project })
  }
  return items
}
