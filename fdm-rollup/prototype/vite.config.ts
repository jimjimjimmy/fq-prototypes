import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  // Relative paths so the built index.html works both via file:// (open -a "Google Chrome" ...)
  // and via the deployed GitHub Pages URL.
  base: './',
  build: {
    outDir: path.resolve(__dirname, '../../../docs/projects/fdm-rollup'),
    emptyOutDir: true,
    // Inline everything into a single index.html so file:// works (no CORS on ES modules).
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  },
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../_shared'),
    },
    dedupe: ['react', 'react-dom', '@floqastinc/flow-ui_core', '@floqastinc/flow-ui_icons'],
  },
  server: {
    port: 5181,
    fs: {
      allow: ['..'],
    },
  },
})
