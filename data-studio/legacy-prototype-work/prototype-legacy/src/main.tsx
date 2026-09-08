import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@floqastinc/flow-ui_core'
import Theme from '@floqastinc/flow-ui_core/Theme'
import './index.css'
import App from './App.tsx'

// Initialize FlowUI theme (loads CSS tokens, fonts, global styles)
// eslint-disable-next-line prefer-spread -- Flow UI's Theme.apply() API requires this calling convention
Theme.apply(null, { standalone: true })

// FlowUI's legacy-global-styles.css overrides font-family to Open Sans at runtime.
// Re-apply Inter by injecting a style tag after Theme.apply() — later in the
// cascade wins at equal specificity.
const interOverride = document.createElement('style')
interOverride.textContent = "html, body { font-family: 'Inter', sans-serif; }"
document.head.appendChild(interOverride)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
