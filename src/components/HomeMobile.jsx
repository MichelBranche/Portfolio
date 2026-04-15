import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import SplitText from './SplitText'

import WordScroll from './WordScroll'
import CreepyButton from './CreepyButton'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function HomeMobile({ ready, t, lang, handleMouseEnter }) {
  const container = useRef()
  const featureVideoRef = useRef(null)
  const featureVideoSectionRef = useRef(null)
  const hasTriedAutoAudioRef = useRef(false)
  const hasVideoFinishedRef = useRef(false)
  const [isVideoAudioOn, setIsVideoAudioOn] = useState(false)
  const [isVideoErrorOverlayVisible, setIsVideoErrorOverlayVisible] = useState(false)

  useGSAP(() => {
    if (!ready) return
    const tl = gsap.timeline()
    tl.from('.hm-hud-item', { y: -20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, 0.5)
    tl.from('.hm-hero-logo', { scale: 1.1, opacity: 0, duration: 1.5, ease: 'expo.out' }, 0.8)
    tl.from('.hm-cta', { y: 30, opacity: 0, duration: 1, ease: 'power4.out' }, 1.2)

    // Mobile Logo Disassembly on Scroll
    gsap.registerPlugin(ScrollTrigger)
    const mobLogoTl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=500',
        scrub: 0.8,
      }
    })
    mobLogoTl
      .to('.logo-letter-m', { y: 300, x: -80, rotation: -35, ease: 'power1.inOut' }, 0)
      .to('.logo-letter-b', { y: 350, x: 80, rotation: 45, ease: 'power1.inOut' }, 0)
      .to('.logo-letter-g', { y: 450, x: -120, rotation: -80, ease: 'power1.inOut' }, 0)
      .to('.logo-letter-s', { y: 500, x: 120, rotation: 100, ease: 'power1.inOut' }, 0)

    if (featureVideoSectionRef.current && featureVideoRef.current) {
      gsap.fromTo(
        featureVideoSectionRef.current,
        { autoAlpha: 0, y: 42 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
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
        { scale: 1.08, yPercent: -5 },
        {
          scale: 1,
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: featureVideoSectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
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
  }, { scope: container, dependencies: [ready] })

  const toggleFeatureVideoAudio = async () => {
    const el = featureVideoRef.current
    if (!el) return

    if (!isVideoAudioOn) {
      el.muted = false
      el.volume = 0.75
      try {
        await el.play()
        setIsVideoAudioOn(true)
      } catch {
        el.muted = true
        setIsVideoAudioOn(false)
      }
      return
    }

    el.muted = true
    setIsVideoAudioOn(false)
  }

  const enableFeatureVideoAudio = async () => {
    const el = featureVideoRef.current
    if (!el) return false
    if (hasVideoFinishedRef.current || isVideoErrorOverlayVisible) return false
    if (!el.muted) {
      setIsVideoAudioOn(true)
      return true
    }

    el.muted = false
    el.volume = 0.75
    try {
      await el.play()
      setIsVideoAudioOn(true)
      return true
    } catch {
      el.muted = true
      setIsVideoAudioOn(false)
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
    setIsVideoAudioOn(false)
    setIsVideoErrorOverlayVisible(true)
  }

  return (
    <div ref={container} className="home-mobile-v3" style={{ width: '100%', position: 'relative', overflowX: 'clip' }}>

      {/* 1. HERO */}
      <section className="hm-hero" style={{ 
        minHeight: '100dvh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'stretch',
        justifyContent: 'space-between',
        padding: 'calc(var(--nav-height, 80px) + 0.75rem) 1.25rem 1.5rem',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <div className="hm-grid" style={{ pointerEvents: 'none', position: 'absolute', inset: 0 }} />
        
        <div className="hm-hud-item" style={{ 
          width: '100%', display: 'flex', justifyContent: 'space-between', 
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem', opacity: 0.7,
          textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0,
        }}>
          <div>[ SYS.ACTIVE ]</div>
          <div>MILAN // HQ</div>
        </div>

        <div style={{ 
          position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', 
          alignItems: 'center', width: '100%', textAlign: 'center', flex: 1,
          justifyContent: 'center', gap: '1.5rem',
        }}>
          <SplitText type="words" delay={0.5} ready={ready} contentKey={lang}>
            <span style={{ letterSpacing: '0.12em', fontSize: '0.6rem', lineHeight: '1.6', display: 'inline-block', textTransform: 'uppercase', opacity: 0.6 }}>
              {t.home_tagline}
            </span>
          </SplitText>

          <div className="hm-hero-logo" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                fontFamily: "'SK Quadratica', 'Unbounded', sans-serif",
                fontSize: 'clamp(6rem, 36vw, 15rem)',
                lineHeight: 0.78,
                letterSpacing: '0',
                display: 'grid',
                gridTemplateColumns: 'max-content max-content',
                gridTemplateRows: 'max-content max-content',
                justifyContent: 'center',
                gap: '0.04em 0.06em',
                width: '100%',
                margin: '0 auto',
                alignItems: 'center',
                paddingTop: '0.12em',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))'
              }}
            >
              <span className="logo-letter-m" style={{ color: '#0053a4', display: 'block', transform: 'translateY(0.04em)' }}>M</span>
              <span className="logo-letter-b" style={{ color: '#159647', display: 'block', transform: 'translateY(0.04em)' }}>B</span>
              <span className="logo-letter-g" style={{ color: '#c41d24', display: 'block', transform: 'translateY(-0.04em)' }}>G</span>
              <span className="logo-letter-s" style={{ color: '#edcc4b', display: 'block', transform: 'translateY(-0.04em)' }}>S</span>
            </div>
          </div>

          <div className="hm-contact-dock" style={{ width: '100%', maxWidth: '260px' }}>
            <CreepyButton to="/works" className="hm-cta" style={{ width: '100%' }}>
              {t.home_enter_hub}
            </CreepyButton>
          </div>
        </div>

        <div className="hm-hud-item" style={{ 
          width: '100%', display: 'flex', justifyContent: 'space-between', 
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem', opacity: 0.55,
          letterSpacing: '0.05em', flexShrink: 0,
        }}>
          <span>BUILD: STABLE_V882</span>
          <span>LOC: 45.46 // 9.19</span>
        </div>
      </section>

      {/* WordScroll — pulled up close to hero */}
      <div style={{ marginTop: '-1rem' }}>
        <WordScroll />
      </div>

      {/* 3. COLLAB — mobile "002 // Availability" */}
      <section id="part1" style={{ width: '100%', boxSizing: 'border-box', padding: '5rem 1.5rem', borderTop: '1px solid var(--c-border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.45, display: 'block', marginBottom: '2.5rem' }}>
          {t.layout_collab_kicker}
        </span>
        <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 7.5vw, 3.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: '0.4rem', wordBreak: 'break-word' }}>
            {t.layout_collab_line1}
          </h2>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 7.5vw, 3.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.03em', color: 'transparent', WebkitTextStroke: '1px var(--text-primary)', marginBottom: '2.5rem', wordBreak: 'break-word' }}>
            {t.layout_collab_line2}
          </h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.6 }}>
            → {t.nav_contact}
          </span>
        </Link>
      </section>

      {/* 2. FEATURED REEL */}
      <section id="part2" style={{ padding: '3rem 1.25rem 6rem', width: '100%', boxSizing: 'border-box' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.45, display: 'block', marginBottom: '1rem', letterSpacing: '0.1em' }}>
          {t.home_featured_kicker}
        </span>

        <h2 style={{ 
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.1rem, 11.5vw, 3.4rem)',
          fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.92, 
          marginBottom: '3rem', letterSpacing: '-0.02em', textAlign: 'left',
          wordBreak: 'normal', overflowWrap: 'anywhere', textWrap: 'balance',
        }}>
          {t.home_featured_reel}{' '}
          <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--text-primary)', whiteSpace: 'normal' }}>
            {t.home_featured_reel_b}
          </span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
          {projects.slice(0, 3).map((project, idx) => {
            const varStyles = [
              { width: '100%', ratio: '16/10', ml: '0',    mr: '0'    },
              { width: '82%',  ratio: '3/4',   ml: 'auto', mr: '0'    },
              { width: '88%',  ratio: '4/3',   ml: '0',    mr: 'auto' },
            ]
            const s = varStyles[idx % 3]
            return (
              <motion.article 
                key={project.id}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '0px' }}
                transition={{ duration: 0.65, ease: 'easeOut', delay: idx * 0.08 }}
                style={{ width: s.width, marginLeft: s.ml, marginRight: s.mr, maxWidth: '100%' }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: s.ratio, overflow: 'hidden', border: '1px solid var(--c-border)', marginBottom: '1rem' }}>
                  <img src={project.image} alt={project.title[lang]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--bg-primary)', padding: '0.15rem 0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', border: '1px solid var(--text-primary)' }}>
                    0{idx + 1}
                  </div>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 5.5vw, 1.4rem)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', lineHeight: 1.05, letterSpacing: '-0.02em', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                  {project.title[lang]}
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', opacity: 0.65, lineHeight: 1.55, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                  {project.description[lang]}
                </p>
              </motion.article>
            )
          })}
        </div>

        <Link to="/works" style={{ display: 'block', marginTop: '3.5rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', textDecoration: 'none', color: 'var(--text-primary)', borderBottom: '1px solid var(--text-primary)', paddingBottom: '0.4rem', width: 'fit-content', marginInline: 'auto' }}>
          {t.home_view_all}
        </Link>
      </section>

      {/* 2B. VIDEO BLOCK (aligned with desktop flow) */}
      <section
        id="part2b-video"
        ref={featureVideoSectionRef}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '0 1.25rem 4.5rem',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3',
            border: '1px solid rgba(255,255,255,0.16)',
            overflow: 'hidden',
            background: '#0f0f10',
          }}
        >
          <video
            ref={featureVideoRef}
            autoPlay
            muted={!isVideoAudioOn}
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
                  key={`err-row-mobile-${idx}`}
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


      {/* 4. MANIFESTO */}
      <section id="part3" style={{ width: '100%', boxSizing: 'border-box', background: '#111', color: '#f6f2ea', padding: '4rem 1.5rem 4.5rem', borderTop: '1px solid rgba(255,255,255,0.16)', borderBottom: '1px solid rgba(255,255,255,0.16)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.62, letterSpacing: '0.12em', display: 'block', marginBottom: '1.4rem' }}>
          {t.home_manifesto_kicker}
        </span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 7vw, 2.9rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.015em', textAlign: 'left', overflowWrap: 'anywhere', wordBreak: 'normal', textWrap: 'balance' }}>
          {t.home_manifesto_title.split('\n').map((line, i) => (
            <span key={i} style={{ display: 'block' }}>{line}</span>
          ))}
        </h2>
      </section>

      {/* 5. LET'S START */}
      <section style={{ width: '100%', boxSizing: 'border-box', padding: '3.5rem 1.5rem 5.5rem', textAlign: 'center', borderTop: '1px solid var(--c-border)' }}>
        <p style={{ margin: '0 0 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.55 }}>
          004 // Final call
        </p>
        <Link to="/contact" style={{ display: 'inline-block', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 10.5vw, 3.4rem)', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'none', color: 'var(--text-primary)', lineHeight: 0.9, letterSpacing: '-0.02em' }}>
          LET'S<br/>
          <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--text-primary)' }}>START</span>
        </Link>
      </section>

    </div>
  )
}
