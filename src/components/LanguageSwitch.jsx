import { useEffect, useId, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { FlagIcon } from './FlagIcon.jsx'

import './LanguageSwitch.css'

export function LanguageSwitch() {
  const { lang, setLang, languages, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
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

  return (
    <div
      className="hero-lang self-destruct-keep"
      ref={rootRef}
    >
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
          className="hero-lang-list"
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
