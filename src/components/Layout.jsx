import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCursor } from '../context/CursorContext'
import { useLanguage } from '../context/LanguageContext'
import { i18nStrings } from '../data/i18n'
import { STATS_API_URL } from '../config/statsApi'

const STATS_VISIT_SESSION_KEY = 'portfolio_stats_visit_v1'

export default function Layout({ children }) {
  const { handleMouseEnter, handleMouseLeave } = useCursor()
  const { lang, toggleLang } = useLanguage()
  const t = i18nStrings[lang]
  const location = useLocation()

  const [stats, setStats] = useState({
    visits: null,
    cvDownloads: null,
    contacts: null,
  })

  useEffect(() => {
    const shouldInc = !sessionStorage.getItem(STATS_VISIT_SESSION_KEY)
    const suffix = shouldInc ? '?inc=visit' : ''
    if (shouldInc) sessionStorage.setItem(STATS_VISIT_SESSION_KEY, '1')

    let cancelled = false
    fetch(`${STATS_API_URL}${suffix}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return
        setStats({
          visits: typeof data.visits === 'number' ? data.visits : 0,
          cvDownloads:
            typeof data.cvDownloads === 'number' ? data.cvDownloads : 0,
          contacts: typeof data.contacts === 'number' ? data.contacts : 0,
        })
      })
      .catch(() => {
        if (!cancelled) {
          setStats({ visits: 0, cvDownloads: 0, contacts: 0 })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const statsLocale = lang === 'it' ? 'it-IT' : 'en-GB'
  const formatStat = (n) =>
    n === null ? '—' : n.toLocaleString(statsLocale)

  useEffect(() => {
    const tr = i18nStrings[lang]
    const titles = {
      '/': tr.meta_title_home,
      '/agency': tr.meta_title_agency,
      '/works': tr.meta_title_works,
      '/contact': tr.meta_title_contact,
    }
    document.title = titles[location.pathname] || tr.meta_title_home
    document.documentElement.lang = lang === 'it' ? 'it' : 'en'
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', tr.meta_description)
  }, [lang, location.pathname])

  const navItems = [
    { key: 'agency', label: t.nav_about, path: '/agency' },
    { key: 'works', label: t.nav_projects, path: '/works' },
    { key: 'contact', label: t.nav_contact, path: '/contact' },
  ]

  return (
    <div
      className="layout-wrapper"
      style={{
        backgroundColor: 'var(--bg-primary)',
        backgroundImage: 'radial-gradient(ellipse 110% 78% at 50% -8%, rgba(255, 252, 245, 0.95), transparent 60%)',
        color: 'var(--text-primary)',
        minHeight: '100vh',
        cursor: 'none'
      }}
    >
      
      <header className="app-nav-bar nav-glass">
        <div className="app-nav-bar__left">
          <Link
            to="/"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="app-nav-bar__logo hoverable"
          >
            <img
              src="/assets/logo-dark.png"
              alt={t.logo_alt}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML =
                  '<div style="font-family:var(--font-display);font-weight:900;font-size:1.4rem;line-height:0.9;color:var(--text-primary)">MBGS<br/>2026</div>'
              }}
            />
          </Link>
          <div
            className="nav-hud-stats"
            aria-label={t.home_stats_aria}
            aria-live="polite"
          >
            <span className="nav-hud-stats__pair">
              <span className="nav-hud-stats__num">{formatStat(stats.visits)}</span>
              <span className="nav-hud-stats__label">{t.stats_visits}</span>
            </span>
            <span className="nav-hud-stats__sep" aria-hidden>
              ·
            </span>
            <span className="nav-hud-stats__pair">
              <span className="nav-hud-stats__num">
                {formatStat(stats.cvDownloads)}
              </span>
              <span className="nav-hud-stats__label">{t.stats_cv}</span>
            </span>
            <span className="nav-hud-stats__sep" aria-hidden>
              ·
            </span>
            <span className="nav-hud-stats__pair">
              <span className="nav-hud-stats__num">
                {formatStat(stats.contacts)}
              </span>
              <span className="nav-hud-stats__label">{t.stats_contacts}</span>
            </span>
          </div>
        </div>
        <nav className="app-nav-bar__nav" aria-label={t.aria_main}>
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`site-nav__link hoverable ${location.pathname.includes(item.key) ? 'site-nav__link--active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <span className="site-nav__divider" aria-hidden />
          <button
            type="button"
            onClick={toggleLang}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={t.aria_switch_lang}
            className="hoverable site-nav-lang"
          >
            <span
              className={`site-nav-lang__opt ${lang === 'en' ? 'site-nav-lang__opt--active' : ''}`}
            >
              {t.lang_en}
            </span>
            <span className="site-nav-lang__rule" aria-hidden />
            <span
              className={`site-nav-lang__opt ${lang === 'it' ? 'site-nav-lang__opt--active' : ''}`}
            >
              {t.lang_it}
            </span>
          </button>
        </nav>
      </header>

      <div className="nav-coords-hud nav-glass nav-glass--coords">
        <div className="nav-glass--coords-inner">
          45.4642° N // 9.1900° E
        </div>
      </div>

      <main style={{ padding: '0 2.5rem' }}>
        {children}
      </main>
    </div>
  )
}
