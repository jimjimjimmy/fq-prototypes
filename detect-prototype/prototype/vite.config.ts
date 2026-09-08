import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages serves the repo's `/docs` folder at the root, and each
  // project lives at `/docs/projects/{name}/`. This base ensures the
  // built `index.html` references its assets relative to that subpath.
  base: '/projects/detect-prototype/',
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    // Write the build directly to the repo's GitHub Pages docs folder so
    // a push to main auto-deploys the prototype. Mirrors the pattern set
    // by `projects/recs-multicurrency`.
    outDir: path.resolve(__dirname, '../../../docs/projects/detect-prototype'),
    emptyOutDir: true,
  },
  server: {
    port: 5177,
  },
})
