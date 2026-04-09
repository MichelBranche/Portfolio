import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { i18nStrings } from '../data/i18n'

export default function ProjectOverlay({ project, onClose }) {
  const { lang } = useLanguage()
  const t = i18nStrings[lang]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!project) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(26, 25, 23, 0.88)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        padding: '2rem'
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        style={{
          width: '100%',
          maxWidth: '1600px',
          height: '80vh',
          background: 'var(--bg-primary)',
          border: '1px solid var(--c-border)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            background: 'none',
            border: '1px solid var(--text-primary)',
            color: 'var(--text-primary)',
            padding: '0.5rem 1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            cursor: 'pointer',
            zIndex: 10,
            textTransform: 'uppercase'
          }}
        >
          {t.overlay_close}
        </button>

        {/* LEFT SIDE: Media Section */}
        <div style={{ position: 'relative', background: 'var(--bg-surface)', overflow: 'hidden' }}>
          <motion.img
            layoutId={`img-${project.id}`}
            src={project.image}
            alt={project.title[lang]}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 5 }}>
             <span style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '0.25rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700 }}>
               {t.overlay_live_badge}
             </span>
          </div>
        </div>

        {/* RIGHT SIDE: Data Section */}
        <div style={{ padding: '6rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid var(--c-border)' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', opacity: 0.5, letterSpacing: '0.2em' }}>
              {t.overlay_project_label} // 0{project.id}
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginTop: '1.5rem', marginBottom: '3rem' }}>
              {project.title[lang]}
            </h2>

            <div style={{ marginBottom: '4rem' }}>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.3, marginBottom: '1rem' }}>{t.overlay_spec_heading}</h4>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                {project.description[lang]}
              </p>
            </div>

            <div style={{ marginBottom: '4rem' }}>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.3, marginBottom: '1rem' }}>{t.overlay_stack_heading}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{ border: '1px solid var(--c-border)', padding: '0.4rem 0.8rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem' }}>
            <a 
              href={project.demo} 
              target="_blank" 
              rel="noreferrer"
              style={{ flex: 1, textAlign: 'center', background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}
            >
              {t.overlay_launch}
            </a>
            <a 
              href={project.github} 
              target="_blank" 
              rel="noreferrer"
              style={{ flex: 1, textAlign: 'center', border: '1px solid var(--text-primary)', color: 'var(--text-primary)', padding: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}
            >
              {t.overlay_source}
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
