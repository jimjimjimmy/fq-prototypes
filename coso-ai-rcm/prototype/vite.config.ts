import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/projects/coso-ai-rcm/',
  build: {
    outDir: path.resolve(__dirname, '../../../docs/projects/coso-ai-rcm'),
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 5179,
    fs: {
      allow: ['..'],
    },
  },
})
