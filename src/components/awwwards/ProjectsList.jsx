import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { AnimatedSectionHeader } from './AnimatedSectionHeader.jsx'

gsap.registerPlugin(ScrollTrigger)

function parseTechTags(tech) {
  return String(tech || '')
    .split(/\s*\/\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function ProjectsList({ projects, subTitle, title, lead, onOpenProject }) {
  const overlayRefs = useRef([])
  const previewRef = useRef(null)
  const listRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(null)
  const mouse = useRef({ x: 0, y: 0 })
  const moveX = useRef(null)
  const moveY = useRef(null)

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
    { dependencies: [projects.length], scope: listRef },
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
        {projects.map((project, index) => {
          const tags = parseTechTags(project.tech)
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
                <h3 className="works-row-title">{project.title}</h3>
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
        <div ref={previewRef} className="works-preview-float" aria-hidden>
          {currentIndex !== null && projects[currentIndex] ? (
            <img src={projects[currentIndex].thumb} alt="" />
          ) : null}
        </div>
      </div>
    </section>
  )
}
