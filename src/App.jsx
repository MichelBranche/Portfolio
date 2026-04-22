import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import ConfettiRain from './components/ConfettiRain'
import MoneyRain from './components/MoneyRain'
import FireworksRain from './components/FireworksRain'
import './App.css'

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

const DOC_TITLE_FRAMES = [
  'MICHEL BRANCHE | Sviluppatore Web',
  'Sviluppatore web · dritto al punto',
  'Disponibile per nuovi progetti',
]
const DOC_TITLE_AWAY = 'No dai ti prego torna qui...'
const FAVICON_DEFAULT = '/favicon.png'
const DOC_TITLE_INTERVAL_MS = 3200

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

function App() {
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
  const [preloaderPhase, setPreloaderPhase] = useState('counting')
  const continueAfterPreloaderRef = useRef(() => {})
  const preloaderPart2DoneRef = useRef(false)

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

  const handlePreloaderContinue = () => {
    if (preloaderPart2DoneRef.current) return
    setPreloaderPhase('exiting')
    playFooterSound('rizz')
    continueAfterPreloaderRef.current()
  }

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
    const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let titleTimer = null

    const applyVisible = () => {
      document.title = preferReduced
        ? DOC_TITLE_FRAMES[0]
        : DOC_TITLE_FRAMES[frame % DOC_TITLE_FRAMES.length]
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
        document.title = DOC_TITLE_AWAY
      } else {
        document.title = DOC_TITLE_FRAMES[0]
        frame = 0
        applyDocumentFavicon(FAVICON_DEFAULT)
        startTitleCycle()
      }
    }

    if (document.hidden) {
      document.title = DOC_TITLE_AWAY
    } else {
      applyDocumentFavicon(FAVICON_DEFAULT)
      startTitleCycle()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      stopTitleCycle()
      document.title = DOC_TITLE_FRAMES[0]
      applyDocumentFavicon(FAVICON_DEFAULT)
    }
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const cursor = document.querySelector('.cursor')
    const easterImg = document.querySelector('.easter-egg-img')
    const magWrap = document.querySelector('.magnetic-wrap')
    const magText = document.querySelector('.magnetic-text')
    const counterElement = document.querySelector('.preloader-counter')
    const projectItems = document.querySelectorAll('.project-item')
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
        overwrite: 'auto',
      })
      if (isStickyTouch && activeTouchProjectItem) {
        return
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
    }
    window.addEventListener('mousemove', onMouseMove)
    cleanupFns.push(() => window.removeEventListener('mousemove', onMouseMove))
    const onWindowBlur = () => {
      clearActiveProjectTouch()
      hideAllProjectFloats()
    }
    const onVisChange = () => {
      if (document.visibilityState === 'hidden') {
        clearActiveProjectTouch()
        hideAllProjectFloats()
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
        const onEnter = () => gsap.to(cursor, { scale: 4, duration: 0.3, ease: 'back.out(2)' })
        const onLeave = () => gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' })
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
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      syncTouch: true,
      touchMultiplier: 1.15,
    })
    lenis.stop()
    lenisRef.current = lenis

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
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

    const counter = { val: 0 }
    gsap
      .timeline({
        onComplete: () => {
          setPreloaderPhase('ready')
        },
      })
      .to(counter, {
        val: 100,
        roundProps: 'val',
        duration: 1.5,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (counterElement) {
            counterElement.innerText = `${counter.val}%`
          }
        },
      })

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
          '.hero-subtitle',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
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
    }

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
        gsap.killTweensOf(img)
        gsap.to(img, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
          overwrite: 'auto',
        })
        gsap.to(cursor, { opacity: 0, duration: 0.2, overwrite: 'auto' })
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
        gsap.killTweensOf(img)
        gsap.to(img, { opacity: 0, scale: 0, duration: 0.3, overwrite: 'auto' })
        gsap.to(cursor, { opacity: 1, duration: 0.2, overwrite: 'auto' })
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
        item.addEventListener('pointermove', onMove)
        cleanupFns.push(() => {
          item.removeEventListener('pointerdown', onItemPointerDown, true)
          item.removeEventListener('pointermove', onMove)
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

    return () => {
      clearActiveProjectTouch()
      cleanupFns.forEach((cleanup) => cleanup())
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (!modalData) return
    const lenis = lenisRef.current
    const modalElements = [
      modalTitleRef.current,
      modalDescRef.current,
      modalLinkRef.current,
      modalCloseRef.current,
    ]

    gsap.set('.project-img-float', { opacity: 0, scale: 0 })
    gsap.to('.cursor', { opacity: 1, duration: 0.1 })
    lenis?.stop()

    const openTl = gsap.timeline()
    openTl
      .to(modalRef.current, { yPercent: 100, duration: 0.8, ease: 'expo.inOut' })
      .to(modalImgRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .to(modalElements, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.4')
  }, [modalData])

  const closeModal = () => {
    const lenis = lenisRef.current
    const closeTl = gsap.timeline({
      onComplete: () => {
        lenis?.start()
        gsap.set(
          [
            modalImgRef.current,
            modalTitleRef.current,
            modalDescRef.current,
            modalLinkRef.current,
            modalCloseRef.current,
          ],
          { opacity: 0 },
        )
        setModalData(null)
      },
    })

    closeTl
      .to(
        [modalCloseRef.current, modalLinkRef.current, modalDescRef.current, modalTitleRef.current],
        { opacity: 0, duration: 0.3, stagger: -0.05, ease: 'power2.in' },
      )
      .to(modalImgRef.current, { opacity: 0, duration: 0.3 }, '-=0.2')
      .to(modalRef.current, { yPercent: 0, duration: 0.8, ease: 'expo.inOut' }, '-=0.1')
  }

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
      'section.hero .hero-subtitle',
      'section.hero a.hero-social-link',
      'section.projects .projects-header',
      'section.projects .project-item',
      '.marquee .marquee-inner span',
      'section.footer p.gs-reveal',
      'section.footer a.magnetic-wrap',
      'section.footer .scrivimi-hint',
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

  // publishedAt = data di creazione repo su GitHub (stessa base della “prima pubblicazione”)
  const projectEntries = [
    {
      title: 'Fotografia - Rubina',
      desc: 'Portfolio fotografico brutal/editoriale con layout dinamici, animazioni GSAP e approccio performance-first senza framework.',
      link: 'https://github.com/MichelBranche/photo-portfolio-demo',
      img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      tech: 'JavaScript / GSAP / CSS',
      publishedAt: '2026-03-21',
    },
    {
      title: 'E-commerce - Streetwear',
      desc: 'E-commerce sperimentale in stile brutalist con routing client-side, transizioni custom, carrello e checkout dimostrativo.',
      link: 'https://github.com/MichelBranche/ecommerce-demo1',
      img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      tech: 'React / Router / GSAP / Lenis',
      publishedAt: '2026-03-29',
    },
    {
      title: 'Istituzionale - Museo Egizio',
      desc: 'Demo front-end immersiva con pagine istituzionali, biglietteria e shop in anteprima, i18n multi-lingua e animazioni avanzate.',
      link: 'https://github.com/MichelBranche/Museo-Egizio-Torino-Demo',
      img: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=800&q=80',
      tech: 'React / Vite / GSAP / Lenis',
      publishedAt: '2026-04-06',
    },
    {
      title: 'Clone interfaccia - Spotify',
      desc: 'Clone UI di Spotify realizzato con stack web classico, focalizzato su struttura frontend e resa visuale.',
      link: 'https://github.com/MichelBranche/Spotify-Clone',
      img: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=800&q=80',
      tech: 'HTML / CSS / JavaScript',
      publishedAt: '2026-04-13',
    },
    {
      title: 'Hospitality - Le Vele',
      desc: 'Web app full stack per residence con landing animata, flusso prenotazioni, area admin e API serverless.',
      link: 'https://github.com/MichelBranche/Demo-LeVeleResidence',
      img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      tech: 'React / Vite / API / Redis',
      publishedAt: '2026-04-18',
    },
    {
      title: 'Gastronomia - Caffè Stella',
      desc: 'Sito vetrina/editoriale multi-pagina per Caffe Stella con routing SPA, animazioni GSAP, smooth scroll Lenis e layout responsive.',
      link: 'https://github.com/MichelBranche/demo-paologriffa',
      img: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80',
      tech: 'React Router / GSAP / Framer Motion',
      publishedAt: '2026-04-20',
    },
  ]
  const projects = [...projectEntries].sort((a, b) =>
    a.publishedAt.localeCompare(b.publishedAt),
  )

  return (
    <>
      <div className="cursor"></div>
      <div className="noise"></div>
      <div
        className={
          preloaderPhase === 'ready' ? 'preloader preloader--cta' : 'preloader'
        }
        aria-hidden={preloaderPhase === 'done' ? true : undefined}
      >
        {preloaderPhase === 'counting' && <div className="preloader-counter">0%</div>}
        {preloaderPhase === 'ready' && (
          <button
            type="button"
            className="preloader-continue interactable"
            onClick={handlePreloaderContinue}
            aria-label="Entra nel sito"
          >
            Continua
          </button>
        )}
      </div>

      <img
        src="/images/michel-easter.png"
        className="easter-egg-img"
        alt="Ritratto"
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

      <section className="hero">
        <div className="hero-top">
          <div className="hero-subtitle gs-reveal">
            Sviluppatore Web Indipendente.
            <br />
            Creo siti web veloci, dritti al punto e che convertono.
          </div>
          <div className="hero-social" aria-label="Contatti social">
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
              aria-label="Italia. Tocca o passa sopra per l'interazione"
            >
              <span className="hero-tag-text" aria-hidden="true">
                ITALY
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
      </section>

      <section className="projects">
        <h2 className="projects-header gs-reveal">Lavori Selezionati</h2>
        <div className="project-list">
          {projects.map((project) => (
            <a
              href="#"
              key={project.title}
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

      <div className="project-modal" ref={modalRef}>
        <div className="modal-layout">
          <div className="modal-image-container">
            <img className="modal-img" ref={modalImgRef} src={modalData?.img ?? ''} alt="Project visual" />
          </div>
          <div className="modal-content">
            <div className="modal-close-wrap">
              <button type="button" className="modal-close interactable" onClick={closeModal} ref={modalCloseRef}>
                CHIUDI [X]
              </button>
            </div>
            <div className="modal-body">
              <h2 className="modal-title" ref={modalTitleRef}>
                {modalData?.title ?? 'TITLE'}
              </h2>
              <p className="modal-desc" ref={modalDescRef}>
                {modalData?.desc ?? 'Description goes here.'}
              </p>
              <a
                href={modalData?.link ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="modal-link interactable"
                ref={modalLinkRef}
              >
                VAI AL SITO WEB ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="marquee">
        <div className="marquee-inner">
          <span>DISPONIBILE PER NUOVI PROGETTI -</span>
          <span>DISPONIBILE PER NUOVI PROGETTI -</span>
          <span>DISPONIBILE PER NUOVI PROGETTI -</span>
          <span>DISPONIBILE PER NUOVI PROGETTI -</span>
          <span>DISPONIBILE PER NUOVI PROGETTI -</span>
          <span>DISPONIBILE PER NUOVI PROGETTI -</span>
        </div>
      </div>

      <section className="footer">
        <p className="gs-reveal">Lavoriamo insieme.</p>
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
              {'SCRIVIMI'.split('').map((letter, i) => (
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
        <span className="scrivimi-hint" aria-hidden="true">
          <span className="scrivimi-hint-arrow">↑</span>
          <span className="scrivimi-hint-text scrivimi-hint-text--coarse">p.s. tocca o tieni premuto</span>
          <span className="scrivimi-hint-text scrivimi-hint-text--fine">
            p.s. passaci sopra col cursore
          </span>
        </span>
        <div className="self-destruct-keep self-destruct-floor">
          <button
            type="button"
            className="self-destruct-btn"
            disabled={selfDestructed}
            onClick={runSelfDestruct}
            aria-label="Scherzo: tanto ci pensa ammiocuggino, tutto cade in basso (demo)"
          >
            {selfDestructed ? 'OK, CHIARO.' : 'TANTO CI PENSA AMMIOCUGGINO'}
          </button>
        </div>
      </section>
    </>
  )
}

export default App
