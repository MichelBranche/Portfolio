import { useEffect, useId, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useLanguage } from '../context/LanguageContext.jsx'
import { FlagIcon } from './FlagIcon.jsx'

gsap.registerPlugin(useGSAP)

export function LanguageSwitch({ variant = 'bubble' }) {
  if (variant === 'pill') return <PillLanguageSwitch />
  return <BubbleLanguageSwitch />
}

function PillLanguageSwitch() {
  const { lang, setLang, languages, t } = useLanguage()
  const listId = useId()
  const index = Math.max(0, languages.findIndex((item) => item.code === lang))

  return (
    <div className="hero-lang hero-lang--pill">
      <div className="hero-lang-pill" id={listId} role="listbox" aria-label={String(t('language.chooseAria'))}>
        <span className="hero-lang-chip" style={{ '--n': languages.length, '--on': index }} aria-hidden />
        <div className="hero-lang-track">
          {languages.map((item) => {
            const selected = item.code === lang
            return (
              <button
                key={item.code}
                type="button"
                className="hero-lang-flag interactable"
                role="option"
                aria-label={item.label}
                title={item.label}
                aria-selected={selected}
                onClick={() => setLang(item.code)}
              >
                <FlagIcon code={item.code} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BubbleLanguageSwitch() {
  const { lang, setLang, languages, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()

  const current = languages.find((l) => l.code === lang) || languages[0]

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useGSAP(
    () => {
      const list = listRef.current
      if (!open || !list) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const options = list.querySelectorAll('.hero-lang-option')

      if (reduced) {
        gsap.set(list, { opacity: 1, scale: 1, clearProps: 'transform' })
        gsap.set(options, { opacity: 1, scale: 1, clearProps: 'transform' })
        return
      }

      gsap.fromTo(
        list,
        { opacity: 0, scale: 0.28 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(2.2)',
        },
      )
      gsap.fromTo(
        options,
        { opacity: 0, scale: 0.2 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.32,
          stagger: 0.045,
          delay: 0.1,
          ease: 'back.out(2.4)',
        },
      )
    },
    { dependencies: [open], scope: rootRef },
  )

  return (
    <div className="hero-lang self-destruct-keep" ref={rootRef}>
      <div className="hero-lang-row">
        {!open ? (
          <p className="hero-lang-hint" aria-hidden="true">
            <span className="hero-lang-hint-arrow" aria-hidden="true">
              <svg
                className="hero-lang-hint-arrow-svg"
                viewBox="0 0 22 12"
                role="presentation"
                focusable="false"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 6h12M14 2.5l6 3.5-6 3.5"
                />
              </svg>
            </span>
            <span className="hero-lang-hint-text">{String(t('language.hintNudge'))}</span>
          </p>
        ) : null}
        <button
          type="button"
          className="hero-lang-btn interactable"
          onClick={() => setOpen((o) => !o)}
          aria-label={String(t('language.switchLabel'))}
          title={String(t('language.switchLabel'))}
          aria-expanded={open}
          aria-controls={listId}
        >
          <FlagIcon code={current.code} />
        </button>
      </div>
      {open ? (
        <ul
          ref={listRef}
          className="hero-lang-list hero-lang-bubble"
          id={listId}
          role="listbox"
          aria-label={String(t('language.chooseAria'))}
        >
          {languages.map((l) => {
            const selected = l.code === lang
            return (
              <li key={l.code} role="none">
                <button
                  type="button"
                  className="hero-lang-option interactable"
                  role="option"
                  aria-label={l.label}
                  title={l.label}
                  aria-selected={selected}
                  onClick={() => {
                    setLang(l.code)
                    setOpen(false)
                  }}
                >
                  <FlagIcon code={l.code} />
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
