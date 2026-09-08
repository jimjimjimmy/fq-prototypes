import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Note: Flow UI's Theme.apply() is omitted here because the MCP node_modules
// copy is missing peer deps (prop-types, woff2 fonts) needed for Vite bundling.
// All styling uses inline styles with Flow UI's exact color tokens and spacing.
// TODO: replace with proper @floqastinc/flow-ui_core from internal registry.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
