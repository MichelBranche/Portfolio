import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, existsSync, mkdirSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-legacy-admin-assets',
      apply: 'build',
      closeBundle() {
        const rootDir = __dirname
        const outDir = resolve(rootDir, 'dist')
        const filesToCopy = ['admin.js', 'admin-stats.js', 'admin-cursor.js', 'data.js', 'i18n.js']
        if (!existsSync(outDir)) return
        mkdirSync(outDir, { recursive: true })
        filesToCopy.forEach((fileName) => {
          copyFileSync(resolve(rootDir, fileName), resolve(outDir, fileName))
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  server: {
    port: 3000,
  }
})
