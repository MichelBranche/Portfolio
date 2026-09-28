'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FOOTER_SOCIAL } from '../../config/site.js'
import { LanguageSwitch } from '../../components/LanguageSwitch.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { Chars, HbCursor, Scramble } from './motion.jsx'
import { magnetic, magneticReset } from './magnetic'
import { reduceMotion } from './motion-utils'
import { shopIsOpen } from './shopData.js'
import { SiteUIContext } from './site-ui.js'

const NAV = [
  { to: '/', key: 'home' },
  { to: '/portfolio', key: 'portfolio' },
  { to: '/studio', key: 'studio' },
  { to: '/servizi', key: 'servizi' },
  { to: '/shop', key: 'shop' },
  { to: '/contatti', key: 'contatti' },
].filter((item) => item.key !== 'shop' || shopIsOpen())

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
    const fail = window.setTimeout(onDone, 900)
    import('gsap').then(({ default: gsap }) => {
      gsap
        .timeline({
          onComplete: () => {
            window.clearTimeout(fail)
            onDone()
          },
        })
        .to(root.querySelectorAll('.hb-welcome-text .hb-char'), {
          yPercent: -115,
          duration: 0.55,
          ease: 'expo.in',
          stagger: 0.012,
        })
        .to(root.querySelector('.hb-welcome-hint'), { autoAlpha: 0, duration: 0.3 }, 0)
        .to(veilRef.current?.children || [], { opacity: 0, duration: 0.001, stagger: { each: 0.005, from: 'random' } })
    })
  }, [onDone])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (reduceMotion()) {
      onDone()
      return undefined
    }
    let alive = true
    let tl
    const id = window.setTimeout(finish, 2600)
    import('gsap').then(({ default: gsap }) => {
      if (!alive || !root) return
      tl = gsap.timeline({ delay: 0.15 })
      tl.fromTo(
        root.querySelectorAll('.hb-welcome-text .hb-char'),
        { yPercent: 115 },
        { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.028 },
      ).fromTo(root.querySelector('.hb-welcome-hint'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.6)
    })
    return () => {
      alive = false
      tl?.kill()
      window.clearTimeout(id)
    }
  }, [finish, onDone])

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

function clearBodyLock() {
  const body = document.body
  body.style.position = ''
  body.style.top = ''
  body.style.left = ''
  body.style.right = ''
  body.style.width = ''
  body.style.paddingRight = ''
}

function applyBodyLock(y) {
  const body = document.body
  const gap = Math.max(0, window.innerWidth - document.documentElement.clientWidth)
  body.style.position = 'fixed'
  body.style.top = `-${y}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'
  body.style.paddingRight = gap ? `${gap}px` : ''
}

export function SiteFrame({ children }) {
  const { t, lang, setLang } = useLanguage()
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

  const isHomeRef = useRef(isHome)
  const apiRef = useRef({})
  const runtimeRef = useRef(null)
  const lockY = useRef(null)

  useLayoutEffect(() => {
    isHomeRef.current = isHome
    apiRef.current = {
      pathname: location.pathname,
      search: location.search,
      welcome,
      welcomeKnown,
      menuOpen,
      modalOpen: Boolean(modalProject),
      modalKey: modalProject?.slug || '',
      isHome,
      overlayLock,
      mainRef,
      lenisRef,
      modalRef,
    }
  })

  useEffect(() => {
    let cancel = false
    const show = (value) => {
      if (cancel) return
      setWelcome(value)
      setWelcomeKnown(true)
    }
    let seen = false
    try {
      seen = sessionStorage.getItem(WELCOME_KEY) === '1'
    } catch {
      seen = false
    }
    if (seen) {
      show(false)
      return undefined
    }
    const arm = () => show(true)
    if (!isHomeRef.current) {
      arm()
      return () => {
        cancel = true
      }
    }
    const img = document.querySelector('[data-lcp] img')
    let cap = 0
    if (img && !img.complete) {
      img.addEventListener('load', arm, { once: true })
      img.addEventListener('error', arm, { once: true })
      cap = window.setTimeout(arm, 1000)
    } else {
      cap = window.setTimeout(arm, 80)
    }
    return () => {
      cancel = true
      window.clearTimeout(cap)
      img?.removeEventListener('load', arm)
      img?.removeEventListener('error', arm)
    }
  }, [])

  useEffect(() => {
    document.body.classList.add('hb-on')
    return () => document.body.classList.remove('hb-on')
  }, [])

  useEffect(() => {
    let dead = false
    const boot = () => {
      import('./site-runtime.js').then(({ createRuntime }) => {
        if (dead) return
        runtimeRef.current = createRuntime(apiRef)
        runtimeRef.current.sync()
      })
    }
    const start = () => {
      const ric = window.requestIdleCallback
      if (ric) ric(boot, { timeout: 1600 })
      else window.setTimeout(boot, 400)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      dead = true
      window.removeEventListener('load', start)
      runtimeRef.current?.destroy()
      runtimeRef.current = null
    }
  }, [])

  useEffect(() => {
    runtimeRef.current?.sync()
  }, [location.pathname, location.search, welcome, welcomeKnown, menuOpen, modalProject, isHome, overlayLock])

  useEffect(() => {
    const code = searchParams.get('lang')
    if (code && code !== lang) setLang(code)
  }, [searchParams, lang, setLang])

  useLayoutEffect(() => {
    if (document.body.style.position === 'fixed') {
      clearBodyLock()
      lockY.current = null
    }
    window.scrollTo(0, 0)
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })
    if (!veilPending.current || !veilRef.current) return
    const cells = veilRef.current.children
    veilPending.current = false
    import('gsap').then(({ default: gsap }) => {
      gsap.to(cells, {
        opacity: 0,
        duration: 0.001,
        delay: 0.1,
        stagger: { each: 0.005, from: 'random' },
      })
    })
  }, [location.pathname, location.search])

  useLayoutEffect(() => {
    const menuLock = menuOpen || Boolean(modalProject)
    const lenis = lenisRef.current
    if (menuLock) {
      if (lockY.current == null) {
        const y = window.scrollY || lenis?.scroll || 0
        lockY.current = y
        applyBodyLock(y)
      }
      lenis?.stop()
      return
    }
    if (lockY.current != null) {
      const y = lockY.current
      lockY.current = null
      clearBodyLock()
      if (lenis && !isHome && !welcome && !overlayLock) {
        lenis.start()
        lenis.resize()
        lenis.scrollTo(y, { immediate: true, force: true })
      } else {
        window.scrollTo(0, y)
        lenis?.stop()
      }
      return
    }
    if (!lenis) return
    if (isHome || welcome || overlayLock) lenis.stop()
    else lenis.start()
  }, [menuOpen, modalProject, isHome, welcome, overlayLock])

  const go = useCallback(
    (to) => {
      setMenuPath(null)
      if (to === here) return
      const cells = veilRef.current?.children
      if (!cells || reduceMotion()) {
        router.push(to)
        return
      }
      import('gsap').then(({ default: gsap }) => {
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
      })
    },
    [here, router],
  )

  const openProject = useCallback((project) => setModal({ project, path: here }), [here])

  const closeModal = useCallback(() => {
    const root = modalRef.current
    if (!root || reduceMotion()) {
      setModal(null)
      return
    }
    import('gsap').then(({ default: gsap }) => {
      gsap
        .timeline({ onComplete: () => setModal(null) })
        .to(root.querySelector('.hb-modal-panel'), {
          clipPath: 'inset(50% 0% 50% 0%)',
          duration: 0.55,
          ease: 'expo.in',
        })
        .to(root.querySelector('.hb-modal-backdrop'), { autoAlpha: 0, duration: 0.3 }, 0.3)
    })
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
            {mm} - {String(t('site.place'))}
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
                {modalProject.kindLabel ? <p className="hb-kind">{modalProject.kindLabel}</p> : null}
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
          <a href={FOOTER_SOCIAL.phone}>{FOOTER_SOCIAL.phoneDisplay}</a>
          <a href={FOOTER_SOCIAL.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
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
