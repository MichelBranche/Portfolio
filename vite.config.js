import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { devApiPlugin } from './vite.dev-api.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devApiPlugin()],
  build: {
    target: 'es2022',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) {
              return 'react-vendor'
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui-motion'
            }
            if (id.includes('gsap') || id.includes('lenis')) {
              return 'scroll-motion'
            }
            if (id.includes('react-responsive')) {
              return 'media'
            }
            if (id.includes('recharts') || id.includes('react-router')) {
              return 'admin-charts'
            }
          }
        },
      },
    },
  },
})
