import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // FlowUI subpath packages (e.g. FileUpload) import React directly; dedupe so
  // they share the app's single React instance (avoids null hook dispatcher).
  resolve: {
    dedupe: ['react', 'react-dom', 'styled-components'],
  },
  optimizeDeps: {
    include: ['@floqastinc/flow-ui_core/FileUpload'],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
