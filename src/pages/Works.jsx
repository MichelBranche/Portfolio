import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/PageTransition'
import { useAggressivePageGsap } from '../animations/useAggressivePageGsap'
import { useCursor } from '../context/CursorContext'
import { useLanguage } from '../context/LanguageContext'
import { projects } from '../data/projects'
import { i18nStrings } from '../data/i18n'
import ProjectOverlay from '../components/ProjectOverlay'

const PLACEHOLDER =
  'https://placehold.co/800x500/f4efe6/1a1917?text=Project+Preview'

export default function Works() {
  const { handleMouseEnter, handleMouseLeave } = useCursor()
  const { lang } = useLanguage()
  const t = i18nStrings[lang]

  const [filterTag, setFilterTag] = useState(null)
  const [selectedId, setSelectedId] = useState(projects[0]?.id)
  const [expandedProject, setExpandedProject] = useState(null)
  const selectedItemRef = useRef(null)

  const allTags = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tags))].sort((a, b) =>
      a.localeCompare(b)
    ),
    []
  )

  const filteredProjects = useMemo(
    () =>
      filterTag
        ? projects.filter((p) => p.tags.includes(filterTag))
        : projects,
    [filterTag]
  )

  const selectedProject = useMemo(() => {
    const list = filteredProjects
    if (!list.length) return null
    const found = list.find((p) => p.id === selectedId)
    return found ?? list[0]
  }, [filteredProjects, selectedId])

  useEffect(() => {
    if (!filteredProjects.length) return
    if (!filteredProjects.some((p) => p.id === selectedId)) {
      setSelectedId(filteredProjects[0].id)
    }
  }, [filteredProjects, selectedId])

  const pageRef = useAggressivePageGsap([lang, filterTag])

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh(true)
    })
    return () => cancelAnimationFrame(id)
  }, [lang, filterTag])

  useEffect(() => {
    const el = selectedItemRef.current
    if (!el) return
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          behavior: 'auto',
        })
      })
    })
    return () => cancelAnimationFrame(id)
  }, [selectedId, filterTag])

  const openDemo = useCallback(() => {
    if (!selectedProject?.demo) return
    window.open(selectedProject.demo, '_blank', 'noopener,noreferrer')
  }, [selectedProject])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea, [contenteditable="true"]'))
        return

      const list = filteredProjects
      if (!list.length || !selectedProject) return

      const idx = list.findIndex((p) => p.id === selectedProject.id)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = list[Math.min(idx + 1, list.length - 1)]
        if (next) setSelectedId(next.id)
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const next = list[Math.max(idx - 1, 0)]
        if (next) setSelectedId(next.id)
      }
      if (e.key === 'Enter' && selectedProject && !expandedProject) {
        e.preventDefault()
        openDemo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [filteredProjects, selectedProject, expandedProject, openDemo])

  const idxInList = selectedProject
    ? filteredProjects.findIndex((p) => p.id === selectedProject.id)
    : -1

  return (
    <PageTransition>
      <div
        ref={pageRef}
        style={{
          width: '100%',
          maxWidth: '1620px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <header
          className="gsap-page-header"
          style={{
            marginBottom: 'clamp(2rem, 5vw, 3.5rem)',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--c-border)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            {t.works_archive_kicker}
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              margin: '0.5rem 0 0',
            }}
          >
            {t.projects_title}
          </h1>
        </header>

        <div className="works-split">
          <div>
            <div className="works-filter-row">
              <span className="works-filter-label">
                {t.works_filter_stack}
              </span>
              <div className="works-filter-chips">
                <button
                  type="button"
                  className={`works-filter-chip ${filterTag == null ? 'works-filter-chip--active' : ''}`}
                  onClick={() => setFilterTag(null)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {t.works_filter_all}
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`works-filter-chip ${filterTag === tag ? 'works-filter-chip--active' : ''}`}
                    onClick={() =>
                      setFilterTag((cur) => (cur === tag ? null : tag))
                    }
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <nav
              aria-label={t.works_menu_aria}
              role="listbox"
              className="works-menu-scroll"
              data-lenis-prevent
            >
              {filteredProjects.map((project, idx) => (
                <button
                  key={project.id}
                  ref={selectedId === project.id ? selectedItemRef : undefined}
                  type="button"
                  role="option"
                  aria-selected={selectedId === project.id}
                  className={`works-menu-item ${selectedId === project.id ? 'works-menu-item--active' : ''}`}
                  onClick={() => setSelectedId(project.id)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <p className="works-menu-item__title">
                    {project.title[lang]}
                  </p>
                  <span className="works-menu-item__meta">
                    {String(idx + 1).padStart(2, '0')} ·{' '}
                    {project.tags.slice(0, 3).join(' // ')}
                  </span>
                </button>
              ))}
            </nav>

            <p className="works-preview__hint">{t.works_hint_keyboard}</p>
          </div>

          <section
            className="works-preview gsap-reveal"
            aria-label={t.works_preview_aria}
          >
            {selectedProject && !expandedProject && (
              <>
                <div className="works-preview__frame">
                  <motion.img
                    layoutId={`img-${selectedProject.id}`}
                    transition={{
                      duration: 0.55,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                    src={selectedProject.image}
                    alt=""
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      zIndex: 1,
                    }}
                    onError={(e) => {
                      e.target.src = PLACEHOLDER
                    }}
                  />
                  <iframe
                    key={selectedProject.id}
                    title={`${t.works_live_iframe} ${selectedProject.title[lang]}`}
                    src={selectedProject.demo}
                    className="works-preview__iframe"
                    referrerPolicy="no-referrer-when-downgrade"
                    loading="lazy"
                  />
                </div>

                <div className="works-preview__actions">
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="works-preview__btn"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {t.works_visit} ↗
                  </a>
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="works-preview__btn works-preview__btn--ghost"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {t.works_source}
                  </a>
                  <button
                    type="button"
                    className="works-preview__btn works-preview__btn--ghost"
                    onClick={() => setExpandedProject(selectedProject)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {t.works_details}
                  </button>
                </div>

                {idxInList >= 0 && (
                  <p
                    className="works-menu-item__meta"
                    style={{ marginTop: '1rem' }}
                  >
                    {t.works_brief}: {selectedProject.description[lang].slice(0, 180)}
                    {selectedProject.description[lang].length > 180 ? '…' : ''}
                  </p>
                )}
              </>
            )}

          </section>
        </div>

        <footer className="gsap-page-footer" style={{ marginTop: '4rem' }} />

        <AnimatePresence>
          {expandedProject && (
            <ProjectOverlay
              project={expandedProject}
              onClose={() => setExpandedProject(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
