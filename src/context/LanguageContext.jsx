import { createContext, useContext, useState, useCallback } from 'react'

const STORAGE_KEY = 'portfolio-lang'

function readStoredLang() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s === 'en' || s === 'it') return s
  } catch {
    /* ignore */
  }
  return 'en'
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang)

  const setLang = useCallback((next) => {
    const v = next === 'it' ? 'it' : 'en'
    setLangState(v)
    try {
      localStorage.setItem(STORAGE_KEY, v)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const v = prev === 'en' ? 'it' : 'en'
      try {
        localStorage.setItem(STORAGE_KEY, v)
      } catch {
        /* ignore */
      }
      return v
    })
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
