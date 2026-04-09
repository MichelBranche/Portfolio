import { useState } from 'react'
import PageTransition from '../components/PageTransition'
import { motion } from 'framer-motion'
import { useAggressivePageGsap } from '../animations/useAggressivePageGsap'
import { useCursor } from '../context/CursorContext'
import { useLanguage } from '../context/LanguageContext'
import { contactLinks } from '../data/projects'
import { i18nStrings } from '../data/i18n'
import { CONTACT_FORM_API_URL } from '../config/contactApi'

function contactLinkLabel(link, t) {
  const key = `contact_link_${link.id}`
  return t[key] ?? link.id
}

function contactLinkLine(link, t) {
  if (link.lineKey === 'linkedin') return t.contact_line_linkedin
  if (link.lineKey === 'instagram') return t.contact_line_instagram
  if (link.lineKey === 'facebook') return t.contact_line_facebook
  return link.value
}

export default function Contact() {
  const { handleMouseEnter, handleMouseLeave } = useCursor()
  const { lang } = useLanguage()
  const t = i18nStrings[lang]
  const [formStatus, setFormStatus] = useState('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const pageRef = useAggressivePageGsap([lang])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setFormStatus('sending')

    try {
      const res = await fetch(CONTACT_FORM_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setFormStatus('success')
        setName('')
        setEmail('')
        setMessage('')
        return
      }

      if (res.status === 400 && data.error?.toLowerCase?.().includes('email')) {
        setErrorMessage(t.contact_form_error_validation)
      } else if (res.status === 500 && String(data.error || '').includes('configured')) {
        setErrorMessage(t.contact_form_error_config)
      } else {
        setErrorMessage(data.error || t.contact_form_error)
      }
      setFormStatus('idle')
    } catch {
      setErrorMessage(t.contact_form_error)
      setFormStatus('idle')
    }
  }

  const resetSuccess = () => {
    setFormStatus('idle')
    setErrorMessage('')
  }

  return (
    <PageTransition>
      <div ref={pageRef} style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem' }}>
        
        {/* Left: Social & Info */}
        <div>
          <div className="gsap-page-header">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{t.contact_page_kicker}</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, marginTop: '2rem', marginBottom: '4rem' }}>
              {t.contact_heading_a} <br/>
              <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--text-primary)' }}>{t.contact_heading_b}</span>
            </h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {contactLinks.map(link => (
              <a 
                key={link.id}
                className="gsap-card"
                href={link.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--text-primary)', 
                  fontFamily: 'var(--font-mono)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderLeft: '1px solid var(--c-border)',
                  paddingLeft: '1.5rem',
                  gap: '0.25rem'
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase' }}>{contactLinkLabel(link, t)}</span>
                <span style={{ fontSize: '0.9rem' }}>{contactLinkLine(link, t)}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="gsap-reveal" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--c-border)', padding: '3rem' }}>
          {formStatus === 'success' ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', textTransform: 'uppercase' }}>{t.contact_success_title}</h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>{t.contact_success_body}</p>
              <button 
                type="button"
                onClick={resetSuccess}
                style={{ marginTop: '2rem', background: 'none', border: '1px solid var(--text-primary)', color: 'var(--text-primary)', padding: '0.75rem 1.5rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontSize: '0.7rem', cursor: 'pointer' }}
              >
                {t.contact_success_again}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {errorMessage ? (
                <p
                  role="alert"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: '#b42318',
                    margin: 0,
                    padding: '0.75rem 1rem',
                    border: '1px solid color-mix(in srgb, #b42318 35%, transparent)',
                    background: 'color-mix(in srgb, #b42318 8%, transparent)',
                  }}
                >
                  {errorMessage}
                </p>
              ) : null}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="contact-name" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5 }}>{t.contact_form_name}</label>
                <input 
                  id="contact-name"
                  required
                  type="text" 
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  placeholder={t.contact_ph_name}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--c-border)', color: 'var(--text-primary)', padding: '0.5rem 0', fontFamily: 'var(--font-mono)', fontSize: '1rem', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="contact-email" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5 }}>{t.contact_form_email}</label>
                <input 
                  id="contact-email"
                  required
                  type="email" 
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder={t.contact_ph_email}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--c-border)', color: 'var(--text-primary)', padding: '0.5rem 0', fontFamily: 'var(--font-mono)', fontSize: '1rem', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="contact-message" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5 }}>{t.contact_form_brief}</label>
                <textarea 
                  id="contact-message"
                  required
                  name="message"
                  rows="4"
                  value={message}
                  onChange={(ev) => setMessage(ev.target.value)}
                  placeholder={t.contact_form_ph_brief}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--c-border)', color: 'var(--text-primary)', padding: '0.5rem 0', fontFamily: 'var(--font-mono)', fontSize: '1rem', outline: 'none', resize: 'none' }}
                />
              </div>
              
              <button 
                disabled={formStatus === 'sending'}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                type="submit"
                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer', opacity: formStatus === 'sending' ? 0.5 : 1 }}
              >
                {formStatus === 'sending' ? t.contact_form_sending : t.contact_form_send}
              </button>
            </form>
          )}
        </div>

      </div>
    </PageTransition>
  )
}
