import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/projects/recs-ag-grid/',
  build: {
    outDir: path.resolve(__dirname, '../../../docs/projects/recs-ag-grid'),
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      '@floqastinc/flow-ui_core': path.resolve(__dirname, 'node_modules/@floqastinc/flow-ui_core'),
      '@floqastinc/flow-ui_icons': path.resolve(__dirname, 'node_modules/@floqastinc/flow-ui_icons'),
    },
  },
  server: {
    port: 5183,
    fs: {
      allow: ['..'],
    },
  },
})
