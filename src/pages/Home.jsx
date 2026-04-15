import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import PageTransition from '../components/PageTransition'
import { useCursor } from '../context/CursorContext'
import { useLanguage } from '../context/LanguageContext'
import { projects } from '../data/projects'
import { i18nStrings } from '../data/i18n'
import SplitText from '../components/SplitText'
import SplitType from 'split-type'
import { useMediaQuery } from '../hooks/useMediaQuery'
import HomeMobile from '../components/HomeMobile'

import WordScroll from '../components/WordScroll'
import CreepyButton from '../components/CreepyButton'
import SplineKeyboardIntegration from '../components/SplineKeyboardIntegration'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function HudClockLine({ locale }) {
  const [currentTime, setCurrentTime] = useState('')
  const loc = locale === 'it' ? 'it-IT' : 'en-GB'

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString(loc, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [loc])

  return <>[ {currentTime} ]</>
}

/**
 * Animated background bar to replicate the split-screen effect from the CodePen.
 * Matched to site colors (Grey/Dark/White).
 */
function BackgroundBar() {
  const barRef = useRef(null)

  useGSAP(() => {
    // Controlled dark panel: smoother and less noisy than the previous side-swap behavior
    gsap.to(barRef.current, {
      width: '56%',
      ease: 'none',
      scrollTrigger: {
        trigger: '#wordscroll-section',
        start: 'top 85%',
        end: '#part1 top 55%',
        scrub: true,
      }
    })

    // Part 2: warmer dark tone for better continuity with cream palette
    gsap.to(barRef.current, {
      backgroundColor: '#353432',
      scrollTrigger: {
        trigger: '#part2',
        start: 'top 78%',
        end: 'top 35%',
        scrub: true,
      }
    })

    // Fade and retreat before the dedicated video section.
    gsap.to(barRef.current, {
      width: '0%',
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#part2b-video',
        start: 'top 85%',
        end: 'top 20%',
        scrub: true,
      }
    })
  }, [])

  return (
    <div 
      ref={barRef}
      className="bg-animation-bar"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '0%',
        height: '100%',
        backgroundColor: '#40403d',
        // Soft leading edge to avoid hard vertical seams.
        WebkitMaskImage: 'linear-gradient(to left, black 88%, rgba(0,0,0,0.72) 94%, transparent 100%)',
        maskImage: 'linear-gradient(to left, black 88%, rgba(0,0,0,0.72) 94%, transparent 100%)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        opacity: 1,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

export default function Home({ ready }) {
  const { handleMouseEnter, handleMouseLeave } = useCursor()
  const { lang } = useLanguage()
  const t = i18nStrings[lang]
  const isMobile = useMediaQuery('(max-width: 768px)')
  const container = useRef()
  const manifestoSplitsRef = useRef([])
  const featureVideoRef = useRef(null)
  const featureVideoSectionRef = useRef(null)
  const hasTriedAutoAudioRef = useRef(false)
  const hasVideoFinishedRef = useRef(false)
  const [isHeroAudioOn, setIsHeroAudioOn] = useState(false)
  const [isVideoErrorOverlayVisible, setIsVideoErrorOverlayVisible] = useState(false)

  useGSAP(() => {
    if (!ready) return
    if (isMobile) return

    const ctx = gsap.context(() => {
      manifestoSplitsRef.current.forEach((s) => s.revert())
      manifestoSplitsRef.current = []

      // HUD entrance
      gsap.from('.hud-block', {
        opacity: 0, y: 36, x: (i) => (i % 2 === 0 ? -52 : 52),
        skewX: 5, stagger: 0.11, duration: 0.95, delay: 0.75, ease: 'expo.out'
      })

      // Entrata Brackets
      gsap.from('.hero-bracket', {
        scale: 0, opacity: 0, rotation: -90, transformOrigin: 'center center',
        stagger: { each: 0.1, from: 'random' }, duration: 0.85, delay: 1.15, ease: 'back.out(2.2)'
      })

      // Ghost watermark drift
      gsap.to('.hero-ghost', { xPercent: 8, duration: 18, ease: 'none', repeat: -1, yoyo: true })
      gsap.to('.hero-ghost', { opacity: 0.035, duration: 0.8, delay: 0.5, ease: 'power2.out' })

      // Tech grid breath
      gsap.to('.tech-grid', { opacity: 0.18, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' })

      // Entrata Logo 3D
      gsap.from('.hero-logo-wrap', {
        scale: 0.82, rotateX: -18, rotateZ: -6, y: 90, opacity: 0,
        duration: 1.35, delay: 0.55, ease: 'power4.out'
      })

      // Logo gravity collapse on scroll
      const logoCollapseTl = gsap.timeline({
        scrollTrigger: { trigger: container.current, start: 'top top', end: '+=600', scrub: 0.8 }
      })
      logoCollapseTl
        .to('.logo-letter-m', { y: 350, x: -180, rotation: -45, ease: 'power1.inOut' }, 0)
        .to('.logo-letter-b', { y: 400, x: 180, rotation: 60, ease: 'power1.inOut' }, 0)
        .to('.logo-letter-g', { y: 550, x: -220, rotation: -90, ease: 'power1.inOut' }, 0)
        .to('.logo-letter-s', { y: 600, x: 220, rotation: 120, ease: 'power1.inOut' }, 0)

      // CTA pop-in
      gsap.from('.hero-cta-wrap', {
        y: 36, opacity: 0, skewY: 4, duration: 0.9, delay: 1.85, ease: 'expo.out'
      })

      // Story blocks under hero (strict left/right composition synced with keyboard path)
      gsap.utils.toArray('.home-flow-card').forEach((card) => {
        const side = card.getAttribute('data-side')
        gsap.from(card, {
          y: 42,
          x: side === 'left' ? -64 : side === 'right' ? 64 : 0,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        })
      })

      // Manifesto character reveal
      const manifestoRoot = container.current?.querySelector('.manifesto-section')
      const manifestoLines = container.current?.querySelectorAll('.manifesto-title .manifesto-line')

      if (manifestoRoot && manifestoLines?.length) {
        manifestoLines.forEach((lineEl) => {
          const st = new SplitType(lineEl, { types: 'chars', tagName: 'span' })
          manifestoSplitsRef.current.push(st)
        })
        const allChars = manifestoSplitsRef.current.flatMap((s) => s.chars || [])
        gsap.set('.manifesto-kicker', { opacity: 0, y: 36 })
        gsap.set('.manifesto-title', { perspective: 900, transformStyle: 'preserve-3d' })
        gsap.set(allChars, { opacity: 0, yPercent: 118, rotateX: -82, skewX: -5, transformOrigin: '50% 100%' })

        const manifestoTl = gsap.timeline({
          scrollTrigger: { trigger: manifestoRoot, start: 'top 70%', toggleActions: 'play none none none' }
        })
        manifestoTl.to('.manifesto-kicker', { opacity: 1, y: 0, duration: 0.85, ease: 'power4.out' })
        manifestoTl.to(allChars, {
          opacity: 1, yPercent: 0, rotateX: 0, skewX: 0, duration: 1.12,
          stagger: { each: 0.018, ease: 'power2.out' }, ease: 'expo.out'
        }, '-=0.42')
        manifestoTl.to('.manifesto-title', { x: -6, duration: 0.45, ease: 'power2.inOut', yoyo: true, repeat: 1 }, '-=0.55')
      }

      // Parallax images
      gsap.utils.toArray('.parallax-img').forEach((img) => {
        gsap.to(img, {
          yPercent: -20, scale: 1.05, ease: 'none',
          scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        })
      })

      // Dedicated video section: entrance + scroll motion.
      if (featureVideoSectionRef.current && featureVideoRef.current) {
        gsap.fromTo(
          featureVideoSectionRef.current,
          { autoAlpha: 0, y: 70 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: featureVideoSectionRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )

        gsap.fromTo(
          featureVideoRef.current,
          { scale: 1.08, yPercent: -6 },
          {
            scale: 1,
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: featureVideoSectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
          }
        )

        ScrollTrigger.create({
          trigger: featureVideoSectionRef.current,
          start: 'top 120%',
          onEnter: () => {
            if (hasTriedAutoAudioRef.current || hasVideoFinishedRef.current || isVideoErrorOverlayVisible) return
            hasTriedAutoAudioRef.current = true
            enableFeatureVideoAudio()
          },
          onEnterBack: () => {
            if (hasTriedAutoAudioRef.current || hasVideoFinishedRef.current || isVideoErrorOverlayVisible) return
            hasTriedAutoAudioRef.current = true
            enableFeatureVideoAudio()
          },
        })
      }

      ScrollTrigger.refresh()
    }, container)

    return () => ctx.revert()
  }, { scope: container, dependencies: [ready, lang] })

  const toggleHeroAudio = async () => {
    const el = featureVideoRef.current
    if (!el) return

    if (!isHeroAudioOn) {
      el.muted = false
      el.volume = 0.75
      try {
        await el.play()
        setIsHeroAudioOn(true)
      } catch {
        el.muted = true
        setIsHeroAudioOn(false)
      }
      return
    }

    el.muted = true
    setIsHeroAudioOn(false)
  }

  const enableFeatureVideoAudio = async () => {
    const el = featureVideoRef.current
    if (!el) return false
    if (hasVideoFinishedRef.current || isVideoErrorOverlayVisible) return false
    if (!el.muted) {
      setIsHeroAudioOn(true)
      return true
    }

    el.muted = false
    el.volume = 0.75
    try {
      await el.play()
      setIsHeroAudioOn(true)
      return true
    } catch {
      el.muted = true
      setIsHeroAudioOn(false)
      return false
    }
  }

  const handleFeatureVideoEnded = () => {
    const el = featureVideoRef.current
    if (!el) return
    if (isVideoErrorOverlayVisible) return

    hasVideoFinishedRef.current = true
    el.pause()
    el.muted = true
    setIsHeroAudioOn(false)
    setIsVideoErrorOverlayVisible(true)
  }

  if (isMobile) {
    return <HomeMobile ready={ready} t={t} lang={lang} handleMouseEnter={handleMouseEnter} />
  }

  // Desktop Return
  return (
    <div key={`desktop-${lang}`} ref={container} style={{ position: 'relative', backgroundColor: '#454440' }}>
      {/* Background separation bar (Brutalist split) */}
      <BackgroundBar />
      
      {/* Fixed 3D Spline keyboard, z-index 1 */}
      <SplineKeyboardIntegration />
      
      <div className="noise" />

      <PageTransition style={{ padding: 0, width: '100%', display: 'block', position: 'relative', zIndex: 2 }}>

        {/* ── HERO: Cream Background ── */}
        <section style={{
          position: 'relative', width: '100%', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', overflow: 'hidden', background: 'var(--bg-primary)',
        }}>
          <div className="tech-grid" />
          <div className="scan-line" />

          {/* Ghost watermark */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', textAlign: 'center', pointerEvents: 'none', zIndex: 0 }}>
            <h2 className="hero-ghost" style={{ fontFamily: 'var(--font-display)', fontSize: '25vw', fontWeight: 900, color: 'var(--text-primary)', opacity: 0, whiteSpace: 'nowrap', lineHeight: 1, margin: 0 }}>
              M.BRANCHE / 2026
            </h2>
          </div>

          {/* HUD blocks */}
          <div className="hud-block" style={{ position: 'absolute', top: 'clamp(5.5rem, 15vh, 7rem)', left: 'var(--mobile-gutter, 2.5rem)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.08em', opacity: ready ? 0.35 : 0, zIndex: 10 }}>
            [ STATO: <span style={{ color: '#159647' }}>COLLEGATO</span> ]<br className="mobile-hide" />
            <span className="mobile-hide">[ CRITTOGRAFIA: AES-256 ]<br /></span>
            [ MODALITÀ: PRODUZIONE ]
          </div>
          <div className="hud-block mobile-hide" style={{ position: 'absolute', top: '2rem', right: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textAlign: 'right', letterSpacing: '0.1em', opacity: ready ? 0.4 : 0 }}>
            [ BUILD: STABLE V082 ]<br />[ DEP: REACT 19 / GSAP ]<br /><HudClockLine locale={lang} />
          </div>

          {/* Central logo */}
          <div style={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
            <SplitText type="words" delay={0.5} ready={ready} contentKey={lang}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                {t.home_tagline}
              </p>
            </SplitText>

            <div style={{ position: 'relative', margin: '0 auto', width: 'min(92vw, 720px)', perspective: '1200px' }}>
              <h1 className="sr-only">{t.hero_sr_name}</h1>
              <div className="hero-logo-wrap" style={{ transformStyle: 'preserve-3d' }}>
                <div className="hero-logo-mbgs" style={{
                  fontFamily: "'SK Quadratica', 'Unbounded', sans-serif",
                  fontSize: 'clamp(8rem, 21vw, 20rem)', lineHeight: 0.78,
                  display: 'grid', gridTemplateColumns: 'max-content max-content',
                  gridTemplateRows: 'max-content max-content',
                  justifyContent: 'center', gap: '0.04em 0.06em',
                  width: '100%', margin: '0 auto', alignItems: 'center', paddingTop: '0.12em'
                }}>
                  <span className="logo-letter-m" style={{ color: '#0053a4' }}>M</span>
                  <span className="logo-letter-b" style={{ color: '#159647' }}>B</span>
                  <span className="logo-letter-g" style={{ color: '#c41d24' }}>G</span>
                  <span className="logo-letter-s" style={{ color: '#edcc4b' }}>S</span>
                </div>
              </div>
            </div>

            <div className="hero-cta-wrap" style={{ marginTop: '5rem', visibility: ready ? 'visible' : 'hidden' }}>
              <CreepyButton to="/works">{t.home_enter_hub}</CreepyButton>
            </div>
          </div>
        </section>

        {/* WordScroll transition wrapper */}
        <div id="wordscroll-section" style={{ background: 'transparent', position: 'relative' }}>
          <WordScroll />
        </div>

        {/* ── PART 1: Collaborazioni (Reference layout adapted) ── */}
        <section
          id="part1"
          className="home-flow-section home-flow-section--right"
        >
          <div className="home-flow-rail home-flow-rail--left" aria-hidden />
          <article className="home-flow-card" data-side="right">
            <span className="home-flow-kicker">
              {t.layout_collab_kicker}
            </span>
            <h2 className="home-flow-title">
              {t.layout_collab_line1}<br />
              <span className="home-flow-title--outline">{t.layout_collab_line2}</span>
            </h2>
            <p className="home-flow-copy">
              {lang === 'it'
                ? 'Dal concept al rilascio, seguo ogni fase con metodo e cura.'
                : 'From concept to launch, I handle each phase with clarity and care.'}
            </p>
            <ul className="home-flow-bullets" aria-label="Collaboration highlights">
              <li>{lang === 'it' ? 'Direzione creativa e sviluppo completo' : 'Creative direction and full development'}</li>
              <li>{lang === 'it' ? 'Workflow rapido, iterazioni chiare' : 'Fast workflow and clear iterations'}</li>
              <li>{lang === 'it' ? 'Output orientato a performance e brand' : 'Performance-first, brand-driven output'}</li>
            </ul>
            <Link to="/contact" className="home-flow-btn hoverable">
              {t.nav_contact} {'→'}
            </Link>
          </article>
        </section>

        {/* ── PART 2: Featured Reels (Reference layout adapted) ── */}
        <section
          id="part2"
          className="home-flow-section home-flow-section--left"
        >
          <article className="home-flow-card" data-side="left">
            <p className="home-flow-kicker">
              {t.home_featured_kicker}
            </p>
            <h2 className="home-flow-title">
              {t.home_featured_reel}<br />
              <span className="home-flow-title--outline">{t.home_featured_reel_b}</span>
            </h2>
            <div className="home-flow-reel-list">
              {projects.slice(0, 3).map((project, idx) => (
                <div key={project.id} className="home-flow-reel-item">
                  <img className="home-flow-reel-thumb parallax-img" src={project.image} alt={project.title[lang]} />
                  <div>
                    <span className="home-flow-reel-meta">0{idx + 1} // {project.tags[0]}</span>
                    <h3 className="home-flow-reel-title">{project.title[lang]}</h3>
                    <p className="home-flow-reel-desc">{project.description[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/works" className="home-flow-btn home-flow-btn--ghost hoverable">
              {t.home_view_all}
            </Link>
          </article>
          <div className="home-flow-rail home-flow-rail--right" aria-hidden />
        </section>

        <section
          id="part2b-video"
          ref={featureVideoSectionRef}
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '58vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: 'transparent',
            padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2.5rem)',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1200px',
              aspectRatio: '4 / 3',
              minHeight: 'clamp(260px, 38vw, 520px)',
              border: '1px solid rgba(255,255,255,0.16)',
              overflow: 'hidden',
              background: '#0f0f10',
            }}
          >
          <video
            ref={featureVideoRef}
            autoPlay
            muted={!isHeroAudioOn}
            playsInline
            preload="metadata"
            onEnded={handleFeatureVideoEnded}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.88,
            }}
          >
            <source src="/assets/hero-bg.mp4" type="video/mp4" />
          </video>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(10,10,10,0.2), rgba(10,10,10,0.44))',
            }}
          />
          {isVideoErrorOverlayVisible && (
            <div className="video-error-overlay" aria-hidden="true">
              <div className="video-error-overlay__stripes" />
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={`err-row-${idx}`}
                  className={`video-error-overlay__text-track ${idx % 2 === 0 ? 'is-left' : 'is-right'}`}
                  style={{ top: `${10 + idx * 11.5}%` }}
                >
                  ERROR • ERROR • ERROR • ERROR • ERROR • ERROR • ERROR • ERROR • ERROR • ERROR • ERROR • ERROR • ERROR • ERROR •
                </div>
              ))}
            </div>
          )}

          </div>
        </section>

        {/* ── PART 3: Manifesto (Back to Cream) ── */}
        <section
          id="part3"
          className="manifesto-section home-flow-manifesto"
          style={{
            width: '100%', minHeight: '120vh',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '6rem 2rem 10rem', textAlign: 'center',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
        >
          <div className="manifesto-inner" style={{ maxWidth: '1200px', width: '100%' }}>
            <span className="manifesto-kicker" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>
              {t.home_manifesto_kicker}
            </span>
            <h2 className="manifesto-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 6.2vw, 5.4rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.96, marginTop: '2rem', marginBottom: '3rem' }}>
              {t.home_manifesto_title.split('\n').map((line, i, arr) => (
                <span
                  key={`${lang}-${i}`}
                  className={`manifesto-line ${i === arr.length - 1 ? 'manifesto-line--outline' : ''}`}
                  style={{ display: 'block', whiteSpace: 'nowrap', wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}
                >
                  {line}
                </span>
              ))}
            </h2>
            <p className="home-flow-manifesto-hash">#Spline3DAndGSAPAnimations</p>
            <CreepyButton to="/contact">{t.nav_contact}</CreepyButton>
          </div>
        </section>

      </PageTransition>
    </div>
  )
}
