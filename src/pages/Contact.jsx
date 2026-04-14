import { useState, useEffect, useRef } from 'react'
import PageTransition from '../components/PageTransition'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import SplitType from 'split-type'
import { useCursor } from '../context/CursorContext'
import { useLanguage } from '../context/LanguageContext'
import { contactLinks } from '../data/projects'
import { i18nStrings } from '../data/i18n'
import { CONTACT_FORM_API_URL } from '../config/contactApi'
import { useMediaQuery } from '../hooks/useMediaQuery'
import CreepyButton from '../components/CreepyButton'

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
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [formStatus, setFormStatus] = useState('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const headingRef = useRef(null)
  const pageRef = useRef(null)

  // ── GSAP.com 1:1 animation ────────────────────────────────────────────────
  // Phase 1: Scramble-text reveal (chars cycle through random symbols → correct letter)
  // Phase 2: Infinite floating wave per char (yoyo, each char offset)
  // Phase 3: Hover scale+lift per individual char
  useEffect(() => {
    const el = headingRef.current
    if (!el) return

    const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>/'
    const ctx = gsap.context(() => {}, el)

    // Split into individual chars
    const split = new SplitType(el, { types: 'chars,words,lines' })
    const chars = split.chars
    if (!chars || chars.length === 0) return

    // ── Wrap each char in overflow:hidden container ──────────────────────
    chars.forEach((char) => {
      const wrapper = document.createElement('span')
      wrapper.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;'
      char.parentNode.insertBefore(wrapper, char)
      wrapper.appendChild(char)
      char.style.display = 'inline-block'
    })

    // Store original chars text
    const originals = chars.map(c => c.textContent)

    // ── Phase 1: Scramble reveal ─────────────────────────────────────────
    // Each char starts hidden below (y:100%), gets revealed with scramble
    gsap.set(chars, { y: '100%' })

    const scrambleDuration = 600  // ms per char scramble
    const staggerDelay = 50        // ms between chars starting

    chars.forEach((char, i) => {
      const original = originals[i]
      if (original === ' ') {
        gsap.to(char, { y: '0%', duration: 0, delay: (i * staggerDelay) / 1000 })
        return
      }

      // After stagger delay, slide up AND scramble simultaneously
      setTimeout(() => {
        // Slide up
        gsap.to(char, { y: '0%', duration: 0.7, ease: 'expo.out' })

        // Scramble: cycle through random chars then resolve to original
        let frame = 0
        const totalFrames = 18
        const interval = setInterval(() => {
          const progress = frame / totalFrames
          if (progress < 0.7) {
            // Scrambling phase
            char.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          } else {
            // Resolving phase — original flickers in
            char.textContent = Math.random() > 0.4 ? original : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          }
          frame++
          if (frame >= totalFrames) {
            clearInterval(interval)
            char.textContent = original
          }
        }, scrambleDuration / totalFrames)
      }, i * staggerDelay + 500)  // +500ms for PageTransition
    })

    // ── Phase 2: Infinite floating wave after reveal ─────────────────────
    const revealDuration = 500 + chars.length * staggerDelay + scrambleDuration
    const floatTimer = setTimeout(() => {
      chars.forEach((char, i) => {
        if (originals[i] === ' ') return
        gsap.to(char, {
          y: `${-4 - Math.random() * 4}px`,  // each char goes different height
          duration: 1.2 + Math.random() * 0.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.07 * Math.random() * 0.5,  // staggered start for wave feel
        })
      })
    }, revealDuration)

    // ── Phase 3: Hover per individual char ───────────────────────────────
    const onEnter = (char) => () => {
      gsap.to(char, { y: '-12px', scale: 1.25, duration: 0.25, ease: 'back.out(2)', overwrite: 'auto' })
    }
    const onLeave = (char, i) => () => {
      gsap.to(char, {
        y: originals[i] !== ' ' ? `${-4 - Math.random() * 4}px` : '0px',
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      })
    }

    const cleanups = chars.map((char, i) => {
      const enter = onEnter(char)
      const leave = onLeave(char, i)
      char.addEventListener('mouseenter', enter)
      char.addEventListener('mouseleave', leave)
      char.style.cursor = 'default'
      return () => {
        char.removeEventListener('mouseenter', enter)
        char.removeEventListener('mouseleave', leave)
      }
    })

    return () => {
      clearTimeout(floatTimer)
      cleanups.forEach(fn => fn())
      gsap.killTweensOf(chars)
      split.revert()
      ctx.revert()
    }
  }, [lang])

  // ── Reveal remaining elements ────────────────────────────────────────────
  useEffect(() => {
    if (!pageRef.current) return
    const els = pageRef.current.querySelectorAll('.ct-reveal')
    gsap.fromTo(els,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, stagger: 0.09, ease: 'power3.out', delay: 0.85 }
    )
  }, [lang])

  const resetSuccess = () => {
    setFormStatus('idle')
    setName('')
    setEmail('')
    setMessage('')
    setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setFormStatus('sending')
    try {
      const res = await fetch(CONTACT_FORM_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setFormStatus('success')
        setName(''); setEmail(''); setMessage('')
        return
      }
      if (res.status === 503) setErrorMessage(t.contact_form_error_config)
      else if (res.status === 400) setErrorMessage(t.contact_form_error_validation)
      else setErrorMessage(data.error || t.contact_form_error)
      setFormStatus('idle')
    } catch {
      setErrorMessage(t.contact_form_error)
      setFormStatus('idle')
    }
  }

  // ── Mobile ───────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <PageTransition>
        <div style={{ paddingBottom: '5rem', paddingTop: '3rem' }}>
          <header style={{ marginBottom: '2.5rem', padding: '0 1.25rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.2em' }}>{t.contact_page_kicker}</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 9vw, 3.2rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.85, marginTop: '0.5rem' }}>
              {t.contact_heading_a}<br/>
              <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--text-primary)' }}>{t.contact_heading_b}</span>
            </h1>
          </header>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '0 1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {contactLinks.map(link => (
                <a key={link.id} href={link.href} target="_blank" rel="noreferrer"
                  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                  style={{ border: '1px solid var(--c-border)', padding: '1.5rem', textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-surface)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', opacity: 0.45, textTransform: 'uppercase' }}>{contactLinkLabel(link, t)}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, wordBreak: 'break-all' }}>{contactLinkLine(link, t)}</span>
                </a>
              ))}
            </div>
            <div>
              {formStatus === 'success' ? (
                <div style={{ border: '1px solid var(--text-primary)', padding: '2rem', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900 }}>{t.contact_success_title}</h3>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginTop: '1rem' }}>{t.contact_success_body}</p>
                  <CreepyButton onClick={resetSuccess} style={{ marginTop: '2rem' }}>{t.contact_success_again}</CreepyButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {[
                    { label: t.contact_form_name, type: 'text', val: name, set: setName },
                    { label: t.contact_form_email, type: 'email', val: email, set: setEmail },
                  ].map((f, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', opacity: 0.5 }}>{f.label}</label>
                      <input required type={f.type} value={f.val} onChange={e => f.set(e.target.value)} style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--c-border)', color: 'var(--text-primary)', padding: '0.5rem 0', fontSize: '16px', fontFamily: 'var(--font-mono)', borderRadius: 0 }} />
                    </div>
                  ))}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', opacity: 0.5 }}>{t.contact_form_brief}</label>
                    <textarea required rows="4" value={message} onChange={e => setMessage(e.target.value)} style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--c-border)', color: 'var(--text-primary)', padding: '0.5rem 0', fontSize: '16px', fontFamily: 'var(--font-mono)', resize: 'none', borderRadius: 0 }} />
                  </div>
                  <CreepyButton type="submit" disabled={formStatus === 'sending'} style={{ opacity: formStatus === 'sending' ? 0.5 : 1 }}>
                    {formStatus === 'sending' ? t.contact_form_sending : t.contact_form_send}
                  </CreepyButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  // ── Desktop — centered, mega animated heading ────────────────────────────
  return (
    <PageTransition>
      <div key={lang} ref={pageRef} style={{ width: '100%', maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>

        {/* Mega heading with GSAP char animation */}
        <div style={{ marginBottom: '5rem' }}>
          <span className="ct-reveal" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.25em', display: 'block', marginBottom: '1.5rem' }}>
            {t.contact_page_kicker}
          </span>
          <h1
            ref={headingRef}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              margin: '0 auto',
            }}
          >
            <span style={{ display: 'block' }}>{t.contact_heading_a}</span>
            <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '2px var(--text-primary)' }}>
              {t.contact_heading_b}
            </span>
          </h1>
        </div>

        {/* Social links — horizontal centered bar */}
        <div className="ct-reveal" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2.5rem', marginBottom: '5rem', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)', padding: '2rem 0' }}>
          {contactLinks.map(link => {
            const iconClass = {
              email: 'fas fa-envelope',
              github: 'fab fa-github',
              linkedin: 'fab fa-linkedin',
              discord: 'fab fa-discord',
              instagram: 'fab fa-instagram',
              facebook: 'fab fa-facebook',
            }[link.id] || 'fas fa-link'

            return (
              <a key={link.id} href={link.href} target="_blank" rel="noreferrer"
                onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                style={{ textDecoration: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'opacity 0.2s' }}>
                <i className={iconClass} style={{ fontSize: '1.3rem', opacity: 0.75 }} />
                <span style={{ fontSize: '0.6rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{contactLinkLabel(link, t)}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{contactLinkLine(link, t)}</span>
              </a>
            )
          })}
        </div>

        {/* Form — centered, max 600px */}
        <div className="ct-reveal" style={{ maxWidth: '600px', margin: '0 auto' }}>
          {formStatus === 'success' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid var(--c-border)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', textTransform: 'uppercase', marginBottom: '1rem' }}>{t.contact_success_title}</h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t.contact_success_body}</p>
              <CreepyButton onClick={resetSuccess}>{t.contact_success_again}</CreepyButton>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', textAlign: 'left' }}>
              {errorMessage && (
                <p role="alert" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#b42318', margin: 0, padding: '0.75rem 1rem', border: '1px solid color-mix(in srgb, #b42318 35%, transparent)', background: 'color-mix(in srgb, #b42318 8%, transparent)' }}>
                  {errorMessage}
                </p>
              )}
              {[
                { id: 'contact-name',  label: t.contact_form_name,  type: 'text',  val: name,  set: setName,  ph: t.contact_ph_name,  auto: 'name' },
                { id: 'contact-email', label: t.contact_form_email, type: 'email', val: email, set: setEmail, ph: t.contact_ph_email, auto: 'email' },
              ].map(field => (
                <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor={field.id} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5 }}>{field.label}</label>
                  <input id={field.id} required type={field.type} name={field.id} autoComplete={field.auto}
                    value={field.val} onChange={e => field.set(e.target.value)} placeholder={field.ph}
                    onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                    style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--c-border)', color: 'var(--text-primary)', padding: '0.75rem 0', fontFamily: 'var(--font-mono)', fontSize: '16px', outline: 'none', borderRadius: 0 }} />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="contact-message" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5 }}>{t.contact_form_brief}</label>
                <textarea id="contact-message" required name="message" rows="4"
                  value={message} onChange={e => setMessage(e.target.value)} placeholder={t.contact_form_ph_brief}
                  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                  style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--c-border)', color: 'var(--text-primary)', padding: '0.75rem 0', fontFamily: 'var(--font-mono)', fontSize: '16px', outline: 'none', resize: 'none', borderRadius: 0 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CreepyButton disabled={formStatus === 'sending'} type="submit" style={{ opacity: formStatus === 'sending' ? 0.5 : 1 }}>
                  {formStatus === 'sending' ? t.contact_form_sending : t.contact_form_send}
                </CreepyButton>
              </div>
            </form>
          )}
        </div>

      </div>
    </PageTransition>
  )
}
