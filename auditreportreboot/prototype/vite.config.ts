import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  // Relative paths so the built index.html works both via file:// and
  // via the deployed GitHub Pages URL.
  base: './',
  build: {
    // Output to the repo's docs/ tree so GitHub Pages serves the prototype.
    // Matches the pattern used by fdm-rollup, detect-prototype, etc.
    outDir: path.resolve(__dirname, '../../../docs/projects/auditreportreboot'),
    emptyOutDir: true,
    // Inline everything into a single index.html so file:// works too.
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
    port: 5179,
    fs: {
      allow: ['..'],
    },
  },
})
