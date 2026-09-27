'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { FOOTER_SOCIAL } from '../../config/site.js'
import { LanguageSwitch } from '../../components/LanguageSwitch.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { Chars, HbCursor, Scramble } from './motion.jsx'
import { EASE, magnetic, magneticReset, reduceMotion, useReveal } from './motion-fx'
import { SiteUIContext } from './site-ui.js'

gsap.registerPlugin(ScrollTrigger)

const NAV = [
  { to: '/', key: 'home' },
  { to: '/portfolio', key: 'portfolio' },
  { to: '/studio', key: 'studio' },
  { to: '/servizi', key: 'servizi' },
  { to: '/shop', key: 'shop' },
  { to: '/contatti', key: 'contatti' },
]

const VEIL_CELLS = 12 * 7
const WELCOME_KEY = 'hb:welcome'

function useClock() {
  const [now, setNow] = useState(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [])
  if (!now) return ['--', '--']
  return [String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0')]
}

function Veil({ veilRef, className = '' }) {
  return (
    <div ref={veilRef} className={`hb-veil ${className}`} aria-hidden>
      {Array.from({ length: VEIL_CELLS }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  )
}

function Welcome({ text, onDone }) {
  const rootRef = useRef(null)
  const veilRef = useRef(null)
  const doneRef = useRef(false)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    const root = rootRef.current
    if (!root || reduceMotion()) {
      onDone()
      return
    }
    gsap
      .timeline({ onComplete: onDone })
      .to(root.querySelectorAll('.hb-welcome-text .hb-char'), {
        yPercent: -115,
        duration: 0.55,
        ease: 'expo.in',
        stagger: 0.012,
      })
      .to(root.querySelector('.hb-welcome-hint'), { autoAlpha: 0, duration: 0.3 }, 0)
      .to(veilRef.current.children, { opacity: 0, duration: 0.001, stagger: { each: 0.005, from: 'random' } })
  }, [onDone])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (reduceMotion()) return undefined
    const tl = gsap.timeline({ delay: 0.15 })
    tl.fromTo(
      root.querySelectorAll('.hb-welcome-text .hb-char'),
      { yPercent: 115 },
      { yPercent: 0, duration: 1.1, ease: EASE, stagger: 0.028 },
    ).fromTo(root.querySelector('.hb-welcome-hint'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.6)
    const id = window.setTimeout(finish, 2600)
    return () => {
      tl.kill()
      window.clearTimeout(id)
    }
  }, [finish])

  return (
    <div ref={rootRef} className="hb-welcome" onClick={finish} role="presentation">
      <Veil veilRef={veilRef} className="is-full" />
      <p className="hb-welcome-text">
        <Chars text={text} reveal={false} />
      </p>
      <p className="hb-welcome-hint">michel branche</p>
    </div>
  )
}

export function SiteFrame({ children }) {
  const { t, lang } = useLanguage()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const search = searchParams.toString()
  const location = { pathname, search: search ? `?${search}` : '' }
  const lenisRef = useRef(null)
  const veilRef = useRef(null)
  const veilPending = useRef(false)
  const mainRef = useRef(null)
  const modalRef = useRef(null)
  const [hh, mm] = useClock()
  const [menuPath, setMenuPath] = useState(null)
  const [modal, setModal] = useState(null)
  const [welcome, setWelcome] = useState(false)
  const [welcomeKnown, setWelcomeKnown] = useState(false)
  const [brandPlay, setBrandPlay] = useState(0)
  const [overlayLock, setOverlayLock] = useState(false)
  const here = location.pathname + location.search
  const isHome = location.pathname === '/'
  const isShop = location.pathname === '/shop'
  const menuOpen = menuPath === here
  const modalProject = modal?.path === here ? modal.project : null

  useEffect(() => {
    try {
      setWelcome(sessionStorage.getItem(WELCOME_KEY) !== '1')
    } catch {
      setWelcome(true)
    }
    setWelcomeKnown(true)
  }, [])

  useReveal(mainRef, [location.pathname, location.search, welcome], 0.2)

  useEffect(() => {
    document.body.classList.add('hb-on')
    return () => document.body.classList.remove('hb-on')
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
    })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    lenisRef.current = lenis
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useLayoutEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    if (!veilPending.current || !veilRef.current) return
    veilPending.current = false
    gsap.to(veilRef.current.children, {
      opacity: 0,
      duration: 0.001,
      delay: 0.1,
      stagger: { each: 0.005, from: 'random' },
    })
  }, [location.pathname, location.search])

  useEffect(() => {
    const locked = menuOpen || Boolean(modalProject) || isHome || welcome || overlayLock
    document.body.classList.toggle('site-lock', locked)
    const lenis = lenisRef.current
    if (!lenis) return
    if (locked) lenis.stop()
    else lenis.start()
  }, [menuOpen, modalProject, isHome, welcome, overlayLock])

  useLayoutEffect(() => {
    if (!welcomeKnown || welcome || reduceMotion()) return
    gsap.fromTo(
      '.hb-header > *, .hb-subline > *',
      { y: -16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, ease: EASE, stagger: 0.07 },
    )
  }, [welcome, welcomeKnown])

  const go = useCallback(
    (to) => {
      setMenuPath(null)
      if (to === here) return
      const cells = veilRef.current?.children
      if (!cells || reduceMotion()) {
        router.push(to)
        return
      }
      gsap.killTweensOf(cells)
      gsap.to(cells, {
        opacity: 1,
        duration: 0.001,
        stagger: { each: 0.005, from: 'random' },
        onComplete: () => {
          veilPending.current = true
          router.push(to)
        },
      })
    },
    [here, router],
  )

  const openProject = useCallback((project) => setModal({ project, path: here }), [here])

  useLayoutEffect(() => {
    const root = modalRef.current
    if (!modalProject || !root || reduceMotion()) return
    const tl = gsap.timeline()
    tl.fromTo(root.querySelector('.hb-modal-backdrop'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 })
      .fromTo(
        root.querySelector('.hb-modal-panel'),
        { clipPath: 'inset(50% 0% 50% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'expo.inOut' },
        0,
      )
      .fromTo(
        root.querySelectorAll('.hb-modal-copy > *'),
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: EASE, stagger: 0.06 },
        0.45,
      )
    const singleImage = root.querySelector('.hb-modal-images:not(.is-stack) img')
    if (singleImage) {
      tl.fromTo(singleImage, { scale: 1.08 }, { scale: 1, duration: 1.15, ease: EASE, clearProps: 'transform' }, 0.2)
    }
  }, [modalProject])

  const closeModal = useCallback(() => {
    const root = modalRef.current
    if (!root || reduceMotion()) {
      setModal(null)
      return
    }
    gsap
      .timeline({ onComplete: () => setModal(null) })
      .to(root.querySelector('.hb-modal-panel'), {
        clipPath: 'inset(50% 0% 50% 0%)',
        duration: 0.55,
        ease: 'expo.in',
      })
      .to(root.querySelector('.hb-modal-backdrop'), { autoAlpha: 0, duration: 0.3 }, 0.3)
  }, [])

  useEffect(() => {
    if (!menuOpen && !modalProject) return undefined
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      if (modalProject) closeModal()
      else setMenuPath(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, modalProject, closeModal])

  const endWelcome = useCallback(() => {
    try {
      sessionStorage.setItem(WELCOME_KEY, '1')
    } catch {
      /* private mode */
    }
    setWelcome(false)
  }, [])

  const images = modalProject?.imgs?.length
    ? modalProject.imgs
    : modalProject?.img
      ? [modalProject.img]
      : []

  const link = (to) => (event) => {
    event.preventDefault()
    go(to)
  }

  const scrollTop = useCallback(() => {
    const lenis = lenisRef.current
    if (!lenis) {
      window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' })
      return
    }
    lenis.scrollTo(0, reduceMotion() ? { immediate: true } : { force: true })
  }, [])

  return (
    <SiteUIContext.Provider value={{ openProject, go, introDone: !welcome, lang, scrollTop, setOverlayLock }}>
      <div className={`hb-shell${isHome ? ' hb-shell--gate' : ''}`}>
        <header className="hb-header">
          <a
            href="/"
            className="hb-brand"
            onClick={link('/')}
            onPointerEnter={() => setBrandPlay((n) => n + 1)}
          >
            <Scramble text="michel branche" play={brandPlay} />
          </a>
          <div className="hb-header-center">
            <button
              type="button"
              className={`hb-burger${menuOpen ? ' is-open' : ''}`}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? String(t('nav.menuClose')) : String(t('site.menu'))}
              onClick={() => setMenuPath(menuOpen ? null : here)}
            >
              <span />
              <span />
              <span />
            </button>
            <span className="hb-menu-label">\ {String(t('site.menu'))} \</span>
          </div>
          {isShop ? (
            <div id="hb-header-end" className="hb-header-end" />
          ) : (
            <a className="hb-mail" href={FOOTER_SOCIAL.email} onPointerMove={magnetic} onPointerLeave={magneticReset}>
              {String(t('site.mail'))}
            </a>
          )}
        </header>
        <div className="hb-subline">
          <span>
            H. {hh}
            <span className="hb-blink">.</span>
            {mm} — {String(t('site.place'))}
          </span>
          <span className="hb-subline-page">{String(t(`site.${routeKey(location.pathname)}`))}</span>
        </div>

        <div className={`hb-menu-layer${menuOpen ? ' is-open' : ''}`} inert={menuOpen ? undefined : true}>
          <button
            type="button"
            className="hb-menu-backdrop"
            aria-label={String(t('nav.menuClose'))}
            onClick={() => setMenuPath(null)}
          />
          <nav className="hb-menu" aria-label={String(t('site.menu'))}>
            <button type="button" className="hb-menu-x" onClick={() => setMenuPath(null)} aria-label={String(t('nav.menuClose'))}>
              <span />
              <span />
            </button>
            <ul>
              {NAV.map((item, index) => (
                <li key={item.to} style={{ '--i': index }}>
                  <a
                    href={item.to}
                    className={location.pathname === item.to ? 'is-active' : undefined}
                    onClick={link(item.to)}
                  >
                    <span className="hb-menu-arrow" aria-hidden>
                      →
                    </span>
                    {String(t(`site.${item.key}`))}
                  </a>
                </li>
              ))}
            </ul>
            <div className="hb-menu-foot">
              <LanguageSwitch variant="pill" />
              <div className="hb-menu-social">
                <a href={FOOTER_SOCIAL.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a href={FOOTER_SOCIAL.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </div>
            </div>
          </nav>
        </div>

        <main className="hb-main" ref={mainRef}>
          {children}
          {!isHome ? <SiteFooter t={t} link={link} /> : null}
        </main>

        {modalProject ? (
          <div ref={modalRef} className="hb-modal" role="dialog" aria-modal="true" aria-labelledby="hb-modal-title">
            <button type="button" className="hb-modal-backdrop" aria-label={String(t('modal.close'))} onClick={closeModal} />
            <div className="hb-modal-panel">
              <div className={`hb-modal-images${images.length > 1 ? ' is-stack' : ''}`} data-lenis-prevent>
                {images.map((src) => (
                  <img key={src} src={src} alt={String(t('modal.imgAlt'))} />
                ))}
              </div>
              <div className="hb-modal-copy" data-lenis-prevent>
                <button type="button" className="hb-menu-x" onClick={closeModal} aria-label={String(t('modal.close'))}>
                  <span />
                  <span />
                </button>
                <p className="hb-tags">{`\\ ${modalProject.categoryLabel} \\`}</p>
                <h2 id="hb-modal-title">{modalProject.title}</h2>
                <p className="hb-modal-tech">{modalProject.tech}</p>
                <p>{modalProject.desc}</p>
                <div className="hb-modal-actions">
                  <a
                    href={modalProject.link}
                    target="_blank"
                    rel="noreferrer"
                    onPointerMove={magnetic}
                    onPointerLeave={magneticReset}
                  >
                    {String(t('modal.visit'))}
                  </a>
                  {modalProject.caseHref ? (
                    <button
                      type="button"
                      onClick={() => go(modalProject.caseHref)}
                      onPointerMove={magnetic}
                      onPointerLeave={magneticReset}
                    >
                      {String(t('modal.caseStudy'))}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <Veil veilRef={veilRef} />
        {welcome ? <Welcome text={String(t('site.welcome'))} onDone={endWelcome} /> : null}
        <HbCursor />
      </div>
    </SiteUIContext.Provider>
  )
}

function routeKey(pathname) {
  const key = pathname.replace(/^\//, '').split('/')[0]
  if (key === 'work') return 'portfolio'
  return key || 'home'
}

function SiteFooter({ t, link }) {
  const lead = String(t('about.lead'))
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <footer className="hb-footer" data-reveal-scope>
      <span className="hb-rule" data-line />
      <div className="hb-footer-cols">
        <div data-reveal>
          <p className="hb-label">\ Michel Branche \</p>
          {lead.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div data-reveal>
          <p className="hb-label">\ {String(t('site.contatti'))} \</p>
          <a href={FOOTER_SOCIAL.email}>michel.lavoro@gmail.com</a>
          <a href={FOOTER_SOCIAL.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={FOOTER_SOCIAL.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
        <div data-reveal>
          <p className="hb-label">\ {String(t('site.menu'))} \</p>
          {NAV.map((item) => (
            <a key={item.to} href={item.to} onClick={link(item.to)}>
              {String(t(`site.${item.key}`))}
            </a>
          ))}
        </div>
      </div>
      <p className="hb-footer-word">
        <Chars text="michel branche" reveal={false} />
      </p>
    </footer>
  )
}
