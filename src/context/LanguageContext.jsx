'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, LANGUAGE_LIST, translate } from '../i18n/translations'

const STORAGE = 'mb-lang'
const STORAGE_EXPLICIT = 'mb-lang-explicit'
const CODES = new Set(LANGUAGE_LIST.map((l) => l.code))

const LanguageContext = createContext(null)

function readStoredLang() {
  try {
    const explicit = localStorage.getItem(STORAGE_EXPLICIT) === '1'
    const stored = localStorage.getItem(STORAGE)
    if (explicit && stored && CODES.has(stored)) return stored
  } catch {
    /* private mode */
  }
  return 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en')

  const setLang = useCallback((code) => {
    if (!CODES.has(code)) return
    setLangState(code)
    try {
      localStorage.setItem(STORAGE, code)
      localStorage.setItem(STORAGE_EXPLICIT, '1')
    } catch {
      /* private mode */
    }
  }, [])

  useEffect(() => {
    const stored = readStoredLang()
    if (stored !== 'en') setLangState(stored)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = LANGUAGES[lang]?.code || 'en'
    const cycle = translate(lang, 'doc.cycle')
    const title = Array.isArray(cycle) ? cycle[0] : String(cycle)
    if (title) document.title = title
  }, [lang])

  const t = useCallback(
    (path) => {
      return translate(lang, path)
    },
    [lang],
  )

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      languages: LANGUAGE_LIST,
    }),
    [lang, setLang, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const c = useContext(LanguageContext)
  if (!c) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return c
}
