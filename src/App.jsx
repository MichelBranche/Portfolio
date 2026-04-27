import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import ConfettiRain from './components/ConfettiRain'
import { LanguageSwitch } from './components/LanguageSwitch.jsx'
import MoneyRain from './components/MoneyRain'
import FireworksRain from './components/FireworksRain'
import { VisualSectionLazy } from './components/VisualSectionLazy.jsx'
import { useLanguage } from './context/LanguageContext.jsx'
import './App.css'
import { translate } from './i18n/translations'
import { initFlairConfetti } from './lib/flairConfetti'
import { useIsCoarsePointerDevice, usePrefersReducedMotion } from './hooks/useResponsive.js'
import { useAppPageGsap } from './hooks/useAppPageGsap.js'
import {
  DOC_TITLE_INTERVAL_MS,
  FAVICON_DEFAULT,
  FOOTER_SOUNDS,
  FOOTER_SOCIAL,
  HERO_MP3_TRACKS,
  PRELOADER_AMBIENT,
  PROJECT_META,
} from './config/site.js'
import { asArray, applyDocumentFavicon } from './utils/document.js'
import { cx } from './utils/cx.js'
import { Cross, Wave } from './components/home/WaveCross.jsx'
import { HeroFlair, HeroMiniPlayer, HeroSubtitle } from './components/home/HeroPartials.jsx'
import {
  HeroTitleLetters,
  PackagesHeaderLetters,
  ProjectTitleWords,
  ServicesHeaderLetters,
} from './components/home/LetterText.jsx'
import { ModalTitle } from './components/home/ModalTitle.jsx'
import { PreloaderCreepyButton } from './components/home/PreloaderCreepyButton.jsx'

function App() {
  const { t, lang } = useLanguage()
  const isCoarsePointer = useIsCoarsePointerDevice()
  const prefersReducedMotion = usePrefersReducedMotion()
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
  const heroTrackPlayingRef = useRef(false)
  const pendingScPlayRef = useRef(false)
  const [heroTrackPlaying, setHeroTrackPlaying] = useState(false)
  const [heroTrackIndex, setHeroTrackIndex] = useState(() =>
    Math.floor(Math.random() * HERO_MP3_TRACKS.length),
  )
  const heroTrackIndexRef = useRef(heroTrackIndex)
  const [heroTrackMeta, setHeroTrackMeta] = useState({
    title: '',
    artist: '',
    artwork: '',
  })
  /** Carica iframe + API SoundCloud solo al primo uso del mini player. */
  const [soundCloudArmed, setSoundCloudArmed] = useState(false)

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

  useEffect(() => {
    heroTrackIndexRef.current = heroTrackIndex
  }, [heroTrackIndex])
  useEffect(() => {
    heroTrackPlayingRef.current = heroTrackPlaying
  }, [heroTrackPlaying])

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
    if (!soundCloudArmed) return
    const widget = heroSoundCloudWidgetRef.current
    if (!widget) return
    setHeroTrackMeta({ title: '', artist: '', artwork: '' })
    widget.load(HERO_MP3_TRACKS[heroTrackIndex].url, {
      auto_play: heroTrackPlayingRef.current,
      show_comments: false,
      show_user: false,
      show_reposts: false,
      hide_related: true,
      visual: false,
    })
  }, [heroTrackIndex, soundCloudArmed])

  useEffect(() => {
    if (!soundCloudArmed) {
      return undefined
    }
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
        if (cancelled) return
        readSoundMeta()
      })
      const idx = heroTrackIndexRef.current
      const ap = pendingScPlayRef.current
      pendingScPlayRef.current = false
      setHeroTrackMeta({ title: '', artist: '', artwork: '' })
      widget.load(HERO_MP3_TRACKS[idx].url, {
        auto_play: ap,
        show_comments: false,
        show_user: false,
        show_reposts: false,
        hide_related: true,
        visual: false,
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
  }, [soundCloudArmed])

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
      a.preload = 'metadata'
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
    const players = footerSoundRef.current
    if (players) {
      Object.entries(players).forEach(([, audio]) => {
        if (!audio) return
        const originalVolume = audio.volume
        audio.muted = true
        const p = audio.play()
        if (p && typeof p.then === 'function') {
          p.then(() => {
            audio.pause()
            audio.currentTime = 0
            audio.muted = false
            audio.volume = originalVolume
          }).catch(() => {
            audio.muted = false
            audio.volume = originalVolume
          })
        } else {
          audio.pause()
          audio.currentTime = 0
          audio.muted = false
          audio.volume = originalVolume
        }
      })
    }
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
    let frame = 0
    let titleTimer = null

    const applyVisible = () => {
      document.title = prefersReducedMotion
        ? titleFrames[0]
        : titleFrames[frame % titleFrames.length]
    }

    const startTitleCycle = () => {
      if (prefersReducedMotion) {
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
  }, [lang, prefersReducedMotion])

  useAppPageGsap({
    isCoarsePointer,
    prefersReducedMotion,
    playFooterSound,
    setPreloaderPhase,
    continueAfterPreloaderRef,
    startPreloaderLoadingRef,
    preloaderPart2DoneRef,
    lenisRef,
    footerSoundRef,
  })

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
    if (!soundCloudArmed) {
      setSoundCloudArmed(true)
      pendingScPlayRef.current = true
      return
    }
    const widget = heroSoundCloudWidgetRef.current
    if (!widget) return
    if (!heroTrackPlaying) {
      widget.play()
      return
    }
    widget.pause()
  }

  const nextHeroTrack = () => {
    if (!soundCloudArmed) {
      setSoundCloudArmed(true)
    }
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

    const floorY = floorBtn.getBoundingClientRect().top

    const selectors = [
      // Hero
      'section.hero .hero-title-letter',
      'section.hero .hero-tag',
      'section.hero .hero-subtitle-word-inner',
      'section.hero a.hero-social-link',
      // Services / projects / packages (newer blocks included)
      'section.services .services-header',
      'section.services .service-item',
      'section.services .gs-reveal',
      'section.projects .projects-header',
      'section.projects .project-item',
      'section.projects .gs-reveal',
      'section.packages .packages-header',
      'section.packages .package-card',
      'section.packages .package-list li',
      'section.packages .packages-meta-grid article',
      'section.packages .gs-reveal',
      // Shared marquee/footer
      '.marquee .marquee-inner span',
      'section.footer p.gs-reveal',
      'section.footer a.magnetic-wrap',
      'section.footer .scrivimi-hint',
      'section.footer .footer-meta',
      // Generic text/media leaves for future additions
      '#root section h1, #root section h2, #root section h3, #root section p, #root section li',
      '#root section img, #root section video',
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
      } catch {
        // ignore
      }
    })

    if (!rows.length) {
      selfDestructLockRef.current = false
      return
    }

    setSelfDestructed(true)
    document.body.classList.add('self-destruct-mode')

    const shuffled = rows.sort(() => Math.random() - 0.5)

    requestAnimationFrame(() => {
      shuffled.forEach(({ el, r }, i) => {
        const maxFall = Math.max(0, floorY - 10 - r.bottom)
        // If an element is already at/under the floor line, still animate a short tumble
        // so newly added footer blocks (e.g. footer-meta) also participate.
        const fall = maxFall < 2 ? gsap.utils.random(18, 42) : maxFall
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

        const dur = prefersReducedMotion ? 0.04 : Math.min(1.15, 0.38 + fall / 1100)
        const delay = prefersReducedMotion ? 0 : i * 0.02 + Math.random() * 0.22
        const rot = prefersReducedMotion ? 0 : gsap.utils.random(-9, 9)

        gsap.fromTo(
          el,
          { y: 0, rotation: 0, opacity: 1, transformOrigin: '50% 50%' },
          {
            y: fall,
            rotation: rot,
            opacity: maxFall < 2 ? 0.82 : 1,
            duration: dur,
            delay,
            ease: prefersReducedMotion ? 'none' : 'power2.in',
          },
        )
      })
    })
  }, [modalData, prefersReducedMotion])

  useEffect(() => {
    if (!isCoarsePointer) return
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
  }, [isCoarsePointer])

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

  // publishedAt = data di creazione repo su GitHub (stessa base della â€œprima pubblicazioneâ€)
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
          <PreloaderCreepyButton
            label={String(t('preloader.enter'))}
            ariaLabel={String(t('preloader.enterAria'))}
            onClick={handlePreloaderEnter}
          />
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
                if (!isCoarsePointer || e.pointerType === 'mouse') return
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
                if (!isCoarsePointer || e.pointerType === 'mouse') return
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
                if (!isCoarsePointer || e.pointerType === 'mouse') return
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
            {soundCloudArmed && (
            <iframe
              ref={heroMiniPlayerIframeRef}
              title="Hero SoundCloud player"
              className="hero-mini-player-iframe"
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                HERO_MP3_TRACKS[heroTrackIndex].url,
              )}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false`}
              allow="autoplay"
            />
            )}
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
              if (!isCoarsePointer || e.pointerType === 'mouse') return
              playFooterSound('michel')
            }}
            onPointerLeave={() => {
              if (isCoarsePointer) return
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
              if (!isCoarsePointer || e.pointerType === 'mouse') return
              playFooterSound('branche')
            }}
            onPointerLeave={() => {
              if (isCoarsePointer) return
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
              <img
                src={project.thumb}
                alt={project.title}
                className="project-img-float"
                loading="lazy"
                decoding="async"
              />
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
        <h2 className="packages-header gs-reveal">
          <PackagesHeaderLetters text={String(t('packages.header'))} />
        </h2>
        <p className="packages-lead gs-reveal">{String(t('packages.lead'))}</p>
        <div className="packages-pricing-grid">
          {packageCards.map((pack, idx) => {
            const isFeatured = pack.key === 'growth'
            const isWaveTemplateCard = pack.key === 'launch' || pack.key === 'authority'
            return (
              <article
                key={pack.key}
                className={cx(
                  'package-card pricing-wrapper gs-reveal',
                  `package-card--${pack.key}`,
                  isWaveTemplateCard && 'pricing-wrapper--wave-template',
                  idx % 2 === 0 ? 'pricing-wrapper--waves' : 'pricing-wrapper--crosses',
                )}
              >
                <div className="pricing-content">
                  <p className="pricing-kicker">
                    {String(t('packages.selected'))} 0{idx + 1}
                  </p>
                  {isFeatured && <span className="package-badge">{String(t('packages.featured'))}</span>}
                  <h3 className="pricing-title">{pack.name}</h3>
                  <p className="pricing-price">{pack.range}</p>
                  <div className="pricing-details">
                    <div className="pricing-details-grid">
                      <div className="pricing-details-col">
                        <p className={cx('package-label', isWaveTemplateCard && 'pricing-paragraph')}>
                          {String(t('packages.idealLabel'))}
                        </p>
                        <ul className="package-list">
                          {pack.ideal.map((item) => (
                            <li key={`ideal-${pack.key}-${item}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pricing-details-col">
                        <p className={cx('package-label', isWaveTemplateCard && 'pricing-paragraph')}>
                          {String(t('packages.includesLabel'))}
                        </p>
                        <ul className="package-list">
                          {pack.includes.map((item) => (
                            <li key={`includes-${pack.key}-${item}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <a href={FOOTER_SOCIAL.email} className="pricing-contact-btn interactable">
                    Contact
                  </a>
                </div>

                {idx % 2 === 0 ? (
                  <>
                    <div className="pricing-wave pricing-wave--left">
                      <Wave />
                    </div>
                    <div className="pricing-wave pricing-wave--right">
                      <Wave />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pricing-cross pricing-cross--one">
                      <Cross />
                    </div>
                    <div className="pricing-cross pricing-cross--two">
                      <Cross />
                    </div>
                    <div className="pricing-cross pricing-cross--three">
                      <Cross />
                    </div>
                  </>
                )}
              </article>
            )
          })}
        </div>
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
      <VisualSectionLazy />
      <div className="project-modal" ref={modalRef}>
        <div className="modal-layout">
          <div className="modal-image-container">
            <img
              className="modal-img"
              ref={modalImgRef}
              src={modalData?.img || undefined}
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
            if (!isCoarsePointer || e.pointerType === 'mouse') return
            playFooterSound('scrivimi')
            setShowConfetti(true)
          }}
          onPointerLeave={() => {
            if (isCoarsePointer) return
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
          <span className="scrivimi-hint-arrow">{'\u2191'}</span>
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
          <p className="footer-copyright">{'\u00A9'} {new Date().getFullYear()} Michel Branche</p>
          <p className="footer-motto">{String(t('footer.motto'))}</p>
        </div>
      </section>
    </>
  )
}

export default App
