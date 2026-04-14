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
import WaterDroplets from '../components/WaterDroplets'
import CreepyButton from '../components/CreepyButton'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Imposta `false` per tornare al titolo MICHEL / BRANCHE animato con SplitText */
const HERO_USE_LOGO = true

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

export default function Home({ ready }) {
  const { handleMouseEnter, handleMouseLeave } = useCursor()
  const { lang } = useLanguage()
  const t = i18nStrings[lang]
  const isMobile = useMediaQuery('(max-width: 768px)')
  const container = useRef()
  const magneticButton = useRef()
  const manifestoSplitsRef = useRef([])
  const homeCollabSplitsRef = useRef([])

  useGSAP(() => {
    if (!ready) return
    if (isMobile) return

    let featuredMM = null

    const ctx = gsap.context(() => {
      manifestoSplitsRef.current.forEach((s) => s.revert())
      manifestoSplitsRef.current = []
      homeCollabSplitsRef.current.forEach((s) => s.revert())
      homeCollabSplitsRef.current = []

      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // HUD — ingresso tagliente + scarto laterale
      gsap.from('.hud-block', {
        opacity: 0,
        y: 36,
        x: (i) => (i % 2 === 0 ? -52 : 52),
        skewX: 5,
        stagger: 0.11,
        duration: 0.95,
        delay: 0.75,
        ease: 'expo.out'
      })

      // Brackets — “lock-on”
      gsap.from('.hero-bracket', {
        scale: 0,
        opacity: 0,
        rotation: -90,
        transformOrigin: 'center center',
        stagger: { each: 0.1, from: 'random' },
        duration: 0.85,
        delay: 1.15,
        ease: 'back.out(2.2)'
      })

      // Watermark ghost — drift continuo
      gsap.to('.hero-ghost', {
        xPercent: 8,
        duration: 18,
        ease: 'none',
        repeat: -1,
        yoyo: true
      })
      gsap.to('.hero-ghost', {
        opacity: 0.035,
        duration: 0.8,
        delay: 0.5,
        ease: 'power2.out'
      })

      // Griglia tech — respiro
      gsap.to('.tech-grid', {
        opacity: 0.18,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // Logo hero — impatto 3D
      gsap.from('.hero-logo-wrap', {
        scale: 0.82,
        rotateX: -18,
        rotateZ: -6,
        y: 90,
        opacity: 0,
        duration: 1.35,
        delay: 0.55,
        ease: 'power4.out'
      })

      // CTA hub — pop-in
      gsap.from('.hero-cta-wrap', {
        y: 36,
        opacity: 0,
        skewY: 4,
        duration: 0.9,
        delay: 1.85,
        ease: 'expo.out'
      })

      // Collaboration — rolling text (rolling-text.zip: rotationX -90→90, stagger, repeat)
      const collabStrip = container.current?.querySelector('.home-collab-strip')
      const collabTube = container.current?.querySelector('.home-collab-tube')
      const collabLineEls =
        container.current?.querySelectorAll('.home-collab-line') || []

      let collabRollTl = null
      let collabRollActive = false

      if (!reduceMotion && collabTube && collabLineEls.length >= 4) {
        gsap.set(collabTube, { autoAlpha: 0 })

        const collabSplitInstances = []
        collabLineEls.forEach((lineEl) => {
          const st = new SplitType(lineEl, { types: 'chars', tagName: 'span' })
          homeCollabSplitsRef.current.push(st)
          collabSplitInstances.push(st)
        })

        const w = collabTube.getBoundingClientRect().width || window.innerWidth
        const depth = -w / 8
        const transformOrigin = `50% 50% ${depth}px`

        gsap.set(collabLineEls, { transformStyle: 'preserve-3d' })

        const animTime = 0.9
        collabRollTl = gsap.timeline({ repeat: -1, paused: true })

        collabSplitInstances.forEach((split, index) => {
          if (!split.chars?.length) return
          collabRollTl.fromTo(
            split.chars,
            { rotationX: -90 },
            {
              rotationX: 90,
              stagger: 0.08,
              duration: animTime,
              ease: 'none',
              transformOrigin,
            },
            index * 0.45
          )
        })

        ScrollTrigger.create({
          trigger: collabStrip,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => {
            if (collabRollActive && collabRollTl) collabRollTl.play()
          },
          onLeave: () => {
            if (collabRollTl) collabRollTl.pause()
          },
          onEnterBack: () => {
            if (collabRollActive && collabRollTl) collabRollTl.play()
          },
        })
      }

      if (collabRollTl) {
        gsap.set('.home-collab-subline', { autoAlpha: 0, y: 10 })
      }

      const collabIntroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.home-collab-strip',
          start: 'top 86%',
          toggleActions: 'play none none none',
        },
      })

      collabIntroTl.from('.collab-line', {
        scaleX: 0,
        opacity: 0,
        duration: 0.95,
        ease: 'power3.inOut',
        transformOrigin: 'center center',
      })

      if (reduceMotion || !collabRollTl) {
        collabIntroTl.from(
          '.home-collab-inner',
          {
            y: 48,
            opacity: 0,
            duration: 0.85,
            ease: 'expo.out',
          },
          '-=0.35'
        )
      } else {
        collabIntroTl.from(
          '.home-collab-kicker',
          {
            y: 28,
            opacity: 0,
            duration: 0.55,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        collabIntroTl.to(
          collabTube,
          {
            autoAlpha: 1,
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => {
              collabRollActive = true
              collabRollTl.play()
            },
          },
          '-=0.15'
        )
        collabIntroTl.to(
          '.home-collab-subline',
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.1'
        )
      }

      collabIntroTl.from(
        '.home-collab-arrow',
        {
          x: -28,
          opacity: 0,
          duration: 0.55,
          ease: 'power4.out',
        },
        '-=0.35'
      )

      // Featured reel — scroll verticale → traslazione orizzontale (pin + scrub)
      if (!reduceMotion) {
        featuredMM = gsap.matchMedia()
        featuredMM.add('(min-width: 701px)', () => {
          const root = container.current
          if (!root) return undefined
          const outer = root.querySelector('.home-featured-reel-outer')
          const reel = root.querySelector('.home-featured-reel')
          const track = root.querySelector('.home-featured__track')
          if (!outer || !reel || !track) return undefined

          const travel = () =>
            Math.max(0, track.scrollWidth - reel.clientWidth)

          gsap.set(track, { x: 0 })

          const tween = gsap.to(track, {
            x: () => Math.min(0, reel.clientWidth - track.scrollWidth),
            ease: 'none',
            scrollTrigger: {
              trigger: outer,
              start: 'top top',
              end: () =>
                `+=${travel() * 1.85 + window.innerHeight * 1.15}`,
              pin: true,
              scrub: 1.05,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          return () => {
            tween.scrollTrigger?.kill()
            tween.kill()
          }
        })
      }

      // Manifesto — titolo: split caratteri + timeline (EN/IT)
      const manifestoRoot = container.current?.querySelector('.manifesto-section')
      const manifestoLines = container.current?.querySelectorAll(
        '.manifesto-title .manifesto-line'
      )

      if (reduceMotion) {
        gsap.from('.manifesto-inner', {
          y: 56,
          opacity: 0,
          duration: 0.85,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.manifesto-section',
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        })
      } else if (manifestoRoot && manifestoLines?.length) {
        manifestoLines.forEach((lineEl) => {
          const st = new SplitType(lineEl, { types: 'chars', tagName: 'span' })
          manifestoSplitsRef.current.push(st)
        })

        const allChars = manifestoSplitsRef.current.flatMap((s) => s.chars || [])

        gsap.set('.manifesto-kicker', { opacity: 0, y: 36 })
        gsap.set('.manifesto-title', {
          perspective: 900,
          transformStyle: 'preserve-3d',
        })
        gsap.set(allChars, {
          opacity: 0,
          yPercent: 118,
          rotateX: -82,
          skewX: -5,
          transformOrigin: '50% 100%',
        })

        const manifestoTl = gsap.timeline({
          scrollTrigger: {
            trigger: manifestoRoot,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        })

        manifestoTl.to('.manifesto-kicker', {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power4.out',
        })

        manifestoTl.to(
          allChars,
          {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            skewX: 0,
            duration: 1.12,
            stagger: {
              each: 0.018,
              ease: 'power2.out',
            },
            ease: 'expo.out',
          },
          '-=0.42'
        )

        manifestoTl.to(
          '.manifesto-title',
          {
            x: -6,
            duration: 0.45,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1,
          },
          '-=0.55'
        )
      }

      gsap.fromTo(
        '.manifesto-section',
        { backgroundPosition: '0% 0%' },
        {
          backgroundPosition: '0% 100%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.manifesto-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      )

      // Parallax immagini — più aggressivo
      gsap.utils.toArray('.parallax-img').forEach((img) => {
        gsap.to(img, {
          yPercent: -38,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        })
      })
      
      // Force refresh all triggers after layout is established
      ScrollTrigger.refresh()
    }, container)

    return () => {
      manifestoSplitsRef.current.forEach((s) => s.revert())
      manifestoSplitsRef.current = []
      homeCollabSplitsRef.current.forEach((s) => s.revert())
      homeCollabSplitsRef.current = []
      featuredMM?.revert()
      ctx.revert()
    }
  }, { scope: container, dependencies: [ready, lang] })

  // If mobile, render the exclusive mobile version
  if (isMobile) {
    return (
      <div key={`mob-${lang}`} ref={container} className="mobile-only-home" style={{ position: 'relative' }}>
        <div className="noise" />
        <PageTransition noPadding style={{ display: 'block', width: '100%', minHeight: '100vh', alignItems: 'unset' }}>
           <HomeMobile ready={ready} t={t} lang={lang} handleMouseEnter={handleMouseEnter} />
        </PageTransition>
      </div>
    )
  }

  return (
    <div key={`desktop-${lang}`} ref={container} style={{ position: 'relative' }}>
      <div className="noise" />

      <PageTransition style={{ padding: 0, width: '100%', display: 'block' }}>
        {/* Desktop Version (Existing code) */}
        {/* ... (the rest of the original return) */}
        <section
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            overflow: 'hidden',
          }}
        >
          <WaterDroplets />
          <div className="tech-grid" />
          <div className="scan-line" />

          {/* Layer 1: Ghost Watermark (GSAP drift) */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', textAlign: 'center', pointerEvents: 'none', zIndex: 0 }}>
            <h2 
              className="hero-ghost"
              style={{ fontFamily: 'var(--font-display)', fontSize: '25vw', fontWeight: 900, color: 'var(--text-primary)', opacity: 0, whiteSpace: 'nowrap', lineHeight: 1, margin: 0 }}
            >
              M.BRANCHE / 2026
            </h2>
          </div>

          {/* HUD CORNER DATA BLOCKS */}
          <div className="hud-block" style={{ position: 'absolute', top: 'clamp(5.5rem, 15vh, 7rem)', left: 'var(--mobile-gutter, 2.5rem)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.08em', opacity: ready ? 0.35 : 0, zIndex: 10 }}>
            [ {t.home_hud_status}: <span style={{ color: '#00ff00' }}>{t.home_hud_connected}</span> ]<br className="mobile-hide" />
            <span className="mobile-hide">[ {t.home_hud_encryption} ]<br/></span>
            [ {t.home_hud_mode} ]
          </div>


          <div className="hud-block mobile-hide" style={{ position: 'absolute', top: '2rem', right: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textAlign: 'right', letterSpacing: '0.1em', opacity: ready ? 0.4 : 0 }}>
            [ {t.home_hud_build} ]<br/>
            [ {t.home_hud_dep} ]<br/>
            <HudClockLine locale={lang} />
          </div>


          <div className="hud-block mobile-hide" style={{ position: 'absolute', bottom: '2rem', left: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', opacity: ready ? 0.4 : 0 }}>
            [ {t.home_hud_coords} ]<br/>
            [ {t.home_hud_altitude} ]<br/>
            [ {t.home_hud_temp} ]
          </div>


          <div className="hud-block mobile-hide" style={{ position: 'absolute', bottom: '2rem', right: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textAlign: 'right', letterSpacing: '0.1em', opacity: ready ? 0.4 : 0 }}>
            [ {t.home_hud_scroll} ]<br/>
            [ {t.home_hud_counter} ]
          </div>


          {/* Brackets */}
          <div style={{ position: 'absolute', width: '80%', height: '80%', maxWidth: '1200px', pointerEvents: 'none', opacity: ready ? 1 : 0 }}>
            <div className="hero-bracket" style={{ position: 'absolute', top: '0rem', left: '0rem', width: 60, height: 60, borderTop: '1px solid var(--c-border)', borderLeft: '1px solid var(--c-border)' }} />
            <div className="hero-bracket" style={{ position: 'absolute', top: '0rem', right: '0rem', width: 60, height: 60, borderTop: '1px solid var(--c-border)', borderRight: '1px solid var(--c-border)' }} />
            <div className="hero-bracket" style={{ position: 'absolute', bottom: '0rem', left: '0rem', width: 60, height: 60, borderBottom: '1px solid var(--c-border)', borderLeft: '1px solid var(--c-border)' }} />
            <div className="hero-bracket" style={{ position: 'absolute', bottom: '0rem', right: '0rem', width: 60, height: 60, borderBottom: '1px solid var(--c-border)', borderRight: '1px solid var(--c-border)' }} />
          </div>

          <div style={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
            <SplitText type="words" delay={0.5} ready={ready} contentKey={lang}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--text-secondary)', marginBottom: HERO_USE_LOGO ? '2.5rem' : '3rem' }}>
                {t.home_tagline}
              </p>
            </SplitText>
            
            {HERO_USE_LOGO ? (
              <div
                style={{
                  position: 'relative',
                  margin: '0 auto',
                  width: 'min(92vw, 720px)',
                  perspective: '1200px'
                }}
              >
                <h1
                  style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0
                  }}
                >
                  {t.hero_sr_name}
                </h1>
                <div className="hero-logo-wrap" style={{ transformStyle: 'preserve-3d' }}>
                  <img
                    className="hero-logo-mbgs"
                    src="/assets/logo-hero-mbgs.png"
                    alt=""
                    style={{
                      width: 'min(calc(88vw), 392px)',
                      height: 'auto',
                      maxHeight: 'min(calc(42vh * 1.4), 392px)',
                      aspectRatio: '1',
                      objectFit: 'contain',
                      display: 'block',
                      margin: '0 auto',
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <SplitText type="chars" delay={0.8} ready={ready} contentKey={lang}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.5rem, 12vw, 12rem)', lineHeight: 0.8, letterSpacing: '-0.06em', textTransform: 'uppercase', margin: 0, color: 'var(--text-primary)' }}>
                    {t.hero_name_michel}
                  </h1>
                </SplitText>
                
                <SplitText type="chars" delay={1} ready={ready} contentKey={lang}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.5rem, 12vw, 12rem)', lineHeight: 0.8, letterSpacing: '-0.06em', textTransform: 'uppercase', margin: 0, WebkitTextStroke: '1.5px var(--c-border)', color: 'transparent', display: 'block' }}>
                    {t.hero_name_branche}
                  </h1>
                </SplitText>
              </>
            )}

            <SplitText type="lines" delay={1.4} scroll={false} ready={ready} contentKey={lang}>
              <div style={{ marginTop: '3rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
                {t.home_studio}<br/>
                <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>{t.home_established}</span>
              </div>
            </SplitText>


            <div className="hero-cta-wrap" style={{ marginTop: '5rem', visibility: ready ? 'visible' : 'hidden' }}>
              <CreepyButton to="/works">
                {t.home_enter_hub}
              </CreepyButton>
            </div>
          </div>
        </section>

        {/* CSS Scroll Timeline Words */}
        <WordScroll />

        {/* Collaboration CTA — GSAP timeline + ScrollTrigger */}
        <section
          className="home-collab-strip"
          aria-labelledby="home-collab-heading"
        >
          <div className="collab-line home-collab-strip__rule" />
          <div className="home-collab-inner">
            <Link
              to="/contact"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="hoverable"
              style={{
                display: 'block',
                width: '100%',
                textDecoration: 'none',
                color: 'inherit',
                position: 'relative',
              }}
            >
              <span className="home-collab-kicker">
                {t.layout_collab_kicker}
              </span>
              <h2 id="home-collab-heading" className="sr-only">
                {t.layout_collab_roll} {t.layout_collab_subline}
              </h2>
              <div className="home-collab-tube" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <div key={`${lang}-collab-roll-${i}`} className="home-collab-line">
                    {t.layout_collab_roll}
                  </div>
                ))}
              </div>
              <p className="home-collab-subline">{t.layout_collab_subline}</p>
              <span className="home-collab-arrow" aria-hidden>
                → {t.nav_contact}
              </span>
            </Link>

          </div>
        </section>

        {/* Featured Reel */}
        <section className="home-featured" id="featured-reel" aria-labelledby="featured-reel-heading">
          <div className="home-featured__inner">
            <p className="home-featured__kicker">{t.home_featured_kicker}</p>
            <div className="home-featured__head">
              <SplitText scroll ready={ready} type="chars" contentKey={lang} className="home-featured__title-wrap">
                <h2 id="featured-reel-heading" className="home-featured__title">
                  {t.home_featured_reel}{' '}
                  <span className="home-featured__title-stroke">{t.home_featured_reel_b}</span>
                </h2>
              </SplitText>
              <CreepyButton
                to="/works"
                className="home-featured__cta"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {t.home_view_all}
              </CreepyButton>
            </div>

            <div className="home-featured-reel-outer">
              <p className="home-featured-reel-hint">{t.home_featured_scroll_hint}</p>
              <div className="home-featured-reel">
                <div className="home-featured__track">
                  {projects.slice(0, 3).map((project, idx) => (
                    <article key={project.id} className="home-featured-card">
                      <div className="home-featured-card__media">
                        <img
                          className="home-featured-card__img"
                          src={project.image}
                          alt={project.title[lang]}
                          onError={(e) => {
                            e.target.src =
                              'https://placehold.co/800x500/f4efe6/1a1917?text=Project'
                          }}
                        />
                      </div>
                      <div className="home-featured-card__body">
                        <span className="home-featured-card__index">
                          0{idx + 1} // {project.tags[0]}
                        </span>
                        <h3 className="home-featured-card__title">
                          {project.title[lang]}
                        </h3>
                        <p className="home-featured-card__desc">
                          {project.description[lang]}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Manifesto */}
        <section
          className="manifesto-section"
          style={{
            width: '100%',
            background: 'linear-gradient(180deg, var(--text-primary) 0%, color-mix(in srgb, var(--text-primary) 92%, #000) 100%)',
            backgroundSize: '100% 200%',
            color: 'var(--bg-primary)',
            padding: '10rem 2rem'
          }}
        >
          <div className="manifesto-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <span
              className="manifesto-kicker"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                display: 'inline-block',
              }}
            >
              {t.home_manifesto_kicker}
            </span>
            <h2
              className="manifesto-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                lineHeight: 1.05,
                marginTop: '2rem',
                marginBottom: 0,
              }}
            >
              {t.home_manifesto_title.split('\n').map((line, i, arr) => (
                <span
                  key={`${lang}-${i}`}
                  className={`manifesto-line ${i === arr.length - 1 ? 'manifesto-line--outline' : ''}`}
                >
                  {line}
                </span>
              ))}
            </h2>
          </div>
        </section>
      </PageTransition>
    </div>
  )
}
