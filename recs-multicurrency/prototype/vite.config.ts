import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/projects/recs-multicurrency/',
  build: {
    outDir: path.resolve(__dirname, '../../../docs/projects/recs-multicurrency'),
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../_shared'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      '@floqastinc/flow-ui_core': path.resolve(__dirname, 'node_modules/@floqastinc/flow-ui_core'),
      '@floqastinc/flow-ui_icons': path.resolve(__dirname, 'node_modules/@floqastinc/flow-ui_icons'),
    },
  },
  server: {
    port: 5176,
    fs: {
      allow: ['..'],
    },
  },
})
