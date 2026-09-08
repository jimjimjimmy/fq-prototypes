import type { Plugin } from 'vite'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { IncomingMessage, ServerResponse } from 'http'

const PENDING_FILE = 'src/dev-tools/.figma-match-pending.txt'

/**
 * Vite plugin that injects the Figma Match overlay in dev mode.
 * Serves the overlay JS at a virtual URL and adds a script tag to index.html.
 * Also provides a POST endpoint for the "Send to Claude" file-based flow.
 * `apply: 'serve'` ensures this never affects production builds.
 */
export function figmaMatchPlugin(): Plugin {
  return {
    name: 'figma-match-overlay',
    apply: 'serve',
    configureServer(server) {
      const __dirname = dirname(fileURLToPath(import.meta.url))

      // Serve the overlay JS
      server.middlewares.use('/@figma-match-overlay', (_req: IncomingMessage, res: ServerResponse) => {
        const code = readFileSync(resolve(__dirname, 'figma-match-overlay.js'), 'utf-8')
        res.setHeader('Content-Type', 'application/javascript')
        res.end(code)
      })

      // POST endpoint: "Send to Claude" writes match data to a file Claude can read
      server.middlewares.use('/@figma-match-send', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const projectRoot = server.config.root
            const filePath = resolve(projectRoot, PENDING_FILE)
            mkdirSync(dirname(filePath), { recursive: true })
            writeFileSync(filePath, body, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, path: filePath }))
          } catch (err: any) {
            res.statusCode = 500
            res.end(JSON.stringify({ ok: false, error: err.message }))
          }
        })
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
