import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ReactLenis } from 'lenis/react'

import Layout from './components/Layout'
import Home from './pages/Home'
import Agency from './pages/Agency'
import EpicodeJourney from './pages/EpicodeJourney'
import Works from './pages/Works'
import Contact from './pages/Contact'
import PageMask from './components/PageMask'
import Preloader from './components/Preloader'
import { CursorProvider } from './context/CursorContext'
import CustomCursor from './components/CustomCursor'
import { LanguageProvider } from './context/LanguageContext'
import MiniMusicPlayer from './components/MiniMusicPlayer'

function App() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Force every route to open from the top on navigation.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })

    return () => cancelAnimationFrame(raf)
  }, [location.pathname])

  return (
    <ReactLenis root options={{ smoothTouch: true }}>
      <LanguageProvider>
        <CursorProvider>
          <AnimatePresence>
            {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
          </AnimatePresence>
          
          <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
            <CustomCursor />
            <MiniMusicPlayer />
            <Layout>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<><PageMask /><Home ready={!isLoading} /></>} />
                  <Route path="/agency" element={<><PageMask /><Agency /></>} />
                  <Route path="/agency/epicode" element={<><PageMask /><EpicodeJourney /></>} />
                  <Route path="/works" element={<><PageMask /><Works /></>} />
                  <Route path="/contact" element={<><PageMask /><Contact /></>} />
                </Routes>
              </AnimatePresence>
            </Layout>
          </div>
        </CursorProvider>
      </LanguageProvider>
    </ReactLenis>
  )
}

export default App
