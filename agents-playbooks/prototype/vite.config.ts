import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: { allow: ['..'] },
  },
  // Flow UI is installed from the MCP node_modules (no font files bundled).
  // Exclude it from pre-bundling so Vite doesn't fail on missing .woff2 imports.
  optimizeDeps: {
    exclude: ['@floqastinc/flow-ui_core', '@floqastinc/flow-ui_icons'],
  },
})
