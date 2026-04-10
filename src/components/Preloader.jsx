import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useLanguage } from '../context/LanguageContext'
import { i18nStrings } from '../data/i18n'

export default function Preloader({ onComplete }) {
  const { lang } = useLanguage()
  const t = i18nStrings[lang]
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    // Fake counting logic for cinematic effect
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 20)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (percent === 100) {
      const tl = gsap.timeline({
        onComplete: () => onComplete()
      })

      tl.to('.preloader-number', {
        y: -100,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.in'
      })
      .to('.preloader-bg', {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1,
        ease: 'power4.inOut'
      })
    }
  }, [percent, onComplete])

  return (
    <div className="preloader-bg" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'var(--text-primary)',
      color: 'var(--bg-primary)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{ position: 'relative', overflow: 'hidden', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <img 
          src="/assets/logo-light.png" 
          alt={t.preloader_logo_alt} 
          style={{ width: '80px', height: '80px', objectFit: 'contain' }} 
        />
        <h1 className="preloader-number" style={{ 
          fontSize: 'clamp(3rem, 10vw, 6rem)', 
          fontWeight: 900, 
          margin: 0, 
          lineHeight: 1,
          fontFamily: 'var(--font-display)',
          wordBreak: 'keep-all',
          whiteSpace: 'nowrap'
        }}>
          {percent.toString().padStart(3, '0')}
        </h1>
      </div>
      
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ 
          textTransform: 'uppercase', 
          letterSpacing: '0.4em', 
          fontSize: 'clamp(0.6rem, 2vw, 0.7rem)',
          maxWidth: '300px',
          margin: '0 auto' 
        }}>
          {t.preloader_initializing}
        </p>
        <div style={{ width: '200px', height: '1px', background: 'rgba(255,255,255,0.2)', marginTop: '1rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--bg-primary)', width: `${percent}%` }} />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '4rem', fontSize: '0.6rem', opacity: 0.5, textTransform: 'uppercase' }}>
        {t.preloader_stack}
      </div>
    </div>
  )
}
