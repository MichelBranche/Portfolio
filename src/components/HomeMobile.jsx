import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import SplitText from './SplitText'

import WordScroll from './WordScroll'
import CreepyButton from './CreepyButton'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export default function HomeMobile({ ready, t, lang, handleMouseEnter }) {
  const container = useRef()

  useGSAP(() => {
    if (!ready) return
    const tl = gsap.timeline()
    tl.from('.hm-hud-item', { y: -20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, 0.5)
    tl.from('.hm-hero-logo', { scale: 1.1, opacity: 0, duration: 1.5, ease: 'expo.out' }, 0.8)
    tl.from('.hm-cta', { y: 30, opacity: 0, duration: 1, ease: 'power4.out' }, 1.2)
  }, { scope: container, dependencies: [ready] })

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
            <img src="/assets/logo-hero-mbgs.png" alt="" style={{ width: '65%', maxWidth: '240px', height: 'auto', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }} />
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
      <div style={{ marginTop: '-4rem' }}>
        <WordScroll />
      </div>

      {/* 2. FEATURED REEL */}
      <section style={{ padding: '3rem 1.25rem 6rem', width: '100%', boxSizing: 'border-box' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.45, display: 'block', marginBottom: '1rem', letterSpacing: '0.1em' }}>
          {t.home_featured_kicker}
        </span>

        <h2 style={{ 
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 14vw, 4rem)',
          fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.88, 
          marginBottom: '3rem', letterSpacing: '-0.03em', textAlign: 'left',
        }}>
          {t.home_featured_reel}<br/>
          <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--text-primary)' }}>
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

      {/* 3. COLLAB — mobile "002 // Availability" */}
      <section style={{ width: '100%', boxSizing: 'border-box', padding: '5rem 1.5rem', borderTop: '1px solid var(--c-border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.45, display: 'block', marginBottom: '2.5rem' }}>
          {t.layout_collab_kicker}
        </span>
        <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 9vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
            {t.layout_collab_line1}
          </h2>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 9vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.03em', color: 'transparent', WebkitTextStroke: '1px var(--text-primary)', marginBottom: '2.5rem' }}>
            {t.layout_collab_line2}
          </h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.6 }}>
            → {t.nav_contact}
          </span>
        </Link>
      </section>

      {/* 4. MANIFESTO */}
      <section style={{ width: '100%', boxSizing: 'border-box', background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '5rem 1.5rem 6rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.12em', display: 'block', marginBottom: '2rem' }}>
          {t.home_manifesto_kicker}
        </span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 6.5vw, 2.8rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.02em', textAlign: 'left', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
          {t.home_manifesto_title.split('\n').map((line, i) => (
            <span key={i} style={{ display: 'block' }}>{line}</span>
          ))}
        </h2>
      </section>

      {/* 5. LET'S START */}
      <section style={{ width: '100%', boxSizing: 'border-box', padding: '6rem 1.5rem 10rem', textAlign: 'center' }}>
        <Link to="/contact" style={{ display: 'inline-block', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 12vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'none', color: 'var(--text-primary)', lineHeight: 0.88, letterSpacing: '-0.03em' }}>
          LET'S<br/>
          <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--text-primary)' }}>START</span>
        </Link>
      </section>

    </div>
  )
}
