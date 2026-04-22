import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, LANGUAGE_LIST, translate } from '../i18n/translations'

const STORAGE = 'mb-lang'
const CODES = new Set(LANGUAGE_LIST.map((l) => l.code))

const LanguageContext = createContext(null)

function readInitialLang() {
  if (typeof window === 'undefined') return 'it'
  const s = localStorage.getItem(STORAGE)
  if (s && CODES.has(s)) return s
  const nav = navigator.language?.slice(0, 2)
  if (nav && CODES.has(nav)) return nav
  return 'it'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang)

  const setLang = useCallback((code) => {
    if (!CODES.has(code)) return
    setLangState(code)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE, code)
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = LANGUAGES[lang]?.code || lang
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
