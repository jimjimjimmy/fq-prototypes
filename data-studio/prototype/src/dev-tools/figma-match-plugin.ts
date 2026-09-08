import type { Plugin } from 'vite'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

/**
 * Vite plugin that injects the Figma Match overlay in dev mode.
 * Serves the overlay JS at a virtual URL and adds a script tag to index.html.
 * `apply: 'serve'` ensures this never affects production builds.
 */
export function figmaMatchPlugin(): Plugin {
  return {
    name: 'figma-match-overlay',
    apply: 'serve',
    configureServer(server) {
      const __dirname = dirname(fileURLToPath(import.meta.url))
      server.middlewares.use('/@figma-match-overlay', (_req, res) => {
        const code = readFileSync(resolve(__dirname, 'figma-match-overlay.js'), 'utf-8')
        res.setHeader('Content-Type', 'application/javascript')
        res.end(code)
      })
    },
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: { type: 'module', src: '/@figma-match-overlay' },
          injectTo: 'body',
        },
      ]
    },
  }
}
