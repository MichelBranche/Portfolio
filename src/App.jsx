import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import ConfettiRain from './components/ConfettiRain'
import { LanguageSwitch } from './components/LanguageSwitch.jsx'
import MoneyRain from './components/MoneyRain'
import FireworksRain from './components/FireworksRain'
import { useLanguage } from './context/LanguageContext.jsx'
import './App.css'
import { translate } from './i18n/translations'
import { initFlairConfetti } from './lib/flairConfetti'

const FOOTER_SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/michel-branche-328501301/',
  instagram: 'https://www.instagram.com/80_sete_/',
  email: 'mailto:michel.lavoro@gmail.com',
}

const FOOTER_SOUNDS = {
  linkedin: '/sounds/linkedin.mp3',
  instagram: '/sounds/instagram.mp3',
  email: '/sounds/vine-boom.mp3',
  scrivimi: '/sounds/scrivimi.mp3',
  anvilDrop: '/sounds/anvil-drop.mp3',
  michel: '/sounds/michelexd.mp3',
  branche: '/sounds/mariah-carey-vive-la-france.mp3',
  rizz: '/sounds/rizz-sound-effect.mp3',
}

const FAVICON_DEFAULT = '/favicon.png'
const DOC_TITLE_INTERVAL_MS = 3200
const PRELOADER_AMBIENT = '/sounds/preloader-ambient.mp3'
const HERO_MP3_TRACKS = [
  {
    url: 'https://soundcloud.com/deneroofficial/kesha-tik-tok-denero-remix-free-download-1',
  },
  {
    url: 'https://soundcloud.com/e1oovdghddfw/crazy-in-love-ft-jay',
  },
  {
    url: 'https://soundcloud.com/kemosaberecords/die-young-ke-ha',
  },
]
const HERO_MP3_ART = '/favicon.png'

function applyDocumentFavicon(href) {
  document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((el) => {
    el.setAttribute('href', href)
  })
}

/** Dito / stilo: niente “hover reale” → comandi a tocco persistente */
function isCoarsePointerDevice() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

function asArray(value) {
  return Array.isArray(value) ? value.map(String) : [String(value)]
}

function HeroTitleLetters({ text }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span key={`${ch}-${i}`} className="hero-title-letter">
          <span className="hero-title-letter-inner">{ch}</span>
        </span>
      ))}
    </>
  )
}

function ServicesHeaderLetters({ text }) {
  return (
    <>
      {String(text)
        .split('')
        .map((ch, i) => (
          <span key={`${ch}-${i}`} className="services-header-letter">
            <span className="services-header-letter-inner">{ch === ' ' ? '\u00A0' : ch}</span>
          </span>
        ))}
    </>
  )
}

function ProjectTitleWords({ text }) {
  const words = text.split(' ')
  return (
    <div className="project-title-anim" aria-label={text}>
      {words.map((word, i) => (
        <span className="project-title-word" key={`${i}-${word}`}>
          <span className="project-title-word-inner">{word}</span>
        </span>
      ))}
    </div>
  )
}

const FLAIR_CDN = 'https://assets.codepen.io/16327/'

const HERO_FLAIR_PRELOAD_3D = [
  ['combo', '3D-combo.png'],
  ['cone', '3D-cone.png'],
  ['hoop', '3D-hoop.png'],
  ['keyframe', '3D-keyframe.png'],
  ['semi', '3D-semi.png'],
  ['spiral', '3D-spiral.png'],
  ['squish', '3D-squish.png'],
  ['triangle', '3D-triangle.png'],
  ['tunnel', '3D-tunnel.png'],
  ['wat', '3D-poly.png'],
]

const HERO_FLAIR_PRELOAD_XP = [
  ['blue-circle', '2D-circles.png'],
  ['green-keyframe', '2D-keyframe.png'],
  ['orange-lightning', '2D-lightning.png'],
  ['orange-star', '2D-star.png'],
  ['purple-flower', '2D-flower.png'],
  ['cone', '3D-cone.png'],
  ['keyframe', '3D-spiral.png'],
  ['spiral', '3D-spiral.png'],
  ['tunnel', '3D-tunnel.png'],
  ['hoop', '3D-hoop.png'],
  ['semi', '3D-semi.png'],
]

const GH = (repo, file) => `https://raw.githubusercontent.com/MichelBranche/${repo}/main/${file}`

const PROJECT_META = [
  {
    slug: 'rubina',
    tech: 'JavaScript / GSAP / CSS',
    link: 'https://rubinastradella.vercel.app/',
    img: GH('photo-portfolio-demo', 'preview.jpg'),
    thumb: GH('photo-portfolio-demo', 'preview.jpg'),
    publishedAt: '2026-03-21',
  },
  {
    slug: 'streetwear',
    tech: 'React / Router / GSAP / Lenis',
    link: 'https://sys-0ff.vercel.app/',
    img: GH('ecommerce-demo1', 'public/assets/mockup.png'),
    thumb: GH('ecommerce-demo1', 'public/assets/mockup.png'),
    publishedAt: '2026-03-29',
  },
  {
    slug: 'museo',
    tech: 'React / Vite / GSAP / Lenis',
    link: 'https://museoegiziotorino.vercel.app/',
    img: GH('Museo-Egizio-Torino-Demo', 'preview.png'),
    thumb: GH('Museo-Egizio-Torino-Demo', 'preview.png'),
    publishedAt: '2026-04-06',
  },
  {
    slug: 'spotify',
    tech: 'HTML / CSS / JavaScript',
    link: 'https://spotify-clone-mbdev-umber.vercel.app/',
    img: GH('Spotify-Clone', 'preview.png'),
    thumb: GH('Spotify-Clone', 'preview.png'),
    publishedAt: '2026-04-13',
  },
  {
    slug: 'levele',
    tech: 'React / Vite / API / Redis',
    link: 'https://demoleveleresidence.vercel.app/',
    img: GH('Demo-LeVeleResidence', 'preview.png'),
    thumb: GH('Demo-LeVeleResidence', 'preview.png'),
    publishedAt: '2026-04-18',
  },
  {
    slug: 'caffestella',
    tech: 'React Router / GSAP / Framer Motion',
    link: 'https://demo-paologriffa.vercel.app/',
    img: GH('demo-paologriffa', 'preview.png'),
    thumb: GH('demo-paologriffa', 'preview.png'),
    publishedAt: '2026-04-20',
  },
  {
    slug: 'ilgusto',
    tech: 'HTML / CSS / JavaScript',
    link: 'https://demo-il-gusto.vercel.app/',
    img: GH('Demo-IlGusto', 'preview-hero.png'),
    thumb: GH('Demo-IlGusto', 'preview-hero.png'),
    publishedAt: '2026-04-22',
  },
]

function HeroFlair() {
  return (
    <div className="hero-flair" aria-hidden>
      <div className="image-preload">
        {HERO_FLAIR_PRELOAD_3D.map(([key, f]) => (
          <img key={key} data-key={key} src={`${FLAIR_CDN}${f}`} width={1} height={1} alt="" />
        ))}
      </div>
      <div className="explosion-preload">
        {HERO_FLAIR_PRELOAD_XP.map(([key, f], i) => (
          <img key={`${i}-${key}`} data-key={key} src={`${FLAIR_CDN}${f}`} alt="" />
        ))}
      </div>
      <svg className="pricing-hero__canvas" />
      <div className="pricing-hero__proxy" />
    </div>
  )
}

function HeroSubtitle({ lines = [] }) {
  return (
    <div className="hero-subtitle gs-reveal">
      {lines.map((line, lineIdx) => (
        <div className="hero-subtitle-line" key={lineIdx}>
          {line.split(' ').map((word, i) => (
            <span className="hero-subtitle-word" key={`${lineIdx}-${i}-${word}`}>
              <span className="hero-subtitle-word-inner">{word}</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function HeroMiniPlayer({
  isPlaying,
  onToggle,
  artwork,
  title,
  artist,
  onNextTrack,
  trackNumber,
  totalTracks,
}) {
  return (
    <div className="hero-mini-player interactable">
      <button
        type="button"
        className="hero-mini-player-disc-wrap"
        onClick={onToggle}
        aria-label={isPlaying ? 'Pause hero track' : 'Play hero track'}
        aria-pressed={isPlaying}
      >
        <span className={`hero-mini-player-disc${isPlaying ? ' hero-mini-player-disc--spinning' : ''}`}>
          <img
            src={artwork || HERO_MP3_ART}
            alt={title ? `Cover ${title}` : 'Cover track'}
            className="hero-mini-player-disc-art"
          />
        </span>
      </button>
      <div className="hero-mini-player-meta">
        <span className="hero-mini-player-label-wrap" title={title || 'Hero mix'}>
          <span className="hero-mini-player-label hero-mini-player-label--scroll">
            {title || 'Hero mix'}
          </span>
        </span>
        <span className="hero-mini-player-artist">{artist || 'SoundCloud'}</span>
        <div className="hero-mini-player-controls-row">
          <span className="hero-mini-player-state">{isPlaying ? 'Playing' : 'Paused'}</span>
          <button
            type="button"
            className="hero-mini-player-next"
            onClick={onNextTrack}
            aria-label="Prossima canzone"
          >
            Next {trackNumber}/{totalTracks}
          </button>
        </div>
      </div>
    </div>
  )
}

function ModalTitle({ text }) {
  const safeText = String(text || '')
  const shouldScroll = safeText.length > 32
  if (!shouldScroll) {
    return <>{safeText}</>
  }
  return (
    <span className="modal-title-ticker" aria-label={safeText}>
      <span className="modal-title-ticker-track">
        <span>{safeText}</span>
        <span aria-hidden>{safeText}</span>
      </span>
    </span>
  )
}

function App() {
  const { t, lang } = useLanguage()
  const [modalData, setModalData] = useState(null)
  const lenisRef = useRef(null)
  const modalRef = useRef(null)
  const modalImgRef = useRef(null)
  const modalTitleRef = useRef(null)
  const modalDescRef = useRef(null)
  const modalLinkRef = useRef(null)
  const modalCloseRef = useRef(null)
  const footerSoundRef = useRef(null)
  const scrivimiLeaveCountRef = useRef(0)
  const sideEyeTimeoutRef = useRef(null)
  const [showSideEye, setShowSideEye] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [selfDestructed, setSelfDestructed] = useState(false)
  const selfDestructLockRef = useRef(false)
  const [preloaderPhase, setPreloaderPhase] = useState('awaitEnter')
  const continueAfterPreloaderRef = useRef(() => {})
  const startPreloaderLoadingRef = useRef(null)
  const preloaderPart2DoneRef = useRef(false)
  const heroRef = useRef(null)
  const preloaderAmbientRef = useRef(null)
  const heroMiniPlayerIframeRef = useRef(null)
  const heroSoundCloudWidgetRef = useRef(null)
  const heroMiniPlayerPulseRef = useRef(null)
  const heroMetaPollTimeoutRef = useRef(null)
  const [heroTrackPlaying, setHeroTrackPlaying] = useState(false)
  const [heroTrackIndex, setHeroTrackIndex] = useState(() =>
    Math.floor(Math.random() * HERO_MP3_TRACKS.length),
  )
  const [heroTrackMeta, setHeroTrackMeta] = useState({
    title: '',
    artist: '',
    artwork: '',
  })

  const projects = useMemo(() => {
    return [...PROJECT_META]
      .map((p) => ({
        ...p,
        title: t(`projects.${p.slug}.title`),
        desc: t(`projects.${p.slug}.desc`),
      }))
      .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt, lang, { sensitivity: 'base' }))
  }, [t, lang])

  const heroSubtitleLines = useMemo(() => {
    const raw = t('hero.lines')
    return Array.isArray(raw) ? raw : [String(raw)]
  }, [t])

  const marqueeLine = String(t('marquee.line'))
  const services = useMemo(
    () => [
      {
        title: String(t('services.website.title')),
        desc: String(t('services.website.desc')),
      },
      {
        title: String(t('services.ecommerce.title')),
        desc: String(t('services.ecommerce.desc')),
      },
      {
        title: String(t('services.uiux.title')),
        desc: String(t('services.uiux.desc')),
      },
      {
        title: String(t('services.performance.title')),
        desc: String(t('services.performance.desc')),
      },
      {
        title: String(t('services.maintenance.title')),
        desc: String(t('services.maintenance.desc')),
      },
      {
        title: String(t('services.seo.title')),
        desc: String(t('services.seo.desc')),
      },
    ],
    [t],
  )
  const packageCards = useMemo(
    () =>
      ['launch', 'growth', 'authority'].map((key) => ({
        key,
        name: String(t(`packages.${key}.name`)),
        range: String(t(`packages.${key}.range`)),
        ideal: asArray(t(`packages.${key}.ideal`)),
        includes: asArray(t(`packages.${key}.includes`)),
      })),
    [t],
  )
  const packageExtras = useMemo(() => asArray(t('packages.extras.items')), [t])
  const packagePositioning = useMemo(() => asArray(t('packages.positioning.lines')), [t])
  const packageFlow = useMemo(() => asArray(t('packages.flow.steps')), [t])
  const [activePackage, setActivePackage] = useState('growth')
  const activePackageData = useMemo(
    () => packageCards.find((pack) => pack.key === activePackage) ?? packageCards[1],
    [activePackage, packageCards],
  )
  const packagesShowcaseRef = useRef(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePackage((current) => {
        const idx = packageCards.findIndex((pack) => pack.key === current)
        return packageCards[(idx + 1) % packageCards.length]?.key ?? 'growth'
      })
    }, 9000)
    return () => window.clearInterval(timer)
  }, [packageCards])

  useEffect(() => {
    const root = packagesShowcaseRef.current
    if (!root) return
    const moving = root.querySelectorAll(
      '.packages-showcase-title, .packages-showcase-price, .package-label, .package-list li, .package-badge, .package-kicker',
    )
    const tl = gsap.timeline()
    tl.fromTo(
      root,
      { opacity: 0.72, y: 10 },
      { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' },
      0,
    ).fromTo(
      moving,
      { y: 12, opacity: 0.2 },
      { y: 0, opacity: 1, duration: 0.42, stagger: 0.02, ease: 'power2.out' },
      0.04,
    )
    return () => {
      tl.kill()
    }
  }, [activePackage])

  useEffect(() => {
    if (preloaderPhase !== 'counting') {
      const a = preloaderAmbientRef.current
      if (a) {
        a.pause()
        a.currentTime = 0
      }
      return
    }
    let a = preloaderAmbientRef.current
    if (!a) {
      a = new Audio(PRELOADER_AMBIENT)
      a.loop = true
      a.preload = 'auto'
      a.volume = 0.38
      preloaderAmbientRef.current = a
    }
    void a.play().catch(() => {})
  }, [preloaderPhase])

  useEffect(() => {
    return () => {
      const a = preloaderAmbientRef.current
      if (a) {
        a.pause()
        a.src = ''
        preloaderAmbientRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const widget = heroSoundCloudWidgetRef.current
    if (!widget) return
    const shouldAutoplay = heroTrackPlaying
    setHeroTrackMeta({ title: '', artist: '', artwork: '' })
    widget.load(HERO_MP3_TRACKS[heroTrackIndex].url, {
      auto_play: shouldAutoplay,
      show_comments: false,
      show_user: false,
      show_reposts: false,
      hide_related: true,
      visual: false,
    })
  }, [heroTrackIndex])

  useEffect(() => {
    let cancelled = false
    const scriptId = 'soundcloud-widget-api'

    const bindWidget = () => {
      const iframe = heroMiniPlayerIframeRef.current
      const SC = window.SC
      if (!iframe || !SC?.Widget) return
      const widget = SC.Widget(iframe)
      heroSoundCloudWidgetRef.current = widget
      const readSoundMeta = (attempt = 0) => {
        if (heroMetaPollTimeoutRef.current) {
          clearTimeout(heroMetaPollTimeoutRef.current)
          heroMetaPollTimeoutRef.current = null
        }
        widget.getCurrentSound((sound) => {
          if (cancelled || !sound) return
          const title = typeof sound.title === 'string' ? sound.title : ''
          const artist =
            typeof sound.user?.username === 'string'
              ? sound.user.username
              : ''
          const artworkRaw =
            typeof sound.artwork_url === 'string' && sound.artwork_url
              ? sound.artwork_url
              : typeof sound.user?.avatar_url === 'string'
                ? sound.user.avatar_url
                : ''
          const artwork = artworkRaw ? artworkRaw.replace('-large.', '-t500x500.') : ''
          setHeroTrackMeta({ title, artist, artwork })
          if ((!title || !artwork) && attempt < 8) {
            heroMetaPollTimeoutRef.current = setTimeout(() => {
              readSoundMeta(attempt + 1)
            }, 200)
          }
        })
      }
      widget.bind(SC.Widget.Events.PLAY, () => {
        if (!cancelled) setHeroTrackPlaying(true)
      })
      widget.bind(SC.Widget.Events.PAUSE, () => {
        if (!cancelled) setHeroTrackPlaying(false)
      })
      widget.bind(SC.Widget.Events.FINISH, () => {
        if (!cancelled) setHeroTrackPlaying(false)
      })
      widget.bind(SC.Widget.Events.READY, () => {
        if (!cancelled) {
          setHeroTrackPlaying(false)
          readSoundMeta()
        }
      })
    }

    if (window.SC?.Widget) {
      bindWidget()
      return () => {
        cancelled = true
        if (heroMetaPollTimeoutRef.current) {
          clearTimeout(heroMetaPollTimeoutRef.current)
          heroMetaPollTimeoutRef.current = null
        }
        heroSoundCloudWidgetRef.current = null
      }
    }

    let script = document.getElementById(scriptId)
    const onLoad = () => bindWidget()
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://w.soundcloud.com/player/api.js'
      script.async = true
      script.addEventListener('load', onLoad)
      document.body.appendChild(script)
    } else {
      script.addEventListener('load', onLoad)
    }

    return () => {
      cancelled = true
      if (heroMetaPollTimeoutRef.current) {
        clearTimeout(heroMetaPollTimeoutRef.current)
        heroMetaPollTimeoutRef.current = null
      }
      script?.removeEventListener('load', onLoad)
      heroSoundCloudWidgetRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      const widget = heroSoundCloudWidgetRef.current
      if (!widget) return
      widget.pause()
      if (heroMetaPollTimeoutRef.current) {
        clearTimeout(heroMetaPollTimeoutRef.current)
        heroMetaPollTimeoutRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const players = {
      linkedin: new Audio(FOOTER_SOUNDS.linkedin),
      instagram: new Audio(FOOTER_SOUNDS.instagram),
      email: new Audio(FOOTER_SOUNDS.email),
      scrivimi: new Audio(FOOTER_SOUNDS.scrivimi),
      anvilDrop: new Audio(FOOTER_SOUNDS.anvilDrop),
      michel: new Audio(FOOTER_SOUNDS.michel),
      branche: new Audio(FOOTER_SOUNDS.branche),
      rizz: new Audio(FOOTER_SOUNDS.rizz),
    }
    Object.values(players).forEach((a) => {
      a.preload = 'auto'
      a.volume = 0.45
    })
    if (players.instagram) {
      players.instagram.volume = 0.45 * 0.6
    }
    if (players.rizz) {
      players.rizz.volume = 0.55
    }
    footerSoundRef.current = players
    return () => {
      Object.values(players).forEach((a) => {
        a.pause()
        a.src = ''
      })
      footerSoundRef.current = null
    }
  }, [])

  const playFooterSound = (key) => {
    const players = footerSoundRef.current
    const audio = players?.[key]
    if (!audio) return
    audio.loop = key === 'scrivimi'
    audio.currentTime = 0
    void audio.play().catch(() => {})
  }

  const stopFooterSound = (key) => {
    const players = footerSoundRef.current
    const audio = players?.[key]
    if (!audio) return
    audio.loop = false
    audio.pause()
    audio.currentTime = 0
  }

  const handlePreloaderEnter = useCallback(() => {
    if (preloaderPhase !== 'awaitEnter') return
    setPreloaderPhase('counting')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        startPreloaderLoadingRef.current?.()
      })
    })
  }, [preloaderPhase])

  const handleScrivimiLeave = () => {
    stopFooterSound('scrivimi')
    scrivimiLeaveCountRef.current += 1
    if (scrivimiLeaveCountRef.current >= 3) {
      playFooterSound('email')
      setShowSideEye(true)
      if (sideEyeTimeoutRef.current) {
        clearTimeout(sideEyeTimeoutRef.current)
      }
      sideEyeTimeoutRef.current = setTimeout(() => {
        setShowSideEye(false)
        sideEyeTimeoutRef.current = null
      }, 900)
    }
  }

  useEffect(() => {
    return () => {
      if (sideEyeTimeoutRef.current) {
        clearTimeout(sideEyeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const docCycleRaw = translate(lang, 'doc.cycle')
    const away = translate(lang, 'doc.away')
    const titleFrames = Array.isArray(docCycleRaw) ? docCycleRaw : [String(docCycleRaw)]
    const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let titleTimer = null

    const applyVisible = () => {
      document.title = preferReduced
        ? titleFrames[0]
        : titleFrames[frame % titleFrames.length]
    }

    const startTitleCycle = () => {
      if (preferReduced) {
        applyVisible()
        return
      }
      applyVisible()
      titleTimer = window.setInterval(() => {
        if (document.hidden) return
        frame += 1
        applyVisible()
      }, DOC_TITLE_INTERVAL_MS)
    }

    const stopTitleCycle = () => {
      if (titleTimer != null) {
        window.clearInterval(titleTimer)
        titleTimer = null
      }
    }

    const onVisibility = () => {
      if (document.hidden) {
        stopTitleCycle()
        document.title = String(away)
      } else {
        document.title = titleFrames[0]
        frame = 0
        applyDocumentFavicon(FAVICON_DEFAULT)
        startTitleCycle()
      }
    }

    if (document.hidden) {
      document.title = String(away)
    } else {
      applyDocumentFavicon(FAVICON_DEFAULT)
      startTitleCycle()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      stopTitleCycle()
      document.title = titleFrames[0]
      applyDocumentFavicon(FAVICON_DEFAULT)
    }
  }, [lang])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const cursor = document.querySelector('.cursor')
    const easterImg = document.querySelector('.easter-egg-img')
    const magWrap = document.querySelector('.magnetic-wrap')
    const magText = document.querySelector('.magnetic-text')
    const projectItems = document.querySelectorAll('.project-item')
    const serviceItems = document.querySelectorAll('.service-item')
    const packageCardsEls = document.querySelectorAll('.package-card')
    const projectFloats = document.querySelectorAll('.project-img-float')
    const interactables = document.querySelectorAll('.interactable')
    const easterTriggers = document.querySelectorAll('.easter-trigger')

    const cleanupFns = []

    const hideAllProjectFloats = () => {
      if (!projectFloats.length) return
      gsap.killTweensOf([...projectFloats])
      gsap.set([...projectFloats], { opacity: 0, scale: 0, x: 0, y: 0 })
      if (cursor) {
        gsap.to(cursor, { opacity: 1, duration: 0.15, overwrite: 'auto' })
      }
    }

    const isStickyTouch = isCoarsePointerDevice()
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const heroTopEl = document.querySelector('.hero-top')
    const heroSubEl = document.querySelector('section.hero .hero-subtitle')
    const heroSocialEl = document.querySelector('section.hero .hero-social')
    const heroParallaxOn = !isStickyTouch && !prefersReducedMotion && heroTopEl && heroSubEl && heroSocialEl

    const resetHeroTopParallax = () => {
      if (!heroSubEl || !heroSocialEl) return
      gsap.to([heroSubEl, heroSocialEl], {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    if (heroParallaxOn) {
      const heroSection = document.querySelector('section.hero')
      const onLeaveHero = () => resetHeroTopParallax()
      if (heroSection) {
        heroSection.addEventListener('mouseleave', onLeaveHero)
        cleanupFns.push(() => {
          heroSection.removeEventListener('mouseleave', onLeaveHero)
        })
      }
    }

    let activeTouchProjectItem = null
    let activeProjectLeave = null
    const clearActiveProjectTouch = () => {
      if (activeProjectLeave) {
        activeProjectLeave()
        activeProjectLeave = null
        activeTouchProjectItem = null
      }
    }

    const onMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
        force3D: true,
        overwrite: 'auto',
      })
      if (isStickyTouch && activeTouchProjectItem) {
        return
      }
      if (heroParallaxOn) {
        const r = heroTopEl.getBoundingClientRect()
        if (r.width > 1 && r.height > 1) {
          const cx = r.left + r.width * 0.5
          const cy = r.top + r.height * 0.5
          const tx = Math.max(
            -1,
            Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.28)),
          )
          const ty = Math.max(
            -1,
            Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.28)),
          )
          gsap.to(heroSubEl, {
            x: tx * 26,
            y: ty * 16,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          })
          gsap.to(heroSocialEl, {
            x: tx * 11,
            y: ty * 7,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      }
      // Fallback when mouseleave is missed (e.g. fast scroll) or old tweens leave opacity>0.
      const top = document.elementFromPoint(e.clientX, e.clientY)
      if (!top?.closest?.('.project-item')) {
        for (const img of projectFloats) {
          if (Number(gsap.getProperty(img, 'opacity')) > 0.01) {
            hideAllProjectFloats()
            break
          }
        }
      }
      if (!isStickyTouch && cursor && !top?.closest?.('.interactable')) {
        // Safety reset: if a leave event is missed, bring cursor back to normal size.
        gsap.to(cursor, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
          force3D: true,
          transformOrigin: '50% 50%',
          overwrite: 'auto',
        })
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    cleanupFns.push(() => window.removeEventListener('mousemove', onMouseMove))
    const onWindowBlur = () => {
      clearActiveProjectTouch()
      hideAllProjectFloats()
      resetHeroTopParallax()
    }
    const onVisChange = () => {
      if (document.visibilityState === 'hidden') {
        clearActiveProjectTouch()
        hideAllProjectFloats()
        resetHeroTopParallax()
      }
    }
    window.addEventListener('blur', onWindowBlur)
    document.addEventListener('visibilitychange', onVisChange)
    cleanupFns.push(() => {
      window.removeEventListener('blur', onWindowBlur)
      document.removeEventListener('visibilitychange', onVisChange)
    })

    if (!isStickyTouch) {
      interactables.forEach((el) => {
        const onEnter = () =>
          gsap.to(cursor, {
            scale: 4,
            duration: 0.3,
            ease: 'back.out(2)',
            force3D: true,
            transformOrigin: '50% 50%',
          })
        const onLeave = () =>
          gsap.to(cursor, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            force3D: true,
            transformOrigin: '50% 50%',
          })
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
        cleanupFns.push(() => {
          el.removeEventListener('mouseenter', onEnter)
          el.removeEventListener('mouseleave', onLeave)
        })
      })
    }

    if (isStickyTouch) {
      const onDocProjectTouch = (e) => {
        if (e.pointerType === 'mouse') return
        if (!activeTouchProjectItem) return
        if (activeTouchProjectItem.contains(e.target)) return
        clearActiveProjectTouch()
      }
      document.addEventListener('pointerdown', onDocProjectTouch, true)
      cleanupFns.push(() => {
        document.removeEventListener('pointerdown', onDocProjectTouch, true)
      })
    }

    easterTriggers.forEach((trigger) => {
      const showImg = () => gsap.to(easterImg, { opacity: 1, scale: 1, duration: 0.3 })
      const hideImg = () => gsap.to(easterImg, { opacity: 0, scale: 1.1, duration: 0.4 })
      trigger.addEventListener('mousedown', showImg)
      trigger.addEventListener('touchstart', showImg)
      trigger.addEventListener('mouseup', hideImg)
      trigger.addEventListener('mouseleave', hideImg)
      trigger.addEventListener('touchend', hideImg)
      cleanupFns.push(() => {
        trigger.removeEventListener('mousedown', showImg)
        trigger.removeEventListener('touchstart', showImg)
        trigger.removeEventListener('mouseup', hideImg)
        trigger.removeEventListener('mouseleave', hideImg)
        trigger.removeEventListener('touchend', hideImg)
      })
    })

    const heroTitles = document.querySelectorAll('.hero-title')
    heroTitles.forEach((title) => {
      const outers = title.querySelectorAll('.hero-title-letter')
      const inners = title.querySelectorAll('.hero-title-letter-inner')
      let hoverTl = null
      const colorTl = { current: null }

      const onEnter = () => {
        if (hoverTl) hoverTl.kill()
        if (colorTl.current) colorTl.current.kill()
        gsap.set(outers, { transformOrigin: '50% 100%' })
        hoverTl = gsap.timeline({ repeat: -1, repeatDelay: 0, repeatRefresh: true })
        hoverTl
          .to(outers, {
            y: () => gsap.utils.random(-36, -14),
            rotate: () => gsap.utils.random(-14, 14),
            skewX: () => gsap.utils.random(-9, 9),
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
            stagger: { each: 0.034, from: 'start' },
          })
          .to(outers, {
            y: 0,
            rotate: 0,
            skewX: 0,
            duration: 0.48,
            ease: 'power1.inOut',
            overwrite: 'auto',
            stagger: { each: 0.03, from: 'end' },
          })
        colorTl.current = gsap.to(inners, {
          color: 'var(--accent)',
          duration: 0.2,
          stagger: { each: 0.03, from: 'start' },
        })
      }

      const onLeave = () => {
        if (hoverTl) {
          hoverTl.kill()
          hoverTl = null
        }
        if (colorTl.current) {
          colorTl.current.kill()
          colorTl.current = null
        }
        gsap.to(outers, {
          y: 0,
          rotate: 0,
          skewX: 0,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto',
          stagger: { each: 0.018, from: 'center' },
        })
        gsap.to(inners, { color: '', duration: 0.3 })
      }

      title.addEventListener('mouseenter', onEnter)
      title.addEventListener('mouseleave', onLeave)
      cleanupFns.push(() => {
        title.removeEventListener('mouseenter', onEnter)
        title.removeEventListener('mouseleave', onLeave)
        if (hoverTl) hoverTl.kill()
        if (colorTl.current) colorTl.current.kill()
      })
    })

    const socialLinks = document.querySelectorAll('.hero-social-link')
    socialLinks.forEach((link, idx) => {
      const icon = link.querySelector('.social-icon')
      let enterTl = null

      const onEnter = () => {
        if (enterTl) enterTl.kill()
        enterTl = gsap.timeline()
        enterTl
          .to(link, {
            y: -8,
            scale: 1.25,
            color: 'var(--accent)',
            duration: 0.35,
            ease: 'power3.out',
          })
          .to(
            icon,
            {
              rotate: idx === 1 ? 360 : gsap.utils.random(-18, 18),
              duration: idx === 1 ? 0.9 : 0.45,
              ease: idx === 1 ? 'power2.inOut' : 'back.out(2)',
            },
            0,
          )
          .to(
            link,
            {
              y: -4,
              scale: 1.15,
              duration: 0.6,
              ease: 'elastic.out(1, 0.4)',
            },
            '>-0.1',
          )
      }

      const onLeave = () => {
        if (enterTl) enterTl.kill()
        gsap.to(link, {
          y: 0,
          scale: 1,
          color: '',
          duration: 0.55,
          ease: 'elastic.out(1, 0.5)',
        })
        gsap.to(icon, { rotate: 0, duration: 0.5, ease: 'power3.out' })
      }

      const onDown = () => {
        gsap.to(link, { scale: 0.9, duration: 0.1, ease: 'power2.out' })
      }
      const onUp = () => {
        gsap.to(link, { scale: 1.25, duration: 0.25, ease: 'back.out(2)' })
      }

      link.addEventListener('mouseenter', onEnter)
      link.addEventListener('mouseleave', onLeave)
      link.addEventListener('mousedown', onDown)
      link.addEventListener('mouseup', onUp)
      cleanupFns.push(() => {
        link.removeEventListener('mouseenter', onEnter)
        link.removeEventListener('mouseleave', onLeave)
        link.removeEventListener('mousedown', onDown)
        link.removeEventListener('mouseup', onUp)
        if (enterTl) enterTl.kill()
      })
    })

    const heroMiniPlayer = document.querySelector('.hero-mini-player')
    if (heroMiniPlayer) {
      const discWrap = heroMiniPlayer.querySelector('.hero-mini-player-disc-wrap')
      const nextBtn = heroMiniPlayer.querySelector('.hero-mini-player-next')
      const meta = heroMiniPlayer.querySelector('.hero-mini-player-meta')
      let playerEnterTl = null

      const onPlayerEnter = () => {
        if (playerEnterTl) playerEnterTl.kill()
        playerEnterTl = gsap.timeline()
        playerEnterTl
          .to(heroMiniPlayer, {
            y: -6,
            scale: 1.03,
            duration: 0.3,
            ease: 'power3.out',
          })
          .to(
            discWrap,
            {
              borderColor: 'var(--accent)',
              duration: 0.25,
              ease: 'power2.out',
            },
            0,
          )
          .to(
            discWrap,
            {
              rotate: '+=22',
              duration: 0.45,
              ease: 'back.out(2)',
            },
            0,
          )
          .to(
            meta,
            {
              x: 3,
              duration: 0.35,
              ease: 'power2.out',
            },
            0,
          )
      }

      const onPlayerLeave = () => {
        if (playerEnterTl) playerEnterTl.kill()
        gsap.to(heroMiniPlayer, {
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: 'elastic.out(1, 0.5)',
        })
        gsap.to(discWrap, { borderColor: '', duration: 0.28, ease: 'power2.out' })
        gsap.to(discWrap, { rotate: 0, duration: 0.45, ease: 'power3.out' })
        gsap.to(meta, { x: 0, duration: 0.35, ease: 'power2.out' })
      }

      const onPlayerDown = () => {
        gsap.to(heroMiniPlayer, { scale: 0.97, duration: 0.12, ease: 'power2.out' })
      }
      const onPlayerUp = () => {
        gsap.to(heroMiniPlayer, { scale: 1.03, duration: 0.25, ease: 'back.out(2)' })
      }

      const onNextEnter = () => {
        gsap.to(nextBtn, {
          y: -2,
          backgroundColor: 'var(--accent)',
          color: 'var(--bg)',
          borderColor: 'var(--accent)',
          duration: 0.25,
          ease: 'power2.out',
        })
      }
      const onNextLeave = () => {
        gsap.to(nextBtn, {
          y: 0,
          backgroundColor: 'transparent',
          color: '',
          borderColor: '',
          duration: 0.3,
          ease: 'power2.out',
        })
      }
      const onNextDown = () => {
        gsap.to(nextBtn, { scale: 0.93, duration: 0.1, ease: 'power2.out' })
      }
      const onNextUp = () => {
        gsap.to(nextBtn, { scale: 1, duration: 0.2, ease: 'back.out(2)' })
      }

      heroMiniPlayer.addEventListener('mouseenter', onPlayerEnter)
      heroMiniPlayer.addEventListener('mouseleave', onPlayerLeave)
      heroMiniPlayer.addEventListener('mousedown', onPlayerDown)
      heroMiniPlayer.addEventListener('mouseup', onPlayerUp)
      nextBtn?.addEventListener('mouseenter', onNextEnter)
      nextBtn?.addEventListener('mouseleave', onNextLeave)
      nextBtn?.addEventListener('mousedown', onNextDown)
      nextBtn?.addEventListener('mouseup', onNextUp)
      cleanupFns.push(() => {
        heroMiniPlayer.removeEventListener('mouseenter', onPlayerEnter)
        heroMiniPlayer.removeEventListener('mouseleave', onPlayerLeave)
        heroMiniPlayer.removeEventListener('mousedown', onPlayerDown)
        heroMiniPlayer.removeEventListener('mouseup', onPlayerUp)
        nextBtn?.removeEventListener('mouseenter', onNextEnter)
        nextBtn?.removeEventListener('mouseleave', onNextLeave)
        nextBtn?.removeEventListener('mousedown', onNextDown)
        nextBtn?.removeEventListener('mouseup', onNextUp)
        if (playerEnterTl) playerEnterTl.kill()
      })
    }

    if (magWrap && magText) {
      const onMagneticMove = (e) => {
        const rect = magWrap.getBoundingClientRect()
        gsap.to(magText, {
          x: (e.clientX - (rect.left + rect.width / 2)) * 0.4,
          y: (e.clientY - (rect.top + rect.height / 2)) * 0.4,
          duration: 0.5,
        })
      }
      const onMagneticLeave = () =>
        gsap.to(magText, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' })
      magWrap.addEventListener('mousemove', onMagneticMove)
      magWrap.addEventListener('mouseleave', onMagneticLeave)
      cleanupFns.push(() => {
        magWrap.removeEventListener('mousemove', onMagneticMove)
        magWrap.removeEventListener('mouseleave', onMagneticLeave)
      })
    }

    const lenis = new Lenis({
      duration: isStickyTouch ? 0.95 : 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      syncTouch: !isStickyTouch,
      touchMultiplier: isStickyTouch ? 1 : 1.15,
    })
    lenis.stop()
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tickerCallback = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    let heroTagFallTl = null
    let heroTagFallLocked = false
    let heroTagHasFallen = false

    const playAnvilLand = () => {
      const players = footerSoundRef.current
      const audio = players?.anvilDrop
      if (!audio) return
      audio.loop = false
      audio.currentTime = 0
      audio.volume = 0.55
      void audio.play().catch(() => {})
    }

    const resetHeroTagFall = () => {
      const tag = document.querySelector('.hero-tag')
      if (heroTagFallTl) {
        heroTagFallTl.kill()
        heroTagFallTl = null
      }
      heroTagFallLocked = false
      heroTagHasFallen = false
      if (tag) {
        gsap.set(tag, { y: 0, x: 0, rotation: -6, zIndex: 2 })
      }
    }

    const runHeroTagFall = () => {
      const tag = document.querySelector('.hero-tag')
      const hero = document.querySelector('.hero')
      if (!tag || !hero) return
      if (heroTagFallLocked || heroTagHasFallen) {
        return
      }

      if (heroTagFallTl) {
        heroTagFallTl.kill()
        heroTagFallTl = null
      }

      const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const measureDist = () => {
        const hr = hero.getBoundingClientRect()
        const tr = tag.getBoundingClientRect()
        const floorPad = 22
        return Math.max(0, hr.bottom - floorPad - tr.bottom)
      }

      const run = () => {
        const dist = measureDist()
        gsap.set(tag, { transformOrigin: '50% 50%' })

        if (dist < 4) {
          return
        }

        heroTagFallLocked = true

        if (preferReduced) {
          gsap.set(tag, { y: dist, rotation: -6, zIndex: 3 })
          playAnvilLand()
          heroTagHasFallen = true
          heroTagFallLocked = false
          return
        }

        const dur = Math.min(1.2, Math.max(0.45, 0.36 + dist / 1200))

        heroTagFallTl = gsap
          .timeline({
            onComplete: () => {
              heroTagHasFallen = true
              heroTagFallLocked = false
            },
          })
          .set(tag, { zIndex: 5 })
          .to(tag, {
            y: dist,
            rotation: 5,
            ease: 'power2.in',
            duration: dur,
            onComplete: () => {
              playAnvilLand()
            },
          })
          .to(tag, {
            y: dist - 15,
            rotation: -2,
            duration: 0.12,
            ease: 'power2.out',
          })
          .to(tag, {
            y: dist,
            rotation: -6,
            duration: 0.5,
            ease: 'bounce.out',
          })
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(run)
      })
    }

    const tagEl = document.querySelector('.hero-tag')
    const heroSection = document.querySelector('.hero')
    if (tagEl && heroSection) {
      const onTagPointerEnter = () => {
        runHeroTagFall()
      }
      const onHeroMouseLeave = () => {
        resetHeroTagFall()
      }
      tagEl.addEventListener('pointerenter', onTagPointerEnter)
      heroSection.addEventListener('mouseleave', onHeroMouseLeave)
      cleanupFns.push(() => {
        tagEl.removeEventListener('pointerenter', onTagPointerEnter)
        heroSection.removeEventListener('mouseleave', onHeroMouseLeave)
        resetHeroTagFall()
      })
    } else {
      cleanupFns.push(() => {
        if (heroTagFallTl) {
          heroTagFallTl.kill()
          heroTagFallTl = null
        }
      })
    }

    continueAfterPreloaderRef.current = () => {
      if (preloaderPart2DoneRef.current) {
        return
      }
      preloaderPart2DoneRef.current = true
      gsap
        .timeline({
          onComplete: () => {
            lenis.start()
            setPreloaderPhase('done')
          },
        })
        .to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut' })
        .fromTo(
          '.hero-title-letter-inner',
          {
            yPercent: 120,
            opacity: 0,
            rotate: () => gsap.utils.random(-22, 22),
            skewX: () => gsap.utils.random(-12, 12),
          },
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            skewX: 0,
            duration: 1.1,
            stagger: { each: 0.045, from: 'start' },
            ease: 'power4.out',
          },
          '-=0.6',
        )
        .fromTo(
          '.hero-tag',
          { opacity: 0, scale: 2.2, rotate: 18, y: -30 },
          {
            opacity: 1,
            scale: 1,
            rotate: -6,
            y: 0,
            duration: 0.55,
            ease: 'power4.out',
            transformOrigin: '0% 50%',
            clearProps: 'scale,y',
          },
          '-=0.3',
        )
        .fromTo(
          '.hero-subtitle-word-inner',
          {
            yPercent: 115,
            opacity: 0,
            rotate: () => gsap.utils.random(-6, 6),
            skewX: () => gsap.utils.random(-5, 5),
          },
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            skewX: 0,
            duration: 0.82,
            stagger: { each: 0.032, from: 'start' },
            ease: 'power3.out',
          },
          '-=0.8',
        )
        .fromTo(
          '.hero-social-link',
          { opacity: 0, y: 30, scale: 0.6, rotate: -45 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'back.out(2.2)',
          },
          '-=0.7',
        )
        .fromTo(
          '.hero-mini-player',
          { opacity: 0, y: 22, scale: 0.72, rotate: -8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.72,
            ease: 'back.out(1.9)',
          },
          '-=0.65',
        )
    }

    const startPreloaderCounting = () => {
      const el = document.querySelector('.preloader-counter')
      const counter = { val: 0 }
      if (el) {
        el.innerText = '0%'
      }
      gsap
        .timeline({
          onComplete: () => {
            if (preloaderPart2DoneRef.current) return
            setPreloaderPhase('exiting')
            playFooterSound('rizz')
            continueAfterPreloaderRef.current()
          },
        })
        .to(counter, {
          val: 100,
          roundProps: 'val',
          duration: 2.2,
          ease: 'power3.inOut',
          onUpdate: () => {
            if (el) {
              el.innerText = `${counter.val}%`
            }
          },
        })
    }
    startPreloaderLoadingRef.current = startPreloaderCounting

    projectItems.forEach((item) => {
      const titleInners = item.querySelectorAll('.project-title-word-inner')
      const tech = item.querySelector('.project-tech')
      const img = item.querySelector('.project-img-float')

      gsap.set(item, { opacity: 0, y: 52 })
      if (titleInners.length) {
        gsap.set(titleInners, { y: '100%', opacity: 0 })
      }
      if (tech) {
        gsap.set(tech, { opacity: 0, y: 22, x: 24 })
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            once: true,
          },
        })
        .to(item, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .to(
          titleInners,
          { y: '0%', opacity: 1, duration: 0.75, stagger: 0.04, ease: 'power3.out' },
          0.05,
        )
        .to(tech, { y: 0, x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.12)

      const onEnter = () => {
        if (!isStickyTouch) {
          gsap.killTweensOf(img)
          gsap.to(img, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
            overwrite: 'auto',
          })
          gsap.to(cursor, { opacity: 0, duration: 0.2, overwrite: 'auto' })
        }
        if (titleInners.length) {
          gsap.to(titleInners, {
            y: -5,
            duration: 0.45,
            stagger: { each: 0.026, from: 'start' },
            ease: 'back.out(1.5)',
            overwrite: 'auto',
          })
        }
        if (tech) {
          gsap.to(tech, {
            x: 8,
            y: -3,
            letterSpacing: '0.07em',
            duration: 0.45,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      }
      const onLeave = () => {
        if (!isStickyTouch) {
          gsap.killTweensOf(img)
          gsap.to(img, { opacity: 0, scale: 0, duration: 0.3, overwrite: 'auto' })
          gsap.to(cursor, { opacity: 1, duration: 0.2, overwrite: 'auto' })
        }
        if (titleInners.length) {
          gsap.to(titleInners, {
            y: 0,
            duration: 0.38,
            stagger: { each: 0.016, from: 'end' },
            ease: 'power3.inOut',
            overwrite: 'auto',
          })
        }
        if (tech) {
          gsap.to(tech, {
            x: 0,
            y: 0,
            letterSpacing: '0em',
            duration: 0.38,
            ease: 'power2.inOut',
            overwrite: 'auto',
          })
        }
      }
      const onMove = (e) => {
        gsap.to(img, {
          x: e.clientX - window.innerWidth / 2,
          y: e.clientY - window.innerHeight / 2,
          duration: 0.5,
          overwrite: 'auto',
        })
      }

      if (isStickyTouch) {
        const onItemPointerDown = (e) => {
          if (e.pointerType === 'mouse') return
          if (activeTouchProjectItem && activeTouchProjectItem !== item) {
            if (activeProjectLeave) {
              activeProjectLeave()
            }
            activeProjectLeave = null
            activeTouchProjectItem = null
          }
          if (activeTouchProjectItem === item) {
            return
          }
          activeTouchProjectItem = item
          activeProjectLeave = onLeave
          onEnter()
        }
        item.addEventListener('pointerdown', onItemPointerDown, true)
        cleanupFns.push(() => {
          item.removeEventListener('pointerdown', onItemPointerDown, true)
        })
      } else {
        item.addEventListener('mouseenter', onEnter)
        item.addEventListener('mouseleave', onLeave)
        item.addEventListener('mousemove', onMove)
        cleanupFns.push(() => {
          item.removeEventListener('mouseenter', onEnter)
          item.removeEventListener('mouseleave', onLeave)
          item.removeEventListener('mousemove', onMove)
        })
      }
    })

    const servicesHeader = document.querySelector('.services-header')
    const servicesLead = document.querySelector('.services-lead')
    const runServicesHeaderIntro = () => {
      if (!servicesHeader || prefersReducedMotion) return
      const headerLetters = servicesHeader.querySelectorAll('.services-header-letter-inner')
      gsap.set(headerLetters, { yPercent: 110, rotate: 4, opacity: 0 })
      gsap
        .timeline()
        .to(servicesHeader, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' })
        .to(
          headerLetters,
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.03,
            ease: 'power3.out',
          },
          0,
        )
        .to(
          servicesHeader,
          {
            color: 'var(--accent)',
            duration: 0.18,
            ease: 'power1.out',
            yoyo: true,
            repeat: 1,
          },
          0.18,
        )
    }

    if (servicesHeader || servicesLead) {
      gsap.set([servicesHeader, servicesLead].filter(Boolean), { opacity: 0, y: 24 })
      const servicesRevealTl = gsap
        .timeline({
          scrollTrigger: {
            trigger: '.services',
            start: 'top 84%',
            once: true,
          },
        })
        .to([servicesHeader, servicesLead].filter(Boolean), {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: 'power2.out',
        })
      servicesRevealTl.eventCallback('onComplete', () => {
        runServicesHeaderIntro()
      })
    }
    if (servicesHeader) {
      cleanupFns.push(() => {
        gsap.killTweensOf(servicesHeader)
      })
    }

    serviceItems.forEach((item) => {
      const title = item.querySelector('.service-title')
      const desc = item.querySelector('.service-desc')
      const parts = [title, desc].filter(Boolean)

      gsap.set(item, { opacity: 0, y: 36, rotateX: -10, transformOrigin: '50% 100%' })
      if (parts.length) {
        gsap.set(parts, { opacity: 0, y: 16 })
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            once: true,
          },
        })
        .to(item, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          ease: 'power2.out',
        })
        .to(
          parts,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
          },
          0.1,
        )

      const onEnter = () => {
        gsap.to(item, {
          y: -7,
          scale: 1.015,
          borderColor: 'var(--accent)',
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        })
        if (title) {
          gsap.to(title, {
            x: 4,
            color: 'var(--accent)',
            duration: 0.32,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
        if (desc) {
          gsap.to(desc, {
            x: 2,
            opacity: 1,
            duration: 0.32,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      }

      const onLeave = () => {
        gsap.to(item, {
          y: 0,
          scale: 1,
          borderColor: '',
          duration: 0.42,
          ease: 'power2.out',
          overwrite: 'auto',
        })
        if (title) {
          gsap.to(title, {
            x: 0,
            color: '',
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
        if (desc) {
          gsap.to(desc, {
            x: 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      }

      if (isStickyTouch) {
        const onTap = (e) => {
          if (e.pointerType === 'mouse') return
          onEnter()
          window.setTimeout(() => onLeave(), 260)
        }
        item.addEventListener('pointerdown', onTap, true)
        cleanupFns.push(() => {
          item.removeEventListener('pointerdown', onTap, true)
        })
      } else {
        item.addEventListener('mouseenter', onEnter)
        item.addEventListener('mouseleave', onLeave)
        cleanupFns.push(() => {
          item.removeEventListener('mouseenter', onEnter)
          item.removeEventListener('mouseleave', onLeave)
        })
      }
    })

    const packagesHeader = document.querySelector('.packages-header')
    const packagesLead = document.querySelector('.packages-lead')
    const packagesExtras = document.querySelector('.packages-extras')
    const packagesPositioning = document.querySelector('.packages-positioning')
    const packagesFlow = document.querySelector('.packages-flow')
    const packagesShowcase = document.querySelector('.packages-showcase')

    if (
      packagesHeader ||
      packagesLead ||
      packageCardsEls.length ||
      packagesExtras ||
      packagesPositioning ||
      packagesFlow ||
      packagesShowcase
    ) {
      const introParts = [packagesHeader, packagesLead].filter(Boolean)
      if (introParts.length) {
        gsap.set(introParts, { opacity: 0, y: 24 })
      }
      if (packageCardsEls.length) {
        gsap.set(packageCardsEls, { opacity: 0, y: 40, rotateX: -10, transformOrigin: '50% 100%' })
      }
      gsap.set([packagesShowcase, packagesExtras, packagesPositioning, packagesFlow].filter(Boolean), {
        opacity: 0,
        y: 20,
      })

      const packagesTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.packages',
          start: 'top 84%',
          once: true,
        },
      })
      if (introParts.length) {
        packagesTl.to(introParts, {
          opacity: 1,
          y: 0,
          duration: 0.52,
          stagger: 0.12,
          ease: 'power2.out',
        })
      }
      if (packageCardsEls.length) {
        packagesTl.to(
          packageCardsEls,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.56,
            stagger: 0.1,
            ease: 'power2.out',
          },
          introParts.length ? '-=0.25' : 0,
        )
      }
      packagesTl.to(
        [packagesShowcase, packagesExtras, packagesPositioning, packagesFlow].filter(Boolean),
        {
          opacity: 1,
          y: 0,
          duration: 0.48,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.2',
      )
    }

    packageCardsEls.forEach((card) => {
      const packageColor = getComputedStyle(card).getPropertyValue('--package-color').trim() || 'var(--accent)'
      const onEnter = () => {
        gsap.to(card, {
          y: -7,
          scale: 1.012,
          borderColor: packageColor,
          duration: 0.32,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
      const onLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          borderColor: '',
          duration: 0.38,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
      if (isStickyTouch) {
        const onTap = (e) => {
          if (e.pointerType === 'mouse') return
          onEnter()
          window.setTimeout(() => onLeave(), 220)
        }
        card.addEventListener('pointerdown', onTap, true)
        cleanupFns.push(() => {
          card.removeEventListener('pointerdown', onTap, true)
        })
      } else {
        card.addEventListener('mouseenter', onEnter)
        card.addEventListener('mouseleave', onLeave)
        cleanupFns.push(() => {
          card.removeEventListener('mouseenter', onEnter)
          card.removeEventListener('mouseleave', onLeave)
        })
      }
    })

    return () => {
      clearActiveProjectTouch()
      if (heroSubEl && heroSocialEl) {
        gsap.killTweensOf([heroSubEl, heroSocialEl])
        gsap.set([heroSubEl, heroSocialEl], { x: 0, y: 0 })
      }
      cleanupFns.forEach((cleanup) => cleanup())
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (!modalData) return
    const lenis = lenisRef.current
    const modalTextElements = [modalTitleRef.current, modalDescRef.current]
    const modalControls = [modalLinkRef.current, modalCloseRef.current]

    gsap.set('.project-img-float', { opacity: 0, scale: 0 })
    gsap.to('.cursor', { opacity: 1, duration: 0.1 })
    gsap.set(modalControls, { opacity: 1, y: 0, clearProps: 'transform' })
    lenis?.stop()

    const openTl = gsap.timeline()
    openTl
      .to(modalRef.current, { yPercent: 100, duration: 0.8, ease: 'expo.inOut' })
      .to(modalImgRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .to(
        modalTextElements,
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        '-=0.4',
      )
  }, [modalData])

  const closeModal = () => {
    const lenis = lenisRef.current
    const closeTl = gsap.timeline({
      onComplete: () => {
        lenis?.start()
        gsap.set([modalImgRef.current, modalTitleRef.current, modalDescRef.current], { opacity: 0 })
        setModalData(null)
      },
    })

    closeTl
      .to([modalDescRef.current, modalTitleRef.current], {
        opacity: 0,
        duration: 0.3,
        stagger: -0.05,
        ease: 'power2.in',
      })
      .to(modalImgRef.current, { opacity: 0, duration: 0.3 }, '-=0.2')
      .to(modalRef.current, { yPercent: 0, duration: 0.8, ease: 'expo.inOut' }, '-=0.1')
  }

  const toggleHeroTrack = () => {
    const widget = heroSoundCloudWidgetRef.current
    if (!widget) return
    if (!heroTrackPlaying) {
      widget.play()
      return
    }
    widget.pause()
  }

  const nextHeroTrack = () => {
    const pulseEl = heroMiniPlayerPulseRef.current
    if (pulseEl) {
      gsap.killTweensOf(pulseEl)
      gsap.fromTo(
        pulseEl,
        { scale: 1, boxShadow: '0 0 0 0 rgba(255, 51, 0, 0.45)' },
        {
          scale: 1.075,
          boxShadow: '0 0 0 9px rgba(255, 51, 0, 0)',
          duration: 0.34,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        },
      )
    }
    setHeroTrackIndex((prev) => (prev + 1) % HERO_MP3_TRACKS.length)
  }

  useEffect(() => {
    const pulseEl = heroMiniPlayerPulseRef.current
    if (!pulseEl) return
    gsap.killTweensOf(pulseEl)
    gsap.fromTo(
      pulseEl,
      { scale: 1, boxShadow: '0 0 0 0 rgba(255, 51, 0, 0.38)' },
      {
        scale: 1.055,
        boxShadow: '0 0 0 7px rgba(255, 51, 0, 0)',
        duration: 0.28,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      },
    )
  }, [heroTrackIndex])

  const runSelfDestruct = useCallback(() => {
    if (selfDestructLockRef.current) {
      return
    }
    const floorBtn = document.querySelector('.self-destruct-btn')
    if (!floorBtn) {
      return
    }
    selfDestructLockRef.current = true
    floorBtn.scrollIntoView({ block: 'center', behavior: 'auto' })
    setShowConfetti(false)
    setShowSideEye(false)
    if (modalData) {
      setModalData(null)
    }
    if (scrivimiLeaveCountRef.current) {
      scrivimiLeaveCountRef.current = 0
    }
    if (sideEyeTimeoutRef.current) {
      clearTimeout(sideEyeTimeoutRef.current)
      sideEyeTimeoutRef.current = null
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const floorY = floorBtn.getBoundingClientRect().top

    const selectors = [
      'section.hero .hero-title-letter',
      'section.hero .hero-tag',
      'section.hero .hero-subtitle-word-inner',
      'section.hero a.hero-social-link',
      'section.projects .projects-header',
      'section.projects .project-item',
      '.marquee .marquee-inner span',
      'section.footer p.gs-reveal',
      'section.footer a.magnetic-wrap',
      'section.footer .scrivimi-hint',
      'section.footer .footer-meta',
    ]

    const seen = new Set()
    const rows = []
    selectors.forEach((sel) => {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          if (seen.has(el) || (el.closest && el.closest('.self-destruct-keep'))) {
            return
          }
          if (!el.isConnected) {
            return
          }
          const r = el.getBoundingClientRect()
          if (r.width < 1.5 || r.height < 1.5) {
            return
          }
          seen.add(el)
          rows.push({ el, r })
        })
      } catch (_) {}
    })

    setSelfDestructed(true)
    document.body.classList.add('self-destruct-mode')

    const shuffled = rows.sort(() => Math.random() - 0.5)

    requestAnimationFrame(() => {
      shuffled.forEach(({ el, r }, i) => {
        const maxFall = Math.max(0, floorY - 10 - r.bottom)
        if (maxFall < 2) {
          return
        }
        const fall = maxFall
        const z = 40010 + i

        el.style.setProperty('box-sizing', 'border-box', 'important')
        el.style.setProperty('position', 'fixed', 'important')
        el.style.setProperty('left', `${r.left}px`, 'important')
        el.style.setProperty('top', `${r.top}px`, 'important')
        el.style.setProperty('width', `${r.width}px`, 'important')
        el.style.setProperty('min-width', `${r.width}px`, 'important')
        el.style.setProperty('height', `${r.height}px`, 'important')
        el.style.setProperty('z-index', String(z), 'important')
        el.style.setProperty('margin', '0', 'important')
        el.style.setProperty('pointer-events', 'none', 'important')
        if (r.width > 40) {
          el.style.setProperty('overflow', 'hidden', 'important')
        }

        const dur = prefersReduced ? 0.04 : Math.min(1.15, 0.38 + fall / 1100)
        const delay = prefersReduced ? 0 : i * 0.02 + Math.random() * 0.22
        const rot = prefersReduced ? 0 : gsap.utils.random(-9, 9)

        gsap.fromTo(
          el,
          { y: 0, rotation: 0, transformOrigin: '50% 50%' },
          {
            y: fall,
            rotation: rot,
            duration: dur,
            delay,
            ease: prefersReduced ? 'none' : 'power2.in',
          },
        )
      })
    })
  }, [modalData])

  useEffect(() => {
    if (!isCoarsePointerDevice()) return
    const onDocClearSounds = (e) => {
      if (e.pointerType === 'mouse') return
      if (e.target?.closest?.('.interactable, .self-destruct-keep, .self-destruct-btn')) {
        return
      }
      stopFooterSound('michel')
      stopFooterSound('branche')
      stopFooterSound('linkedin')
      stopFooterSound('instagram')
      stopFooterSound('email')
      stopFooterSound('scrivimi')
      setShowConfetti(false)
    }
    document.addEventListener('pointerdown', onDocClearSounds, true)
    return () => document.removeEventListener('pointerdown', onDocClearSounds, true)
  }, [])

  useEffect(() => {
    const el = heroRef.current
    if (!el) {
      return undefined
    }
    const release = initFlairConfetti(el)
    return () => {
      try {
        release()
      } catch {
        // ignore
      }
    }
  }, [])

  // publishedAt = data di creazione repo su GitHub (stessa base della “prima pubblicazione”)
  return (
    <>
      <div className="cursor" aria-hidden>
        <svg
          className="cursor-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <circle cx="50" cy="50" r="50" fill="currentColor" />
        </svg>
      </div>
      <div className="noise"></div>
      <div
        className={[
          'preloader',
          (preloaderPhase === 'counting' || preloaderPhase === 'exiting') &&
            'preloader--counting',
          preloaderPhase === 'awaitEnter' && 'preloader--cta',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={preloaderPhase === 'done' ? true : undefined}
      >
        {(preloaderPhase === 'counting' || preloaderPhase === 'exiting') && (
          <div className="preloader-counting">
            <div className="preloader-sprinkler-wrap">
              <iframe
                className="preloader-sprinkler-iframe"
                title={String(t('preloader.iframeTitle'))}
                src="/water-sprinkler-loader/loader-embed.html"
                loading="eager"
                scrolling="no"
              />
            </div>
            <div className="preloader-counter">0%</div>
          </div>
        )}
        {preloaderPhase === 'awaitEnter' && (
          <button
            type="button"
            className="preloader-continue interactable"
            onClick={handlePreloaderEnter}
            aria-label={String(t('preloader.enterAria'))}
          >
            {String(t('preloader.enter'))}
          </button>
        )}
      </div>

      <img
        src="/images/michel-easter.png"
        className="easter-egg-img"
        alt={String(t('easter.imageAlt'))}
      />

      <div
        className={`side-eye-overlay${showSideEye ? ' side-eye-overlay--visible' : ''}`}
        aria-hidden={!showSideEye}
      >
        <img src="/images/side-eye.png" alt="" className="side-eye-overlay-img" />
      </div>

      <FireworksRain active={showConfetti} />
      <ConfettiRain active={showConfetti} />
      <MoneyRain active={showConfetti} />

      <section ref={heroRef} className="hero">
        <HeroFlair />
        <div className="hero-foreground">
        <div className="hero-top">
          <HeroSubtitle lines={heroSubtitleLines} />
          <div className="hero-social" aria-label={String(t('hero.socialAria'))}>
            <div className="hero-social-icons">
            <a
              href={FOOTER_SOCIAL.linkedin}
              className="hero-social-link interactable"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              onPointerEnter={(e) => {
                if (e.pointerType !== 'mouse') return
                playFooterSound('linkedin')
              }}
              onPointerDown={(e) => {
                if (!isCoarsePointerDevice() || e.pointerType === 'mouse') return
                playFooterSound('linkedin')
              }}
            >
              <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
            </a>
            <a
              href={FOOTER_SOCIAL.instagram}
              className="hero-social-link interactable"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              onPointerEnter={(e) => {
                if (e.pointerType !== 'mouse') return
                playFooterSound('instagram')
              }}
              onPointerDown={(e) => {
                if (!isCoarsePointerDevice() || e.pointerType === 'mouse') return
                playFooterSound('instagram')
              }}
            >
              <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2.2c3.2 0 3.6.01 4.9.07 1.1.05 1.7.2 2.1.4.5.2.9.5 1.3.9.4.4.7.8.9 1.3.2.4.3 1 .4 2.1.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.1-.2 1.7-.4 2.1-.2.5-.5.9-.9 1.3-.4.4-.8.7-1.3.9-.4.2-1 .3-2.1.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.1 0-1.7-.2-2.1-.4a3.3 3.3 0 0 1-1.3-.9c-.4-.4-.7-.8-.9-1.3-.2-.4-.3-1-.4-2.1C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.1.2-1.7.4-2.1.2-.5.5-.9.9-1.3.4-.4.8-.7 1.3-.9.4-.2 1-.3 2.1-.4C8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3.01 7 .07c-1.3.1-2.2.3-3 .6a6.1 6.1 0 0 0-2.2 1.4A6.1 6.1 0 0 0 .4 4c-.3.8-.5 1.7-.6 3C.01 8.3 0 8.7 0 12c0 3.3.01 3.7.07 5 .1 1.3.3 2.2.6 3 .3.8.7 1.5 1.4 2.2.7.6 1.4 1.1 2.2 1.4.8.3 1.7.5 3 .6 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.2-.3 3-.6a6.1 6.1 0 0 0 2.2-1.4 6.1 6.1 0 0 0 1.4-2.2c.3-.8.5-1.7.6-3 .05-1.3.05-1.7.05-5s0-3.7-.05-5c-.1-1.3-.3-2.2-.6-3A6.1 6.1 0 0 0 20 .4a6.1 6.1 0 0 0-2.2-1.4c-.8-.3-1.7-.5-3-.6C15.7.01 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"
                />
              </svg>
            </a>
            <a
              href={FOOTER_SOCIAL.email}
              className="hero-social-link interactable"
              aria-label="Email"
              onPointerEnter={(e) => {
                if (e.pointerType !== 'mouse') return
                playFooterSound('email')
              }}
              onPointerDown={(e) => {
                if (!isCoarsePointerDevice() || e.pointerType === 'mouse') return
                playFooterSound('email')
              }}
            >
              <svg
                className="social-icon social-icon--stroke"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2.25" y="4.5" width="19.5" height="15" rx="1.5" />
                <path d="M2.5 6.5 12 12.5l9.5-6" />
              </svg>
            </a>
            </div>
            <HeroMiniPlayer
              isPlaying={heroTrackPlaying}
              onToggle={toggleHeroTrack}
              artwork={heroTrackMeta.artwork}
              title={heroTrackMeta.title}
              artist={heroTrackMeta.artist}
              onNextTrack={nextHeroTrack}
              trackNumber={heroTrackIndex + 1}
              totalTracks={HERO_MP3_TRACKS.length}
            />
            <iframe
              ref={heroMiniPlayerIframeRef}
              title="Hero SoundCloud player"
              className="hero-mini-player-iframe"
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                HERO_MP3_TRACKS[heroTrackIndex].url,
              )}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false`}
              allow="autoplay"
            />
          </div>
          <span className="hero-mini-player-pulse" ref={heroMiniPlayerPulseRef} aria-hidden />
        </div>
        <div className="hero-name">
          <h1
            className="hero-title interactable easter-trigger"
            onPointerEnter={(e) => {
              if (e.pointerType !== 'mouse') return
              playFooterSound('michel')
            }}
            onPointerDown={(e) => {
              if (!isCoarsePointerDevice() || e.pointerType === 'mouse') return
              playFooterSound('michel')
            }}
            onPointerLeave={() => {
              if (isCoarsePointerDevice()) return
              stopFooterSound('michel')
            }}
          >
            <HeroTitleLetters text="MICHEL" />
            <span
              className="hero-tag"
              role="img"
              aria-label={String(t('hero.italyTagAria'))}
            >
              <span className="hero-tag-text" aria-hidden="true">
                {String(t('hero.italy'))}
              </span>
            </span>
          </h1>
          <br />
          <h1
            className="hero-title interactable easter-trigger"
            onPointerEnter={(e) => {
              if (e.pointerType !== 'mouse') return
              playFooterSound('branche')
            }}
            onPointerDown={(e) => {
              if (!isCoarsePointerDevice() || e.pointerType === 'mouse') return
              playFooterSound('branche')
            }}
            onPointerLeave={() => {
              if (isCoarsePointerDevice()) return
              stopFooterSound('branche')
            }}
          >
            <HeroTitleLetters text="BRANCHE" />
          </h1>
        </div>
        <div className="hero-lang-corner">
          <LanguageSwitch />
        </div>
        </div>
      </section>

      <section className="projects">
        <h2 className="projects-header gs-reveal">{String(t('projects.header'))}</h2>
        <div className="project-list">
          {projects.map((project) => (
            <a
              href="#"
              key={project.slug}
              className="project-item interactable project-trigger"
              onClick={(e) => {
                e.preventDefault()
                setModalData(project)
              }}
            >
              <div className="project-title">
                <ProjectTitleWords text={project.title} />
              </div>
              <div className="project-tech">{project.tech}</div>
              <img src={project.thumb} alt={project.title} className="project-img-float" />
            </a>
          ))}
        </div>
      </section>

      <section className="services">
        <h2 className="services-header gs-reveal">
          <ServicesHeaderLetters text={String(t('services.header'))} />
        </h2>
        <p className="services-lead gs-reveal">{String(t('services.lead'))}</p>
        <div className="services-grid">
          {services.map((service) => (
            <article className="service-item gs-reveal" key={service.title}>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="packages">
        <h2 className="packages-header gs-reveal">{String(t('packages.header'))}</h2>
        <p className="packages-lead gs-reveal">{String(t('packages.lead'))}</p>
        <article
          ref={packagesShowcaseRef}
          className={`packages-showcase package-card--${activePackageData.key} gs-reveal`}
        >
          <span className="package-orb" aria-hidden />
          <span className="package-index" aria-hidden>
            0{packageCards.findIndex((pack) => pack.key === activePackageData.key) + 1}
          </span>
          <div className="packages-showcase-head">
            <p className="package-kicker">{String(t('packages.selected'))}</p>
            {activePackageData.key === 'growth' && (
              <span className="package-badge">{String(t('packages.featured'))}</span>
            )}
            <h3 className="packages-showcase-title">{activePackageData.name}</h3>
            <p className="packages-showcase-price">{activePackageData.range}</p>
            <div className="packages-showcase-controls" aria-label={String(t('packages.header'))}>
              {packageCards.map((pack, idx) => (
                <button
                  type="button"
                  key={`package-control-${pack.key}`}
                  className={`packages-showcase-dot${activePackage === pack.key ? ' packages-showcase-dot--active' : ''}`}
                  onClick={() => setActivePackage(pack.key)}
                  aria-label={pack.name}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="packages-showcase-body">
            <div>
              <p className="package-label">{String(t('packages.idealLabel'))}</p>
              <ul className="package-list">
                {activePackageData.ideal.map((item) => (
                  <li key={`showcase-ideal-${item}`}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="package-label">{String(t('packages.includesLabel'))}</p>
              <ul className="package-list">
                {activePackageData.includes.map((item) => (
                  <li key={`showcase-includes-${item}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
        <div className="packages-meta-grid">
          <article className="packages-extras gs-reveal">
            <h3 className="packages-subtitle">{String(t('packages.extras.title'))}</h3>
            <ul className="package-list">
              {packageExtras.map((item) => (
                <li key={`extra-${item}`}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="packages-positioning gs-reveal">
            <h3 className="packages-subtitle">{String(t('packages.positioning.title'))}</h3>
            <ul className="package-list">
              {packagePositioning.map((item) => (
                <li key={`positioning-${item}`}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="packages-flow gs-reveal">
            <h3 className="packages-subtitle">{String(t('packages.flow.title'))}</h3>
            <ol className="package-list package-list--ordered">
              {packageFlow.map((item) => (
                <li key={`flow-${item}`}>{item}</li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <div className="project-modal" ref={modalRef}>
        <div className="modal-layout">
          <div className="modal-image-container">
            <img
              className="modal-img"
              ref={modalImgRef}
              src={modalData?.img ?? ''}
              alt={String(t('modal.imgAlt'))}
            />
          </div>
          <div className="modal-content">
            <div className="modal-close-wrap">
              <button type="button" className="modal-close interactable" onClick={closeModal} ref={modalCloseRef}>
                {String(t('modal.close'))}
              </button>
            </div>
            <div className="modal-body">
              <h2 className="modal-title" ref={modalTitleRef}>
                <ModalTitle
                  text={
                    modalData ? String(t(`projects.${modalData.slug}.title`)) : String(t('modal.titlePlaceholder'))
                  }
                />
              </h2>
              <p className="modal-desc" ref={modalDescRef}>
                {modalData ? String(t(`projects.${modalData.slug}.desc`)) : String(t('modal.descPlaceholder'))}
              </p>
              <a
                href={modalData?.link ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="modal-link interactable"
                ref={modalLinkRef}
              >
                {String(t('modal.visit'))}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="marquee">
        <div className="marquee-inner">
          <span>{marqueeLine}</span>
          <span>{marqueeLine}</span>
          <span>{marqueeLine}</span>
          <span>{marqueeLine}</span>
          <span>{marqueeLine}</span>
          <span>{marqueeLine}</span>
        </div>
      </div>

      <section className="footer">
        <div className="footer-stack">
        <div className="footer-stack-lead">
        <p className="gs-reveal">{String(t('footer.cta'))}</p>
        <a
          href={FOOTER_SOCIAL.email}
          className="magnetic-wrap interactable"
          onPointerEnter={(e) => {
            if (e.pointerType !== 'mouse') return
            playFooterSound('scrivimi')
            setShowConfetti(true)
          }}
          onPointerDown={(e) => {
            if (!isCoarsePointerDevice() || e.pointerType === 'mouse') return
            playFooterSound('scrivimi')
            setShowConfetti(true)
          }}
          onPointerLeave={() => {
            if (isCoarsePointerDevice()) return
            setShowConfetti(false)
            handleScrivimiLeave()
          }}
        >
          <span className="magnetic-text">
            <span className="magnetic-text-shake">
              {String(t('footer.scrivimi'))
                .split('')
                .map((letter, i) => (
                <span
                  key={i}
                  className="magnetic-text-letter"
                  style={{ animationDelay: `${i * 0.11}s` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </span>
        </a>
        </div>
        <span className="scrivimi-hint" aria-hidden="true">
          <span className="scrivimi-hint-arrow">↑</span>
          <span className="scrivimi-hint-text scrivimi-hint-text--coarse">
            {String(t('footer.hintCoarse'))}
          </span>
          <span className="scrivimi-hint-text scrivimi-hint-text--fine">
            {String(t('footer.hintFine'))}
          </span>
        </span>
        <div className="self-destruct-keep self-destruct-floor">
          <button
            type="button"
            className="self-destruct-btn"
            disabled={selfDestructed}
            onClick={runSelfDestruct}
            aria-label={String(t('footer.selfDestructAria'))}
          >
            {selfDestructed
              ? String(t('footer.selfDestructDone'))
              : String(t('footer.selfDestruct'))}
          </button>
        </div>
        </div>
        <div className="footer-meta">
          <p className="footer-copyright">© {new Date().getFullYear()} Michel Branche</p>
          <p className="footer-motto">{String(t('footer.motto'))}</p>
        </div>
      </section>
    </>
  )
}

export default App
