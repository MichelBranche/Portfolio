'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LANGUAGES, LANGUAGE_LIST, translate } from '../i18n/translations'
import { applyClientMeta } from '../lib/seo-shared'

const STORAGE = 'mb-lang'
const STORAGE_EXPLICIT = 'mb-lang-explicit'
const CODES = new Set(LANGUAGE_LIST.map((l) => l.code))

const LanguageContext = createContext(null)

export function LanguageProvider({ children, initialLang = 'it' }) {
  const pathname = usePathname()
  const [lang, setLangState] = useState(CODES.has(initialLang) ? initialLang : 'it')

  const setLang = useCallback((code) => {
    if (!CODES.has(code)) return
    setLangState(code)
    try {
      localStorage.setItem(STORAGE, code)
      localStorage.setItem(STORAGE_EXPLICIT, '1')
      document.cookie = `mb-lang=${code};path=/;max-age=31536000;SameSite=Lax`
      document.cookie = `mb-lang-explicit=1;path=/;max-age=31536000;SameSite=Lax`
    } catch {
      /* private mode */
    }
  }, [])

  useEffect(() => {
    let stored = ''
    try {
      const explicit = localStorage.getItem(STORAGE_EXPLICIT) === '1'
      const value = localStorage.getItem(STORAGE) || ''
      if (explicit && CODES.has(value)) stored = value
    } catch {
      stored = ''
    }
    if (!stored) return undefined
    const id = window.setTimeout(() => setLang(stored), 0)
    return () => window.clearTimeout(id)
  }, [setLang])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = LANGUAGES[lang]?.code || 'it'
    applyClientMeta(lang, pathname || '/')
  }, [lang, pathname])

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
