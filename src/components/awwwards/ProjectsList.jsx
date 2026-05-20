import { useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { PROJECT_CATEGORY_ORDER } from '../../config/site.js'
import { AnimatedSectionHeader } from './AnimatedSectionHeader.jsx'

gsap.registerPlugin(ScrollTrigger)

function parseTechTags(tech) {
  return String(tech || '')
    .split(/\s*\/\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function formatProjectDate(iso, locale) {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(new Date(iso))
  } catch {
    return iso
  }
}

function groupProjectsByCategory(projects, order) {
  const buckets = Object.fromEntries(order.map((key) => [key, []]))
  for (const project of projects) {
    const key = project.category
    if (buckets[key]) buckets[key].push(project)
  }
  return order
    .filter((key) => buckets[key].length > 0)
    .map((key) => ({
      key,
      label: buckets[key][0].categoryLabel,
      projects: [...buckets[key]].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    }))
}

export function ProjectsList({ projects, subTitle, title, lead, onOpenProject }) {
  const { lang, t } = useLanguage()
  const overlayRefs = useRef([])
  const previewRef = useRef(null)
  const listRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(null)
  const mouse = useRef({ x: 0, y: 0 })
  const moveX = useRef(null)
  const moveY = useRef(null)

  const groups = useMemo(
    () => groupProjectsByCategory(projects, PROJECT_CATEGORY_ORDER),
    [projects],
  )

  const flatProjects = useMemo(() => groups.flatMap((g) => g.projects), [groups])

  const rowIndexBySlug = useMemo(() => {
    const map = new Map()
    let i = 0
    for (const group of groups) {
      for (const project of group.projects) {
        map.set(project.slug, i)
        i += 1
      }
    }
    return map
  }, [groups])

  const projectCountLabel = (n) =>
    n === 1
      ? String(t('projects.countOne'))
      : String(t('projects.countMany')).replace('{{n}}', String(n))

  useGSAP(
    () => {
      if (!previewRef.current) return
      moveX.current = gsap.quickTo(previewRef.current, 'x', {
        duration: 1.4,
        ease: 'power3.out',
      })
      moveY.current = gsap.quickTo(previewRef.current, 'y', {
        duration: 1.8,
        ease: 'power3.out',
      })

      const rows = listRef.current?.querySelectorAll('.works-row')
      if (rows?.length) {
        gsap.from(rows, {
          y: 80,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 85%',
            once: true,
          },
        })
      }
    },
    { dependencies: [flatProjects.length], scope: listRef },
  )

  const handleMouseEnter = (index) => {
    if (window.innerWidth < 768) return
    setCurrentIndex(index)
    const el = overlayRefs.current[index]
    if (!el) return
    gsap.killTweensOf(el)
    gsap.fromTo(
      el,
      { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 0.15,
        ease: 'power2.out',
      },
    )
    gsap.to(previewRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.28,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = (index) => {
    if (window.innerWidth < 768) return
    setCurrentIndex(null)
    const el = overlayRefs.current[index]
    if (!el) return
    gsap.killTweensOf(el)
    gsap.to(el, {
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
      duration: 0.2,
      ease: 'power2.in',
    })
    gsap.to(previewRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.28,
      ease: 'power2.out',
    })
  }

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return
    mouse.current.x = e.clientX + 20
    mouse.current.y = e.clientY + 20
    moveX.current?.(mouse.current.x)
    moveY.current?.(mouse.current.y)
  }

  return (
    <section id="work" className="projects">
      <AnimatedSectionHeader
        subTitle={subTitle}
        title={title}
        lead={lead}
        withScrollTrigger
      />
      <div className="works-list" ref={listRef} onMouseMove={handleMouseMove}>
        {groups.map((group) => (
          <div key={group.key} className="works-group">
            <div className="works-group-head">
              <p className="works-group-title">{group.label}</p>
              <p className="works-group-count">{projectCountLabel(group.projects.length)}</p>
            </div>
            {group.projects.map((project) => {
              const index = rowIndexBySlug.get(project.slug) ?? 0
              const tags = parseTechTags(project.tech)
              const dateLabel = formatProjectDate(project.publishedAt, lang)

              return (
                <a
                  key={project.slug}
                  href="#"
                  className="works-row interactable project-trigger"
                  onClick={(e) => {
                    e.preventDefault()
                    onOpenProject(project)
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  <div
                    ref={(el) => {
                      overlayRefs.current[index] = el
                    }}
                    className="works-row-overlay"
                    aria-hidden
                  />
                  <div className="works-row-head">
                    <div className="works-row-head-text">
                      <h3 className="works-row-title">{project.title}</h3>
                      {dateLabel ? (
                        <time className="works-row-date" dateTime={project.publishedAt}>
                          {dateLabel}
                        </time>
                      ) : null}
                    </div>
                    <ArrowUpRight className="works-row-arrow" aria-hidden />
                  </div>
                  <div className="works-row-tags">
                    {tags.map((tag) => (
                      <span key={`${project.slug}-${tag}`} className="works-row-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="works-row-mobile-preview" aria-hidden>
                    <img
                      src={project.thumb}
                      alt=""
                      className="works-row-mobile-bg"
                      loading="lazy"
                      decoding="async"
                    />
                    <img
                      src={project.thumb}
                      alt=""
                      className="works-row-mobile-shot"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </a>
              )
            })}
          </div>
        ))}
        <div ref={previewRef} className="works-preview-float" aria-hidden>
          {currentIndex !== null && flatProjects[currentIndex] ? (
            <img src={flatProjects[currentIndex].thumb} alt="" />
          ) : null}
        </div>
      </div>
    </section>
  )
}
