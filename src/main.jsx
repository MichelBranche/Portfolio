import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import 'lenis/dist/lenis.css'
import './index.css'
import './pages/AdminPage.css'
import App from './App.jsx'
import { VisitTracker } from './components/VisitTracker.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

const AdminPage = lazy(() => import('./pages/AdminPage.jsx'))

createRoot(document.getElementById('root')).render(
  <LanguageProvider>
    <BrowserRouter>
      <VisitTracker />
      <Routes>
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="admin-page admin-page--loading">Caricamento…</div>}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="/*" element={<App />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  </LanguageProvider>,
)
