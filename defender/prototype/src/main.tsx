import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Theme from '@floqastinc/flow-ui_core/Theme'
import App from './App.tsx'
import './index.css'
import 'flexlayout-react/style/light.css'

// Initialize FlowUI theme (loads CSS tokens, fonts, global styles)
Theme.apply(null, { standalone: true })

// Override FlowUI's legacy-global-styles.css font-family.
// Theme.apply() sets body to 'Open Sans' — we need 'Inter'.
// Injected AFTER Theme.apply() so it wins by source order without !important.
// This preserves inline styles (Museo Sans on headers) and FlowUI component fonts.
const fontFix = document.createElement('style')
fontFix.setAttribute('data-meta', 'prototype-font-override')
fontFix.textContent = `
  body {
    font-family: var(--flo-sem-font-family-body, 'Inter'), sans-serif;
  }
  button, textarea, input {
    font-family: inherit;
  }
`
document.head.appendChild(fontFix)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
