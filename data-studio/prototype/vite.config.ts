import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { figmaMatchPlugin } from './src/dev-tools/figma-match-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), figmaMatchPlugin()],
})
