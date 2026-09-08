import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/projects/recs-side-drawer/',
  build: {
    outDir: path.resolve(__dirname, '../../../docs/projects/recs-side-drawer'),
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../_shared'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      '@floqastinc/flow-ui_core': path.resolve(__dirname, '../../../flowui-cache/node_modules/@floqastinc/flow-ui_core'),
      '@floqastinc/flow-ui_icons': path.resolve(__dirname, '../../../flowui-cache/node_modules/@floqastinc/flow-ui_icons'),
      '@floqastinc/fq-intl': path.resolve(__dirname, '../../../flowui-cache/node_modules/@floqastinc/fq-intl'),
    },
  },
  server: {
    port: Number(process.env.PORT) || 5193,
    fs: {
      allow: ['..'],
    },
  },
})
