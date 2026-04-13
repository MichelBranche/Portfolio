import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import SplitText from './SplitText'

import WordScroll from './WordScroll'
import WaterDroplets from './WaterDroplets'
import CreepyButton from './CreepyButton'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export default function HomeMobile({ ready, t, lang, handleMouseEnter }) {
  const container = useRef()

  useGSAP(() => {
    if (!ready) return

    const tl = gsap.timeline()
    
    tl.from('.hm-hud-item', {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.5)

    tl.from('.hm-hero-logo', {
      scale: 1.1,
      opacity: 0,
      duration: 1.5,
      ease: 'expo.out'
    }, 0.8)

    tl.from('.hm-cta', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    }, 1.2)
  }, { scope: container, dependencies: [ready] })

  return (
    <div ref={container} className="home-mobile-v3">
      {/* 1. MOBILE HERO: Vertical Technical Stack */}
      <section className="hm-hero" style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '8rem 1rem 4rem', 
        position: 'relative',
        textAlign: 'center',
        width: '100%',
        overflow: 'hidden'
      }}>
        <WaterDroplets />
        <div className="hm-grid" style={{ pointerEvents: 'none', position: 'absolute', inset: 0 }} />
        
        {/* Top HUD Bar */}
        <div className="hm-hud-item" style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontFamily: 'var(--font-mono)', 
          fontSize: '0.65rem', 
          opacity: 0.8,
          position: 'absolute',
          top: '8rem',
          left: 0,
          padding: '0 1.5rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <div>[ SYS.ACTIVE ]</div>
          <div>MILAN // HQ</div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <SplitText type="words" delay={0.5} ready={ready} contentKey={lang}>
             <span className="tech-label-xs" style={{ letterSpacing: '0.25em', fontSize: '0.45rem' }}>
               {t.home_tagline}
             </span>
          </SplitText>

          <div className="hm-hero-logo" style={{ marginTop: '2rem', marginBottom: '3rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img 
               src="/assets/logo-hero-mbgs.png" 
               alt="" 
               style={{ width: '75%', maxWidth: '300px', height: 'auto', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }} 
            />
          </div>

          <div className="hm-contact-dock" style={{ width: '100%', maxWidth: '280px', display: 'flex', justifyContent: 'center' }}>
             <CreepyButton to="/works" className="hm-cta" style={{ width: '100%' }}>
               {t.home_enter_hub}
             </CreepyButton>
          </div>
        </div>

        {/* HUD Bottom Info */}
        <div className="hm-hud-item" style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontFamily: 'var(--font-mono)', 
          fontSize: '0.6rem', 
          opacity: 0.6,
          padding: '2rem 1.5rem',
          letterSpacing: '0.05em'
        }}>
           <span>BUILD: STABLE_V882</span>
           <span>LOC: 45.46 // 9.19</span>
        </div>
      </section>

      {/* CSS Scroll Timeline Words */}
      <div style={{ margin: '4rem 0' }}>
        <WordScroll />
      </div>

      {/* 2. REIMAGINED REEL: Vertical Reveal Stack */}
      <section className="hm-reel" style={{ padding: '6rem 2rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, display: 'block', marginBottom: '1.25rem' }}>
          {t.home_featured_kicker}
        </span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, marginBottom: '3rem' }}>
          {t.home_featured_reel}<br/>
          <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--text-primary)' }}>{t.home_featured_reel_b}</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {projects.slice(0, 3).map((project, idx) => {
            const varStyles = [
              { width: '100%', ratio: '16/10', align: 'center', ml: 0, mr: 0 },
              { width: '85%', ratio: '3/4', align: 'flex-end', ml: 'auto', mr: 0 },
              { width: '90%', ratio: '4/3', align: 'flex-start', ml: 0, mr: 'auto' }
            ];
            const currentStyle = varStyles[idx % 3];

            return (
              <motion.article 
                key={project.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "circOut", delay: idx * 0.1 }}
                style={{ alignSelf: currentStyle.align, marginLeft: currentStyle.ml, marginRight: currentStyle.mr, width: currentStyle.width }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: currentStyle.ratio, overflow: 'hidden', border: '1px solid var(--c-border)', marginBottom: '1.5rem' }}>
                  <img src={project.image} alt={project.title[lang]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--bg-primary)', padding: '0.2rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', border: '1px solid var(--text-primary)' }}>
                     0{idx + 1}
                  </div>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{project.title[lang]}</h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', opacity: 0.6, lineHeight: 1.5 }}>{project.description[lang]}</p>
              </motion.article>
            );
          })}
        </div>

        <Link to="/works" style={{ display: 'block', marginTop: '4rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textDecoration: 'none', color: 'var(--text-primary)', borderBottom: '1px solid var(--text-primary)', paddingBottom: '0.5rem', width: 'fit-content', marginInline: 'auto' }}>
           {t.home_view_all}
        </Link>
      </section>

      {/* 3. MANIFESTO: Aggressive Vertical Flow */}
      <section style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '8rem 2rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.5 }}>{t.home_manifesto_kicker}</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 12vw, 3.8rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.85, marginTop: '2.5rem' }}>
          {t.home_manifesto_title.split('\n').join(' ')}
        </h2>
      </section>

      {/* 4. COLLABORATION: Sticky Footer Theme */}
      <section style={{ padding: '6rem 2rem 10rem' }}>

         <div style={{ marginTop: '4rem', textAlign: 'center' }}>
            <Link to="/contact" style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'none', color: 'var(--text-primary)', lineHeight: 0.9 }}>
               LET'S<br/>
               <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--text-primary)' }}>START</span>
            </Link>
         </div>
      </section>
    </div>
  )
}
