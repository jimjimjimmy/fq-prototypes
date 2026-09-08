import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../_shared'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      '@floqastinc/flow-ui_core': path.resolve(__dirname, 'node_modules/@floqastinc/flow-ui_core'),
      '@floqastinc/flow-ui_icons': path.resolve(__dirname, 'node_modules/@floqastinc/flow-ui_icons'),
    },
  },
})
