import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ReactLenis } from 'lenis/react'

import Layout from './components/Layout'
import Home from './pages/Home'
import Agency from './pages/Agency'
import Works from './pages/Works'
import Contact from './pages/Contact'
import PageMask from './components/PageMask'
import Preloader from './components/Preloader'
import { CursorProvider } from './context/CursorContext'
import CustomCursor from './components/CustomCursor'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)

  return (
    <ReactLenis root options={{ smoothTouch: true }}>
      <LanguageProvider>
        <CursorProvider>
          <AnimatePresence>
            {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
          </AnimatePresence>
          
          <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
            <CustomCursor />
            <Layout>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<><PageMask /><Home ready={!isLoading} /></>} />
                  <Route path="/agency" element={<><PageMask /><Agency /></>} />
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
