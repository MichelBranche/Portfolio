import { useCallback, useEffect, useRef, useState } from 'react'
import { FOOTER_SOCIAL } from '../../config/site.js'
import './SiteNavbar.css'

const SECTION_IDS = ['home', 'work', 'services', 'about', 'packages', 'contact']

export function SiteNavbar({ labels, onNavigate }) {
  const rootRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [navHover, setNavHover] = useState(false)

  const navItems = [
    { id: 'home', label: labels.home },
    { id: 'work', label: labels.work },
    { id: 'services', label: labels.services },
    { id: 'about', label: labels.about },
    { id: 'packages', label: labels.packages },
    { id: 'contact', label: labels.contact },
  ].filter((item) => SECTION_IDS.includes(item.id))

  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  useEffect(() => {
    document.body.classList.toggle('site-nav-open', isOpen)
    return () => document.body.classList.remove('site-nav-open')
  }, [isOpen])

  useEffect(() => {
    document.body.classList.toggle('cursor-on-dark-ui', isOpen || navHover)
    return () => document.body.classList.remove('cursor-on-dark-ui')
  }, [isOpen, navHover])

  const setMenuOpen = useCallback((open) => {
    setIsOpen(open)
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!isOpen)
  }

  const goTo = (id) => {
    onNavigate?.(id)
    setMenuOpen(false)
  }

  return (
    <div ref={rootRef} className="site-nav-root site-nav-root--ready">
      <nav
        id="site-nav-panel"
        className={['site-nav-panel', isOpen && 'site-nav-panel--open']
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!isOpen}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') setNavHover(true)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') setNavHover(false)
        }}
      >
        <div className="site-nav-links">
          {navItems.map((item) => (
            <div key={item.id}>
              <button type="button" className="site-nav-link interactable" onClick={() => goTo(item.id)}>
                {item.label}
              </button>
            </div>
          ))}
        </div>
        <div className="site-nav-meta">
          <div>
            <p className="site-nav-meta-label">{labels.emailLabel}</p>
            <a className="site-nav-email interactable" href={FOOTER_SOCIAL.email}>
              michel.lavoro@gmail.com
            </a>
          </div>
          <div>
            <p className="site-nav-meta-label">{labels.socialLabel}</p>
            <div className="site-nav-socials">
              <a
                className="site-nav-social interactable"
                href={FOOTER_SOCIAL.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                {'{ LinkedIn }'}
              </a>
              <a
                className="site-nav-social interactable"
                href={FOOTER_SOCIAL.instagram}
                target="_blank"
                rel="noreferrer"
              >
                {'{ Instagram }'}
              </a>
              <a className="site-nav-social interactable" href={FOOTER_SOCIAL.email}>
                {'{ Email }'}
              </a>
            </div>
          </div>
        </div>
      </nav>
      <button
        type="button"
        className={['site-nav-burger', 'interactable', isOpen && 'site-nav-burger--open']
          .filter(Boolean)
          .join(' ')}
        onClick={toggleMenu}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') setNavHover(true)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') setNavHover(false)
        }}
        aria-expanded={isOpen}
        aria-controls="site-nav-panel"
        aria-label={isOpen ? labels.menuClose : labels.menuOpen}
      >
        <span className="site-nav-burger-line" />
        <span className="site-nav-burger-line" />
      </button>
    </div>
  )
}
