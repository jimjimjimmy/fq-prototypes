import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// node_modules is a symlink to ../../recs-ag-grid/node_modules. `preserveSymlinks: false`
// (the default) lets Vite resolve packages through it normally.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@kit': path.resolve(__dirname, 'src/_kit'),
    },
  },
  server: {
    port: 5190,
    fs: { allow: ['..', '../..'] },
  },
})
